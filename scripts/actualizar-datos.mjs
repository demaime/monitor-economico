// Actualización mensual de datos que no tienen API pero sí archivo oficial:
// descarga el XLS de "precios promedio de productos seleccionados" del INDEC
// (se publica cada mes junto con el informe de IPC) y regenera
// src/data/auto/consumos.json. Lo corre el workflow .github/workflows/actualizar-datos.yml.
//
// Uso local: node scripts/actualizar-datos.mjs

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as XLSX from "xlsx";

const URL_PRECIOS =
  "https://www.indec.gob.ar/ftp/cuadros/economia/sh_ipc_precios_promedio.xls";

// Producto de la hoja "GBA" del XLS -> clave usada por la app
const PRODUCTOS = {
  "pan frances tipo flauta": "kiloPan", // kg
  "leche fresca entera en sachet": "litroLeche", // litro
  "yerba mate": "kiloYerba", // 500 g -> x2
  "cerveza en botella": "litroCerveza", // litro
  nalga: "kiloCarne", // kg
  "gaseosa base cola": "cocaCola", // 1,5 litros
  "fideos secos tipo guisero": "fideos", // 500 g
};

// Ajustes de unidad para llevar el precio del XLS a la unidad que muestra la app
const MULTIPLICADOR = {
  kiloYerba: 2, // el XLS trae el paquete de 500 g
};

const MESES = {
  enero: "01",
  febrero: "02",
  marzo: "03",
  abril: "04",
  mayo: "05",
  junio: "06",
  julio: "07",
  agosto: "08",
  septiembre: "09",
  octubre: "10",
  noviembre: "11",
  diciembre: "12",
};

const normalizar = (texto) =>
  String(texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

async function main() {
  console.log(`Descargando ${URL_PRECIOS} ...`);
  const respuesta = await fetch(URL_PRECIOS);
  if (!respuesta.ok) {
    throw new Error(`INDEC respondió ${respuesta.status}`);
  }
  const buffer = Buffer.from(await respuesta.arrayBuffer());
  const libro = XLSX.read(buffer, { type: "buffer" });

  const hoja = libro.Sheets["GBA"] || libro.Sheets[libro.SheetNames[0]];
  const filas = XLSX.utils.sheet_to_json(hoja, { header: 1, raw: true });

  // Encontrar las filas de encabezado: una con "Año XXXX" y la siguiente con los meses
  let filaAnios = -1;
  for (let i = 0; i < 10; i++) {
    if ((filas[i] || []).some((c) => /año\s*\d{4}/i.test(String(c ?? "")))) {
      filaAnios = i;
      break;
    }
  }
  if (filaAnios === -1) {
    throw new Error("No se encontró la fila de años: ¿cambió el formato del XLS?");
  }
  const anios = filas[filaAnios];
  const meses = filas[filaAnios + 1];

  // Mapear índice de columna -> "YYYY-MM"
  const columnaAMes = {};
  let anioActual = null;
  const maxCol = Math.max(anios.length, meses.length);
  for (let c = 0; c < maxCol; c++) {
    const matchAnio = String(anios[c] ?? "").match(/(\d{4})/);
    if (matchAnio) anioActual = Number(matchAnio[1]);
    const mes = MESES[normalizar(meses[c])];
    if (anioActual && mes) {
      columnaAMes[c] = `${anioActual}-${mes}`;
      // Los años del XLS marcan solo la primera columna de cada año; al pasar
      // de diciembre a enero el año avanza aunque no haya celda de año.
      if (mes === "12") anioActual += 1;
    }
  }

  // En la hoja GBA el producto está en la columna 0 y la unidad en la 1
  const series = {};
  for (const fila of filas) {
    const clave = PRODUCTOS[normalizar(fila?.[0])];
    if (!clave) continue;
    const factor = MULTIPLICADOR[clave] || 1;
    series[clave] = series[clave] || {};
    for (const [col, ym] of Object.entries(columnaAMes)) {
      const valor = fila[Number(col)];
      if (typeof valor === "number" && isFinite(valor)) {
        series[clave][ym] = Number((valor * factor).toFixed(2));
      }
    }
  }

  const encontrados = Object.keys(series);
  const esperados = Object.values(PRODUCTOS);
  const faltantes = esperados.filter((k) => !encontrados.includes(k));
  if (faltantes.length) {
    throw new Error(
      `Faltan productos en el XLS (¿cambió el formato?): ${faltantes.join(", ")}`
    );
  }

  const ultimoMes = Object.keys(series.kiloPan).sort().at(-1);
  const salida = {
    descripcion:
      "Precios promedio GBA de productos seleccionados de la canasta del IPC (INDEC). Generado por scripts/actualizar-datos.mjs — no editar a mano.",
    fuente: URL_PRECIOS,
    actualizado: new Date().toISOString(),
    ultimoMes,
    series,
  };

  const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const destino = path.join(raiz, "src", "data", "auto", "consumos.json");
  await mkdir(path.dirname(destino), { recursive: true });
  await writeFile(destino, JSON.stringify(salida, null, 2) + "\n");
  console.log(
    `OK: ${destino} (${encontrados.length} productos, último mes: ${ultimoMes})`
  );
}

main().catch((error) => {
  console.error("ERROR:", error.message);
  process.exit(1);
});

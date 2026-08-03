import manual from "@/data/manual.json";
import consumosAuto from "@/data/auto/consumos.json";

// Reemplazo de /api/sheets: misma forma de respuesta ({ data: { meses, <indicador>: [24 valores] } })
// pero alimentado por fuentes públicas automáticas en lugar de la planilla de Google.
//
// Fuentes:
//  - apis.datos.gob.ar/series (INDEC / IDECBA / Min. Trabajo / ANSES vía sspm)
//  - src/data/auto/*.json (generados por scripts/actualizar-datos.mjs vía GitHub Action)
//  - src/data/manual.json (indicadores sin fuente automática, congelados en su último valor real)

const BASE_URL = "https://apis.datos.gob.ar/series/api/series/";
// Los datos manuales/semilla arrancan en 2023-12; pedimos desde ahí para poder
// anclar las derivaciones (topes AUH) y cubrir siempre la ventana de 24 meses.
const START_DATE = "2023-12-01";

const SERIES = {
  // IPC Nacional (INDEC, base dic 2016) — niveles de índice, igual que la planilla
  inflacionNacional: "148.3_INIVELNAL_DICI_M_26",
  alimentosNacional: "146.3_IALIMENNAL_DICI_M_45",
  bebidasNacional: "146.3_IBEBIDANAL_DICI_M_39",
  indumentariaNacional: "146.3_IPRENDANAL_DICI_M_35",
  viviendaNacional: "146.3_IVIVIENNAL_DICI_M_52",
  equipamientoNacional: "146.3_IEQUIPANAL_DICI_M_46",
  saludNacional: "146.3_ISALUDNAL_DICI_M_18",
  transporteNacional: "146.3_ITRANSPNAL_DICI_M_23",
  comunicacionNacional: "146.3_ICOMUNINAL_DICI_M_27",
  recreacionNacional: "146.3_IRECREANAL_DICI_M_31",
  educacionNacional: "146.3_IEDUCACNAL_DICI_M_22",
  restaurantesNacional: "146.3_IRESTAUNAL_DICI_M_33",
  bienesServiciosNacional: "146.3_IBIENESNAL_DICI_M_36",

  // IPCBA (IDECBA, base 2021=100) — mismas series que se copiaban a mano
  inflacionCaba: "193.2_NIVEL_GENERAL_2021_0_13_2",
  alimentosCaba: "193.2_ALIMENTOS_CAS_2021_0_32_80",
  bebidasCaba: "193.2_BEBIDAS_ALACO_2021_0_26_81",
  indumentariaCaba: "193.2_PRENDAS_VEADO_2021_0_22_9",
  viviendaCaba: "193.2_VIVIENDA_ALES_2021_0_45_98",
  equipamientoCaba: "193.2_EQUIPAMIENGAR_2021_0_32_39",
  saludCaba: "193.2_SALUDLUD_2021_0_5_15",
  transporteCaba: "193.2_TRANSPORTERTE_2021_0_10_1",
  comunicacionCaba: "193.2_INFORMACIOION_2021_0_24_37",
  recreacionCaba: "193.2_RECREACIONURA_2021_0_18_78",
  educacionCaba: "193.2_EDUCACIONION_2021_0_9_53",
  restaurantesCaba: "193.2_RESTAURANTLES_2021_0_20_90",
  segurosCaba: "193.2_SEGUROS_SEROS_2021_0_29_0",
  cuidadoPersonalCaba: "193.2_CUIDADO_PEROS_2021_0_40_67",

  // Canasta básica por adulto equivalente (INDEC)
  cbaIndividualNacional: "150.1_CSTA_BARIA_0_D_26",
  cbtIndividualNacional: "150.1_CSTA_BATAL_0_D_20",

  // Salario mínimo vital y móvil (Min. Trabajo)
  smv: "57.1_SMVMM_0_M_34",

  // Haber mínimo jubilatorio (sin bono)
  jubSinBono: "58.1_MP_0_M_24",

  // Monto AUH por hijo (ANSES)
  auh: "165.1_AAUH_0_0_3",
};

const MESES_ES = [
  "ENERO",
  "FEBRERO",
  "MARZO",
  "ABRIL",
  "MAYO",
  "JUNIO",
  "JULIO",
  "AGOSTO",
  "SEPTIEMBRE",
  "OCTUBRE",
  "NOVIEMBRE",
  "DICIEMBRE",
];

async function fetchMatriz(ids) {
  const url = `${BASE_URL}?ids=${ids.join(
    ","
  )}&format=json&start_date=${START_DATE}&limit=1000`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`datos.gob.ar respondió ${response.status}`);
  }
  const json = await response.json();
  // Cada fila es [fecha, v1, v2, ...] en el orden de ids; null si esa serie no tiene dato ese mes
  const porSerie = {};
  ids.forEach((id) => (porSerie[id] = {}));
  for (const fila of json.data || []) {
    const ym = String(fila[0]).slice(0, 7);
    ids.forEach((id, i) => {
      const valor = fila[i + 1];
      if (valor !== null && valor !== undefined) porSerie[id][ym] = valor;
    });
  }
  return porSerie;
}

// Alinea un mapa {"YYYY-MM": valor} al eje de meses, arrastrando el último
// valor conocido hacia adelante (forward-fill) para series con rezago.
function alinear(mapa, eje) {
  const resultado = [];
  let ultimo = null;
  const fechasOrdenadas = Object.keys(mapa).sort();
  for (const ym of eje) {
    if (mapa[ym] !== undefined) {
      ultimo = mapa[ym];
    } else if (ultimo === null) {
      // sin dato previo: usar el primer dato disponible posterior (back-fill)
      const siguiente = fechasOrdenadas.find((f) => f > ym);
      resultado.push(siguiente !== undefined ? mapa[siguiente] : null);
      continue;
    }
    resultado.push(ultimo);
  }
  return resultado;
}

function ultimoDatoReal(mapa) {
  const fechas = Object.keys(mapa).sort();
  return fechas.length ? fechas[fechas.length - 1] : null;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const claves = Object.keys(SERIES);
    const ids = claves.map((k) => SERIES[k]);
    const matriz = await fetchMatriz(ids);

    const mapas = {};
    claves.forEach((k) => (mapas[k] = matriz[SERIES[k]]));

    // Mezclar datos de archivos: manual.json (semilla congelada) + auto/*.json (GitHub Action)
    for (const [clave, serie] of Object.entries(manual.series)) {
      mapas[clave] = { ...serie };
    }
    for (const [clave, serie] of Object.entries(consumosAuto.series || {})) {
      mapas[clave] = { ...(mapas[clave] || {}), ...serie };
    }

    // Eje temporal: últimos 24 meses con dato del IPC nacional
    const eje = Object.keys(mapas.inflacionNacional).sort().slice(-24);
    if (eje.length === 0) {
      throw new Error("La serie de IPC nacional no devolvió datos");
    }

    const data = {};
    data.meses = eje.map((ym) => {
      const año = Number(ym.slice(0, 4));
      const mes = MESES_ES[Number(ym.slice(5, 7)) - 1];
      return { id: `${año}${mes}`, mes, año };
    });

    const ultimoDato = {};
    for (const [clave, mapa] of Object.entries(mapas)) {
      data[clave] = alinear(mapa, eje);
      ultimoDato[clave] = ultimoDatoReal(mapa);
    }

    // ---- Indicadores derivados ----
    const cfg = manual.config;

    // Canasta familiar = adulto equivalente x 3.09 (familia tipo INDEC)
    data.cbaFamiliarNacional = data.cbaIndividualNacional.map((v) =>
      v === null ? null : Math.round(v * cfg.factorFamiliarINDEC)
    );
    data.cbtFamiliarNacional = data.cbtIndividualNacional.map((v) =>
      v === null ? null : Math.round(v * cfg.factorFamiliarINDEC)
    );

    // Jubilación mínima: la serie es el haber SIN bono; con bono = + bono vigente
    data.jubConBono = data.jubSinBono.map((v) =>
      v === null ? null : Math.round(v + cfg.bonoJubilacion)
    );

    // Seguro de desempleo: mínimo = 50% SMVM, máximo = 100% SMVM
    data.seguroDesempleoMin = data.smv.map((v) =>
      v === null ? null : Math.round(v * 0.5)
    );
    data.seguroDesempleoMax = data.smv.map((v) => (v === null ? null : v));

    // Topes de ingreso AUH: se mueven por la misma movilidad que el monto AUH.
    // Se escala el tope conocido (semilla) por el factor de crecimiento del monto AUH.
    const seed = cfg.auhTopeSeed;
    const auhSeed = mapas.auh[seed.mes] || seed.auh;
    data.auhTopeIndividual = data.auh.map((v) =>
      v === null ? null : Math.round((seed.topeIndividual * v) / auhSeed)
    );
    data.auhTopeGrupoFamiliar = data.auhTopeIndividual.map((v) =>
      v === null ? null : v * 2
    );

    ultimoDato.cbaFamiliarNacional = ultimoDato.cbaIndividualNacional;
    ultimoDato.cbtFamiliarNacional = ultimoDato.cbtIndividualNacional;
    ultimoDato.jubConBono = ultimoDato.jubSinBono;
    ultimoDato.seguroDesempleoMin = ultimoDato.smv;
    ultimoDato.seguroDesempleoMax = ultimoDato.smv;
    ultimoDato.auhTopeIndividual = ultimoDato.auh;
    ultimoDato.auhTopeGrupoFamiliar = ultimoDato.auh;

    // Los datos mensuales cambian una vez por mes: cache CDN de 12 h con revalidación en background
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=43200, stale-while-revalidate=86400"
    );
    res.status(200).json({ data, meta: { ultimoDato } });
  } catch (error) {
    console.error("Error obteniendo indicadores:", error);
    res.status(502).json({ error: error.message });
  }
}

import { google } from "googleapis";
import { readFileSync } from "fs";
import path from "path";

export default async function handler(req, res) {
  // Cargar las credenciales del archivo JSON desde la variable de entorno
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

  // Reemplaza las secuencias `\n` en `private_key` por saltos de línea reales
  credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");

  // Autenticación
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // ID de la hoja de cálculo y rango
  const spreadsheetId = "1CVnPUD9jj9nYFp3-uJOyv_uwBmm-GRNmaJxpQG0kMw8";
  const ranges = {
    //Años y meses
    año: "datos!C1:1",
    meses: "datos!C2:2",

    //Inflacion
    inflacionNacional: "datos!C3:3",
    inflacionCaba: "datos!C4:4",

    // Apertura Nacional
    alimentosNacional: "datos!C5:5",
    bebidasNacional: "datos!C6:6",
    indumentariaNacional: "datos!C7:7",
    viviendaNacional: "datos!C8:8",
    equipamientoNacional: "datos!C9:9",
    saludNacional: "datos!C10:10",
    transporteNacional: "datos!C11:11",
    comunicacionNacional: "datos!C12:12",
    recreacionNacional: "datos!C13:13",
    educacionNacional: "datos!C14:14",
    restaurantesNacional: "datos!C15:15",
    bienesServiciosNacional: "datos!C16:16",

    // Apertura CABA
    alimentosCaba: "datos!C17:17",
    bebidasCaba: "datos!C18:18",
    indumentariaCaba: "datos!C19:19",
    viviendaCaba: "datos!C20:20",
    equipamientoCaba: "datos!C21:21",
    saludCaba: "datos!C22:22",
    transporteCaba: "datos!C23:23",
    comunicacionCaba: "datos!C24:24",
    recreacionCaba: "datos!C25:25",
    educacionCaba: "datos!C26:26",
    restaurantesCaba: "datos!C27:27",
    segurosCaba: "datos!C28:28",
    cuidadoPersonalCaba: "datos!C29:29",

    // Canastas
    cbaIndividualNacional: "datos!C30:30",
    cbtIndividualNacional: "datos!C31:31",
    cbaFamiliarNacional: "datos!C32:32",
    cbtFamiliarNacional: "datos!C33:33",
    cbaIndividualCaba: "datos!C34:34",
    cbtIndividualCaba: "datos!C35:35",
    cbaFamiliarCaba: "datos!C36:36",
    cbtFamiliarCaba: "datos!C37:37",
    smv: "datos!C38:38",
    jubConBono: "datos!C39:39",
    jubSinBono: "datos!C40:40",

    // Transporte
    subte: "datos!C41:41",
    tren: "datos!C42:42",
    colectivo: "datos!C43:43",
    nafta: "datos!C44:44",
    peajeNorte: "datos!C45:45",
    peajeOeste: "datos!C46:46",
    patentamientoAutos: "datos!C47:47",
    patentamientoMotos: "datos!C48:48",

    // Alquileres
    alquilerCaba: "datos!C50:50",
    alquilerNorte: "datos!C51:51",
    alquilerOesteSur: "datos!C52:52",
  };

  try {
    // Obtener todos los rangos en una única solicitud
    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges: Object.values(ranges),
      majorDimension: "ROWS",
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    if (response.status !== 200) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = {};
    response.data.valueRanges.forEach((range, index) => {
      const key = Object.keys(ranges)[index];
      const rows = range.values;

      if (Array.isArray(rows) && rows.length) {
        // Filtramos celdas vacías y tomamos los últimos 24 valores
        const filteredData = rows[0].filter((cell) => {
          if (typeof cell === "number") return true;
          if (typeof cell === "string") return cell.trim() !== "";
          return cell !== null && cell !== undefined;
        });
        // Obtener los últimos 24 valores para todos los campos
        data[key] = filteredData.slice(-24);
      } else {
        data[key] = [];
      }
    });

    // Crear el array de objetos mes+año
    if (data.meses && data.año) {
      data.meses = data.meses.map((mes, index) => ({
        id: `${data.año[index]}${mes}`,
        mes: mes,
        año: data.año[index],
      }));
    }

    if (Object.keys(data).length) {
      res.status(200).json({ data });
    } else {
      res.status(404).json({ message: "No data found." });
    }
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);

    // Mejorar el manejo de errores específicos
    if (error.code === 429) {
      res.status(429).json({
        error: "Rate limit exceeded",
        message: "Please try again in a few minutes",
        retryAfter: 60,
      });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
}

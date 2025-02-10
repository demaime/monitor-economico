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
    meses: "datos!C2:2",
    inflacionNacional: "datos!C3:3",
    inflacionCaba: "datos!C4:4",
    cbaIndividualNacional: "datos!C5:5",
    cbtIndividualNacional: "datos!C6:6",
    cbaFamiliarNacional: "datos!C7:7",
    cbtFamiliarNacional: "datos!C8:8",
    cbaIndividualCaba: "datos!C9:9",
    cbtIndividualCaba: "datos!C10:10",
    cbaFamiliarCaba: "datos!C11:11",
    cbtFamiliarCaba: "datos!C12:12",
    smv: "datos!C13:13",
    jubConBono: "datos!C14:14",
    jubSinBono: "datos!C15:15",
  };

  try {
    // Obtener datos de la hoja de cálculo para cada rango
    const data = {};
    for (const [key, range] of Object.entries(ranges)) {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
        majorDimension: "ROWS",
        valueRenderOption: "UNFORMATTED_VALUE",
      });

      if (response.status !== 200) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const rows = response.data.values;
      if (Array.isArray(rows) && rows.length) {
        // Filtramos celdas vacías, undefined, null o que solo contengan espacios en blanco
        data[key] = rows[0].filter((cell) => {
          if (typeof cell === "number") return true;
          if (typeof cell === "string") return cell.trim() !== "";
          return cell !== null && cell !== undefined;
        });
      } else {
        data[key] = [];
      }
    }

    if (Object.keys(data).length) {
      res.status(200).json({ data });
    } else {
      res.status(404).json({ message: "No data found." });
    }
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
    res.status(500).json({ error: error.message });
  }
}

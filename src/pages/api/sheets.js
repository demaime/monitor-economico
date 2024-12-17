import { google } from "googleapis";
import { readFileSync } from "fs";
import path from "path";

export default async function handler(req, res) {
  // Cargar las credenciales del archivo JSON
  const credentials = JSON.parse(
    readFileSync(path.join(process.cwd(), "public", "credentials.json"))
  );

  // Autenticación
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // ID de la hoja de cálculo y rango
  const spreadsheetId = "1CVnPUD9jj9nYFp3-uJOyv_uwBmm-GRNmaJxpQG0kMw8";
  const ranges = {
    meses: "datos!C2:L2",
    inflacion: "datos!C3:L3",
    // cba: "datos!C4:H4",
  }; // Cambia el rango según tus necesidades

  try {
    // Obtener datos de la hoja de cálculo para cada rango
    const data = {};
    for (const [key, range] of Object.entries(ranges)) {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const rows = response.data.values;
      if (rows.length) {
        data[key] = rows[0]; // Asignar la primera fila de datos al objeto
      } else {
        data[key] = []; // Asignar un array vacío si no hay datos
      }
    }

    if (Object.keys(data).length) {
      res.status(200).json({ data });
    } else {
      res.status(404).json({ message: "No data found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

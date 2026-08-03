// Proxy con caché para las series del EMAE (datos.gob.ar).
// Antes cada visitante disparaba 17 requests desde el navegador; ahora es una
// sola llamada del servidor, cacheada en la CDN.

const BASE_URL = "https://apis.datos.gob.ar/series/api/series/";
const SERIE_GENERAL = "143.3_NO_PR_2004_A_21";

const EMAE_IDS = [
  SERIE_GENERAL,
  "11.3_IF_2004_M_25",
  "11.3_SEGA_2004_M_48",
  "11.3_HR_2004_M_24",
  "11.3_IM_2004_M_25",
  "11.3_C_2004_M_60",
  "11.3_ITC_2004_M_21",
  "11.3_ISD_2004_M_26",
  "11.3_AGCS_2004_M_41",
  "11.3_EMC_2004_M_25",
  "11.3_TAC_2004_M_60",
  "11.3_P_2004_M_20",
  "11.3_ISOM_2004_M_39",
  "11.3_CMMR_2004_M_10",
  "11.3_VIPAA_2004_M_5",
  "11.3_VMASD_2004_M_23",
  "11.3_VMATC_2004_M_12",
];

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const url = `${BASE_URL}?ids=${EMAE_IDS.join(
      ","
    )}&format=json&start_date=2004-01-01&limit=1000`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`datos.gob.ar respondió ${response.status}`);
    }
    const json = await response.json();

    // Reconstruir cada serie como [[fecha, valor], ...] sin nulls, misma forma
    // que devolvía la API pública cuando se pedía cada serie por separado.
    const series = {};
    EMAE_IDS.forEach((id, i) => {
      series[id] = (json.data || [])
        .filter((fila) => fila[i + 1] !== null && fila[i + 1] !== undefined)
        .map((fila) => [fila[0], fila[i + 1]]);
    });

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=21600, stale-while-revalidate=43200"
    );

    // ?general=1 -> solo la serie general (últimos 24 meses), usado por la portada
    if (req.query.general) {
      return res.status(200).json({ data: series[SERIE_GENERAL].slice(-24) });
    }

    res.status(200).json({ series });
  } catch (error) {
    console.error("Error obteniendo EMAE:", error);
    res.status(502).json({ error: error.message });
  }
}

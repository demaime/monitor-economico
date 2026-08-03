import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const endpoints = [
      { name: "oficial", url: "https://dolarapi.com/v1/dolares/oficial" },
      { name: "blue", url: "https://dolarapi.com/v1/dolares/blue" },
      { name: "mep", url: "https://dolarapi.com/v1/dolares/bolsa" },
      { name: "ccl", url: "https://dolarapi.com/v1/dolares/contadoconliqui" },
      { name: "tarjeta", url: "https://dolarapi.com/v1/dolares/tarjeta" },
      { name: "mayorista", url: "https://dolarapi.com/v1/dolares/mayorista" },
    ];

    const formattedData = {};

    const results = await Promise.allSettled(
      endpoints.map((endpoint) => axios.get(endpoint.url, { timeout: 5000 }))
    );

    results.forEach((result, index) => {
      const { name } = endpoints[index];
      if (result.status === "fulfilled" && result.value.data) {
        formattedData[name] = {
          compra: result.value.data.compra,
          venta: result.value.data.venta,
          fecha: result.value.data.fechaActualizacion,
        };
      } else {
        console.error(`Error fetching ${name}:`, result.reason?.message);
        formattedData[name] = {
          error: true,
          message: `Failed to fetch ${name} data`,
        };
      }
    });

    if (Object.keys(formattedData).length === 0) {
      throw new Error("No se pudo obtener ningún dato de las APIs");
    }

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );
    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error general:", error);
    res.status(500).json({
      error: "Error fetching dollar data",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

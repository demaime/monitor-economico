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

    // Realizar las llamadas una por una para mejor manejo de errores
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(endpoint.url, { timeout: 5000 });

        if (response.data && response.status === 200) {
          formattedData[endpoint.name] = {
            compra: response.data.compra,
            venta: response.data.venta,
            fecha: response.data.fechaActualizacion,
          };
        }
      } catch (endpointError) {
        console.error(
          `Error fetching ${endpoint.name}:`,
          endpointError.message
        );
        formattedData[endpoint.name] = {
          error: true,
          message: `Failed to fetch ${endpoint.name} data`,
        };
      }
    }

    // Si no se pudo obtener ningún dato, devolver error
    if (Object.keys(formattedData).length === 0) {
      throw new Error("No se pudo obtener ningún dato de las APIs");
    }

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

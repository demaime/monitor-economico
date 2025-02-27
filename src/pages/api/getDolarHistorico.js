import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const endpoints = [
      {
        name: "oficial",
        url: "https://api.argentinadatos.com/v1/cotizaciones/dolares/oficial",
      },
      {
        name: "blue",
        url: "https://api.argentinadatos.com/v1/cotizaciones/dolares/blue",
      },
      {
        name: "bolsa",
        url: "https://api.argentinadatos.com/v1/cotizaciones/dolares/bolsa",
      },
      {
        name: "contadoconliqui",
        url: "https://api.argentinadatos.com/v1/cotizaciones/dolares/contadoconliqui",
      },
      {
        name: "cripto",
        url: "https://api.argentinadatos.com/v1/cotizaciones/dolares/cripto",
      },
      {
        name: "mayorista",
        url: "https://api.argentinadatos.com/v1/cotizaciones/dolares/mayorista",
      },
    ];

    const formattedData = {};

    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(endpoint.url, { timeout: 10000 });

        if (response.data && Array.isArray(response.data)) {
          // Agrupar por mes y calcular promedios
          const monthlyAverages = response.data.reduce((acc, item) => {
            const yearMonth = item.fecha.substring(0, 7); // "YYYY-MM"

            if (!acc[yearMonth]) {
              acc[yearMonth] = {
                sum: 0,
                count: 0,
                month: yearMonth,
              };
            }

            acc[yearMonth].sum += item.venta;
            acc[yearMonth].count += 1;

            return acc;
          }, {});

          // Convertir promedios a array y ordenar
          const averagesArray = Object.values(monthlyAverages)
            .map(({ sum, count, month }) => ({
              month,
              average: Math.round(sum / count),
            }))
            .sort((a, b) => b.month.localeCompare(a.month));

          // Tomar los últimos 24 meses completos
          formattedData[endpoint.name] = averagesArray.slice(1, 25);
        }
      } catch (endpointError) {
        console.error(
          `Error fetching ${endpoint.name}:`,
          endpointError.message
        );
        formattedData[endpoint.name] = {
          error: true,
          message: `Failed to fetch ${endpoint.name} historical data`,
        };
      }
    }

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error general:", error);
    res.status(500).json({
      error: "Error fetching historical dollar data",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

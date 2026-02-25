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
        name: "tarjeta",
        url: "https://api.argentinadatos.com/v1/cotizaciones/dolares/tarjeta",
      },
      {
        name: "mayorista",
        url: "https://api.argentinadatos.com/v1/cotizaciones/dolares/mayorista",
      },
    ];

    const results = await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        const response = await axios.get(endpoint.url, { timeout: 8000 });
        return { name: endpoint.name, data: response.data };
      })
    );

    const formattedData = {};

    for (const result of results) {
      if (result.status === "fulfilled") {
        const { name, data } = result.value;
        if (data && Array.isArray(data)) {
          const monthlyAverages = data.reduce((acc, item) => {
            const yearMonth = item.fecha.substring(0, 7);
            if (!acc[yearMonth]) {
              acc[yearMonth] = { sum: 0, count: 0, month: yearMonth };
            }
            acc[yearMonth].sum += item.venta;
            acc[yearMonth].count += 1;
            return acc;
          }, {});

          const averagesArray = Object.values(monthlyAverages)
            .map(({ sum, count, month }) => ({
              month,
              average: Math.round(sum / count),
            }))
            .sort((a, b) => b.month.localeCompare(a.month));

          formattedData[name] = averagesArray.slice(1, 25);
        }
      } else {
        const endpointName = endpoints[results.indexOf(result)]?.name || "unknown";
        console.error(`Error fetching ${endpointName}:`, result.reason?.message);
        formattedData[endpointName] = {
          error: true,
          message: `Failed to fetch ${endpointName} historical data`,
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

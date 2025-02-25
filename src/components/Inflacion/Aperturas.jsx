import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Aperturas({
  data,
  months,
  selectedRegion,
  selectedMonth,
}) {
  // Obtenemos los últimos 12 meses
  const last12Months = months.slice(-12);

  // Encontramos el índice del mes seleccionado en los últimos 12 meses
  const selectedMonthIndex = last12Months.findIndex(
    (m) => m.mes === selectedMonth
  );

  // Calculamos los índices correctos en el array completo de 24 meses
  const currentMonthIndex = months.length - 12 + selectedMonthIndex;
  const previousMonthIndex = currentMonthIndex - 1;

  // Preparamos los datos para el gráfico
  const prepareData = () => {
    if (!data || !data[selectedRegion] || previousMonthIndex < 0) {
      return [];
    }

    const regionData = data[selectedRegion];
    const chartData = [];

    // Calculamos la variación porcentual para el nivel general
    if (regionData.general && Array.isArray(regionData.general)) {
      const currentValue = regionData.general[currentMonthIndex];
      const previousValue = regionData.general[previousMonthIndex];

      if (
        typeof currentValue === "number" &&
        typeof previousValue === "number" &&
        previousValue !== 0
      ) {
        const variacionPorcentual =
          ((currentValue - previousValue) / previousValue) * 100;
        chartData.push({
          name: "Nivel General",
          variacion: parseFloat(variacionPorcentual.toFixed(1)),
          fill: "#0760b8", // Color especial para Nivel General
        });
      }
    }

    // Calculamos la variación porcentual para cada apertura
    if (regionData.apertura) {
      Object.entries(regionData.apertura).forEach(([key, values]) => {
        if (Array.isArray(values)) {
          const currentValue = values[currentMonthIndex];
          const previousValue = values[previousMonthIndex];

          if (
            typeof currentValue === "number" &&
            typeof previousValue === "number" &&
            previousValue !== 0
          ) {
            const variacionPorcentual =
              ((currentValue - previousValue) / previousValue) * 100;
            chartData.push({
              name:
                key.charAt(0).toUpperCase() +
                key
                  .slice(1)
                  .replace(/([A-Z])/g, " $1")
                  .trim(),
              variacion: parseFloat(variacionPorcentual.toFixed(1)),
              fill: selectedRegion === "nacional" ? "#ff5733" : "#f6ff00",
            });
          }
        }
      });
    }

    return chartData.sort((a, b) => b.variacion - a.variacion);
  };

  const chartData = prepareData();

  if (chartData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="text-gray-300 text-[10px] sm:text-[5px]">
        <span>Variaciones mensuales - </span>
        <span className="font-medium">
          {last12Months[selectedMonthIndex].mes}{" "}
          {last12Months[selectedMonthIndex].año}
        </span>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: window.innerWidth < 640 ? 15 : 20,
              right: window.innerWidth < 640 ? 5 : 15,
              left: window.innerWidth < 640 ? -35 : 10,
              bottom: window.innerWidth < 640 ? 50 : 60,
            }}
          >
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={window.innerWidth < 640 ? 60 : 80}
              tick={{
                fill: "#9ca3af",
                fontSize: window.innerWidth < 640 ? 8 : 12,
              }}
            />
            <YAxis
              tick={{
                fill: "#9ca3af",
                fontSize: window.innerWidth < 640 ? 8 : 12,
              }}
              axisLine={{ stroke: "#374151" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: window.innerWidth < 640 ? 10 : 12,
                color: "#ffffff",
              }}
              labelStyle={{ color: "#9ca3af" }}
              formatter={(value) => [`${value}%`, "Variación"]}
              itemStyle={{ color: "#ffffff" }}
            />
            <Bar
              dataKey="variacion"
              fill={(entry) => entry.fill}
              radius={[4, 4, 0, 0]}
              label={{
                position: "insideTop",
                fill: selectedRegion === "nacional" ? "#fff" : "#000",
                formatter: (value) => `${value}%`,
                fontSize: window.innerWidth < 640 ? 8 : 12,
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

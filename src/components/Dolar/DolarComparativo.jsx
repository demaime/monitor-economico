import React, { useState } from "react";
import MonthSelector from "../MonthSelector/MonthSelector";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

// Reusing the same DOLAR_TYPES but excluding 'oficial' since it's our base for comparison
const DOLAR_TYPES = {
  blue: {
    name: "Dólar Blue",
    color: "#2563eb", // azul
  },
  bolsa: {
    name: "Dólar MEP",
    color: "#ec4899", // rosa
  },
  contadoconliqui: {
    name: "Dólar CCL",
    color: "#a855f7", // violeta
  },
  tarjeta: {
    name: "Dólar Tarjeta",
    color: "#eab308", // amarillo
  },
  mayorista: {
    name: "Dólar Mayorista",
    color: "#f97316", // naranja
  },
};

export default function DolarComparativo({
  months,
  historicalData,
  selectedMonth,
  setSelectedMonth,
}) {
  const [activeCard, setActiveCard] = useState(0);

  // Función para convertir YYYY-MM a nombre de mes
  const formatMonthName = (dateStr) => {
    const monthNames = {
      "01": "ENERO",
      "02": "FEBRERO",
      "03": "MARZO",
      "04": "ABRIL",
      "05": "MAYO",
      "06": "JUNIO",
      "07": "JULIO",
      "08": "AGOSTO",
      "09": "SEPTIEMBRE",
      10: "OCTUBRE",
      11: "NOVIEMBRE",
      12: "DICIEMBRE",
    };
    const month = dateStr.split("-")[1];
    return monthNames[month];
  };

  // Función para calcular la diferencia y porcentaje para un mes específico
  const calculateDifference = (dolarType, month) => {
    if (
      !historicalData ||
      !historicalData.oficial ||
      !historicalData[dolarType]
    ) {
      return null;
    }

    const oficialData = historicalData.oficial.find(
      (m) => formatMonthName(m.month) === month
    );
    const typeData = historicalData[dolarType].find(
      (m) => formatMonthName(m.month) === month
    );

    if (!oficialData || !typeData) return null;

    const difference = typeData.average - oficialData.average;
    const percentage = ((difference / oficialData.average) * 100).toFixed(2);

    return {
      difference,
      percentage,
    };
  };

  // Preparar datos para el gráfico (solo el mes seleccionado)
  const prepareChartData = () => {
    if (!historicalData || !historicalData.oficial) return [];

    const oficialData = historicalData.oficial.find(
      (m) => formatMonthName(m.month) === selectedMonth
    );

    if (!oficialData) return [];

    const oficialValue = oficialData.average;

    // Crear un array con un objeto que contiene todos los valores
    return [
      {
        name: "Cotizaciones",
        oficial: oficialValue,
        ...Object.keys(DOLAR_TYPES).reduce((acc, dolarType) => {
          const typeData = historicalData[dolarType]?.find(
            (m) => formatMonthName(m.month) === selectedMonth
          );
          if (typeData) {
            acc[dolarType] = typeData.average;
            acc[`${dolarType}_diff`] = typeData.average - oficialValue;
          }
          return acc;
        }, {}),
      },
    ];
  };

  // Add handleScroll function for carousel
  const handleScroll = (e) => {
    const scrollPosition = e.target.scrollLeft;
    const cardWidth = window.innerWidth * 0.85; // 85vw
    const activeIndex = Math.round(scrollPosition / cardWidth);
    setActiveCard(activeIndex);
  };

  if (!months || months.length === 0) {
    return <div>No hay datos de meses disponibles</div>;
  }

  if (!historicalData) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        Cargando datos históricos...
      </div>
    );
  }

  const chartData = prepareChartData();

  return (
    <div className="flex h-full flex-col gap-2 bg-gray-900">
      {/* Título y Selector de Mes */}
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between">
          <MonthSelector
            months={months}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-[75%] md:h-2/3 rounded-xl p-4 bg-gray-800">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={prepareChartData()}
            margin={{
              top: 20,
              right: window.innerWidth < 768 ? 0 : 180,
              left: window.innerWidth < 768 ? -30 : 0,
              bottom: 20,
            }}
            barCategoryGap={20}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis type="category" dataKey="name" hide={true} />
            <YAxis
              tick={{
                fill: "#9ca3af",
                fontSize: window.innerWidth < 768 ? 8 : 12,
              }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "0.75rem",
                padding: window.innerWidth < 768 ? "0.5rem" : "0.75rem",
              }}
              formatter={(value, name) => {
                const dolarType = DOLAR_TYPES[name];
                if (name === "oficial") {
                  return [`$${value.toLocaleString()}`, "Dólar Oficial"];
                }
                const item = prepareChartData()[0];
                if (item && item[`${name}_diff`]) {
                  const diff = item[`${name}_diff`];
                  const diffText =
                    window.innerWidth < 768
                      ? `$${diff.toLocaleString()} (${(
                          (diff / item.oficial) *
                          100
                        ).toFixed(1)}%)`
                      : `Diferencia: $${diff.toLocaleString()} (${(
                          (diff / item.oficial) *
                          100
                        ).toFixed(2)}%)`;
                  return [
                    `$${value.toLocaleString()} ▬ ${diffText}`,
                    dolarType.name,
                  ];
                }
                return [value, name];
              }}
              labelStyle={{
                color: "#fff",
                fontSize: window.innerWidth < 768 ? "0.65rem" : "0.875rem",
              }}
              itemStyle={{
                fontSize: window.innerWidth < 768 ? "0.65rem" : "0.875rem",
              }}
            />
            {/* Línea de referencia en el valor del dólar oficial */}
            {prepareChartData()[0]?.oficial && (
              <ReferenceLine
                y={prepareChartData()[0].oficial}
                stroke="#4ade80"
                strokeDasharray="3 3"
                label={{
                  value:
                    window.innerWidth < 768
                      ? `Oficial: $${prepareChartData()[0].oficial.toLocaleString()} ►`
                      : `Oficial: $${prepareChartData()[0].oficial.toLocaleString()}`,
                  fill: "#4ade80",
                  position: window.innerWidth < 768 ? "insideRight" : "right",
                  angle: window.innerWidth < 768 ? -90 : 0,
                  offset: window.innerWidth < 768 ? 10 : 0,
                  fontSize: window.innerWidth < 768 ? 10 : 12,
                }}
              />
            )}
            <Bar
              dataKey="oficial"
              fill="#4ade80"
              name="Dólar Oficial"
              opacity={0.3}
            />
            {Object.entries(DOLAR_TYPES).map(([key, info]) => (
              <Bar
                key={key}
                dataKey={key}
                fill={info.color}
                name={key}
                label={{
                  position: "top",
                  fill: info.color,
                  fontSize: 12,
                  formatter: (value) => `$${value.toLocaleString()}`,
                }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cards con diferencias */}
      <div className="flex-1 flex flex-col">
        {/* Carousel container */}
        <div
          className="flex gap-4 overflow-x-auto md:grid md:grid-cols-5 snap-x snap-mandatory scroll-smooth"
          onScroll={handleScroll}
        >
          {Object.entries(DOLAR_TYPES).map(([dolarType, info]) => {
            const diff = calculateDifference(dolarType, selectedMonth);

            return (
              <div
                key={dolarType}
                className="min-w-[85vw] shrink-0 md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50 snap-center"
              >
                <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-200">
                      {info.name} vs Oficial
                    </h3>
                    {diff && (
                      <div className="space-y-1">
                        <div
                          className="text-2xl font-bold"
                          style={{ color: info.color }}
                        >
                          ${diff.difference >= 0 ? "" : "-"}
                          {Math.abs(diff.difference).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">
                          {diff.percentage >= 0 ? "+" : ""}
                          {diff.percentage}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Indicadores de scroll (solo en móvil) */}
        <div className="flex gap-1 justify-center py-2 md:hidden">
          {Object.keys(DOLAR_TYPES).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                activeCard === index ? "bg-blue-500" : "bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

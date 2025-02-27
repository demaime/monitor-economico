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
  cripto: {
    name: "Dólar Cripto",
    color: "#eab308", // amarillo
  },
  mayorista: {
    name: "Dólar Mayorista",
    color: "#f97316", // naranja
  },
};

export default function DolarComparativo({ months, historicalData }) {
  const [selectedMonth, setSelectedMonth] = useState(
    months && months.length > 0 ? months[months.length - 1].mes : ""
  );

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
              right: window.innerWidth < 768 ? -30 : 180,
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
                padding: "0.75rem",
              }}
              formatter={(value, name) => {
                const dolarType = DOLAR_TYPES[name];
                if (name === "oficial") {
                  return [`$${value.toLocaleString()}`, "Dólar Oficial"];
                }
                const item = prepareChartData()[0];
                if (item && item[`${name}_diff`]) {
                  const diff = item[`${name}_diff`];
                  return [
                    [
                      `$${value.toLocaleString()}`,
                      `Diferencia: $${diff.toLocaleString()} (${(
                        (diff / item.oficial) *
                        100
                      ).toFixed(2)}%)`,
                    ],
                    dolarType.name,
                  ];
                }
                return [value, name];
              }}
            />
            {/* Línea de referencia en el valor del dólar oficial */}
            {prepareChartData()[0]?.oficial && (
              <ReferenceLine
                y={prepareChartData()[0].oficial}
                stroke="#4ade80"
                strokeDasharray="3 3"
                label={{
                  value: `Oficial: $${prepareChartData()[0].oficial.toLocaleString()}`,
                  fill: "#4ade80",
                  position: "right",
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
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(DOLAR_TYPES).map(([dolarType, info]) => {
            const diff = calculateDifference(dolarType, selectedMonth);

            return (
              <div
                key={dolarType}
                className="relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50"
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
                          ${diff.difference.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">
                          +{diff.percentage}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

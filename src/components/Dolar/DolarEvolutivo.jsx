import React, { useState } from "react";
import MonthSelector from "../MonthSelector/MonthSelector";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
} from "recharts";

// Unificamos con DolarEnVivo
const DOLAR_TYPES = {
  oficial: {
    name: "Dólar Oficial",
    color: "#4ade80", // verde
  },
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

export default function DolarEvolutivo({
  months,
  historicalData,
  selectedMonth,
  setSelectedMonth,
}) {
  const [loading, setLoading] = useState(false);
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

  // Función para obtener el año anterior del mismo mes
  const getPreviousYearData = (currentMonth, dolarType) => {
    if (!historicalData || !historicalData[dolarType]) return null;

    const [year, month] = currentMonth.split("-");
    const previousYear = `${parseInt(year) - 1}-${month}`;

    return historicalData[dolarType].find((m) => m.month === previousYear);
  };

  // Calcular variación interanual
  const calculateYearlyVariation = (current, previous) => {
    if (!previous || !current) return null;
    return (
      ((current.average - previous.average) / previous.average) *
      100
    ).toFixed(2);
  };

  // Función para calcular la variación porcentual
  const calculateVariation = (current, previous) => {
    if (!current || !previous) return null;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  // Función para obtener los datos del mes seleccionado
  const getSelectedMonthData = (dolarType) => {
    if (!historicalData || !historicalData[dolarType]) return null;

    const currentData = historicalData[dolarType].find(
      (m) => formatMonthName(m.month) === selectedMonth
    );

    // Encontrar el mes anterior
    const currentIndex = historicalData[dolarType].findIndex(
      (m) => formatMonthName(m.month) === selectedMonth
    );
    const previousData =
      currentIndex < historicalData[dolarType].length - 1
        ? historicalData[dolarType][currentIndex + 1]
        : null;

    return {
      current: currentData?.average,
      variation: calculateVariation(
        currentData?.average,
        previousData?.average
      ),
    };
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

  // Modificar la búsqueda del mes seleccionado
  const selectedMonthData =
    selectedMonth &&
    historicalData &&
    Object.values(historicalData)[0]?.find(
      (m) => formatMonthName(m.month) === selectedMonth
    )?.average;

  // Función para preparar datos para el gráfico
  const prepareChartData = () => {
    if (!historicalData) return [];

    // Obtener los últimos 12 meses de datos
    const firstType = Object.values(historicalData)[0];
    if (!firstType) return [];

    const last12Months = firstType.slice(0, 12).map((item) => item.month);

    return last12Months.reverse().map((month) => {
      const dataPoint = {
        month: formatMonthName(month),
      };

      // Agregar valores para cada tipo de dólar
      Object.entries(historicalData).forEach(([dolarType, data]) => {
        const monthData = data.find((m) => m.month === month);
        dataPoint[dolarType] = monthData ? monthData.average : null;
      });

      return dataPoint;
    });
  };

  // Añadir handleScroll para las tarjetas
  const handleScroll = (e) => {
    const scrollPosition = e.target.scrollLeft;
    const cardWidth = window.innerWidth * 0.85; // 85vw
    const activeIndex = Math.round(scrollPosition / cardWidth);
    setActiveCard(activeIndex);
  };

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

      {/* Gráfico (75% altura en móvil) */}
      <div className="h-[75%] md:h-2/3 rounded-xl p-4 bg-gray-800">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={prepareChartData()}
            margin={{
              top: 5,
              right: 15,
              left: window.innerWidth < 768 ? -30 : -10,
              bottom: 20,
            }}
          >
            <XAxis
              dataKey="month"
              angle={-30}
              textAnchor="end"
              height={60}
              tick={{
                fill: "#9ca3af",
                fontSize: window.innerWidth < 768 ? 8 : 12,
              }}
            />
            <YAxis
              tick={{
                fill: "#9ca3af",
                fontSize: window.innerWidth < 768 ? 8 : 12,
              }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              domain={[700, 1500]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: "0.75rem",
                padding: "0.75rem",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{
                color: "#f3f4f6",
                fontSize: "0.875rem",
                fontWeight: "500",
                marginBottom: "0.5rem",
              }}
              formatter={(value, name) => {
                return [
                  `$${value.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
                  name,
                ];
              }}
            />
            <ReferenceLine
              x={selectedMonth}
              stroke="#56595e"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            {Object.entries(DOLAR_TYPES).map(([dolarType, info]) => (
              <Line
                key={dolarType}
                type="monotone"
                dataKey={dolarType}
                stroke={info.color}
                strokeWidth={2}
                dot={false}
                name={info.name}
              />
            ))}
            <Brush
              dataKey="month"
              height={15}
              stroke="#ff5733"
              fill="#1f2937"
              travellerWidth={10}
              style={{
                fontSize: window.innerWidth < 768 ? "8px" : "12px",
                marginTop: "2px",
                stroke: "#ff5733",
                fill: "#ff5733",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Contenedor de tarjetas deslizables */}
      <div className="flex-1 flex flex-col">
        {/* Carousel container */}
        <div
          className="flex gap-4 overflow-x-auto md:grid md:grid-cols-6 snap-x snap-mandatory scroll-smooth"
          onScroll={handleScroll}
        >
          {Object.entries(DOLAR_TYPES).map(([dolarType, info], index) => {
            const monthData = getSelectedMonthData(dolarType);

            return (
              <div
                key={dolarType}
                className="min-w-[85vw] shrink-0 md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50 snap-center"
              >
                <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-200">
                      {info.name}
                    </h3>
                    <div className="space-y-1">
                      <div
                        className="text-2xl font-bold"
                        style={{ color: info.color }}
                      >
                        {monthData?.current
                          ? `$${monthData.current.toLocaleString()}`
                          : "N/A"}
                      </div>
                      {monthData?.variation && (
                        <div
                          className={`text-sm ${
                            parseFloat(monthData.variation) >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {parseFloat(monthData.variation) >= 0 ? "+" : ""}
                          {monthData.variation}%
                        </div>
                      )}
                    </div>
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

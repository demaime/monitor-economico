import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Maximize2,
} from "lucide-react";

export default function EmaeEvolutivo({
  months,
  emaeData,
  selectedMonth,
  seriesConfig,
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState("cards");

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  if (!emaeData || !months.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-400">No hay datos disponibles</p>
      </div>
    );
  }

  const fullMonthsArray = emaeData.fullMonthsArray || months;

  const chartData = months.map((month, index) => {
    const generalSeriesData = emaeData["143.3_NO_PR_2004_A_21"];
    const fullArrayIndex = generalSeriesData.length - months.length + index;
    const value = generalSeriesData[fullArrayIndex];

    return {
      mes: month.mes,
      valor: value ? Number(value[1].toFixed(2)) : 0,
      date: month.fullDate,
    };
  });

  const selectedIndex = chartData.findIndex(
    (item) => item.mes === selectedMonth
  );
  const selectedData = chartData[selectedIndex];

  let variacionMensual = 0;
  let variacionAnual = 0;

  if (selectedIndex > 0) {
    const valorActual = selectedData.valor;
    const valorAnterior = chartData[selectedIndex - 1].valor;
    if (valorAnterior !== 0) {
      variacionMensual = ((valorActual - valorAnterior) / valorAnterior) * 100;
    }
  }

  const generalSeriesData = emaeData["143.3_NO_PR_2004_A_21"];
  const currentIndexInSeries =
    generalSeriesData.length - months.length + selectedIndex;

  if (currentIndexInSeries >= 12) {
    const valorActual = selectedData.valor;
    const annualPreviousValue = generalSeriesData[currentIndexInSeries - 12];
    const valorAnualAnterior = annualPreviousValue
      ? Number(annualPreviousValue[1])
      : 0;

    if (valorAnualAnterior !== 0) {
      variacionAnual =
        ((valorActual - valorAnualAnterior) / valorAnualAnterior) * 100;
    }
  }

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-600">
          <p className="text-gray-300 text-sm font-medium">{label}</p>
          <p className="text-yellow-300 font-bold">
            Índice: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full bg-gray-800 rounded-xl p-2 sm:p-4 space-y-2 sm:space-y-4">
      {/* Toggle para mobile */}
      {isMobile && (
        <div className="flex justify-center">
          <div className="bg-gray-700 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                viewMode === "cards"
                  ? "bg-orange-custom text-white"
                  : "text-gray-300"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Datos</span>
            </button>
            <button
              onClick={() => setViewMode("chart")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                viewMode === "chart"
                  ? "bg-orange-custom text-white"
                  : "text-gray-300"
              }`}
            >
              <Maximize2 className="w-4 h-4" />
              <span>Gráfico</span>
            </button>
          </div>
        </div>
      )}

      {/* Cards con información del mes seleccionado */}
      {(!isMobile || viewMode === "cards") && (
        <div
          className={`grid gap-2 sm:gap-4 ${
            isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
          }`}
        >
          {/* Valor actual */}
          <div className={`bg-gray-700 rounded-lg ${isMobile ? "p-3" : "p-4"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-gray-400 ${
                    isMobile ? "text-xs" : "text-sm"
                  }`}
                >
                  Índice General
                </p>
                <p
                  className={`font-bold text-yellow-300 ${
                    isMobile ? "text-lg" : "text-2xl"
                  }`}
                >
                  {selectedData?.valor || 0}
                </p>
                <p className="text-gray-500 text-xs">{selectedMonth}</p>
              </div>
              <TrendingUp
                className={`text-yellow-300 ${
                  isMobile ? "w-6 h-6" : "w-8 h-8"
                }`}
              />
            </div>
          </div>

          {/* Variación mensual */}
          <div className={`bg-gray-700 rounded-lg ${isMobile ? "p-3" : "p-4"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-gray-400 ${
                    isMobile ? "text-xs" : "text-sm"
                  }`}
                >
                  Variación Mensual
                </p>
                <p
                  className={`font-bold ${isMobile ? "text-lg" : "text-2xl"} ${
                    variacionMensual >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {variacionMensual >= 0 ? "+" : ""}
                  {variacionMensual.toFixed(2)}%
                </p>
                <p className="text-gray-500 text-xs">vs mes anterior</p>
              </div>
              {variacionMensual >= 0 ? (
                <ArrowUpRight
                  className={`text-green-400 ${
                    isMobile ? "w-6 h-6" : "w-8 h-8"
                  }`}
                />
              ) : (
                <ArrowDownRight
                  className={`text-red-400 ${isMobile ? "w-6 h-6" : "w-8 h-8"}`}
                />
              )}
            </div>
          </div>

          {/* Variación anual */}
          <div className={`bg-gray-700 rounded-lg ${isMobile ? "p-3" : "p-4"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-gray-400 ${
                    isMobile ? "text-xs" : "text-sm"
                  }`}
                >
                  Variación Anual
                </p>
                <p
                  className={`font-bold ${isMobile ? "text-lg" : "text-2xl"} ${
                    variacionAnual >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {variacionAnual >= 0 ? "+" : ""}
                  {variacionAnual.toFixed(2)}%
                </p>
                <p className="text-gray-500 text-xs">
                  vs mismo mes año anterior
                </p>
              </div>
              {variacionAnual >= 0 ? (
                <TrendingUp
                  className={`text-green-400 ${
                    isMobile ? "w-6 h-6" : "w-8 h-8"
                  }`}
                />
              ) : (
                <TrendingDown
                  className={`text-red-400 ${isMobile ? "w-6 h-6" : "w-8 h-8"}`}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gráfico */}
      {(!isMobile || viewMode === "chart") && (
        <div className={`${isMobile ? "h-64" : "h-80"}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={
                isMobile
                  ? { top: 10, right: 10, left: 0, bottom: 5 }
                  : { top: 20, right: 30, left: 20, bottom: 5 }
              }
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="mes"
                tick={{
                  fill: "#9ca3af",
                  fontSize: isMobile ? 8 : 10,
                }}
                angle={-45}
                textAnchor="end"
                height={isMobile ? 50 : 60}
              />
              <YAxis
                tick={{
                  fill: "#9ca3af",
                  fontSize: isMobile ? 8 : 10,
                }}
                axisLine={{ stroke: "#374151" }}
                width={isMobile ? 40 : 60}
              />
              <Tooltip content={customTooltip} />
              <ReferenceLine
                x={selectedMonth}
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#fef08a"
                strokeWidth={isMobile ? 2 : 3}
                dot={{
                  stroke: "#fef08a",
                  fill: "#fef08a",
                  strokeWidth: 2,
                  r: isMobile ? 3 : 4,
                }}
                activeDot={{
                  r: isMobile ? 5 : 6,
                  stroke: "#f59e0b",
                  fill: "#fef08a",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Información adicional */}
      <div className="text-center">
        <p className={`text-gray-400 ${isMobile ? "text-xs" : "text-sm"}`}>
          Mostrando los últimos {isMobile ? "12" : "24"} meses disponibles del
          EMAE
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Base 2004 = 100 | Fuente: INDEC
        </p>
      </div>
    </div>
  );
}

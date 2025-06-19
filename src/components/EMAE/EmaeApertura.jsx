import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, BarChart3, Maximize2 } from "lucide-react";

export default function EmaeApertura({
  months,
  emaeData,
  selectedMonth,
  seriesConfig,
}) {
  const [showVariations, setShowVariations] = useState(false);

  // Estado para mobile y vista
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState("cards"); // "cards" o "chart"

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

  // Usar el array completo de 24 meses si está disponible
  const fullMonthsArray = emaeData.fullMonthsArray || months;

  // Encontrar el índice del mes seleccionado
  const selectedIndex = months.findIndex(
    (month) => month.mes === selectedMonth
  );
  const selectedIndexInFull = fullMonthsArray.findIndex(
    (m) => m.mes === selectedMonth
  );

  // Preparar datos para el gráfico de barras
  const chartData = Object.keys(seriesConfig)
    .filter((id) => id !== "143.3_NO_PR_2004_A_21") // Excluir el índice general
    .map((seriesId) => {
      const seriesData = emaeData[seriesId];
      if (!seriesData || seriesData.length === 0) return null;

      // Obtener el valor actual - usar directamente el índice en la serie original
      const currentIndexInSeries =
        seriesData.length - months.length + selectedIndex;
      const currentValue = seriesData[currentIndexInSeries];
      const valor = currentValue ? Number(currentValue[1].toFixed(2)) : 0;

      // Calcular variación mensual
      let variacionMensual = 0;
      if (selectedIndex > 0) {
        const previousValue = seriesData[currentIndexInSeries - 1];
        const valorAnterior = previousValue ? Number(previousValue[1]) : 0;
        if (valorAnterior !== 0) {
          variacionMensual = ((valor - valorAnterior) / valorAnterior) * 100;
        }
      }

      // Calcular variación anual usando el índice correcto en la serie
      let variacionAnual = 0;
      if (currentIndexInSeries >= 12) {
        const annualValue = seriesData[currentIndexInSeries - 12];
        const valorAnualAnterior = annualValue ? Number(annualValue[1]) : 0;
        if (seriesId === "143.3_NO_PR_2004_A_21") {
          // Solo loggear para el índice general
          console.log(`=== DEBUG APERTURA ${seriesConfig[seriesId].name} ===`);
          console.log("Current index in series:", currentIndexInSeries);
          console.log("Annual value index:", currentIndexInSeries - 12);
          console.log("Series length:", seriesData.length);
          console.log("Valor actual:", valor);
          console.log("Valor anual anterior:", valorAnualAnterior);
        }
        if (valorAnualAnterior !== 0) {
          variacionAnual =
            ((valor - valorAnualAnterior) / valorAnualAnterior) * 100;
          if (seriesId === "143.3_NO_PR_2004_A_21") {
            console.log("Variación anual calculada:", variacionAnual);
          }
        }
      }

      return {
        nombre:
          seriesConfig[seriesId].name.length > 25
            ? seriesConfig[seriesId].name.substring(0, 25) + "..."
            : seriesConfig[seriesId].name,
        nombreCompleto: seriesConfig[seriesId].name,
        valor,
        variacionMensual: Number(variacionMensual.toFixed(2)),
        variacionAnual: Number(variacionAnual.toFixed(2)),
        color: seriesConfig[seriesId].color,
        id: seriesId,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.valor - a.valor); // Ordenar por valor descendente

  // Definir dataKey antes de usarlo - usar variación interanual para EMAE
  const dataKey = showVariations ? "variacionAnual" : "valor";

  // Calcular el rango dinámico para el eje Y
  const values = chartData.map((d) => d[dataKey]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const yAxisDomain = [minValue - 10, maxValue + 10];

  console.log("=== DEBUG CHART DATA APERTURA ===");
  console.log("Chart data length:", chartData.length);
  console.log("Chart data sample:", chartData.slice(0, 3));
  console.log("Selected month:", selectedMonth);
  console.log("Show variations:", showVariations);
  console.log("Data key:", dataKey);
  console.log("Y axis domain:", yAxisDomain);

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 max-w-xs">
          <p className="text-gray-300 text-sm font-medium mb-2">
            {data.nombreCompleto || label}
          </p>
          <div className="space-y-1">
            <p className="text-yellow-300 font-bold">
              {showVariations ? "Variación Interanual:" : "Índice:"}{" "}
              {showVariations ? `${data.variacionAnual}%` : data.valor}
            </p>
            {!showVariations && (
              <>
                <p className="text-green-400 text-xs">
                  Var. Mensual: {data.variacionMensual >= 0 ? "+" : ""}
                  {data.variacionMensual}%
                </p>
                <p className="text-blue-400 text-xs">
                  Var. Anual: {data.variacionAnual >= 0 ? "+" : ""}
                  {data.variacionAnual}%
                </p>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full bg-gray-800 rounded-xl p-2 sm:p-4 space-y-2 sm:space-y-4">
      {/* Header con controles */}
      <div
        className={`flex ${
          isMobile ? "flex-col space-y-2" : "justify-between"
        } items-center`}
      >
        <div>
          <h3
            className={`font-semibold text-gray-200 ${
              isMobile ? "text-base" : "text-lg"
            }`}
          >
            Apertura por Sectores - {selectedMonth}
          </h3>
          <p className={`text-gray-400 ${isMobile ? "text-xs" : "text-sm"}`}>
            {showVariations ? "Variaciones interanuales" : "Índices por sector"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowVariations(false)}
            className={`px-3 py-1 rounded text-xs ${
              !showVariations
                ? "bg-orange-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Índices
          </button>
          <button
            onClick={() => setShowVariations(true)}
            className={`px-3 py-1 rounded text-xs ${
              showVariations
                ? "bg-orange-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Variaciones
          </button>
        </div>
      </div>

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
              <span>Resumen</span>
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

      {/* Resumen estadístico - Solo mobile en vista cards */}
      {isMobile && viewMode === "cards" && (
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-700 p-2 rounded-lg">
            <p className="text-gray-400 text-xs">Sectores en crecimiento</p>
            <p className="text-green-400 text-lg font-bold">
              {showVariations
                ? chartData.filter((d) => d.variacionAnual > 0).length
                : chartData.filter((d) => d.variacionMensual > 0).length}
            </p>
          </div>
          <div className="bg-gray-700 p-2 rounded-lg">
            <p className="text-gray-400 text-xs">Sectores en caída</p>
            <p className="text-red-400 text-lg font-bold">
              {showVariations
                ? chartData.filter((d) => d.variacionAnual < 0).length
                : chartData.filter((d) => d.variacionMensual < 0).length}
            </p>
          </div>
          <div className="bg-gray-700 p-2 rounded-lg">
            <p className="text-gray-400 text-xs">Mayor crecimiento</p>
            <p className="text-green-400 text-lg font-bold">
              +
              {showVariations
                ? Math.max(...chartData.map((d) => d.variacionAnual)).toFixed(1)
                : Math.max(...chartData.map((d) => d.variacionMensual)).toFixed(
                    1
                  )}
              %
            </p>
          </div>
          <div className="bg-gray-700 p-2 rounded-lg">
            <p className="text-gray-400 text-xs">Mayor caída</p>
            <p className="text-red-400 text-lg font-bold">
              {showVariations
                ? Math.min(...chartData.map((d) => d.variacionAnual)).toFixed(1)
                : Math.min(...chartData.map((d) => d.variacionMensual)).toFixed(
                    1
                  )}
              %
            </p>
          </div>
        </div>
      )}

      {/* Lista top sectores - Solo mobile en vista cards */}
      {isMobile && viewMode === "cards" && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Top 5 Sectores</h4>
          <div className="space-y-1">
            {chartData.slice(0, 5).map((sector, index) => (
              <div
                key={sector.id}
                className="flex items-center justify-between bg-gray-700 p-2 rounded-lg"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: sector.color }}
                  />
                  <span className="text-gray-200 text-xs truncate">
                    {sector.nombre}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-yellow-300 font-mono">
                    {sector.valor}
                  </span>
                  <span
                    className={`font-mono ${
                      showVariations
                        ? sector.variacionAnual >= 0
                          ? "text-green-400"
                          : "text-red-400"
                        : sector.variacionMensual >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {showVariations
                      ? `${sector.variacionAnual >= 0 ? "+" : ""}${
                          sector.variacionAnual
                        }%`
                      : `${sector.variacionMensual >= 0 ? "+" : ""}${
                          sector.variacionMensual
                        }%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gráfico - Desktop siempre, Mobile solo en vista chart */}
      {(!isMobile || viewMode === "chart") && (
        <div
          className={`${
            isMobile
              ? "space-y-2"
              : "flex flex-col lg:flex-row lg:gap-6 space-y-4 lg:space-y-0 flex-1"
          }`}
        >
          {/* Gráfico */}
          <div
            className={`${isMobile ? "flex-1" : "flex-1 lg:w-1/2"} space-y-4`}
          >
            <div className={`${isMobile ? "h-64" : "h-96"}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                  data={chartData.slice(0, isMobile ? 8 : 10)}
                  margin={
                    isMobile
                      ? { top: 10, right: 5, left: 0, bottom: 20 }
                      : { top: 20, right: 30, left: 40, bottom: 30 }
                  }
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="nombre"
                    tick={{
                      fill: "#9ca3af",
                      fontSize: isMobile ? 6 : 8,
                    }}
                  axisLine={{ stroke: "#374151" }}
                  angle={-45}
                  textAnchor="end"
                    height={isMobile ? 80 : 100}
                  interval={0}
                />
                <YAxis
                    tick={{
                      fill: "#9ca3af",
                      fontSize: isMobile ? 8 : 10,
                    }}
                  axisLine={{ stroke: "#374151" }}
                  domain={yAxisDomain}
                    width={isMobile ? 35 : 60}
                />
                <Tooltip content={customTooltip} />
                <Bar dataKey={dataKey} strokeWidth={1}>
                    {chartData
                      .slice(0, isMobile ? 8 : 10)
                      .map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={entry.color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

          {/* Columna derecha: Estadísticas y lista - Solo desktop */}
          {!isMobile && (
        <div className="flex-1 lg:w-1/2 space-y-4">
          {/* Resumen estadístico */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 p-3 rounded-lg">
                  <p className="text-gray-400 text-xs">
                    Sectores en crecimiento
                  </p>
              <p className="text-green-400 text-xl font-bold">
                {showVariations
                  ? chartData.filter((d) => d.variacionAnual > 0).length
                  : chartData.filter((d) => d.variacionMensual > 0).length}
              </p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-400 text-xs">Sectores en caída</p>
              <p className="text-red-400 text-xl font-bold">
                {showVariations
                  ? chartData.filter((d) => d.variacionAnual < 0).length
                  : chartData.filter((d) => d.variacionMensual < 0).length}
              </p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-400 text-xs">Mayor crecimiento</p>
              <p className="text-green-400 text-xl font-bold">
                +
                {showVariations
                      ? Math.max(
                          ...chartData.map((d) => d.variacionAnual)
                        ).toFixed(1)
                  : Math.max(
                      ...chartData.map((d) => d.variacionMensual)
                    ).toFixed(1)}
                %
              </p>
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-gray-400 text-xs">Mayor caída</p>
              <p className="text-red-400 text-xl font-bold">
                {showVariations
                      ? Math.min(
                          ...chartData.map((d) => d.variacionAnual)
                        ).toFixed(1)
                  : Math.min(
                      ...chartData.map((d) => d.variacionMensual)
                    ).toFixed(1)}
                %
              </p>
            </div>
          </div>

          {/* Lista detallada */}
          <div className="h-64 overflow-y-auto">
            <div className="grid grid-cols-1 gap-2">
              {chartData.slice(0, 10).map((sector, index) => (
                <div
                  key={sector.id}
                  className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: sector.color }}
                    />
                    <span className="text-gray-200 text-sm truncate">
                      {sector.nombreCompleto}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-yellow-300 font-mono">
                      {sector.valor}
                    </span>
                    <span
                      className={`font-mono ${
                        showVariations
                          ? sector.variacionAnual >= 0
                            ? "text-green-400"
                            : "text-red-400"
                          : sector.variacionMensual >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {showVariations
                        ? `${sector.variacionAnual >= 0 ? "+" : ""}${
                            sector.variacionAnual
                          }%`
                        : `${sector.variacionMensual >= 0 ? "+" : ""}${
                            sector.variacionMensual
                          }%`}
                    </span>
                    {(showVariations
                      ? sector.variacionAnual
                      : sector.variacionMensual) >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
          )}
      </div>
      )}
    </div>
  );
}

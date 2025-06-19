import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  ArrowUpRight,
  Percent,
  LineChart,
  BarChartBig,
  BarChart3,
  TrendingDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Brush,
  ReferenceLine,
} from "recharts";
import MonthSelector from "../MonthSelector/MonthSelector";
import CustomizedLabel from "./CustomizedLabel";
import CustomTooltip from "./CustomTooltip";
import Aperturas from "./Aperturas";

export default function Inflacion({ data, months }) {
  const [selectedMonth, setSelectedMonth] = useState(
    months[months.length - 1].mes
  );
  const [activeCard, setActiveCard] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("nacional");
  const [activeView, setActiveView] = useState("evolution");
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState("chart"); // "cards" or "chart"

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const currentData = data[selectedRegion].general;

  const IPC = months.map((month, index) => {
    const valor = Number(currentData[index]) || 0;
    const valorAnterior = index > 0 ? Number(currentData[index - 1]) || 0 : 0;
    const valorAnualAnterior =
      index >= 12 ? Number(currentData[index - 12]) || 0 : 0;

    // Find the last December value
    let valorDiciembreAnterior = 0;
    for (let i = index - 1; i >= 0; i--) {
      if (months[i].mes === "DICIEMBRE") {
        valorDiciembreAnterior = Number(currentData[i]) || 0;
        break;
      }
    }

    const variacionMensual = valorAnterior
      ? ((valor - valorAnterior) / valorAnterior) * 100
      : 0;
    const variacionAnual = valorAnualAnterior
      ? ((valor - valorAnualAnterior) / valorAnualAnterior) * 100
      : 0;
    const acumuladaAnual = valorDiciembreAnterior
      ? ((valor - valorDiciembreAnterior) / valorDiciembreAnterior) * 100
      : 0;

    return {
      mes: month.mes,
      año: month.año,
      valor,
      variacionMensual: parseFloat(variacionMensual.toFixed(1)),
      variacionAnual: parseFloat(variacionAnual.toFixed(1)),
      acumuladaAnual: parseFloat(acumuladaAnual.toFixed(1)),
    };
  });

  // Filter IPC to only include the last 12 months for display
  const IPCForDisplay = IPC.slice(-12);

  // Find the selected data from the filtered IPC
  const selectedData = IPCForDisplay.find((item) => item.mes === selectedMonth);
  const currentIndex = IPCForDisplay.findIndex((m) => m.mes === selectedMonth);

  const handleScroll = (e) => {
    const scrollPosition = e.target.scrollLeft;
    const cardWidth = window.innerWidth * 0.85;
    const activeIndex = Math.round(scrollPosition / cardWidth);
    setActiveCard(activeIndex);
  };

  return (
    <section className="bg-gray-900 overflow-hidden">
      <div className="w-[90%] h-[90%] flex flex-col gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            <TrendingUp className="w-7 h-7" />
            Inflación
          </h1>

          <p className="text-sm text-gray-400">
            Nacional: INDEC | CABA: INDECBA
          </p>
        </div>

        {/* Mobile toggle button */}
        {isMobile && (
          <div className="flex justify-center mb-4">
            <div className="flex rounded-lg overflow-hidden border border-gray-700">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-4 py-2 flex items-center gap-2 text-sm ${
                  viewMode === "cards"
                    ? selectedRegion === "nacional"
                      ? "bg-orange-custom text-white"
                      : "bg-yellow-custom text-gray-800"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Datos
              </button>
              <button
                onClick={() => setViewMode("chart")}
                className={`px-4 py-2 flex items-center gap-2 text-sm ${
                  viewMode === "chart"
                    ? selectedRegion === "nacional"
                      ? "bg-orange-custom text-white"
                      : "bg-yellow-custom text-gray-800"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <LineChart className="w-4 h-4" />
                Gráfico
              </button>
            </div>
          </div>
        )}

        {/* Desktop controls */}
        {!isMobile && (
          <div className="flex justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedRegion("nacional")}
                className={`px-4 py-2 rounded-lg ${
                  selectedRegion === "nacional"
                    ? "bg-orange-custom text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                Nacional
              </button>
              <button
                onClick={() => setSelectedRegion("caba")}
                className={`px-4 py-2 rounded-lg ${
                  selectedRegion === "caba"
                    ? "bg-yellow-custom text-gray-800"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                CABA
              </button>
            </div>
            <div className="flex gap-2 relative">
              <button
                onClick={() => setActiveView("evolution")}
                className={`px-4 py-2 rounded-lg ${
                  activeView === "evolution"
                    ? selectedRegion === "nacional"
                      ? "bg-orange-custom text-white"
                      : "bg-yellow-custom text-gray-800"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <LineChart className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveView("apertura")}
                className={`px-4 py-2 rounded-lg ${
                  activeView === "apertura"
                    ? selectedRegion === "nacional"
                      ? "bg-orange-custom text-white"
                      : "bg-yellow-custom text-gray-800"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <BarChartBig className="w-5 h-5" />
              </button>
              <div
                className={`absolute right-0 -top-8 rounded-lg px-2 py-1 text-xs ${
                  selectedRegion === "nacional"
                    ? "bg-orange-custom text-white"
                    : "bg-yellow-custom text-gray-800"
                }`}
              >
                {activeView === "evolution" ? "EVOLUTIVO" : "APERTURA"}
              </div>
            </div>
          </div>
        )}

        {/* Mobile region selector (when viewing chart) */}
        {isMobile && viewMode === "chart" && (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setSelectedRegion("nacional")}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedRegion === "nacional"
                  ? "bg-orange-custom text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              Nacional
            </button>
            <button
              onClick={() => setSelectedRegion("caba")}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedRegion === "caba"
                  ? "bg-yellow-custom text-gray-800"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              CABA
            </button>
          </div>
        )}
        {!isMobile && (
          <MonthSelector
            months={months}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        )}

        {/* Mobile Data View */}
        {isMobile && viewMode === "cards" && (
          <div className="space-y-3">
            {/* Summary Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Variación Intermensual */}
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="space-y-2">
                  <h3
                    className={`text-xs font-medium ${
                      selectedRegion === "nacional"
                        ? "text-orange-200"
                        : "text-yellow-200"
                    }`}
                  >
                    IPC Mensual
                  </h3>
                  <div
                    className={`text-lg font-bold ${
                      selectedRegion === "nacional"
                        ? "text-orange-custom"
                        : "text-yellow-custom"
                    }`}
                  >
                    {selectedData ? `${selectedData.variacionMensual}%` : "N/A"}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">Intermensual</span>
                  </div>
                </div>
              </div>

              {/* Variación Interanual */}
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="space-y-2">
                  <h3
                    className={`text-xs font-medium ${
                      selectedRegion === "nacional"
                        ? "text-orange-200"
                        : "text-yellow-200"
                    }`}
                  >
                    IPC Anual
                  </h3>
                  <div
                    className={`text-lg font-bold ${
                      selectedRegion === "nacional"
                        ? "text-orange-custom"
                        : "text-yellow-custom"
                    }`}
                  >
                    {selectedData ? `${selectedData.variacionAnual}%` : "N/A"}
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">Interanual</span>
                  </div>
                </div>
              </div>

              {/* Variación Acumulada */}
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="space-y-2">
                  <h3
                    className={`text-xs font-medium ${
                      selectedRegion === "nacional"
                        ? "text-orange-200"
                        : "text-yellow-200"
                    }`}
                  >
                    Acumulada
                  </h3>
                  <div
                    className={`text-lg font-bold ${
                      selectedRegion === "nacional"
                        ? "text-orange-custom"
                        : "text-yellow-custom"
                    }`}
                  >
                    {selectedData ? `${selectedData.acumuladaAnual}%` : "N/A"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Percent className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">Desde dic.</span>
                  </div>
                </div>
              </div>

              {/* Region selector */}
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-gray-300">Región</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSelectedRegion("nacional")}
                      className={`px-2 py-1 rounded text-xs ${
                        selectedRegion === "nacional"
                          ? "bg-orange-custom text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      Nacional
                    </button>
                    <button
                      onClick={() => setSelectedRegion("caba")}
                      className={`px-2 py-1 rounded text-xs ${
                        selectedRegion === "caba"
                          ? "bg-yellow-custom text-gray-800"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      CABA
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Month Selector for Mobile */}
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <h3 className="text-xs font-medium text-gray-300 mb-2">
                Mes seleccionado
              </h3>
              <MonthSelector
                months={months}
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
              />
            </div>
          </div>
        )}

        {/* Chart View */}
        {(!isMobile || viewMode === "chart") && (
          <div
            className={`${
              isMobile ? "h-64" : "h-[300px]"
            } w-full bg-gray-800 rounded-xl p-4`}
          >
            {activeView === "evolution" ? (
              <ResponsiveContainer>
                <AreaChart
                  data={IPCForDisplay}
                  margin={{
                    top: 0,
                    right: isMobile ? 10 : 15,
                    left: isMobile ? -20 : -30,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient id="colorIPC" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="45%"
                        stopColor={
                          selectedRegion === "nacional" ? "#ff5733" : "#f6ff00"
                        }
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="99%"
                        stopColor={
                          selectedRegion === "nacional" ? "#ff5733" : "#f6ff00"
                        }
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="mes"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fill: "#9ca3af", fontSize: isMobile ? 4 : 6 }}
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: isMobile ? 6 : 8 }}
                    axisLine={{ stroke: "#374151" }}
                  />
                  <Tooltip
                    content={<CustomTooltip selectedRegion={selectedRegion} />}
                  />
                  <Area
                    type="monotone"
                    dataKey="variacionMensual"
                    stroke={
                      selectedRegion === "nacional" ? "#ff5733" : "#f6ff00"
                    }
                    fill="url(#colorIPC)"
                    strokeWidth={2}
                    label={
                      !isMobile ? (
                        <CustomizedLabel selectedRegion={selectedRegion} />
                      ) : undefined
                    }
                  />
                  <ReferenceLine
                    x={selectedMonth}
                    stroke="#56595e"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                  {!isMobile && (
                    <Brush
                      dataKey="mes"
                      height={15}
                      stroke={
                        selectedRegion === "nacional" ? "#ff5733" : "#f6ff00"
                      }
                      fill="#1f2937"
                      travellerWidth={10}
                      style={{
                        fontSize: "8px",
                        marginTop: "2px",
                        stroke:
                          selectedRegion === "nacional" ? "#ff5733" : "#f6ff00",
                        fill:
                          selectedRegion === "nacional" ? "#ff5733" : "#f6ff00",
                      }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Aperturas
                data={data}
                months={months}
                selectedRegion={selectedRegion}
                selectedMonth={selectedMonth}
              />
            )}
          </div>
        )}

        {/* Mobile Month Selector for Chart View */}
        {isMobile && viewMode === "chart" && (
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <h3 className="text-xs font-medium text-gray-300 mb-2">
              Mes seleccionado
            </h3>
            <MonthSelector
              months={months}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          </div>
        )}

        {/* Mobile view/chart type selector */}
        {isMobile && viewMode === "chart" && (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setActiveView("evolution")}
              className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                activeView === "evolution"
                  ? selectedRegion === "nacional"
                    ? "bg-orange-custom text-white"
                    : "bg-yellow-custom text-gray-800"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              <LineChart className="w-4 h-4" />
              Evolutivo
            </button>
            <button
              onClick={() => setActiveView("apertura")}
              className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                activeView === "apertura"
                  ? selectedRegion === "nacional"
                    ? "bg-orange-custom text-white"
                    : "bg-yellow-custom text-gray-800"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              <BarChartBig className="w-4 h-4" />
              Apertura
            </button>
          </div>
        )}

        {/* Desktop Cards container */}
        {!isMobile && (
          <div className="flex-1 flex flex-col">
            {/* Carousel container */}
            <div
              className="flex gap-4 overflow-x-auto md:grid md:grid-cols-3 snap-x snap-mandatory scroll-smooth"
              onScroll={handleScroll}
            >
              {/* Card 1 - Variación Intermensual */}
              <div className="min-w-[85vw] shrink-0 md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50 snap-center">
                <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h3
                      className={`text-sm font-medium text-orange-200 ${
                        selectedRegion === "nacional"
                          ? "text-orange-200"
                          : "text-yellow-200"
                      }`}
                    >
                      IPC
                    </h3>

                    <div
                      className={`text-2xl font-bold  ${
                        selectedRegion === "nacional"
                          ? "text-orange-custom"
                          : "text-yellow-custom"
                      }`}
                    >
                      {selectedData
                        ? `${selectedData.variacionMensual}%`
                        : "N/A"}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Variación Intermensual</span>
                  </div>
                </div>
              </div>

              {/* Card 2 - Variación Interanual */}
              <div className="min-w-[85vw] shrink-0 md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50 snap-center">
                <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h3
                      className={`text-sm font-medium text-orange-200 ${
                        selectedRegion === "nacional"
                          ? "text-orange-200"
                          : "text-yellow-200"
                      }`}
                    >
                      Variación Interanual
                    </h3>
                    <div
                      className={`text-2xl font-bold  ${
                        selectedRegion === "nacional"
                          ? "text-orange-custom"
                          : "text-yellow-custom"
                      }`}
                    >
                      {selectedData ? `${selectedData.variacionAnual}%` : "N/A"}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Respecto del mismo mes del año anterior</span>
                  </div>
                </div>
              </div>

              {/* Card 3 - Variación Acumulada */}
              <div className="min-w-[85vw] shrink-0 md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50 snap-center">
                <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h3
                      className={`text-sm font-medium text-orange-200 ${
                        selectedRegion === "nacional"
                          ? "text-orange-200"
                          : "text-yellow-200"
                      }`}
                    >
                      Variación Acumulada
                    </h3>
                    <div
                      className={`text-2xl font-bold  ${
                        selectedRegion === "nacional"
                          ? "text-orange-custom"
                          : "text-yellow-custom"
                      }`}
                    >
                      {selectedData ? `${selectedData.acumuladaAnual}%` : "N/A"}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    <span>Total acumulado en el período</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll indicators */}
            <div className="flex gap-1 justify-center py-2 md:hidden">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    activeCard === index
                      ? selectedRegion === "nacional"
                        ? "bg-orange-custom"
                        : "bg-yellow-custom"
                      : "bg-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

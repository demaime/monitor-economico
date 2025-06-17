import React, { useState } from "react";
import {
  TrendingUp,
  ArrowUpRight,
  Percent,
  LineChart,
  Home,
  Grid3X3,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import MonthSelector from "../MonthSelector/MonthSelector";

export default function Alquileres({ data, months }) {
  const [selectedMonth, setSelectedMonth] = useState(
    months[months.length - 1].mes
  );
  const [activeCard, setActiveCard] = useState(0);
  const [activeView, setActiveView] = useState("evolution");

  // Procesar datos para crear el dataset unificado CON variaciones calculadas
  const alquileresData = months.map((month, index) => {
    const cabaValue = Number(data.alquileres.caba[index]) || 0;
    const norteValue = Number(data.alquileres.norte[index]) || 0;
    const oesteSurValue = Number(data.alquileres.oesteSur[index]) || 0;

    return {
      mes: month.mes,
      año: month.año,
      caba: cabaValue,
      norte: norteValue,
      oesteSur: oesteSurValue,
      // Calcular variaciones para cada zona
      cabaVariations: calculateVariationsForZone(
        "caba",
        index,
        months,
        data.alquileres.caba
      ),
      norteVariations: calculateVariationsForZone(
        "norte",
        index,
        months,
        data.alquileres.norte
      ),
      oesteSurVariations: calculateVariationsForZone(
        "oesteSur",
        index,
        months,
        data.alquileres.oesteSur
      ),
    };
  });

  // Función auxiliar para calcular variaciones
  function calculateVariationsForZone(zona, index, months, zoneData) {
    const currentValue = Number(zoneData[index]) || 0;
    const previousValue = index > 0 ? Number(zoneData[index - 1]) || 0 : 0;
    const yearAgoValue = index >= 12 ? Number(zoneData[index - 12]) || 0 : 0;

    // Encontrar el último diciembre
    let diciembreValue = 0;
    for (let i = index - 1; i >= 0; i--) {
      if (months[i].mes === "DICIEMBRE") {
        diciembreValue = Number(zoneData[i]) || 0;
        break;
      }
    }

    const variacionMensual = previousValue
      ? ((currentValue - previousValue) / previousValue) * 100
      : 0;
    const variacionAnual = yearAgoValue
      ? ((currentValue - yearAgoValue) / yearAgoValue) * 100
      : 0;
    const variacionAcumulada = diciembreValue
      ? ((currentValue - diciembreValue) / diciembreValue) * 100
      : 0;

    return {
      mensual: parseFloat(variacionMensual.toFixed(1)),
      anual: parseFloat(variacionAnual.toFixed(1)),
      acumulada: parseFloat(variacionAcumulada.toFixed(1)),
    };
  }

  // Filtrar últimos 12 meses para mostrar
  const alquileresDataForDisplay = alquileresData.slice(-12);

  // Encontrar datos del mes seleccionado
  const selectedData = alquileresDataForDisplay.find(
    (item) => item.mes === selectedMonth
  );

  // Obtener variaciones del mes seleccionado
  const calculateVariations = (zona) => {
    const selectedDataItem = alquileresDataForDisplay.find(
      (item) => item.mes === selectedMonth
    );

    if (!selectedDataItem) return { mensual: 0, anual: 0, acumulada: 0 };

    // Usar las variaciones ya calculadas
    return (
      selectedDataItem[`${zona}Variations`] || {
        mensual: 0,
        anual: 0,
        acumulada: 0,
      }
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 shadow-xl">
          <p className="text-gray-200 text-sm font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-bold">
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Componente Heatmap
  const HeatmapView = () => {
    // Función para obtener color basado en variación
    const getHeatmapColor = (variation) => {
      const absVar = Math.abs(variation);
      if (variation > 0) {
        // Variaciones positivas (subas) - tonos rojos
        if (absVar >= 15) return "bg-red-600";
        if (absVar >= 10) return "bg-red-500";
        if (absVar >= 5) return "bg-red-400";
        return "bg-red-300";
      } else if (variation < 0) {
        // Variaciones negativas (bajas) - tonos verdes
        if (absVar >= 15) return "bg-green-600";
        if (absVar >= 10) return "bg-green-500";
        if (absVar >= 5) return "bg-green-400";
        return "bg-green-300";
      }
      return "bg-gray-600"; // Cero o sin datos
    };

    const zones = [
      { key: "caba", name: "CABA", color: "#ff5733" },
      { key: "norte", name: "NORTE", color: "#33ff57" },
      { key: "oesteSur", name: "OESTE/SUR", color: "#3357ff" },
    ];

    return (
      <div className="h-full w-full bg-gray-800 rounded-xl p-4 flex flex-col">
        {/* Título y leyenda */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-100 mb-2 md:mb-0">
            Variaciones Mensuales por Zona
          </h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-300">Baja</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-600 rounded"></div>
              <span className="text-gray-300">Estable</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-gray-300">Suba</span>
            </div>
          </div>
        </div>

        {/* Heatmap grid - responsive */}
        <div className="flex-1 overflow-x-auto flex items-center">
          <div className="min-w-[600px] w-full">
            {/* Header con meses */}
            <div
              className="grid gap-1 mb-2"
              style={{
                gridTemplateColumns: `120px repeat(${alquileresDataForDisplay.length}, 1fr)`,
              }}
            >
              <div className="text-xs text-gray-400 font-medium"></div>
              {alquileresDataForDisplay.map((monthData, index) => (
                <div
                  key={index}
                  className={`text-xs text-gray-300 text-center py-1 px-1 rounded ${
                    monthData.mes === selectedMonth
                      ? "bg-orange-custom text-white font-bold"
                      : ""
                  }`}
                >
                  {monthData.mes.slice(0, 3)}
                </div>
              ))}
            </div>

            {/* Filas de zonas */}
            {zones.map((zone) => (
              <div
                key={zone.key}
                className="grid gap-1 mb-2"
                style={{
                  gridTemplateColumns: `120px repeat(${alquileresDataForDisplay.length}, 1fr)`,
                }}
              >
                {/* Nombre de la zona */}
                <div
                  className="text-sm font-medium text-white py-2 px-2 rounded text-center"
                  style={{ backgroundColor: zone.color }}
                >
                  {zone.name}
                </div>

                {/* Celdas de variación */}
                {alquileresDataForDisplay.map((monthData, index) => {
                  const variation =
                    monthData[`${zone.key}Variations`]?.mensual || 0;
                  return (
                    <div
                      key={index}
                      className={`
                        ${getHeatmapColor(variation)} 
                        text-white text-xs font-medium 
                        py-2 px-1 rounded text-center 
                        hover:brightness-125 hover:shadow-lg transition-all duration-200 cursor-pointer
                        flex items-center justify-center
                        ${
                          monthData.mes === selectedMonth
                            ? "ring-2 ring-white"
                            : ""
                        }
                      `}
                      title={`${zone.name} - ${monthData.mes}: ${variation}%`}
                    >
                      {variation.toFixed(1)}%
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

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
            <Home className="w-7 h-7" />
            Alquileres
          </h1>
          <p className="text-sm text-gray-400">Evolución de precios por zona</p>
        </div>

        <div className="flex justify-end relative">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView("evolution")}
              className={`px-4 py-2 rounded-lg ${
                activeView === "evolution"
                  ? "bg-orange-custom text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              <LineChart className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveView("heatmap")}
              className={`px-4 py-2 rounded-lg ${
                activeView === "heatmap"
                  ? "bg-orange-custom text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute right-0 -top-8 rounded-lg bg-orange-custom text-white px-2 py-1 text-xs">
            {activeView === "evolution" ? "EVOLUTIVO" : "HEATMAP"}
          </div>
        </div>

        <MonthSelector
          months={months}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        <div className="h-[400px] w-full">
          {activeView === "evolution" ? (
            <div className="h-full bg-gray-800 rounded-xl p-4">
              <ResponsiveContainer>
                <RechartsLineChart
                  data={alquileresDataForDisplay}
                  margin={{ top: 0, right: 15, left: -30, bottom: 0 }}
                >
                  <XAxis
                    dataKey="mes"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fill: "#9ca3af", fontSize: 6 }}
                  />
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: 8 }}
                    axisLine={{ stroke: "#374151" }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />

                  {/* Líneas para cada zona */}
                  <Line
                    type="monotone"
                    dataKey="caba"
                    stroke="#ff5733"
                    strokeWidth={2}
                    dot={{ fill: "#ff5733", strokeWidth: 2, r: 3 }}
                    name="CABA"
                  />
                  <Line
                    type="monotone"
                    dataKey="norte"
                    stroke="#33ff57"
                    strokeWidth={2}
                    dot={{ fill: "#33ff57", strokeWidth: 2, r: 3 }}
                    name="NORTE"
                  />
                  <Line
                    type="monotone"
                    dataKey="oesteSur"
                    stroke="#3357ff"
                    strokeWidth={2}
                    dot={{ fill: "#3357ff", strokeWidth: 2, r: 3 }}
                    name="OESTE/SUR"
                  />

                  {/* Línea de referencia del mes seleccionado */}
                  <ReferenceLine
                    x={selectedMonth}
                    stroke="#56595e"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <HeatmapView />
          )}
        </div>

        {/* Cards container */}
        <div className="flex-1 flex flex-col">
          {/* Carousel container */}
          <div
            className="flex gap-4 overflow-x-auto md:grid md:grid-cols-3 snap-x snap-mandatory scroll-smooth"
            onScroll={handleScroll}
          >
            {/* Card 1 - CABA */}
            <div className="min-w-[85vw] shrink-0 md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50 snap-center">
              <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-orange-200">CABA</h3>
                  <div className="text-2xl font-bold text-orange-custom">
                    ${selectedData ? selectedData.caba.toLocaleString() : "N/A"}
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Var. Mensual:</span>
                      <span
                        className={`font-bold ${
                          calculateVariations("caba").mensual >= 0
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {calculateVariations("caba").mensual}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Var. Anual:</span>
                      <span
                        className={`font-bold ${
                          calculateVariations("caba").anual >= 0
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {calculateVariations("caba").anual}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Acumulada:</span>
                      <span
                        className={`font-bold ${
                          calculateVariations("caba").acumulada >= 0
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {calculateVariations("caba").acumulada}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>Precio promedio en pesos</span>
                </div>
              </div>
            </div>

            {/* Card 2 - NORTE */}
            <div className="min-w-[85vw] shrink-0 md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50 snap-center">
              <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-green-200">NORTE</h3>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "#33ff57" }}
                  >
                    $
                    {selectedData ? selectedData.norte.toLocaleString() : "N/A"}
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Var. Mensual:</span>
                      <span
                        className={`font-bold ${
                          calculateVariations("norte").mensual >= 0
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {calculateVariations("norte").mensual}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Var. Anual:</span>
                      <span
                        className={`font-bold ${
                          calculateVariations("norte").anual >= 0
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {calculateVariations("norte").anual}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Acumulada:</span>
                      <span
                        className={`font-bold ${
                          calculateVariations("norte").acumulada >= 0
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {calculateVariations("norte").acumulada}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>Precio promedio en pesos</span>
                </div>
              </div>
            </div>

            {/* Card 3 - OESTE/SUR */}
            <div className="min-w-[85vw] shrink-0 md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50 snap-center">
              <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-blue-200">
                    OESTE/SUR
                  </h3>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "#3357ff" }}
                  >
                    $
                    {selectedData
                      ? selectedData.oesteSur.toLocaleString()
                      : "N/A"}
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Var. Mensual:</span>
                      <span
                        className={`font-bold ${
                          calculateVariations("oesteSur").mensual >= 0
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {calculateVariations("oesteSur").mensual}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Var. Anual:</span>
                      <span
                        className={`font-bold ${
                          calculateVariations("oesteSur").anual >= 0
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {calculateVariations("oesteSur").anual}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Acumulada:</span>
                      <span
                        className={`font-bold ${
                          calculateVariations("oesteSur").acumulada >= 0
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {calculateVariations("oesteSur").acumulada}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>Precio promedio en pesos</span>
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
                  activeCard === index ? "bg-orange-custom" : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

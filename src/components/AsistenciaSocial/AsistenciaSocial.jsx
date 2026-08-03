import React, { useState, useEffect } from "react";
import {
  Heart,
  Calendar,
  TrendingUp,
  BarChart3,
  Maximize2,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
} from "recharts";
import MonthSelector from "../MonthSelector/MonthSelector";

export default function AsistenciaSocial({ data, months }) {
  const [selectedMonth, setSelectedMonth] = useState(
    months[months.length - 1].mes
  );
  const [variationType, setVariationType] = useState("mensual"); // 'mensual' o 'interanual'

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

  // Procesar datos para el gráfico con AMBOS tipos de variación
  const asistenciaData = months.map((month, index) => {
    const dataPoint = {
      mes: month.mes,
      año: month.año,
    };

    // Datos básicos
    const auh = Number(data.auh[index]) || 0;
    const auhTopeIndividual = Number(data.auhTopeIndividual[index]) || 0;
    const auhTopeGrupoFamiliar = Number(data.auhTopeGrupoFamiliar[index]) || 0;
    const seguroDesempleoMin = Number(data.seguroDesempleoMin[index]) || 0;
    const seguroDesempleoMax = Number(data.seguroDesempleoMax[index]) || 0;

    // Valores del mes anterior
    const auhAnterior = index > 0 ? Number(data.auh[index - 1]) || 0 : 0;
    const auhTopeIndividualAnterior =
      index > 0 ? Number(data.auhTopeIndividual[index - 1]) || 0 : 0;
    const auhTopeGrupoFamiliarAnterior =
      index > 0 ? Number(data.auhTopeGrupoFamiliar[index - 1]) || 0 : 0;
    const seguroDesempleoMinAnterior =
      index > 0 ? Number(data.seguroDesempleoMin[index - 1]) || 0 : 0;
    const seguroDesempleoMaxAnterior =
      index > 0 ? Number(data.seguroDesempleoMax[index - 1]) || 0 : 0;

    // Valores del año anterior
    const auhAnual = index >= 12 ? Number(data.auh[index - 12]) || 0 : 0;
    const auhTopeIndividualAnual =
      index >= 12 ? Number(data.auhTopeIndividual[index - 12]) || 0 : 0;
    const auhTopeGrupoFamiliarAnual =
      index >= 12 ? Number(data.auhTopeGrupoFamiliar[index - 12]) || 0 : 0;
    const seguroDesempleoMinAnual =
      index >= 12 ? Number(data.seguroDesempleoMin[index - 12]) || 0 : 0;
    const seguroDesempleoMaxAnual =
      index >= 12 ? Number(data.seguroDesempleoMax[index - 12]) || 0 : 0;

    const calcularVariacion = (actual, anterior) =>
      anterior ? ((actual - anterior) / anterior) * 100 : 0;

    // Guardar valores absolutos
    dataPoint.auh_valor = auh;
    dataPoint.auhTopeIndividual_valor = auhTopeIndividual;
    dataPoint.auhTopeGrupoFamiliar_valor = auhTopeGrupoFamiliar;
    dataPoint.seguroDesempleoMin_valor = seguroDesempleoMin;
    dataPoint.seguroDesempleoMax_valor = seguroDesempleoMax;

    // Variaciones mensuales
    dataPoint.auh_mensual = parseFloat(
      calcularVariacion(auh, auhAnterior).toFixed(2)
    );
    dataPoint.auhTopeIndividual_mensual = parseFloat(
      calcularVariacion(auhTopeIndividual, auhTopeIndividualAnterior).toFixed(2)
    );
    dataPoint.auhTopeGrupoFamiliar_mensual = parseFloat(
      calcularVariacion(
        auhTopeGrupoFamiliar,
        auhTopeGrupoFamiliarAnterior
      ).toFixed(2)
    );
    dataPoint.seguroDesempleoMin_mensual = parseFloat(
      calcularVariacion(seguroDesempleoMin, seguroDesempleoMinAnterior).toFixed(
        2
      )
    );
    dataPoint.seguroDesempleoMax_mensual = parseFloat(
      calcularVariacion(seguroDesempleoMax, seguroDesempleoMaxAnterior).toFixed(
        2
      )
    );

    // Variaciones interanuales
    dataPoint.auh_interanual = parseFloat(
      calcularVariacion(auh, auhAnual).toFixed(2)
    );
    dataPoint.auhTopeIndividual_interanual = parseFloat(
      calcularVariacion(auhTopeIndividual, auhTopeIndividualAnual).toFixed(2)
    );
    dataPoint.auhTopeGrupoFamiliar_interanual = parseFloat(
      calcularVariacion(
        auhTopeGrupoFamiliar,
        auhTopeGrupoFamiliarAnual
      ).toFixed(2)
    );
    dataPoint.seguroDesempleoMin_interanual = parseFloat(
      calcularVariacion(seguroDesempleoMin, seguroDesempleoMinAnual).toFixed(2)
    );
    dataPoint.seguroDesempleoMax_interanual = parseFloat(
      calcularVariacion(seguroDesempleoMax, seguroDesempleoMaxAnual).toFixed(2)
    );

    // Para el gráfico, usar los valores absolutos
    dataPoint.auh = auh;
    dataPoint.auhTopeIndividual = auhTopeIndividual;
    dataPoint.auhTopeGrupoFamiliar = auhTopeGrupoFamiliar;
    dataPoint.seguroDesempleoMin = seguroDesempleoMin;
    dataPoint.seguroDesempleoMax = seguroDesempleoMax;

    return dataPoint;
  });

  // Filtrar últimos 12 meses para mostrar
  const asistenciaDataForDisplay = asistenciaData.slice(-12);

  // Encontrar datos del mes seleccionado
  const selectedData = asistenciaDataForDisplay.find(
    (item) => item.mes === selectedMonth
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const formatCurrency = (value) => {
        return new Intl.NumberFormat("es-AR").format(value);
      };

      return (
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 shadow-xl max-h-64 overflow-y-auto">
          <p className="text-gray-200 text-sm font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              style={{ color: entry.color }}
              className="font-bold text-xs"
            >
              {entry.name}: ${formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const viewConfig = {
    title: "AUH - Asignación Universal por Hijo",
    lines: [
      { key: "auh", name: "AUH", color: "#3b82f6", strokeWidth: 2 },
      {
        key: "seguroDesempleoMin",
        name: "Seguro Desempleo Mín",
        color: "#6b7280",
        strokeWidth: 1.5,
        strokeDasharray: "5 5",
      },
      {
        key: "seguroDesempleoMax",
        name: "Seguro Desempleo Máx",
        color: "#6b7280",
        strokeWidth: 1.5,
        strokeDasharray: "5 5",
      },
    ],
    cards: [
      { key: "auh", name: "AUH", color: "#3b82f6" },
      {
        key: "auhTopeIndividual",
        name: "Tope Individual",
        color: "#60a5fa",
      },
      {
        key: "auhTopeGrupoFamiliar",
        name: "Tope Grupo Familiar",
        color: "#93c5fd",
      },
    ],
  };

  return (
    <section className="bg-gray-900 overflow-hidden">
      <div className="w-[90%] h-[90%] flex flex-col gap-2 sm:gap-4">
        <div className="space-y-1 sm:space-y-2">
          <h1
            className={`font-bold text-gray-100 flex items-center gap-2 ${
              isMobile ? "text-lg" : "text-2xl"
            }`}
          >
            <Heart className={`${isMobile ? "w-5 h-5" : "w-7 h-7"}`} />
            Asistencia Social
          </h1>
          <p className={`text-gray-400 ${isMobile ? "text-xs" : "text-sm"}`}>
            {viewConfig.title}
          </p>
        </div>

        {/* TOGGLE DE TIPO DE VARIACIÓN */}
        <div
          className={`flex ${
            isMobile ? "flex-col space-y-2" : "justify-end"
          }`}
        >
          <div
            className={`flex gap-1 sm:gap-2 relative ${
              isMobile ? "justify-center" : ""
            }`}
          >
            <button
              onClick={() => setVariationType("mensual")}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                variationType === "mensual"
                  ? "bg-yellow-custom text-gray-800"
                  : "bg-gray-800 text-gray-300 hover:text-gray-200"
              }`}
            >
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              Mensual
            </button>
            <button
              onClick={() => setVariationType("interanual")}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                variationType === "interanual"
                  ? "bg-yellow-custom text-gray-800"
                  : "bg-gray-800 text-gray-300 hover:text-gray-200"
              }`}
            >
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              Interanual
            </button>
            {!isMobile && (
              <div className="absolute right-0 -top-8 rounded-lg bg-yellow-custom text-gray-800 px-2 py-1 text-xs">
                {variationType === "mensual" ? "MES A MES" : "AÑO A AÑO"}
              </div>
            )}
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

        <MonthSelector
          months={months}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        {/* GRÁFICO PROTAGONISTA */}
        {(!isMobile || viewMode === "chart") && (
          <div
            className={`w-full bg-gray-800 rounded-xl p-2 sm:p-4 ${
              isMobile ? "h-[280px]" : "h-[350px]"
            }`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart
                data={asistenciaDataForDisplay}
                margin={
                  isMobile
                    ? { top: 0, right: 5, left: -30, bottom: 0 }
                    : { top: 0, right: 15, left: -20, bottom: 0 }
                }
              >
                <XAxis
                  dataKey="mes"
                  angle={-45}
                  textAnchor="end"
                  height={isMobile ? 50 : 60}
                  tick={{
                    fill: "#9ca3af",
                    fontSize: isMobile ? 6 : 8,
                  }}
                />
                <YAxis
                  tick={{
                    fill: "#9ca3af",
                    fontSize: isMobile ? 6 : 8,
                  }}
                  axisLine={{ stroke: "#374151" }}
                  tickFormatter={(value) =>
                    isMobile
                      ? `$${(value / 1000).toFixed(0)}k`
                      : `$${value.toLocaleString()}`
                  }
                  width={isMobile ? 35 : 60}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* Línea de referencia en 0% */}
                <ReferenceLine
                  y={0}
                  stroke="#6b7280"
                  strokeWidth={1}
                  strokeDasharray="2 2"
                />

                {/* Líneas para cada programa */}
                {viewConfig.lines.map((line) => (
                  <Line
                    key={line.key}
                    type="monotone"
                    dataKey={line.key}
                    stroke={line.color}
                    strokeWidth={isMobile ? 1.5 : line.strokeWidth}
                    strokeDasharray={line.strokeDasharray}
                    dot={{
                      fill: line.color,
                      strokeWidth: 1,
                      r: isMobile ? 1.5 : 2,
                    }}
                    name={line.name}
                  />
                ))}

                {/* Línea de referencia del mes seleccionado */}
                <ReferenceLine
                  x={selectedMonth}
                  stroke="#56595e"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />

                {/* BRUSH - Solo en desktop */}
                {!isMobile && (
                  <Brush
                    dataKey="mes"
                    height={15}
                    stroke="#f6ff00"
                    fill="#1f2937"
                    travellerWidth={10}
                    startIndex={0}
                    endIndex={asistenciaDataForDisplay.length - 1}
                    style={{
                      fontSize: "8px",
                      marginTop: "2px",
                    }}
                  />
                )}
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Cards container */}
        {(!isMobile || viewMode === "cards") && (
          <div className="flex-1 flex flex-col">
            {/* Carousel container */}
            <div
              className={`gap-2 sm:gap-4 ${
                isMobile
                  ? "grid grid-cols-1 space-y-2"
                  : "flex overflow-x-auto md:grid md:grid-cols-5 snap-x snap-mandatory scroll-smooth"
              }`}
            >
              {viewConfig.cards.map((line) => {
                const variacionActual = selectedData
                  ? selectedData[`${line.key}_${variationType}`]
                  : 0;

                return (
                  <div
                    key={line.key}
                    className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg border border-gray-700/50 ${
                      isMobile
                        ? "p-3"
                        : "min-w-[85vw] shrink-0 md:min-w-0 p-4 snap-center"
                    }`}
                  >
                    <div
                      className={`relative z-10 flex h-full flex-col justify-between ${
                        isMobile ? "gap-2" : "gap-4"
                      }`}
                    >
                      <div
                        className={`${isMobile ? "space-y-1" : "space-y-2"}`}
                      >
                        <h3
                          className={`font-medium ${
                            isMobile ? "text-xs" : "text-sm"
                          }`}
                          style={{ color: line.color }}
                        >
                          {line.name}
                        </h3>
                        <div
                          className={`font-bold text-white ${
                            isMobile ? "text-lg" : "text-2xl"
                          }`}
                        >
                          $
                          {selectedData
                            ? selectedData[`${line.key}_valor`].toLocaleString()
                            : "N/A"}
                        </div>
                      </div>
                      <div
                        className={`text-gray-400 flex items-center gap-2 ${
                          isMobile ? "text-xs" : "text-xs"
                        }`}
                      >
                        <div
                          className={`rounded-full ${
                            isMobile ? "w-2 h-2" : "w-3 h-3"
                          }`}
                          style={{ backgroundColor: line.color }}
                        />
                        <span>
                          Variación {variationType}:{" "}
                          {selectedData
                            ? (variacionActual > 0 ? "+" : "") +
                              variacionActual +
                              "%"
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

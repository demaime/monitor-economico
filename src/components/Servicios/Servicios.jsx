import React, { useState } from "react";
import { Settings, Calendar, TrendingUp } from "lucide-react";
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

export default function Servicios({ data, months }) {
  const [selectedMonth, setSelectedMonth] = useState(
    months[months.length - 1].mes
  );
  const [variationType, setVariationType] = useState("mensual"); // 'mensual' o 'interanual'

  // Configuración de servicios con colores únicos y distintivos
  const servicios = [
    { key: "gimnasio", name: "Gimnasio", color: "#ef4444", unit: "mes" }, // Rojo
    { key: "cine", name: "Cine", color: "#3b82f6", unit: "entrada" }, // Azul
    { key: "libro", name: "Libro", color: "#10b981", unit: "unidad" }, // Verde
    {
      key: "cortePeloHombre",
      name: "Corte Pelo H",
      color: "#f59e0b",
      unit: "corte",
    }, // Amarillo/Naranja
    {
      key: "cortePeloMujer",
      name: "Corte Pelo M",
      color: "#8b5cf6",
      unit: "corte",
    }, // Púrpura
  ];

  // Procesar datos para el gráfico con AMBOS tipos de variación
  const serviciosData = months.map((month, index) => {
    const dataPoint = {
      mes: month.mes,
      año: month.año,
    };

    // Calcular variaciones para cada servicio
    servicios.forEach((servicio) => {
      const currentValue = Number(data[servicio.key][index]) || 0;
      const previousValue =
        index > 0 ? Number(data[servicio.key][index - 1]) || 0 : 0;
      const yearAgoValue =
        index >= 12 ? Number(data[servicio.key][index - 12]) || 0 : 0;

      // Calcular variación mensual
      const variacionMensual =
        previousValue && previousValue > 0
          ? ((currentValue - previousValue) / previousValue) * 100
          : 0;

      // Calcular variación interanual
      const variacionInteranual =
        yearAgoValue && yearAgoValue > 0
          ? ((currentValue - yearAgoValue) / yearAgoValue) * 100
          : 0;

      // Guardar ambas variaciones
      dataPoint[`${servicio.key}_mensual`] = parseFloat(
        variacionMensual.toFixed(2)
      );
      dataPoint[`${servicio.key}_interanual`] = parseFloat(
        variacionInteranual.toFixed(2)
      );

      // Para el gráfico, usar la variación seleccionada
      dataPoint[servicio.key] =
        variationType === "mensual"
          ? dataPoint[`${servicio.key}_mensual`]
          : dataPoint[`${servicio.key}_interanual`];

      // Guardar también el valor absoluto para las cards
      dataPoint[`${servicio.key}_valor`] = currentValue;
    });

    return dataPoint;
  });

  // Filtrar últimos 12 meses para mostrar (como en otros componentes)
  const serviciosDataForDisplay = serviciosData.slice(-12);

  // Encontrar datos del mes seleccionado para las cards
  const selectedData = serviciosDataForDisplay.find(
    (item) => item.mes === selectedMonth
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 shadow-xl max-h-64 overflow-y-auto">
          <p className="text-gray-200 text-sm font-medium mb-2">{label}</p>
          {payload.map((entry, index) => {
            const servicio = servicios.find((s) => s.key === entry.dataKey);
            return (
              <p
                key={index}
                style={{ color: entry.color }}
                className="font-bold text-xs"
              >
                {entry.name}: {entry.value > 0 ? "+" : ""}
                {entry.value}%
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="bg-gray-900 overflow-hidden">
      <div className="w-[90%] h-[90%] flex flex-col gap-3">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            <Settings className="w-7 h-7" />
            Servicios
          </h1>
          <p className="text-sm text-gray-400">
            Variaciones{" "}
            {variationType === "mensual" ? "mensuales" : "interanuales"} de
            precios
          </p>
        </div>

        {/* TOGGLE DE TIPO DE VARIACIÓN */}
        <div className="flex justify-end relative">
          <div className="flex gap-2">
            <button
              onClick={() => setVariationType("mensual")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                variationType === "mensual"
                  ? "bg-yellow-custom text-gray-800"
                  : "bg-gray-800 text-gray-300 hover:text-gray-200"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Mensual
            </button>
            <button
              onClick={() => setVariationType("interanual")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                variationType === "interanual"
                  ? "bg-yellow-custom text-gray-800"
                  : "bg-gray-800 text-gray-300 hover:text-gray-200"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Interanual
            </button>
          </div>
          <div className="absolute right-0 -top-8 rounded-lg bg-yellow-custom text-gray-800 px-2 py-1 text-xs">
            {variationType === "mensual" ? "MES A MES" : "AÑO A AÑO"}
          </div>
        </div>

        <MonthSelector
          months={months}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        {/* GRÁFICO PROTAGONISTA */}
        <div className="h-[350px] w-full bg-gray-800 rounded-xl p-4">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
              data={serviciosDataForDisplay}
              margin={{ top: 0, right: 15, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="mes"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fill: "#9ca3af", fontSize: 8 }}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 8 }}
                axisLine={{ stroke: "#374151" }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Línea de referencia en 0% */}
              <ReferenceLine
                y={0}
                stroke="#6b7280"
                strokeWidth={1}
                strokeDasharray="2 2"
              />

              {/* Líneas para cada servicio - MÁS FINAS */}
              {servicios.map((servicio) => (
                <Line
                  key={servicio.key}
                  type="monotone"
                  dataKey={servicio.key}
                  stroke={servicio.color}
                  strokeWidth={2}
                  dot={{ fill: servicio.color, strokeWidth: 1, r: 2 }}
                  name={servicio.name}
                />
              ))}

              {/* Línea de referencia del mes seleccionado */}
              <ReferenceLine
                x={selectedMonth}
                stroke="#56595e"
                strokeWidth={1}
                strokeDasharray="3 3"
              />

              {/* BRUSH */}
              <Brush
                dataKey="mes"
                height={15}
                stroke="#f6ff00"
                fill="#1f2937"
                travellerWidth={10}
                startIndex={0}
                endIndex={serviciosDataForDisplay.length - 1}
                style={{
                  fontSize: "8px",
                  marginTop: "2px",
                }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>

        {/* Cards container */}
        <div className="flex-1 flex flex-col">
          {/* Carousel container */}
          <div className="flex gap-4 overflow-x-auto md:grid md:grid-cols-5 snap-x snap-mandatory scroll-smooth">
            {servicios.map((servicio) => {
              const variacionActual = selectedData
                ? selectedData[`${servicio.key}_${variationType}`]
                : 0;

              return (
                <div
                  key={servicio.key}
                  className="min-w-[85vw] shrink-0 md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50 snap-center"
                >
                  <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <h3
                        className="text-sm font-medium"
                        style={{ color: servicio.color }}
                      >
                        {servicio.name}
                      </h3>
                      <div className="text-2xl font-bold text-white">
                        $
                        {selectedData
                          ? selectedData[
                              `${servicio.key}_valor`
                            ].toLocaleString()
                          : "N/A"}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: servicio.color }}
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
      </div>
    </section>
  );
}

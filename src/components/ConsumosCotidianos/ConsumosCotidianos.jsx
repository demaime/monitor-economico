import React, { useState } from "react";
import { ShoppingCart, Calendar, TrendingUp } from "lucide-react";
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

export default function ConsumosCotidianos({ data, months }) {
  const [selectedMonth, setSelectedMonth] = useState(
    months[months.length - 1].mes
  );
  const [variationType, setVariationType] = useState("mensual"); // 'mensual' o 'interanual'

  const productos = [
    { key: "kiloPan", name: "Kilo de Pan", color: "#ff5733", unit: "kg" },
    { key: "litroLeche", name: "Litro de Leche", color: "#33ff57", unit: "L" },
    { key: "kiloYerba", name: "Kilo de Yerba", color: "#3357ff", unit: "kg" },
    {
      key: "litroCerveza",
      name: "Litro de Cerveza",
      color: "#ff33f5",
      unit: "L",
    },
    { key: "kiloCarne", name: "Kilo de Carne", color: "#ff8c33", unit: "kg" },
    { key: "cocaCola", name: "Coca Cola", color: "#33f5ff", unit: "unidad" },
    { key: "fideos", name: "Fideos", color: "#8c33ff", unit: "paquete" },
  ];

  // Procesar datos para el gráfico con AMBOS tipos de variación
  const consumosData = months.map((month, index) => {
    const dataPoint = {
      mes: month.mes,
      año: month.año,
    };

    // Calcular variaciones para cada producto
    productos.forEach((producto) => {
      const currentValue = Number(data.consumos[producto.key][index]) || 0;
      const previousValue =
        index > 0 ? Number(data.consumos[producto.key][index - 1]) || 0 : 0;
      const yearAgoValue =
        index >= 12 ? Number(data.consumos[producto.key][index - 12]) || 0 : 0;

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
      dataPoint[`${producto.key}_mensual`] = parseFloat(
        variacionMensual.toFixed(2)
      );
      dataPoint[`${producto.key}_interanual`] = parseFloat(
        variacionInteranual.toFixed(2)
      );

      // Para el gráfico, usar la variación seleccionada
      dataPoint[producto.key] =
        variationType === "mensual"
          ? dataPoint[`${producto.key}_mensual`]
          : dataPoint[`${producto.key}_interanual`];

      // Guardar también el valor absoluto para las cards
      dataPoint[`${producto.key}_valor`] = currentValue;
    });

    return dataPoint;
  });

  // Filtrar últimos 12 meses para mostrar (como en otros componentes)
  const consumosDataForDisplay = consumosData.slice(-12);

  // Encontrar datos del mes seleccionado para las cards
  const selectedData = consumosDataForDisplay.find(
    (item) => item.mes === selectedMonth
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 shadow-xl max-h-64 overflow-y-auto">
          <p className="text-gray-200 text-sm font-medium mb-2">{label}</p>
          {payload.map((entry, index) => {
            const producto = productos.find((p) => p.key === entry.dataKey);
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
            <ShoppingCart className="w-7 h-7" />
            Consumos Cotidianos
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

        {/* GRÁFICO PROTAGONISTA - MÁS GRANDE */}
        <div className="flex-1 bg-gray-800 rounded-xl p-2">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
              data={consumosDataForDisplay}
              margin={{ top: 10, right: 15, left: 10, bottom: 40 }}
            >
              <XAxis
                dataKey="mes"
                angle={-45}
                textAnchor="end"
                height={50}
                tick={{ fill: "#9ca3af", fontSize: 9 }}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 9 }}
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

              {/* Líneas para cada producto - MÁS FINAS */}
              {productos.map((producto) => (
                <Line
                  key={producto.key}
                  type="monotone"
                  dataKey={producto.key}
                  stroke={producto.color}
                  strokeWidth={1.5}
                  dot={{ fill: producto.color, strokeWidth: 1, r: 2 }}
                  name={producto.name}
                />
              ))}

              {/* Línea de referencia del mes seleccionado */}
              <ReferenceLine
                x={selectedMonth}
                stroke="#56595e"
                strokeWidth={1}
                strokeDasharray="3 3"
              />

              {/* BRUSH más compacto */}
              <Brush
                dataKey="mes"
                height={20}
                stroke="#f6ff00"
                fill="#374151"
                startIndex={0}
                endIndex={consumosDataForDisplay.length - 1}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>

        {/* CARDS MÁS COMPACTAS */}
        <div className="h-24 flex flex-col gap-1">
          <h3 className="text-xs font-semibold text-gray-300">
            Precios en {selectedMonth}
          </h3>

          {/* Scroll horizontal de cards */}
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth">
            {productos.map((producto) => {
              const variacionActual = selectedData
                ? selectedData[`${producto.key}_${variationType}`]
                : 0;

              return (
                <div
                  key={producto.key}
                  className="min-w-[200px] flex-shrink-0 bg-gray-800 rounded-lg p-2 border border-gray-700/50 snap-center"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: producto.color }}
                      />
                      <div>
                        <h4 className="text-xs font-medium text-gray-200">
                          {producto.name}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-white">
                        $
                        {selectedData
                          ? selectedData[
                              `${producto.key}_valor`
                            ].toLocaleString()
                          : "N/A"}
                      </div>
                      <div
                        className={`text-xs font-bold ${
                          variacionActual >= 0
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {selectedData
                          ? (variacionActual > 0 ? "+" : "") +
                            variacionActual +
                            "%"
                          : "N/A"}
                      </div>
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

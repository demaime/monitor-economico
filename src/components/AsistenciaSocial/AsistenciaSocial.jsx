import React, { useState } from "react";
import {
  Heart,
  Calendar,
  TrendingUp,
  Users,
  GraduationCap,
  HandHeart,
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
  const [activeView, setActiveView] = useState("auh"); // 'auh', 'beca', 'acompaniamiento'

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
    const becaProgresar = Number(data.becaProgresar[index]) || 0;
    const acompaniamientoSocial =
      Number(data.acompaniamientoSocial[index]) || 0;
    const seguroDesempleoMin = Number(data.seguroDesempleoMin[index]) || 0;
    const seguroDesempleoMax = Number(data.seguroDesempleoMax[index]) || 0;

    // Valores del mes anterior
    const auhAnterior = index > 0 ? Number(data.auh[index - 1]) || 0 : 0;
    const auhTopeIndividualAnterior =
      index > 0 ? Number(data.auhTopeIndividual[index - 1]) || 0 : 0;
    const auhTopeGrupoFamiliarAnterior =
      index > 0 ? Number(data.auhTopeGrupoFamiliar[index - 1]) || 0 : 0;
    const becaProgresarAnterior =
      index > 0 ? Number(data.becaProgresar[index - 1]) || 0 : 0;
    const acompaniamientoSocialAnterior =
      index > 0 ? Number(data.acompaniamientoSocial[index - 1]) || 0 : 0;
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
    const becaProgresarAnual =
      index >= 12 ? Number(data.becaProgresar[index - 12]) || 0 : 0;
    const acompaniamientoSocialAnual =
      index >= 12 ? Number(data.acompaniamientoSocial[index - 12]) || 0 : 0;
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
    dataPoint.becaProgresar_valor = becaProgresar;
    dataPoint.acompaniamientoSocial_valor = acompaniamientoSocial;
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
    dataPoint.becaProgresar_mensual = parseFloat(
      calcularVariacion(becaProgresar, becaProgresarAnterior).toFixed(2)
    );
    dataPoint.acompaniamientoSocial_mensual = parseFloat(
      calcularVariacion(
        acompaniamientoSocial,
        acompaniamientoSocialAnterior
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
    dataPoint.becaProgresar_interanual = parseFloat(
      calcularVariacion(becaProgresar, becaProgresarAnual).toFixed(2)
    );
    dataPoint.acompaniamientoSocial_interanual = parseFloat(
      calcularVariacion(
        acompaniamientoSocial,
        acompaniamientoSocialAnual
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
    dataPoint.becaProgresar = becaProgresar;
    dataPoint.acompaniamientoSocial = acompaniamientoSocial;
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

  const getViewConfig = () => {
    switch (activeView) {
      case "auh":
        return {
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
      case "beca":
        return {
          title: "Beca Progresar",
          lines: [
            {
              key: "becaProgresar",
              name: "Beca Progresar",
              color: "#10b981",
              strokeWidth: 2,
            },
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
            {
              key: "becaProgresar",
              name: "Beca Progresar",
              color: "#10b981",
            },
          ],
        };
      case "acompaniamiento":
        return {
          title: "Acompañamiento Social",
          lines: [
            {
              key: "acompaniamientoSocial",
              name: "Acompañamiento Social",
              color: "#f59e0b",
              strokeWidth: 2,
            },
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
            {
              key: "acompaniamientoSocial",
              name: "Acompañamiento Social",
              color: "#f59e0b",
            },
          ],
        };
      default:
        return getViewConfig();
    }
  };

  const viewConfig = getViewConfig();

  return (
    <section className="bg-gray-900 overflow-hidden">
      <div className="w-[90%] h-[90%] flex flex-col gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            <Heart className="w-7 h-7" />
            Asistencia Social
          </h1>
          <p className="text-sm text-gray-400">{viewConfig.title}</p>
        </div>

        {/* BOTONES DE VISTA */}
        <div className="flex justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView("auh")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                activeView === "auh"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:text-gray-200"
              }`}
            >
              <Users className="w-4 h-4" />
              AUH
            </button>
            <button
              onClick={() => setActiveView("beca")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                activeView === "beca"
                  ? "bg-green-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:text-gray-200"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Beca Progresar
            </button>
            <button
              onClick={() => setActiveView("acompaniamiento")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                activeView === "acompaniamiento"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:text-gray-200"
              }`}
            >
              <HandHeart className="w-4 h-4" />
              Acompañamiento
            </button>
          </div>

          {/* TOGGLE DE TIPO DE VARIACIÓN */}
          <div className="flex gap-2 relative">
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
            <div className="absolute right-0 -top-8 rounded-lg bg-yellow-custom text-gray-800 px-2 py-1 text-xs">
              {variationType === "mensual" ? "MES A MES" : "AÑO A AÑO"}
            </div>
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
              data={asistenciaDataForDisplay}
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
                tickFormatter={(value) => `$${value.toLocaleString()}`}
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
                  strokeWidth={line.strokeWidth}
                  strokeDasharray={line.strokeDasharray}
                  dot={{ fill: line.color, strokeWidth: 1, r: 2 }}
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

              {/* BRUSH */}
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
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>

        {/* Cards container */}
        <div className="flex-1 flex flex-col">
          {/* Carousel container */}
          <div className="flex gap-4 overflow-x-auto md:grid md:grid-cols-5 snap-x snap-mandatory scroll-smooth">
            {viewConfig.cards.map((line) => {
              const variacionActual = selectedData
                ? selectedData[`${line.key}_${variationType}`]
                : 0;

              return (
                <div
                  key={line.key}
                  className="min-w-[85vw] shrink-0 md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50 snap-center"
                >
                  <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <h3
                        className="text-sm font-medium"
                        style={{ color: line.color }}
                      >
                        {line.name}
                      </h3>
                      <div className="text-2xl font-bold text-white">
                        $
                        {selectedData
                          ? selectedData[`${line.key}_valor`].toLocaleString()
                          : "N/A"}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
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
      </div>
    </section>
  );
}

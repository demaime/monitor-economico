import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Brush,
  ReferenceLine,
} from "recharts";

export default function Particular({
  data,
  months,
  selectedMonth,
  onMonthChange,
  isMobile = false,
  viewMode = "chart",
}) {
  const [activeCard, setActiveCard] = useState(0);
  const [mobileView, setMobileView] = useState("valores"); // "valores" | "patentamientos"

  // Calculate variations and create data object
  const transporteData = months.map((month, index) => {
    const nafta = data.nafta[index];
    const peajeNorte = data.peajes.norte[index];
    const peajeOeste = data.peajes.oeste[index];
    const patentamientoAutos = data.patentamiento.autos[index];
    const patentamientoMotos = data.patentamiento.motos[index];

    // Valores del mes anterior para variación mensual
    const naftaAnterior = index > 0 ? data.nafta[index - 1] : 0;
    const peajeNorteAnterior = index > 0 ? data.peajes.norte[index - 1] : 0;
    const peajeOesteAnterior = index > 0 ? data.peajes.oeste[index - 1] : 0;
    const patentamientoAutosAnterior =
      index > 0 ? data.patentamiento.autos[index - 1] : 0;
    const patentamientoMotosAnterior =
      index > 0 ? data.patentamiento.motos[index - 1] : 0;

    // Valores del año anterior para variación interanual
    const naftaAnual = index >= 12 ? data.nafta[index - 12] : 0;
    const peajeNorteAnual = index >= 12 ? data.peajes.norte[index - 12] : 0;
    const peajeOesteAnual = index >= 12 ? data.peajes.oeste[index - 12] : 0;
    const patentamientoAutosAnual =
      index >= 12 ? data.patentamiento.autos[index - 12] : 0;
    const patentamientoMotosAnual =
      index >= 12 ? data.patentamiento.motos[index - 12] : 0;

    // Encontrar el último valor de diciembre para variación acumulada
    let ultimoDiciembre = {
      nafta: 0,
      peajeNorte: 0,
      peajeOeste: 0,
      patentamientoAutos: 0,
      patentamientoMotos: 0,
    };

    for (let i = index - 1; i >= 0; i--) {
      if (months[i].mes === "DICIEMBRE") {
        ultimoDiciembre = {
          nafta: data.nafta[i],
          peajeNorte: data.peajes.norte[i],
          peajeOeste: data.peajes.oeste[i],
          patentamientoAutos: data.patentamiento.autos[i],
          patentamientoMotos: data.patentamiento.motos[i],
        };
        break;
      }
    }

    const calcularVariacion = (actual, anterior) =>
      anterior ? ((actual - anterior) / anterior) * 100 : 0;

    return {
      mes: month.mes,
      año: month.año,
      nafta,
      peajeNorte,
      peajeOeste,
      patentamientoAutos,
      patentamientoMotos,
      // Variaciones mensuales
      variacionMensualNafta: parseFloat(
        calcularVariacion(nafta, naftaAnterior).toFixed(1)
      ),
      variacionMensualPeajeNorte: parseFloat(
        calcularVariacion(peajeNorte, peajeNorteAnterior).toFixed(1)
      ),
      variacionMensualPeajeOeste: parseFloat(
        calcularVariacion(peajeOeste, peajeOesteAnterior).toFixed(1)
      ),
      variacionMensualPatentamientoAutos: parseFloat(
        calcularVariacion(
          patentamientoAutos,
          patentamientoAutosAnterior
        ).toFixed(1)
      ),
      variacionMensualPatentamientoMotos: parseFloat(
        calcularVariacion(
          patentamientoMotos,
          patentamientoMotosAnterior
        ).toFixed(1)
      ),
      // Variaciones interanuales
      variacionAnualNafta: parseFloat(
        calcularVariacion(nafta, naftaAnual).toFixed(1)
      ),
      variacionAnualPeajeNorte: parseFloat(
        calcularVariacion(peajeNorte, peajeNorteAnual).toFixed(1)
      ),
      variacionAnualPeajeOeste: parseFloat(
        calcularVariacion(peajeOeste, peajeOesteAnual).toFixed(1)
      ),
      variacionAnualPatentamientoAutos: parseFloat(
        calcularVariacion(patentamientoAutos, patentamientoAutosAnual).toFixed(
          1
        )
      ),
      variacionAnualPatentamientoMotos: parseFloat(
        calcularVariacion(patentamientoMotos, patentamientoMotosAnual).toFixed(
          1
        )
      ),
      // Variaciones acumuladas
      variacionAcumuladaNafta: parseFloat(
        calcularVariacion(nafta, ultimoDiciembre.nafta).toFixed(1)
      ),
      variacionAcumuladaPeajeNorte: parseFloat(
        calcularVariacion(peajeNorte, ultimoDiciembre.peajeNorte).toFixed(1)
      ),
      variacionAcumuladaPeajeOeste: parseFloat(
        calcularVariacion(peajeOeste, ultimoDiciembre.peajeOeste).toFixed(1)
      ),
      variacionAcumuladaPatentamientoAutos: parseFloat(
        calcularVariacion(
          patentamientoAutos,
          ultimoDiciembre.patentamientoAutos
        ).toFixed(1)
      ),
      variacionAcumuladaPatentamientoMotos: parseFloat(
        calcularVariacion(
          patentamientoMotos,
          ultimoDiciembre.patentamientoMotos
        ).toFixed(1)
      ),
    };
  });

  // Ensure to slice the last 12 months for display
  const transporteDataForDisplay = transporteData.slice(-12);
  const selectedMonthData = transporteDataForDisplay.find(
    (m) => m.mes === selectedMonth
  );

  const CustomTooltipPesos = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const formatCurrency = (value) => {
        return new Intl.NumberFormat("es-AR").format(value);
      };

      return (
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 shadow-xl">
          <p className="text-gray-200 text-sm font-medium">
            {payload[0].payload.mes} {payload[0].payload.año}
          </p>
          <p className="text-red-400 font-bold">
            Nafta: ${formatCurrency(payload[0].payload.nafta)}
          </p>
          <p className="text-purple-400 font-bold">
            Peaje Norte: ${formatCurrency(payload[0].payload.peajeNorte)}
          </p>
          <p className="text-indigo-400 font-bold">
            Peaje Oeste: ${formatCurrency(payload[0].payload.peajeOeste)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomTooltipUnidades = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const formatPatentamiento = (value) => {
        if (!value || isNaN(value)) {
          return `Próximo informe: ${nextReportMonth}`;
        }
        return new Intl.NumberFormat("es-AR").format(value);
      };

      return (
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 shadow-xl">
          <p className="text-gray-200 text-sm font-medium">
            {payload[0].payload.mes} {payload[0].payload.año}
          </p>
          <p className="text-pink-400 font-bold">
            Pat. Autos:{" "}
            {formatPatentamiento(payload[0].payload.patentamientoAutos)}
          </p>
          <p className="text-orange-400 font-bold">
            Pat. Motos:{" "}
            {formatPatentamiento(payload[0].payload.patentamientoMotos)}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleScroll = (e) => {
    const scrollPosition = e.target.scrollLeft;
    const cardWidth = window.innerWidth * 0.85;
    const activeIndex = Math.round(scrollPosition / cardWidth);
    setActiveCard(activeIndex);
  };

  // Función para obtener el próximo mes de informe de patentamientos
  const getNextPatentamientoReport = () => {
    const reportMonths = ["MARZO", "JUNIO", "SEPTIEMBRE", "DICIEMBRE"];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11
    const currentYear = currentDate.getFullYear();

    // Mapear meses a números (0-11)
    const monthMap = {
      MARZO: 2,
      JUNIO: 5,
      SEPTIEMBRE: 8,
      DICIEMBRE: 11,
    };

    // Encontrar el próximo mes de reporte
    for (const month of reportMonths) {
      const monthNumber = monthMap[month];
      if (monthNumber > currentMonth) {
        return month;
      }
    }

    // Si no hay ningún mes posterior en el año actual, el próximo será marzo del siguiente año
    return "MARZO";
  };

  const nextReportMonth = getNextPatentamientoReport();

  // Si es mobile y está en modo cards, solo mostrar datos
  if (isMobile && viewMode === "cards") {
    return (
      <div className="grid grid-cols-2 gap-2">
        {/* Nafta Card */}
        <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-red-200">Nafta</h3>
            <div className="text-sm font-bold text-red-400">
              ${new Intl.NumberFormat("es-AR").format(selectedMonthData?.nafta)}
            </div>
            <div className="grid grid-cols-3 gap-1 text-xs">
              <div className="text-center">
                <span className="text-gray-400 block text-xs">Mes</span>
                <span className="font-bold text-red-400 text-xs">
                  {selectedMonthData?.variacionMensualNafta}%
                </span>
              </div>
              <div className="text-center">
                <span className="text-gray-400 block text-xs">Año</span>
                <span className="font-bold text-red-400 text-xs">
                  {selectedMonthData?.variacionAnualNafta}%
                </span>
              </div>
              <div className="text-center">
                <span className="text-gray-400 block text-xs">Acum</span>
                <span className="font-bold text-red-400 text-xs">
                  {selectedMonthData?.variacionAcumuladaNafta}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Peaje Norte Card */}
        <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-purple-200">P. Norte</h3>
            <div className="text-sm font-bold text-purple-400">
              $
              {new Intl.NumberFormat("es-AR").format(
                selectedMonthData?.peajeNorte
              )}
            </div>
            <div className="grid grid-cols-3 gap-1 text-xs">
              <div className="text-center">
                <span className="text-gray-400 block text-xs">Mes</span>
                <span className="font-bold text-purple-400 text-xs">
                  {selectedMonthData?.variacionMensualPeajeNorte}%
                </span>
              </div>
              <div className="text-center">
                <span className="text-gray-400 block text-xs">Año</span>
                <span className="font-bold text-purple-400 text-xs">
                  {selectedMonthData?.variacionAnualPeajeNorte}%
                </span>
              </div>
              <div className="text-center">
                <span className="text-gray-400 block text-xs">Acum</span>
                <span className="font-bold text-purple-400 text-xs">
                  {selectedMonthData?.variacionAcumuladaPeajeNorte}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Peaje Oeste Card */}
        <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-indigo-200">P. Oeste</h3>
            <div className="text-sm font-bold text-indigo-400">
              $
              {new Intl.NumberFormat("es-AR").format(
                selectedMonthData?.peajeOeste
              )}
            </div>
            <div className="grid grid-cols-3 gap-1 text-xs">
              <div className="text-center">
                <span className="text-gray-400 block text-xs">Mes</span>
                <span className="font-bold text-indigo-400 text-xs">
                  {selectedMonthData?.variacionMensualPeajeOeste}%
                </span>
              </div>
              <div className="text-center">
                <span className="text-gray-400 block text-xs">Año</span>
                <span className="font-bold text-indigo-400 text-xs">
                  {selectedMonthData?.variacionAnualPeajeOeste}%
                </span>
              </div>
              <div className="text-center">
                <span className="text-gray-400 block text-xs">Acum</span>
                <span className="font-bold text-indigo-400 text-xs">
                  {selectedMonthData?.variacionAcumuladaPeajeOeste}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Patentamiento Autos Card */}
        <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-pink-200">Autos</h3>
            <div className="text-sm font-bold text-pink-400">
              {!selectedMonthData?.patentamientoAutos ||
              isNaN(selectedMonthData?.patentamientoAutos)
                ? `Próximo informe: ${nextReportMonth}`
                : new Intl.NumberFormat("es-AR").format(
                    selectedMonthData?.patentamientoAutos
                  )}
            </div>
            {selectedMonthData?.patentamientoAutos &&
            !isNaN(selectedMonthData?.patentamientoAutos) ? (
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="text-center">
                  <span className="text-gray-400 block text-xs">Mes</span>
                  <span className="font-bold text-pink-400 text-xs">
                    {selectedMonthData?.variacionMensualPatentamientoAutos}%
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-gray-400 block text-xs">Año</span>
                  <span className="font-bold text-pink-400 text-xs">
                    {selectedMonthData?.variacionAnualPatentamientoAutos}%
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-gray-400 block text-xs">Acum</span>
                  <span className="font-bold text-pink-400 text-xs">
                    {selectedMonthData?.variacionAcumuladaPatentamientoAutos}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-400 text-center">
                Datos trimestrales
              </div>
            )}
          </div>
        </div>

        {/* Patentamiento Motos Card */}
        <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-orange-200">Motos</h3>
            <div className="text-sm font-bold text-orange-400">
              {!selectedMonthData?.patentamientoMotos ||
              isNaN(selectedMonthData?.patentamientoMotos)
                ? `Próximo informe: ${nextReportMonth}`
                : new Intl.NumberFormat("es-AR").format(
                    selectedMonthData?.patentamientoMotos
                  )}
            </div>
            {selectedMonthData?.patentamientoMotos &&
            !isNaN(selectedMonthData?.patentamientoMotos) ? (
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="text-center">
                  <span className="text-gray-400 block text-xs">Mes</span>
                  <span className="font-bold text-orange-400 text-xs">
                    {selectedMonthData?.variacionMensualPatentamientoMotos}%
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-gray-400 block text-xs">Año</span>
                  <span className="font-bold text-orange-400 text-xs">
                    {selectedMonthData?.variacionAnualPatentamientoMotos}%
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-gray-400 block text-xs">Acum</span>
                  <span className="font-bold text-orange-400 text-xs">
                    {selectedMonthData?.variacionAcumuladaPatentamientoMotos}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-400 text-center">
                Datos trimestrales
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Mobile view selector */}
      <div className={`flex mb-2 ${isMobile ? "hidden" : "md:hidden"}`}>
        <div className="flex w-full gap-2">
          <button
            onClick={() => setMobileView("valores")}
            className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-xl transition-colors ${
              mobileView === "valores"
                ? "bg-red-500/20 text-red-400 border border-red-500/20"
                : "bg-gray-800 text-gray-400 border border-gray-700"
            }`}
          >
            Nafta y Peajes
          </button>
          <button
            onClick={() => setMobileView("patentamientos")}
            className={`flex-1 px-4 py-1.5 text-sm font-medium rounded-xl transition-colors ${
              mobileView === "patentamientos"
                ? "bg-pink-500/20 text-pink-400 border border-pink-500/20"
                : "bg-gray-800 text-gray-400 border border-gray-700"
            }`}
          >
            Patentamientos
          </button>
        </div>
      </div>

      {/* Charts container */}
      <div className="flex-1 flex flex-col md:grid md:grid-cols-2 gap-2">
        {/* Desktop view o Mobile Chart */}
        <div
          className={`${
            !isMobile ? "hidden md:block" : ""
          } bg-gray-800 rounded-xl p-2 ${isMobile ? "h-64" : ""}`}
        >
          <ResponsiveContainer>
            <LineChart
              data={transporteDataForDisplay}
              margin={{
                top: 0,
                right: isMobile ? 10 : 15,
                left: -20,
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="mes"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fill: "#9ca3af", fontSize: isMobile ? 6 : 8 }}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: isMobile ? 6 : 8 }}
                axisLine={{ stroke: "#374151" }}
              />
              <Tooltip content={<CustomTooltipPesos />} />
              <Line
                type="monotone"
                dataKey="nafta"
                stroke="#f87171"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="peajeNorte"
                stroke="#c084fc"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="peajeOeste"
                stroke="#818cf8"
                strokeWidth={2}
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
                  stroke="#f87171"
                  fill="#1f2937"
                  travellerWidth={10}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          className={`${
            !isMobile ? "hidden md:block" : "hidden"
          } bg-gray-800 rounded-xl p-2`}
        >
          <ResponsiveContainer>
            <LineChart
              data={transporteDataForDisplay}
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
              />
              <Tooltip content={<CustomTooltipUnidades />} />
              <Line
                type="monotone"
                dataKey="patentamientoAutos"
                stroke="#f472b6"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="patentamientoMotos"
                stroke="#fb923c"
                strokeWidth={2}
              />
              <ReferenceLine
                x={selectedMonth}
                stroke="#56595e"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <Brush
                dataKey="mes"
                height={15}
                stroke="#f87171"
                fill="#1f2937"
                travellerWidth={10}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mobile view */}
        <div className="flex-1 md:hidden bg-gray-800 rounded-xl p-2">
          {mobileView === "valores" ? (
            <ResponsiveContainer>
              <LineChart
                data={transporteDataForDisplay}
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
                />
                <Tooltip content={<CustomTooltipPesos />} />
                <Line
                  type="monotone"
                  dataKey="nafta"
                  stroke="#f87171"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="peajeNorte"
                  stroke="#c084fc"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="peajeOeste"
                  stroke="#818cf8"
                  strokeWidth={2}
                />
                <ReferenceLine
                  x={selectedMonth}
                  stroke="#56595e"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <Brush
                  dataKey="mes"
                  height={15}
                  stroke="#f87171"
                  fill="#1f2937"
                  travellerWidth={10}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer>
              <LineChart
                data={transporteDataForDisplay}
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
                />
                <Tooltip content={<CustomTooltipUnidades />} />
                <Line
                  type="monotone"
                  dataKey="patentamientoAutos"
                  stroke="#f472b6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="patentamientoMotos"
                  stroke="#fb923c"
                  strokeWidth={2}
                />
                <ReferenceLine
                  x={selectedMonth}
                  stroke="#56595e"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                <Brush
                  dataKey="mes"
                  height={15}
                  stroke="#f87171"
                  fill="#1f2937"
                  travellerWidth={10}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Cards container */}
      <div className="flex flex-col md:grid md:grid-cols-2 gap-2 mt-2">
        {/* Cards de valores en pesos */}
        <div
          className={`grid grid-cols-3 gap-2 ${
            mobileView !== "valores" && "hidden md:grid"
          }`}
        >
          {/* Card 1 - Nafta */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-1.5 md:p-2 shadow-lg border border-gray-700/50">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-[11px] md:text-sm font-medium text-red-200">
                Nafta
              </h3>
              <p className="text-sm md:text-lg font-bold text-red-400">
                $
                {new Intl.NumberFormat("es-AR").format(
                  selectedMonthData?.nafta
                )}
              </p>
              <div className="text-[10px] md:text-xs">
                <span className="text-gray-400">Mensual </span>
                <span className="text-red-400">
                  {selectedMonthData?.variacionMensualNafta}%
                </span>
              </div>
              <div className="text-[10px] md:text-xs">
                <span className="text-gray-400">Anual </span>
                <span className="text-red-400">
                  {selectedMonthData?.variacionAnualNafta}%
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 - Peaje Norte */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-1.5 md:p-2 shadow-lg border border-gray-700/50">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-[11px] md:text-sm font-medium text-purple-200">
                P. Norte
              </h3>
              <p className="text-sm md:text-lg font-bold text-purple-400">
                $
                {new Intl.NumberFormat("es-AR").format(
                  selectedMonthData?.peajeNorte
                )}
              </p>
              <div className="text-[10px] md:text-xs">
                <span className="text-gray-400">Mensual </span>
                <span className="text-purple-400">
                  {selectedMonthData?.variacionMensualPeajeNorte}%
                </span>
              </div>
              <div className="text-[10px] md:text-xs">
                <span className="text-gray-400">Anual </span>
                <span className="text-purple-400">
                  {selectedMonthData?.variacionAnualPeajeNorte}%
                </span>
              </div>
            </div>
          </div>

          {/* Card 3 - Peaje Oeste */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-1.5 md:p-2 shadow-lg border border-gray-700/50">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-[11px] md:text-sm font-medium text-indigo-200">
                P. Oeste
              </h3>
              <p className="text-sm md:text-lg font-bold text-indigo-400">
                $
                {new Intl.NumberFormat("es-AR").format(
                  selectedMonthData?.peajeOeste
                )}
              </p>
              <div className="text-[10px] md:text-xs">
                <span className="text-gray-400">Mensual </span>
                <span className="text-indigo-400">
                  {selectedMonthData?.variacionMensualPeajeOeste}%
                </span>
              </div>
              <div className="text-[10px] md:text-xs">
                <span className="text-gray-400">Anual </span>
                <span className="text-indigo-400">
                  {selectedMonthData?.variacionAnualPeajeOeste}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de patentamientos */}
        <div
          className={`grid grid-cols-2 gap-2 ${
            mobileView !== "patentamientos" && "hidden md:grid"
          }`}
        >
          {/* Card 4 - Patentamiento Autos */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-1.5 md:p-2 shadow-lg border border-gray-700/50">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-[11px] md:text-sm font-medium text-pink-200">
                Pat. Autos
              </h3>
              <p className="text-sm md:text-lg font-bold text-pink-400">
                {selectedMonthData?.patentamientoAutos}
              </p>
              <div className="text-[10px] md:text-xs">
                <span className="text-gray-400">Mensual </span>
                <span className="text-pink-400">
                  {selectedMonthData?.variacionMensualPatentamientoAutos}%
                </span>
              </div>
              <div className="text-[10px] md:text-xs">
                <span className="text-gray-400">Anual </span>
                <span className="text-pink-400">
                  {selectedMonthData?.variacionAnualPatentamientoAutos}%
                </span>
              </div>
            </div>
          </div>

          {/* Card 5 - Patentamiento Motos */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-1.5 md:p-2 shadow-lg border border-gray-700/50">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-[11px] md:text-sm font-medium text-orange-200">
                Pat. Motos
              </h3>
              <p className="text-sm md:text-lg font-bold text-orange-400">
                {selectedMonthData?.patentamientoMotos}
              </p>
              <div className="text-[10px] md:text-xs">
                <span className="text-gray-400">Mensual </span>
                <span className="text-orange-400">
                  {selectedMonthData?.variacionMensualPatentamientoMotos}%
                </span>
              </div>
              <div className="text-[10px] md:text-xs">
                <span className="text-gray-400">Anual </span>
                <span className="text-orange-400">
                  {selectedMonthData?.variacionAnualPatentamientoMotos}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  ArrowUpRight,
  Percent,
  User,
  Users,
  ExternalLink,
  X,
  ShoppingBasket,
  BarChart3,
  LineChart as LineChartIcon,
} from "lucide-react";
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
import MonthSelector from "../MonthSelector/MonthSelector";

export default function CanastaSalario({ data, months }) {
  const [selectedMonth, setSelectedMonth] = useState(
    months[months.length - 1].mes
  );
  const [activeCard, setActiveCard] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("nacional");
  const [selectedType, setSelectedType] = useState("individual");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
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

  const currentData = data[selectedRegion][selectedType];

  // Calculate variations and create an object.
  const canastaData = months.map((month, index) => {
    const multiplier = selectedType === "familiar" ? 2 : 1;
    const CBA = currentData.basica[index];
    const CBT = currentData.total[index];
    const SMV = data.smv[index] * multiplier;
    const JubConBono = data.jubilaciones.conBono[index] * multiplier;
    const JubSinBono = data.jubilaciones.sinBono[index] * multiplier;

    // Valores del mes anterior para variación mensual
    const CBAAnterior = index > 0 ? currentData.basica[index - 1] : 0;
    const CBTAnterior = index > 0 ? currentData.total[index - 1] : 0;
    const SMVAnterior = index > 0 ? data.smv[index - 1] * multiplier : 0;
    const JubConBonoAnterior =
      index > 0 ? data.jubilaciones.conBono[index - 1] * multiplier : 0;
    const JubSinBonoAnterior =
      index > 0 ? data.jubilaciones.sinBono[index - 1] * multiplier : 0;

    // Valores del año anterior para variación interanual
    const CBAAnual = index >= 12 ? currentData.basica[index - 12] : 0;
    const CBTAnual = index >= 12 ? currentData.total[index - 12] : 0;
    const SMVAnual = index >= 12 ? data.smv[index - 12] * multiplier : 0;
    const JubConBonoAnual =
      index >= 12 ? data.jubilaciones.conBono[index - 12] * multiplier : 0;
    const JubSinBonoAnual =
      index >= 12 ? data.jubilaciones.sinBono[index - 12] * multiplier : 0;

    // Encontrar el último valor de diciembre para variación acumulada
    let ultimoDiciembre = {
      CBA: 0,
      CBT: 0,
      SMV: 0,
      JubConBono: 0,
      JubSinBono: 0,
    };

    for (let i = index - 1; i >= 0; i--) {
      if (months[i].mes === "DICIEMBRE") {
        ultimoDiciembre = {
          CBA: currentData.basica[i],
          CBT: currentData.total[i],
          SMV: data.smv[i] * multiplier,
          JubConBono: data.jubilaciones.conBono[i] * multiplier,
          JubSinBono: data.jubilaciones.sinBono[i] * multiplier,
        };
        break;
      }
    }

    const calcularVariacion = (actual, anterior) =>
      anterior ? ((actual - anterior) / anterior) * 100 : 0;

    return {
      mes: month.mes,
      año: month.año,
      CBA,
      CBT,
      SMV,
      JubConBono,
      JubSinBono,
      // Variaciones mensuales
      variacionMensualCBA: parseFloat(
        calcularVariacion(CBA, CBAAnterior).toFixed(1)
      ),
      variacionMensualCBT: parseFloat(
        calcularVariacion(CBT, CBTAnterior).toFixed(1)
      ),
      variacionMensualSMV: parseFloat(
        calcularVariacion(SMV, SMVAnterior).toFixed(1)
      ),
      variacionMensualJubConBono: parseFloat(
        calcularVariacion(JubConBono, JubConBonoAnterior).toFixed(1)
      ),
      variacionMensualJubSinBono: parseFloat(
        calcularVariacion(JubSinBono, JubSinBonoAnterior).toFixed(1)
      ),
      // Variaciones interanuales
      variacionAnualCBA: parseFloat(
        calcularVariacion(CBA, CBAAnual).toFixed(1)
      ),
      variacionAnualCBT: parseFloat(
        calcularVariacion(CBT, CBTAnual).toFixed(1)
      ),
      variacionAnualSMV: parseFloat(
        calcularVariacion(SMV, SMVAnual).toFixed(1)
      ),
      variacionAnualJubConBono: parseFloat(
        calcularVariacion(JubConBono, JubConBonoAnual).toFixed(1)
      ),
      variacionAnualJubSinBono: parseFloat(
        calcularVariacion(JubSinBono, JubSinBonoAnual).toFixed(1)
      ),
      // Variaciones acumuladas
      variacionAcumuladaCBA: parseFloat(
        calcularVariacion(CBA, ultimoDiciembre.CBA).toFixed(1)
      ),
      variacionAcumuladaCBT: parseFloat(
        calcularVariacion(CBT, ultimoDiciembre.CBT).toFixed(1)
      ),
      variacionAcumuladaSMV: parseFloat(
        calcularVariacion(SMV, ultimoDiciembre.SMV).toFixed(1)
      ),
      variacionAcumuladaJubConBono: parseFloat(
        calcularVariacion(JubConBono, ultimoDiciembre.JubConBono).toFixed(1)
      ),
      variacionAcumuladaJubSinBono: parseFloat(
        calcularVariacion(JubSinBono, ultimoDiciembre.JubSinBono).toFixed(1)
      ),
    };
  });

  // Ensure to slice the last 12 months for display
  const canastaDataForDisplay = canastaData.slice(-12);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const formatCurrency = (value) => {
        return new Intl.NumberFormat("es-AR").format(value);
      };

      return (
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 shadow-xl">
          <p className="text-gray-200 text-sm font-medium">
            {payload[0].payload.name}
          </p>
          <p
            style={{
              color: selectedRegion === "nacional" ? "#ff5733" : "#f6ff00",
            }}
            className="font-bold"
          >
            CBA: ${formatCurrency(payload[0].value)}
          </p>
          {payload[1] && (
            <p
              style={{
                color: selectedRegion === "nacional" ? "#ff8c33" : "#eff553",
              }}
              className="font-bold"
            >
              CBT: ${formatCurrency(payload[1].value)}
            </p>
          )}
          <p className="text-green-400 font-bold">
            SMV: ${formatCurrency(payload[0].payload.SMV)}
          </p>
          <p className="text-blue-400 font-bold">
            Jubilación c/Bono: ${formatCurrency(payload[0].payload.JubConBono)}
          </p>
          <p className="text-blue-300 font-bold">
            Jubilación s/Bono: ${formatCurrency(payload[0].payload.JubSinBono)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Agregar la función handleScroll
  const handleScroll = (e) => {
    const scrollPosition = e.target.scrollLeft;
    const cardWidth = window.innerWidth * 0.85; // 85vw
    const activeIndex = Math.round(scrollPosition / cardWidth);
    setActiveCard(activeIndex);
  };

  const handleOpenModal = (index) => {
    setSelectedCard(index);
    setIsModalOpen(true);
  };

  // Function to get the data for the selected card
  const getModalData = (index) => {
    const currentMonthData =
      canastaDataForDisplay[selectedMonthIndexForDisplay];

    switch (index) {
      case 0: // CBA
        return {
          title: "Canasta Básica Alimentaria",
          value: currentMonthData.CBA,
          variacionMensual: currentMonthData.variacionMensualCBA,
          variacionAnual: currentMonthData.variacionAnualCBA,
          variacionAcumulada: currentMonthData.variacionAcumuladaCBA,
        };
      case 1: // CBT
        return {
          title: "Canasta Básica Total",
          value: currentMonthData.CBT,
          variacionMensual: currentMonthData.variacionMensualCBT,
          variacionAnual: currentMonthData.variacionAnualCBT,
          variacionAcumulada: currentMonthData.variacionAcumuladaCBT,
        };
      case 2: // SMV
        return {
          title: "Salario Mínimo Vital y Móvil",
          value: currentMonthData.SMV,
          variacionMensual: currentMonthData.variacionMensualSMV,
          variacionAnual: currentMonthData.variacionAnualSMV,
          variacionAcumulada: currentMonthData.variacionAcumuladaSMV,
        };
      case 3: // Jubilación con Bono
        return {
          title: "Jubilación con Bono",
          value: currentMonthData.JubConBono,
          variacionMensual: currentMonthData.variacionMensualJubConBono,
          variacionAnual: currentMonthData.variacionAnualJubConBono,
          variacionAcumulada: currentMonthData.variacionAcumuladaJubConBono,
        };
      case 4: // Jubilación sin Bono
        return {
          title: "Jubilación sin Bono",
          value: currentMonthData.JubSinBono,
          variacionMensual: currentMonthData.variacionMensualJubSinBono,
          variacionAnual: currentMonthData.variacionAnualJubSinBono,
          variacionAcumulada: currentMonthData.variacionAcumuladaJubSinBono,
        };
      default:
        return {};
    }
  };

  const selectedMonthIndexForDisplay = canastaDataForDisplay.findIndex(
    (m) => m.mes === selectedMonth
  );

  return (
    <section className="bg-gray-900 overflow-hidden">
      <div className="w-[90%] h-[90%] flex flex-col gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            <ShoppingBasket className="w-7 h-7" />
            Canasta <span className="text-orange-custom text-xs mx-1">
              -
            </span>{" "}
            SMV <span className="text-orange-custom text-xs mx-1">-</span>{" "}
            Jubilación
          </h1>

          <p className="text-sm text-gray-400">Fuente: INDEC</p>
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
                <LineChartIcon className="w-4 h-4" />
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
            </div>
            <div className="flex gap-2 relative">
              <div
                className={`absolute right-0 -top-8 rounded-lg px-2 py-1 text-xs ${
                  selectedRegion === "nacional"
                    ? "bg-orange-custom text-white"
                    : "bg-yellow-custom text-gray-800"
                }`}
              >
                {selectedType === "individual" ? "INDIVIDUAL" : "GRUPAL"}
              </div>
              <button
                onClick={() => setSelectedType("individual")}
                className={`p-2 rounded-lg ${
                  selectedType === "individual"
                    ? selectedRegion === "nacional"
                      ? "bg-orange-custom text-white"
                      : "bg-yellow-custom text-gray-800"
                    : "bg-gray-800 text-gray-300"
                }`}
                title="Individual"
              >
                <User size={16} />
              </button>
              <button
                onClick={() => setSelectedType("familiar")}
                className={`p-2 rounded-lg ${
                  selectedType === "familiar"
                    ? selectedRegion === "nacional"
                      ? "bg-orange-custom text-white"
                      : "bg-yellow-custom text-gray-800"
                    : "bg-gray-800 text-gray-300"
                }`}
                title="Familiar"
              >
                <Users size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Mobile controls when viewing chart */}
        {isMobile && viewMode === "chart" && (
          <div className="space-y-3">
            {/* Region selector */}
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
            </div>

            {/* Type selector */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setSelectedType("individual")}
                className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
                  selectedType === "individual"
                    ? selectedRegion === "nacional"
                      ? "bg-orange-custom text-white"
                      : "bg-yellow-custom text-gray-800"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <User size={14} />
                Individual
              </button>
              <button
                onClick={() => setSelectedType("familiar")}
                className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
                  selectedType === "familiar"
                    ? selectedRegion === "nacional"
                      ? "bg-orange-custom text-white"
                      : "bg-yellow-custom text-gray-800"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <Users size={14} />
                Familiar
              </button>
            </div>
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
            {/* Top level controls */}
            <div className="grid grid-cols-2 gap-3">
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
                  </div>
                </div>
              </div>

              {/* Type selector */}
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-gray-300">Tipo</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSelectedType("individual")}
                      className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                        selectedType === "individual"
                          ? selectedRegion === "nacional"
                            ? "bg-orange-custom text-white"
                            : "bg-yellow-custom text-gray-800"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      <User size={10} />
                      Indiv.
                    </button>
                    <button
                      onClick={() => setSelectedType("familiar")}
                      className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                        selectedType === "familiar"
                          ? selectedRegion === "nacional"
                            ? "bg-orange-custom text-white"
                            : "bg-yellow-custom text-gray-800"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      <Users size={10} />
                      Fam.
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Value Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* CBA Card */}
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="space-y-2">
                  <h3
                    className={`text-xs font-medium ${
                      selectedRegion === "nacional"
                        ? "text-orange-200"
                        : "text-yellow-200"
                    }`}
                  >
                    {selectedType === "familiar" ? "CBAF" : "CBAI"}
                  </h3>
                  <div
                    className={`text-lg font-bold ${
                      selectedRegion === "nacional"
                        ? "text-orange-custom"
                        : "text-yellow-custom"
                    }`}
                  >
                    $
                    {new Intl.NumberFormat("es-AR").format(
                      canastaDataForDisplay[selectedMonthIndexForDisplay].CBA
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      Canasta Básica Alimentaria
                    </span>
                  </div>
                </div>
              </div>

              {/* CBT Card */}
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="space-y-2">
                  <h3
                    className={`text-xs font-medium ${
                      selectedRegion === "nacional"
                        ? "text-orange-200"
                        : "text-yellow-200"
                    }`}
                  >
                    {selectedType === "familiar" ? "CBT" : "CBTI"}
                  </h3>
                  <div
                    className={`text-lg font-bold ${
                      selectedRegion === "nacional"
                        ? "text-orange-custom"
                        : "text-yellow-custom"
                    }`}
                  >
                    $
                    {new Intl.NumberFormat("es-AR").format(
                      canastaDataForDisplay[selectedMonthIndexForDisplay].CBT
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      Canasta Básica Total
                    </span>
                  </div>
                </div>
              </div>

              {/* SMV Card */}
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-green-200">SMVM</h3>
                  <div className="text-lg font-bold text-green-400">
                    $
                    {new Intl.NumberFormat("es-AR").format(
                      canastaDataForDisplay[selectedMonthIndexForDisplay].SMV
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      Salario Mínimo{selectedType === "familiar" ? " (x2)" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Jubilación Card */}
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div className="space-y-2">
                  <h3 className="text-xs font-medium text-blue-200">
                    Jubilación
                  </h3>
                  <div className="text-lg font-bold text-blue-400">
                    $
                    {new Intl.NumberFormat("es-AR").format(
                      canastaDataForDisplay[selectedMonthIndexForDisplay]
                        .JubConBono
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Percent className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      Con Bono{selectedType === "familiar" ? " (x2)" : ""}
                    </span>
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
            <ResponsiveContainer>
              <LineChart
                data={canastaDataForDisplay}
                margin={{
                  top: 0,
                  right: isMobile ? 5 : 15,
                  left: isMobile ? -20 : -20,
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
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="CBA"
                  stroke={selectedRegion === "nacional" ? "#ff5733" : "#f6ff00"}
                  fill={selectedRegion === "nacional" ? "#ff5733" : "#f6ff00"}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="CBT"
                  stroke={selectedRegion === "nacional" ? "#ff8c33" : "#eff553"}
                  fill={selectedRegion === "nacional" ? "#ff8c33" : "#eff553"}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="SMV"
                  stroke="#4ade80"
                  fill="#4ade80"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="JubConBono"
                  stroke="#60a5fa"
                  fill="#60a5fa"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="JubSinBono"
                  stroke="#93c5fd"
                  fill="#93c5fd"
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
              </LineChart>
            </ResponsiveContainer>
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

        {/* Desktop Cards container */}
        {!isMobile && (
          <div className="flex-1 flex flex-col">
            {/* Carousel container */}
            <div
              className="flex gap-4 overflow-x-auto md:grid md:grid-cols-5 snap-x snap-mandatory scroll-smooth"
              onScroll={handleScroll}
            >
              {/* Card 1 - Canasta Básica Alimentaria */}
              <div className="min-w-[85vw] shrink-0 md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50 snap-center">
                <button
                  onClick={() => handleOpenModal(0)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors z-20"
                >
                  <ExternalLink size={16} />
                </button>
                <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h3
                      className={`text-sm font-medium ${
                        selectedRegion === "nacional"
                          ? "text-orange-200"
                          : "text-yellow-200"
                      }`}
                    >
                      {selectedType === "familiar" ? "CBAF" : "CBAI"}
                    </h3>
                    <div
                      className={`text-2xl font-bold ${
                        selectedRegion === "nacional"
                          ? "text-orange-custom"
                          : "text-yellow-custom"
                      }`}
                    >
                      $
                      {new Intl.NumberFormat("es-AR").format(
                        canastaDataForDisplay[selectedMonthIndexForDisplay].CBA
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>
                      Canasta Básica Alimentaria{" "}
                      {selectedType === "familiar" ? "Familiar" : "Individual"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2 - Canasta Básica Total */}
              <div className="min-w-[85vw] shrink-0 md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50 snap-center">
                <button
                  onClick={() => handleOpenModal(1)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors z-20"
                >
                  <ExternalLink size={16} />
                </button>
                <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h3
                      className={`text-sm font-medium ${
                        selectedRegion === "nacional"
                          ? "text-orange-200"
                          : "text-yellow-200"
                      }`}
                    >
                      {selectedType === "familiar" ? "CBT" : "CBTI"}
                    </h3>
                    <div
                      className={`text-2xl font-bold ${
                        selectedRegion === "nacional"
                          ? "text-orange-custom"
                          : "text-yellow-custom"
                      }`}
                    >
                      $
                      {new Intl.NumberFormat("es-AR").format(
                        canastaDataForDisplay[selectedMonthIndexForDisplay].CBT
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>
                      Canasta Básica Total{" "}
                      {selectedType === "familiar" ? "Familiar" : "Individual"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3 - Salario Mínimo */}
              <div className="min-w-[85vw] shrink-0 md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50 snap-center">
                <button
                  onClick={() => handleOpenModal(2)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors z-20"
                >
                  <ExternalLink size={16} />
                </button>
                <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-green-200">SMVM</h3>
                    <div className="text-2xl font-bold text-green-400">
                      $
                      {new Intl.NumberFormat("es-AR").format(
                        canastaDataForDisplay[selectedMonthIndexForDisplay].SMV
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>
                      Salario Mínimo Vital y Móvil{" "}
                      {selectedType === "familiar" ? "(x2)" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 4 - Jubilación con Bono */}
              <div className="min-w-[85vw] shrink-0 md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50 snap-center">
                <button
                  onClick={() => handleOpenModal(3)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors z-20"
                >
                  <ExternalLink size={16} />
                </button>
                <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-blue-200">
                      Jubilación c/Bono
                    </h3>
                    <div className="text-2xl font-bold text-blue-400">
                      $
                      {new Intl.NumberFormat("es-AR").format(
                        canastaDataForDisplay[selectedMonthIndexForDisplay]
                          .JubConBono
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    <span>
                      Jubilación con Bono{" "}
                      {selectedType === "familiar" ? "(x2)" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 5 - Jubilación sin Bono */}
              <div className="min-w-[85vw] shrink-0 md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50 snap-center">
                <button
                  onClick={() => handleOpenModal(4)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors z-20"
                >
                  <ExternalLink size={16} />
                </button>
                <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-blue-200">
                      Jubilación s/Bono
                    </h3>
                    <div className="text-2xl font-bold text-blue-300">
                      $
                      {new Intl.NumberFormat("es-AR").format(
                        canastaDataForDisplay[selectedMonthIndexForDisplay]
                          .JubSinBono
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    <span>
                      Jubilación sin Bono{" "}
                      {selectedType === "familiar" ? "(x2)" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll indicators */}
            <div className="flex gap-1 justify-center py-2 md:hidden">
              {[0, 1, 2, 3, 4].map((index) => (
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-4 flex justify-between items-center border-b border-gray-700">
              <h2 className="text-xl font-bold text-gray-100">
                Detalles de {getModalData(selectedCard).title}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-400">
                Mes: {canastaDataForDisplay[selectedMonthIndexForDisplay].mes}{" "}
                {canastaDataForDisplay[selectedMonthIndexForDisplay].año}
              </p>
              <p className="text-gray-400">
                Valor: $
                {new Intl.NumberFormat("es-AR").format(
                  getModalData(selectedCard).value
                )}
              </p>
              <p className="text-gray-400">
                Variación Mensual:{" "}
                {getModalData(selectedCard).variacionMensual.toFixed(1)}%
              </p>
              <p className="text-gray-400">
                Variación Anual:{" "}
                {getModalData(selectedCard).variacionAnual.toFixed(1)}%
              </p>
              <p className="text-gray-400">
                Variación Acumulada:{" "}
                {getModalData(selectedCard).variacionAcumulada.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

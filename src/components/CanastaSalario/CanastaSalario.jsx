import React, { useState } from "react";
import {
  TrendingUp,
  ArrowUpRight,
  Percent,
  User,
  Users,
  ExternalLink,
  X,
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
import { usePercentageVariation } from "../../hooks/usePercentageVariation";

export default function CanastaSalario({ data, months }) {
  const [selectedMonth, setSelectedMonth] = useState(
    months[months.length - 1].mes
  );
  const [activeCard, setActiveCard] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("nacional");
  const [selectedType, setSelectedType] = useState("individual");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const currentData = data[selectedRegion][selectedType];
  const selectedMonthIndex = months.findIndex((m) => m.mes === selectedMonth);

  const chartData = months.map((month, index) => {
    // Factor de multiplicación basado en el tipo seleccionado
    const multiplier = selectedType === "familiar" ? 2 : 1;

    return {
      name: month.mes,
      CBA: currentData.basica[index],
      CBT: currentData.total[index],
      SMV: data.smv[index] * multiplier,
      JubConBono: data.jubilaciones.conBono[index] * multiplier,
      JubSinBono: data.jubilaciones.sinBono[index] * multiplier,
    };
  });

  const CustomizedLabel = ({ x, y, value }) => {
    return (
      <text
        x={x}
        y={y}
        dy={-8}
        dx={5}
        fontSize={8}
        className="font-bold"
        textAnchor="middle"
        fill={selectedRegion === "nacional" ? "#ff5733" : "#f6ff00"}
      >
        {`${value}%`}
      </text>
    );
  };

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

  return (
    <section className="bg-gray-900 overflow-hidden">
      <div className="w-[90%] h-[90%] flex flex-col gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-100 flex items-center">
            Canasta <span className="text-orange-custom text-xs mx-1">-</span>{" "}
            SMV <span className="text-orange-custom text-xs mx-1">-</span>{" "}
            Jubilación
          </h1>

          <p className="text-sm text-gray-400">
            Nacional: INDEC | CABA: INDECBA
          </p>
        </div>

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
          <div className="flex gap-2">
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

        <MonthSelector
          months={months}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        <div className="h-[300px] w-full bg-gray-800 rounded-xl p-4">
          <ResponsiveContainer>
            <LineChart
              data={chartData}
              margin={{ top: 0, right: 15, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fill: "#9ca3af", fontSize: 8 }}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 8 }}
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
              <Brush
                dataKey="name"
                height={15}
                stroke={selectedRegion === "nacional" ? "#ff5733" : "#f6ff00"}
                fill="#1f2937"
                travellerWidth={10}
                style={{
                  fontSize: "8px",
                  marginTop: "2px",
                  stroke: selectedRegion === "nacional" ? "#ff5733" : "#f6ff00",
                  fill: selectedRegion === "nacional" ? "#ff5733" : "#f6ff00",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cards container */}
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
                      currentData.basica[selectedMonthIndex]
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
                      currentData.total[selectedMonthIndex]
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
                      data.smv[selectedMonthIndex] *
                        (selectedType === "familiar" ? 2 : 1)
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
                      data.jubilaciones.conBono[selectedMonthIndex] *
                        (selectedType === "familiar" ? 2 : 1)
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
                      data.jubilaciones.sinBono[selectedMonthIndex] *
                        (selectedType === "familiar" ? 2 : 1)
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-4 flex justify-between items-center border-b border-gray-700">
              <h2 className="text-xl font-bold text-gray-100">
                Detalles{" "}
                {/* Puedes personalizar el título según selectedCard */}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              {/* Aquí irá el contenido del modal según selectedCard */}
              <p className="text-gray-400">
                Contenido del modal para la tarjeta {selectedCard + 1}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import React, { useState } from "react";
import { TrendingUp, ArrowUpRight, Percent } from "lucide-react";
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
import { usePercentageVariation } from "../../hooks/usePercentageVariation";

export default function Inflacion({ data, months }) {
  const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1]);
  const [activeCard, setActiveCard] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("nacional");

  const currentData = data[selectedRegion];

  const organizedData = months.map((month, index) => ({
    name: month,
    IPC: Number(currentData[index]) || 0,
  }));

  const selectedData = organizedData.find(
    (item) => item.name === selectedMonth
  );
  const currentIndex = months.indexOf(selectedMonth);

  // Calculate variations
  const calculateAccumulated = () => {
    if (!selectedData) return 0;
    return organizedData
      .slice(0, currentIndex + 1)
      .reduce((acc, curr) => acc + curr.IPC, 0);
  };

  const calculateMoM = () => {
    if (currentIndex <= 0 || !selectedData) return 0;
    const prevMonth = organizedData[currentIndex - 1].IPC;
    return ((selectedData.IPC - prevMonth) / prevMonth) * 100;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 shadow-xl">
          <p className="text-gray-200 text-sm font-medium">
            {payload[0].payload.name}
          </p>
          <p className="text-orange-custom font-bold">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Obtener índices para los diferentes cálculos
  const currentMonthIndex = months.indexOf(selectedMonth);
  const previousMonthIndex = currentMonthIndex - 1;
  const previousYearIndex = currentMonthIndex - 12;

  // Calcular variación intermensual
  const intermensualVariation = usePercentageVariation(
    currentData[currentMonthIndex],
    currentData[previousMonthIndex]
  );

  // Calcular variación interanual
  const interanualVariation = usePercentageVariation(
    currentData[currentMonthIndex],
    currentData[previousYearIndex]
  );

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
        fill="#ff5733"
      >
        {`${value}%`}
      </text>
    );
  };

  // Agregar la función handleScroll
  const handleScroll = (e) => {
    const scrollPosition = e.target.scrollLeft;
    const cardWidth = window.innerWidth * 0.85; // 85vw
    const activeIndex = Math.round(scrollPosition / cardWidth);
    setActiveCard(activeIndex);
  };

  return (
    <section className="min-h-screen bg-gray-900 p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-100">Inflación</h1>
        <p className="text-sm text-gray-400">Nacional: INDEC | CABA: INDECBA</p>
      </div>

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
              ? "bg-orange-custom text-white"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          CABA
        </button>
      </div>

      <MonthSelector
        months={months}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

      <div className="h-[300px] w-full bg-gray-800 rounded-xl p-4">
        <ResponsiveContainer>
          <AreaChart
            data={organizedData}
            margin={{ top: 0, right: 15, left: -30, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIPC" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={{ stroke: "#374151" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="IPC"
              stroke="#ff5733"
              fill="url(#colorIPC)"
              strokeWidth={2}
              label={<CustomizedLabel />}
            />
            <ReferenceLine
              x={selectedMonth}
              stroke="#56595e"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Cards container */}
      <div className="w-full">
        {/* Carousel container */}
        <div
          className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory snap-always md:grid md:grid-cols-3 md:overflow-x-visible scroll-smooth overscroll-contain"
          onScroll={handleScroll}
        >
          {/* Cards - ajustamos las clases de snap */}
          <div className="min-w-[85vw] md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50 snap-center">
            <div className="relative z-10 flex h-full flex-col justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-orange-200">IPC</h3>
                <div className="text-2xl font-bold text-orange-custom">
                  {selectedData ? `${selectedData.IPC.toFixed(1)}%` : "N/A"}
                </div>
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Índice de Precios al Consumidor</span>
              </div>
            </div>
          </div>

          <div className="min-w-[85vw] md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50 snap-center">
            <div className="relative z-10 flex h-full flex-col justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-red-200">
                  Variación Acumulada
                </h3>
                <div className="text-2xl font-bold text-red-400">
                  {`${calculateAccumulated().toFixed(1)}%`}
                </div>
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4" />
                <span>Total acumulado en el período</span>
              </div>
            </div>
          </div>

          <div className="min-w-[85vw] md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50 snap-center">
            <div className="relative z-10 flex h-full flex-col justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-yellow-200">
                  Variación Intermensual
                </h3>
                <div className="text-2xl font-bold text-yellow-400">
                  {currentIndex > 0
                    ? `${(
                        selectedData.IPC - organizedData[currentIndex - 1].IPC
                      ).toFixed(1)} pp.`
                    : "N/A"}
                </div>
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-2">
                <Percent className="w-4 h-4" />
                <span>Cambio respecto al mes anterior</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicators */}
        <div className="flex gap-1 justify-center mt-2 md:hidden">
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
    </section>
  );
}

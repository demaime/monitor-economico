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
import CustomizedLabel from "./CustomizedLabel";
import CustomTooltip from "./CustomTooltip";

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

  const calculateAccumulated = () => {
    if (!selectedData) return 0;
    return organizedData
      .slice(0, currentIndex + 1)
      .reduce((acc, curr) => acc + curr.IPC, 0);
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
          <h1 className="text-2xl font-bold text-gray-100">Inflación</h1>

          <p className="text-sm text-gray-400">
            Nacional: INDEC | CABA: INDECBA
          </p>
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
                ? "bg-yellow-custom text-gray-800"
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
              <Tooltip
                content={<CustomTooltip selectedRegion={selectedRegion} />}
              />
              <Area
                type="monotone"
                dataKey="IPC"
                stroke={selectedRegion === "nacional" ? "#ff5733" : "#f6ff00"}
                fill="url(#colorIPC)"
                strokeWidth={2}
                label={<CustomizedLabel selectedRegion={selectedRegion} />}
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
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cards container */}
        <div className="flex-1 flex flex-col">
          {/* Carousel container */}
          <div
            className="flex gap-4 overflow-x-auto md:grid md:grid-cols-3 snap-x snap-mandatory scroll-smooth"
            onScroll={handleScroll}
          >
            {/* Card 1 - IPC */}
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
                    {selectedData ? `${selectedData.IPC.toFixed(1)}%` : "N/A"}
                  </div>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Índice de Precios al Consumidor</span>
                </div>
              </div>
            </div>

            {/* Card 2 - Variación Acumulada */}
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
                    {`${calculateAccumulated().toFixed(1)}%`}
                  </div>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Total acumulado en el período</span>
                </div>
              </div>
            </div>

            {/* Card 3 - Diferencia Intermensual */}
            <div className="min-w-[85vw] shrink-0 md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-4 shadow-lg border border-gray-700/50 snap-center">
              <div className="relative z-10 flex h-full flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h3
                    className={`"text-sm font-medium text-orange-200 ${
                      selectedRegion === "nacional"
                        ? "text-orange-200"
                        : "text-yellow-200"
                    }`}
                  >
                    Diferencia Intermensual
                  </h3>
                  <div
                    className={`text-2xl font-bold  ${
                      selectedRegion === "nacional"
                        ? "text-orange-custom"
                        : "text-yellow-custom"
                    }`}
                  >
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
      </div>
    </section>
  );
}

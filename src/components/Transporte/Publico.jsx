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
import { TrendingUp, ArrowUpRight, Percent } from "lucide-react";

export default function Publico({
  data,
  months,
  selectedMonth,
  onMonthChange,
}) {
  const [activeCard, setActiveCard] = useState(0);

  // Calculate variations and create data object
  const transporteData = months.map((month, index) => {
    const subte = data.subte[index];
    const tren = data.tren[index];
    const colectivo = data.colectivo[index];

    // Valores del mes anterior para variación mensual
    const subteAnterior = index > 0 ? data.subte[index - 1] : 0;
    const trenAnterior = index > 0 ? data.tren[index - 1] : 0;
    const colectivoAnterior = index > 0 ? data.colectivo[index - 1] : 0;

    // Valores del año anterior para variación interanual
    const subteAnual = index >= 12 ? data.subte[index - 12] : 0;
    const trenAnual = index >= 12 ? data.tren[index - 12] : 0;
    const colectivoAnual = index >= 12 ? data.colectivo[index - 12] : 0;

    // Encontrar el último valor de diciembre para variación acumulada
    let ultimoDiciembre = {
      subte: 0,
      tren: 0,
      colectivo: 0,
    };

    for (let i = index - 1; i >= 0; i--) {
      if (months[i].mes === "DICIEMBRE") {
        ultimoDiciembre = {
          subte: data.subte[i],
          tren: data.tren[i],
          colectivo: data.colectivo[i],
        };
        break;
      }
    }

    const calcularVariacion = (actual, anterior) =>
      anterior ? ((actual - anterior) / anterior) * 100 : 0;

    return {
      mes: month.mes,
      año: month.año,
      subte,
      tren,
      colectivo,
      // Variaciones mensuales
      variacionMensualSubte: parseFloat(
        calcularVariacion(subte, subteAnterior).toFixed(1)
      ),
      variacionMensualTren: parseFloat(
        calcularVariacion(tren, trenAnterior).toFixed(1)
      ),
      variacionMensualColectivo: parseFloat(
        calcularVariacion(colectivo, colectivoAnterior).toFixed(1)
      ),
      // Variaciones interanuales
      variacionAnualSubte: parseFloat(
        calcularVariacion(subte, subteAnual).toFixed(1)
      ),
      variacionAnualTren: parseFloat(
        calcularVariacion(tren, trenAnual).toFixed(1)
      ),
      variacionAnualColectivo: parseFloat(
        calcularVariacion(colectivo, colectivoAnual).toFixed(1)
      ),
      // Variaciones acumuladas
      variacionAcumuladaSubte: parseFloat(
        calcularVariacion(subte, ultimoDiciembre.subte).toFixed(1)
      ),
      variacionAcumuladaTren: parseFloat(
        calcularVariacion(tren, ultimoDiciembre.tren).toFixed(1)
      ),
      variacionAcumuladaColectivo: parseFloat(
        calcularVariacion(colectivo, ultimoDiciembre.colectivo).toFixed(1)
      ),
    };
  });

  // Ensure to slice the last 12 months for display
  const transporteDataForDisplay = transporteData.slice(-12);
  const selectedMonthData = transporteDataForDisplay.find(
    (m) => m.mes === selectedMonth
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const formatCurrency = (value) => {
        return new Intl.NumberFormat("es-AR").format(value);
      };

      return (
        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 shadow-xl">
          <p className="text-gray-200 text-sm font-medium">
            {payload[0].payload.mes} {payload[0].payload.año}
          </p>
          <p className="text-blue-400 font-bold">
            Subte: ${formatCurrency(payload[0].payload.subte)}
          </p>
          <p className="text-green-400 font-bold">
            Tren: ${formatCurrency(payload[0].payload.tren)}
          </p>
          <p className="text-yellow-400 font-bold">
            Colectivo: ${formatCurrency(payload[0].payload.colectivo)}
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

  return (
    <>
      {/* Gráfico: más alto en mobile */}
      <div className="h-[400px] md:h-[300px] w-full bg-gray-800 rounded-xl p-4">
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
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="subte"
              stroke="#60a5fa"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="tren"
              stroke="#4ade80"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="colectivo"
              stroke="#facc15"
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
              stroke="#60a5fa"
              fill="#1f2937"
              travellerWidth={10}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Cards container: más compacto en mobile */}
      <div className="flex-1 flex flex-col h-[200px] md:h-auto">
        <div
          className="flex gap-4 overflow-x-auto md:grid md:grid-cols-3 snap-x snap-mandatory scroll-smooth"
          onScroll={handleScroll}
        >
          {/* Card 1 - Subte */}
          <div className="min-w-[85vw] shrink-0 md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-2 md:p-4 shadow-lg border border-gray-700/50 snap-center">
            <div className="relative z-10 flex h-full flex-col justify-between gap-2 md:gap-4">
              <div className="space-y-1 md:space-y-2">
                <h3 className="text-sm font-medium text-blue-200">Subte</h3>
                <div className="space-y-2 md:space-y-3">
                  <div>
                    <p className="text-xs text-gray-400">Valor Actual</p>
                    <p className="text-2xl font-bold text-blue-400">
                      $
                      {new Intl.NumberFormat("es-AR").format(
                        selectedMonthData?.subte
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Var. Mensual
                      </span>
                      <span className="text-sm text-blue-400">
                        {selectedMonthData?.variacionMensualSubte}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Var. Interanual
                      </span>
                      <span className="text-sm text-blue-400">
                        {selectedMonthData?.variacionAnualSubte}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Var. Acumulada
                      </span>
                      <span className="text-sm text-blue-400">
                        {selectedMonthData?.variacionAcumuladaSubte}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Tren */}
          <div className="min-w-[85vw] shrink-0 md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-2 md:p-4 shadow-lg border border-gray-700/50 snap-center">
            <div className="relative z-10 flex h-full flex-col justify-between gap-2 md:gap-4">
              <div className="space-y-1 md:space-y-2">
                <h3 className="text-sm font-medium text-green-200">Tren</h3>
                <div className="space-y-2 md:space-y-3">
                  <div>
                    <p className="text-xs text-gray-400">Valor Actual</p>
                    <p className="text-2xl font-bold text-green-400">
                      $
                      {new Intl.NumberFormat("es-AR").format(
                        selectedMonthData?.tren
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Var. Mensual
                      </span>
                      <span className="text-sm text-green-400">
                        {selectedMonthData?.variacionMensualTren}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Var. Interanual
                      </span>
                      <span className="text-sm text-green-400">
                        {selectedMonthData?.variacionAnualTren}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Var. Acumulada
                      </span>
                      <span className="text-sm text-green-400">
                        {selectedMonthData?.variacionAcumuladaTren}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Colectivo */}
          <div className="min-w-[85vw] shrink-0 md:min-w-0 relative overflow-hidden rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 p-2 md:p-4 shadow-lg border border-gray-700/50 snap-center">
            <div className="relative z-10 flex h-full flex-col justify-between gap-2 md:gap-4">
              <div className="space-y-1 md:space-y-2">
                <h3 className="text-sm font-medium text-yellow-200">
                  Colectivo
                </h3>
                <div className="space-y-2 md:space-y-3">
                  <div>
                    <p className="text-xs text-gray-400">Valor Actual</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      $
                      {new Intl.NumberFormat("es-AR").format(
                        selectedMonthData?.colectivo
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Var. Mensual
                      </span>
                      <span className="text-sm text-yellow-400">
                        {selectedMonthData?.variacionMensualColectivo}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Var. Interanual
                      </span>
                      <span className="text-sm text-yellow-400">
                        {selectedMonthData?.variacionAnualColectivo}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Var. Acumulada
                      </span>
                      <span className="text-sm text-yellow-400">
                        {selectedMonthData?.variacionAcumuladaColectivo}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicators */}
        <div className="flex gap-1 justify-center py-1 md:py-2 md:hidden">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                activeCard === index ? "bg-blue-500" : "bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

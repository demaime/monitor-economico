import React, { useState, useEffect } from "react";
import MonthSelector from "../MonthSelector/MonthSelector";
import { Bus, Car, Truck, BarChart3, LineChart } from "lucide-react";
import Publico from "./Publico";
import Particular from "./Particular";

export default function Transporte({ data, months }) {
  const [selectedMonth, setSelectedMonth] = useState(
    months[months.length - 1].mes
  );
  const [selectedType, setSelectedType] = useState("publico");
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

  return (
    <section className="bg-gray-900 overflow-hidden">
      <div className="w-[90%] h-[90%] flex flex-col gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            <Truck className="w-7 h-7" />
            Transporte
          </h1>
          <p className="text-sm text-gray-400">
            Fuente: Ministerio de Transporte
          </p>
        </div>

        {/* Mobile toggle button */}
        {isMobile && (
          <div className="flex justify-center mb-4">
            <div className="flex rounded-lg overflow-hidden border border-gray-700">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-4 py-2 flex items-center gap-2 text-sm ${
                  viewMode === "cards"
                    ? "bg-orange-custom text-white"
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
                    ? "bg-orange-custom text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                <LineChart className="w-4 h-4" />
                Gráfico
              </button>
            </div>
          </div>
        )}

        {/* Desktop controls */}
        {!isMobile && (
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedType("publico")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                selectedType === "publico"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              <Bus size={16} />
              Público
            </button>
            <button
              onClick={() => setSelectedType("particular")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                selectedType === "particular"
                  ? "bg-red-500 text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              <Car size={16} />
              Particular
            </button>
          </div>
        )}

        {/* Mobile transport type selector (when viewing chart) */}
        {isMobile && viewMode === "chart" && (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setSelectedType("publico")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${
                selectedType === "publico"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              <Bus size={14} />
              Público
            </button>
            <button
              onClick={() => setSelectedType("particular")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${
                selectedType === "particular"
                  ? "bg-red-500 text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              <Car size={14} />
              Particular
            </button>
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
            {/* Transport Type Selector */}
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
              <div className="space-y-2">
                <h3 className="text-xs font-medium text-gray-300">
                  Tipo de Transporte
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedType("publico")}
                    className={`px-3 py-2 rounded text-xs flex items-center gap-1 ${
                      selectedType === "publico"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    <Bus size={12} />
                    Público
                  </button>
                  <button
                    onClick={() => setSelectedType("particular")}
                    className={`px-3 py-2 rounded text-xs flex items-center gap-1 ${
                      selectedType === "particular"
                        ? "bg-red-500 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    <Car size={12} />
                    Particular
                  </button>
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

            {/* Transport Data Summary */}
            {selectedType === "publico" ? (
              <Publico
                data={data.publico}
                months={months}
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
                isMobile={true}
                viewMode={viewMode}
              />
            ) : (
              <Particular
                data={data.particular}
                months={months}
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
                isMobile={true}
                viewMode={viewMode}
              />
            )}
          </div>
        )}

        {/* Chart View */}
        {(!isMobile || viewMode === "chart") && (
          <>
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

            {selectedType === "publico" ? (
              <Publico
                data={data.publico}
                months={months}
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
                isMobile={isMobile}
                viewMode={viewMode}
              />
            ) : (
              <Particular
                data={data.particular}
                months={months}
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
                isMobile={isMobile}
                viewMode={viewMode}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}

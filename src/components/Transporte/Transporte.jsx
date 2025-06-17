import React, { useState } from "react";
import MonthSelector from "../MonthSelector/MonthSelector";
import { Bus, Car, Truck } from "lucide-react";
import Publico from "./Publico";
import Particular from "./Particular";

export default function Transporte({ data, months }) {
  const [selectedMonth, setSelectedMonth] = useState(
    months[months.length - 1].mes
  );
  const [selectedType, setSelectedType] = useState("publico");

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

        <MonthSelector
          months={months}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        {selectedType === "publico" ? (
          <Publico
            data={data.publico}
            months={months}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        ) : (
          <Particular
            data={data.particular}
            months={months}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        )}
      </div>
    </section>
  );
}

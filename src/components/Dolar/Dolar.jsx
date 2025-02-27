import React, { useState, useEffect } from "react";
import MonthSelector from "../MonthSelector/MonthSelector";
import { LineChart, Radio, BarChart2, Activity } from "lucide-react";
import axios from "axios";
import DolarEnVivo from "./DolarEnVivo";
import DolarEvolutivo from "./DolarEvolutivo";

export default function Dolar({ months }) {
  const [selectedMonth, setSelectedMonth] = useState(
    months[months.length - 1].mes
  );
  const [activeView, setActiveView] = useState("live");
  const [dolarData, setDolarData] = useState(null);

  useEffect(() => {
    const fetchDolarData = async () => {
      try {
        const response = await axios.get("/api/getDolar");
        setDolarData(response.data);
      } catch (error) {
        console.error("Error fetching dolar data:", error);
      }
    };

    fetchDolarData();

    // Actualizar datos cada 5 minutos si está en la vista "live"
    let interval;
    if (activeView === "live") {
      interval = setInterval(fetchDolarData, 5 * 60 * 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeView]);

  return (
    <section className="bg-gray-900 overflow-hidden">
      <div className="w-[90%] h-[90%] flex flex-col gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-100 flex items-center">
            Dólar
          </h1>

          <p className="text-sm text-gray-400">DolarApi</p>
        </div>

        <div className="flex justify-end">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView("live")}
              className={`px-4 py-2 rounded-lg ${
                activeView === "live"
                  ? "bg-orange-custom text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              <Radio className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveView("evolution")}
              className={`px-4 py-2 rounded-lg ${
                activeView === "evolution"
                  ? "bg-orange-custom text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              <LineChart className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveView("comparative")}
              className={`px-4 py-2 rounded-lg ${
                activeView === "comparative"
                  ? "bg-orange-custom text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              <BarChart2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content container for the different views */}
        <div className="h-full w-full bg-gray-800 rounded-xl p-4 overflow-y-auto">
          {activeView === "live" && <DolarEnVivo dolarData={dolarData} />}
          {activeView === "evolution" && months && (
            <DolarEvolutivo months={months} />
          )}
          {activeView === "comparative" && <div>Comparative View Content</div>}
        </div>
      </div>
    </section>
  );
}

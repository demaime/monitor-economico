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
  const [historicalData, setHistoricalData] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch both live and historical data simultaneously
        const [liveResponse, historicalResponse] = await Promise.all([
          axios.get("/api/getDolar"),
          axios.get("/api/getDolarHistorico"),
        ]);

        setDolarData(liveResponse.data);
        setHistoricalData(historicalResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllData();

    // Update live data every 5 minutes
    const interval = setInterval(() => {
      if (activeView === "live") {
        axios
          .get("/api/getDolar")
          .then((response) => setDolarData(response.data));
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []); // Remove activeView dependency

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
        <div className="h-full w-full rounded-xl p-4 overflow-y-auto">
          {activeView === "live" && <DolarEnVivo dolarData={dolarData} />}
          {activeView === "evolution" && months && (
            <DolarEvolutivo months={months} historicalData={historicalData} />
          )}
          {activeView === "comparative" && <div>Comparative View Content</div>}
        </div>
      </div>
    </section>
  );
}

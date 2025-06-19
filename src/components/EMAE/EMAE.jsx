import React, { useState, useEffect } from "react";
import MonthSelector from "../MonthSelector/MonthSelector";
import { LineChart, BarChart2, Activity } from "lucide-react";
import EmaeEvolutivo from "./EmaeEvolutivo";
import EmaeApertura from "./EmaeApertura";

export default function EMAE() {
  const [activeView, setActiveView] = useState("evolution");
  const [emaeData, setEmaeData] = useState(null);
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configuración de series del EMAE
  const seriesConfig = {
    "143.3_NO_PR_2004_A_21": { name: "ÍNDICE GENERAL", color: "#fef08a" },
    "11.3_IF_2004_M_25": { name: "Subsidios netos", color: "#ff7f0e" },
    "11.3_SEGA_2004_M_48": {
      name: "Inmobiliarias, empresariales y alquiler",
      color: "#2ca02c",
    },
    "11.3_HR_2004_M_24": {
      name: "Servicios sociales (salud)",
      color: "#d62728",
    },
    "11.3_IM_2004_M_25": {
      name: "Intermediación financiera",
      color: "#9467bd",
    },
    "11.3_C_2004_M_60": {
      name: "Administración pública, defensa y seguridad social",
      color: "#8c564b",
    },
    "11.3_ITC_2004_M_21": {
      name: "Electricidad, gas y agua",
      color: "#e377c2",
    },
    "11.3_ISD_2004_M_26": {
      name: "Explotación de minas y canteras",
      color: "#7f7f7f",
    },
    "11.3_AGCS_2004_M_41": {
      name: "Comercio mayorista y minorista y reparaciones",
      color: "#bcbd22",
    },
    "11.3_EMC_2004_M_25": {
      name: "Transporte, almacenamiento y comunicaciones",
      color: "#17becf",
    },
    "11.3_TAC_2004_M_60": { name: "Servicios comunitarios", color: "#ffbb78" },
    "11.3_P_2004_M_20": { name: "Hoteles y restaurantes", color: "#98df8a" },
    "11.3_ISOM_2004_M_39": {
      name: "Agricultura, ganadería, caza y silvicultura",
      color: "#ff9896",
    },
    "11.3_CMMR_2004_M_10": { name: "Enseñanza", color: "#c5b0d5" },
    "11.3_VIPAA_2004_M_5": { name: "Pesca", color: "#c49c94" },
    "11.3_VMASD_2004_M_23": {
      name: "Industria Manufacturera",
      color: "#f7b6d2",
    },
    "11.3_VMATC_2004_M_12": {
      name: "Construcción",
      color: "#72ff3b",
    },
  };

  const fetchDataForSeries = async (id) => {
    const response = await fetch(
      `https://apis.datos.gob.ar/series/api/series/?ids=${id}&limit=5000&format=json`
    );
    if (!response.ok) {
      throw new Error(`Error fetching data for series ${id}`);
    }
    const data = await response.json();
    return data.data;
  };

  const formatDate = (dateString) => {
    const dateParts = dateString.split("-");
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;

    const monthNames = [
      "ENERO",
      "FEBRERO",
      "MARZO",
      "ABRIL",
      "MAYO",
      "JUNIO",
      "JULIO",
      "AGOSTO",
      "SEPTIEMBRE",
      "OCTUBRE",
      "NOVIEMBRE",
      "DICIEMBRE",
    ];

    return {
      mes: monthNames[month],
      año: year,
      date: `${monthNames[month]}-${year.toString().substring(2, 4)}`,
      fullDate: dateString,
    };
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Fetch data for all series
        const dataPromises = Object.keys(seriesConfig).map((id) =>
          fetchDataForSeries(id)
        );
        const allData = await Promise.all(dataPromises);

        // Organize data by series
        const dataObject = Object.keys(seriesConfig).reduce(
          (acc, id, index) => {
            acc[id] = allData[index];
            return acc;
          },
          {}
        );

        // Process data to get the last 24 values and format them
        const generalData = dataObject["143.3_NO_PR_2004_A_21"];
        const last24 = generalData.slice(-24);

        console.log("=== DEBUG EMAE PRINCIPAL ===");
        console.log("Total data points received:", generalData.length);
        console.log("Last 24 raw data:", last24);

        // Create months array from the last 24 values
        const monthsArray = last24.map(([dateString, value], index) => {
          const formatted = formatDate(dateString);
          return {
            id: index,
            mes: formatted.mes,
            año: formatted.año,
            value: Number(value.toFixed(2)),
            fullDate: formatted.fullDate,
            rawValue: value,
            originalIndex: generalData.length - 24 + index,
          };
        });

        console.log("Months array procesado:", monthsArray);

        // Only show the last 12 months for navigation, but keep all 24 for calculations
        const last12ForNavigation = monthsArray.slice(-12);

        console.log(
          "Last 12 for navigation:",
          last12ForNavigation.map((m) => `${m.mes}-${m.año}`)
        );

        // Set the selected month to the ABSOLUTE last one from the full array
        const absoluteLastMonth = monthsArray[monthsArray.length - 1];
        console.log("Absolute last month:", absoluteLastMonth);

        setSelectedMonth(absoluteLastMonth.mes);
        setMonths(last12ForNavigation);
        setEmaeData({ ...dataObject, fullMonthsArray: monthsArray });
        setError(null);
      } catch (error) {
        console.error("Error fetching EMAE data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <section className="bg-gray-900 overflow-hidden">
        <div className="w-[90%] h-[90%] flex items-center justify-center">
          <div className="text-center">
            <Activity className="w-12 h-12 text-orange-500 animate-pulse mx-auto mb-4" />
            <p className="text-gray-400">Cargando datos del EMAE...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-900 overflow-hidden">
        <div className="w-[90%] h-[90%] flex items-center justify-center">
          <div className="text-center">
            <Activity className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-400">Error al cargar datos del EMAE</p>
            <p className="text-gray-500 text-sm mt-2">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-900 overflow-hidden">
      <div className="w-[90%] h-[90%] flex flex-col gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
            <Activity className="w-7 h-7" />
            EMAE
          </h1>
          <p className="text-sm text-gray-400">
            Estimador Mensual de Actividad Económica - INDEC
          </p>
        </div>

        <div className="flex justify-end relative">
          <div className="flex gap-2">
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
              onClick={() => setActiveView("apertura")}
              className={`px-4 py-2 rounded-lg ${
                activeView === "apertura"
                  ? "bg-orange-custom text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              <BarChart2 className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute right-0 -top-8 rounded-lg bg-orange-custom text-white px-2 py-1 text-xs">
            {activeView === "evolution" ? "EVOLUTIVO" : "APERTURA"}
          </div>
        </div>

        <MonthSelector
          months={months}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />

        {/* Content container for the different views */}
        <div className="h-full w-full rounded-xl overflow-y-auto">
          {activeView === "evolution" && (
            <EmaeEvolutivo
              months={months}
              emaeData={emaeData}
              selectedMonth={selectedMonth}
              seriesConfig={seriesConfig}
            />
          )}
          {activeView === "apertura" && (
            <EmaeApertura
              months={months}
              emaeData={emaeData}
              selectedMonth={selectedMonth}
              seriesConfig={seriesConfig}
            />
          )}
        </div>
      </div>
    </section>
  );
}

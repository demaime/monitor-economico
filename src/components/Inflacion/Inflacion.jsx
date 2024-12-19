import React, { useState } from "react";
import SlideHeader from "../SlideHeader";
import MonthSelector from "../MonthSelector";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Brush,
  LabelList,
} from "recharts";

export default function Inflacion({ data, months }) {
  // Estado para manejar el mes seleccionado
  const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1]); // Por defecto el último mes

  // Organizar los datos para el gráfico
  const organizedData = months.map((month, index) => ({
    name: month,
    IPC: Number(data[index]) || 0,
  }));

  // Filtrar los datos específicos del mes seleccionado
  const selectedData = organizedData.find(
    (item) => item.name === selectedMonth
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
        fill="#FFB3B3"
      >
        {`${value} %`}
      </text>
    );
  };

  return (
    <section>
      <SlideHeader
        title={"INFLACIÓN"}
        description={
          <div className="center-flex-col">
            <p>Nacional: INDEC</p>
            <p>CABA: INDECBA</p>
          </div>
        }
      />

      {/* MonthSelector controlado */}
      <MonthSelector
        months={months}
        selectedMonth={selectedMonth} // Pasamos el mes seleccionado
        onMonthChange={setSelectedMonth} // Actualizamos desde aquí
      />

      <div className="w-full h-1/2 center-flex bg-gray-200 center-flex">
        <div className="wh90 rounded bg-gray-700 center-flex shadow shadow-black">
          <ResponsiveContainer width={"95%"} height={"90%"}>
            <AreaChart
              margin={{ top: 0, right: 25, left: -40, bottom: 0 }}
              data={organizedData} // Gráfico con todos los datos
            >
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{
                  fill: "#e5e7eb",
                  fontSize: "8px",
                  fontWeight: "600",
                }}
              />
              <YAxis
                tick={{
                  fill: "#e5e7eb",
                  fontSize: "10px",
                  fontWeight: "600",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111111",
                  border: "none",
                  borderRadius: "15px",
                  color: "white",
                }}
                cursor={false}
              />
              <Area
                type="monotone"
                dataKey="IPC"
                stroke="#FF5733"
                fill="#FFB3B3"
                label={<CustomizedLabel />}
              />
              <Brush
                dataKey="name"
                tickFormatter={() => ""}
                height={15}
                fill="#FFB3B3"
                stroke="#FF5733"
                travellerWidth={20}
                fontSize={2}
                borderRadius={50}
              />
              <LabelList dataKey="IPC" position="top" fill="#FF5733" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="w-full h-1/2 bg-gray-300">
        <div className="w-full h-1/2 flex items-center justify-evenly">
          {/* Mostrar datos del mes seleccionado */}
          <div className="w-[30%] h-3/5 bg-gray-700 rounded flex flex-col justify-evenly shadow shadow-orange-800">
            <div className="w-full h-2/5 mt-1 text-lg text-[#FFB3B3] center-flex text-center">
              IPC
            </div>
            <div className="w-full h-3/5 text-xl font-semibold text-[#FF5733] center-flex">
              {selectedData ? `${selectedData.IPC} %` : "N/A"}
            </div>
          </div>

          <div className="w-[30%] h-3/5 bg-gray-700 rounded flex flex-col justify-evenly shadow shadow-orange-800">
            <div className="w-full h-2/5 mt-1 text-[10px] text-[#FFB3B3] center-flex text-center">
              VARIACIÓN ACUMULADA
            </div>
            <div className="w-full h-3/5 text-xl font-semibold text-[#FF5733] center-flex">
              {/* Ejemplo de cálculo de variación acumulada */}
              {selectedData
                ? `${(selectedData.IPC * 2).toFixed(1)} %` // Aquí pones tu lógica real
                : "N/A"}
            </div>
          </div>

          <div className="w-[30%] h-3/5 bg-gray-700 rounded flex flex-col justify-evenly shadow shadow-orange-800">
            <div className="w-full h-2/5 mt-1 text-[10px] text-[#FFB3B3] center-flex text-center">
              VARIACIÓN INTERMENSUAL
            </div>
            <div className="w-full h-3/5 text-xl font-semibold text-[#FF5733] center-flex">
              {/* Ejemplo de cálculo de variación intermensual */}
              {selectedData
                ? `${(selectedData.IPC * 3).toFixed(1)} %` // Aquí pones tu lógica real
                : "N/A"}
            </div>
          </div>
        </div>
        <div className="w-full h-1/2 bg-gray-200"></div>
      </div>
    </section>
  );
}

import React from "react";
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
} from "recharts";

export default function Inflacion({ data, months }) {
  console.log(data);

  // Crear chartData a partir de los datos proporcionados
  const chartData = months.map((month, index) => ({
    name: month,
    value: Number(data[index]) || 0, // Convertir a número y manejar valores no numéricos
  }));

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
      <MonthSelector months={months} />
      <div className="w-full h-1/2 center-flex bg-gray-200 center-flex">
        <div className="wh90 rounded bg-gray-700 center-flex">
          <ResponsiveContainer width={"90%"} height={"90%"}>
            <AreaChart width={500} height={300} data={chartData}>
              <XAxis
                dataKey="name"
                tick={{
                  fill: "#e5e7eb",
                  fontSize: "10px",
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
              />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
              <Brush height={20} stroke="#555" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="w-full h-1/2 center-flex bg-gray-300 center-flex"></div>
    </section>
  );
}

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
  LabelList,
} from "recharts";

export default function Inflacion({ data, months }) {
  console.log(data);

  // Crear chartData a partir de los datos proporcionados
  const chartData = months.map((month, index) => ({
    name: month,
    IPC: Number(data[index]) || 0, // Convertir a número y manejar valores no numéricos
  }));

  const CustomizedLabel = ({ x, y,  value }) => {
    return (
      <text
        x={x}
        y={y}
        dy={-8}
        dx={5}
        fontSize={10}
        className="font-semibold"
        textAnchor="middle"
        fill="#FFB3B3"
      >
        {`% ${value}`}
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
      <MonthSelector months={months} />
      <div className="w-full h-1/2 center-flex bg-gray-200 center-flex">
        <div className="wh90 rounded bg-gray-700 center-flex">
          <ResponsiveContainer width={"95%"} height={"90%"}>
            <AreaChart
              margin={{ top: 0, right: 25, left: -40, bottom: 0 }}
              data={chartData}
            >
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
              />

              <LabelList dataKey="IPC" position="top" fill="#FF5733" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="w-full h-1/2 center-flex bg-gray-300 center-flex"></div>
    </section>
  );
}

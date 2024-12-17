import React from "react";
import SlideHeader from "../SlideHeader";
import MonthSelector from "../MonthSelector";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Inflacion() {
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
      <MonthSelector months={["ENERO", "FEBRERO"]} />
      <div className="w-full h-1/2 center-flex bg-gray-200 center-flex">
        <div className="wh90 rounded bg-gray-700">
          {/* <ResponsiveContainer width={"90%"} height={"90%"}>
          <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="value" />
            <YAxis dataKey="name" />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart></ResponsiveContainer> */}
        </div>
      </div>
      <div className="w-full h-1/2 center-flex bg-gray-300 center-flex"></div>
    </section>
  );
}

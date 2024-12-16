import React from "react";
import SlideHeader from "../SlideHeader";

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
      <div className="w-full h-1/2 center-flex bg-gray-200 center-flex">
        <div className="wh90 rounded bg-gray-700"></div>
      </div>
      <div className="w-full h-1/2 center-flex bg-gray-300 center-flex"></div>
    </section>
  );
}

import React from "react";
import SlideHeader from "../SlideHeader";
import MonthSelector from "../MonthSelector";

export default function CanastaSalario() {
  return (
    <section>
      <SlideHeader
        title={"CANASTA - SALARIO"}
        description={
          <div className="center-flex-col">
            <p>Nacional: INDEC</p>
            <p>CABA: INDECBA</p>
            <p>SMVM y Jubilación mínima: ANSES</p>
          </div>
        }
      />

      <MonthSelector months={["ABRIL", "MAYO", "JUNIO", "AGOSTO"]} />
      <div className="w-full h-1/2 center-flex bg-gray-200">TODO PIOLI</div>
      <div className="w-full h-1/2 center-flex bg-gray-300">BOINA?</div>
    </section>
  );
}

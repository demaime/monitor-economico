import React, { useState } from "react";
import SlideHeader from "../SlideHeader";
import MonthSelector from "../MonthSelector";

export default function CanastaSalario(data, months) {
  // const [selectedMonth, setSelectedMonth] = useState(months[months.length - 1]); // Por defecto el último mes
  // console.log(data);
  // console.log(months)

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
      {/* <MonthSelector
        months={months}
        selectedMonth={selectedMonth} // Pasamos el mes seleccionado
        onMonthChange={setSelectedMonth} // Actualizamos desde aquí
      />{" "} */}
      <div className="w-full h-1/2 center-flex bg-gray-200">TODO PIOLI</div>
      <div className="w-full h-1/2 center-flex bg-gray-300">BOINA?</div>
    </section>
  );
}

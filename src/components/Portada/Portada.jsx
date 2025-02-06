import React, { useState } from "react";
import Fade, { AttentionSeeker } from "react-awesome-reveal";
import { FaAnglesUp } from "react-icons/fa6";

export default function Portada() {
  const [scrollPosition, setScrollPosition] = useState({
    isAtTop: true,
    isAtBottom: false,
  });

  const handleScroll = (e) => {
    const container = e.target;
    const isAtTop = container.scrollTop === 0;
    const isAtBottom =
      Math.abs(
        container.scrollHeight - container.scrollTop - container.clientHeight
      ) < 1;

    setScrollPosition({ isAtTop, isAtBottom });
  };

  return (
    <section className="bg-gray-900">
      <Fade className="w-full h-[10%]">
        <div className="w-full h-full text-orange-custom font-semibold center-flex-col text-lg font-semibol border-b-2 border-white">
          MONITOR INDICADORES ECONOMICOS
        </div>
      </Fade>
      <div className="w-full h-[90%] text-white center-flex-col">
        <div className="w-full h-[10%] center-flex-col">
          <div className="w-[90%] rounded  h-12 flex justify-between text-xs">
            <div className="w-1/5 center-flex">INDICADOR</div>
            <div className="w-3/5 flex justify-between">
              <div className="pl-2 center-flex">INTERMENSUAL</div>
              <div className="center-flex">INTERANUAL</div>
            </div>
          </div>
        </div>
        <div
          onScroll={handleScroll}
          className="border-y-4 border-[#FF5733] w-[90%] h-[80%] flex flex-col items-center overflow-y-auto [&::-webkit-scrollbar-thumb]:bg-gray-700"
        >
          <div className="w-full min-h-min flex flex-col items-center gap-2 py-2 relative">
            {/* Top gradient */}
            {!scrollPosition.isAtTop && (
              <div
                className="fixed top-0 left-0 w-full h-8 pointer-events-none z-10"
                style={{
                  background:
                    "linear-gradient(to top, transparent, rgb(55 65 81))",
                }}
              />
            )}

            {/* Items */}
            <div className="w-[98%] rounded bg-gray-200 text-gray-800 h-12 flex px-2 mb-2 text-xs justify-between">
              <div className="w-2/5 flex items-center">Canasta básica</div>
              <div className="w-2/5 flex justify-between">
                <div className="center-flex">4.5%</div>
                <div className="center-flex">235%</div>
              </div>
            </div>
            <div className="w-[98%] rounded bg-gray-200 text-gray-800 h-12 flex px-2 mb-2 text-xs justify-between">
              <div className="w-2/5 flex items-center">Ayuda Social</div>
              <div className="w-2/5 flex justify-between">
                <div className="center-flex">4.5%</div>
                <div className="center-flex">235%</div>
              </div>
            </div>
            <div className="w-[98%] rounded bg-gray-200 text-gray-800 h-12 flex px-2 mb-2 text-xs justify-between">
              <div className="w-2/5 flex items-center">Dolar</div>
              <div className="w-2/5 flex justify-between">
                <div className="center-flex">4.5%</div>
                <div className="center-flex">235%</div>
              </div>
            </div>
            <div className="w-[98%] rounded bg-gray-200 text-gray-800 h-12 flex px-2 mb-2 text-xs justify-between">
              <div className="w-2/5 flex items-center">Transporte</div>
              <div className="w-2/5 flex justify-between">
                <div className="center-flex">4.5%</div>
                <div className="center-flex">235%</div>
              </div>
            </div>
            <div className="w-[98%] rounded bg-gray-200 text-gray-800 h-12 flex px-2 mb-2 text-xs justify-between">
              <div className="w-2/5 flex items-center">Alquiler</div>
              <div className="w-2/5 flex justify-between">
                <div className="center-flex">4.5%</div>
                <div className="center-flex">235%</div>
              </div>
            </div>
            <div className="w-[98%] rounded bg-gray-200 text-gray-800 h-12 flex px-2 mb-2 text-xs justify-between">
              <div className="w-2/5 flex items-center">Servicios</div>
              <div className="w-2/5 flex justify-between">
                <div className="center-flex">4.5%</div>
                <div className="center-flex">235%</div>
              </div>
            </div>
            <div className="w-[98%] rounded bg-gray-200 text-gray-800 h-12 flex px-2 mb-2 text-xs justify-between">
              <div className="w-2/5 flex items-center">Alimentos</div>
              <div className="w-2/5 flex justify-between">
                <div className="center-flex">4.5%</div>
                <div className="center-flex">235%</div>
              </div>
            </div>
            <div className="w-[98%] rounded bg-gray-200 text-gray-800 h-12 flex px-2 mb-2 text-xs justify-between">
              <div className="w-2/5 flex items-center">Ocio</div>
              <div className="w-2/5 flex justify-between">
                <div className="center-flex">4.5%</div>
                <div className="center-flex">235%</div>
              </div>
            </div>
            <div className="w-[98%] rounded bg-gray-200 text-gray-800 h-12 flex px-2 mb-2 text-xs justify-between">
              <div className="w-2/5 flex items-center">Actividad Económica</div>
              <div className="w-2/5 flex justify-between">
                <div className="center-flex">4.5%</div>
                <div className="center-flex">235%</div>
              </div>
            </div>
            <div className="w-[98%] rounded bg-gray-200 text-gray-800 h-12 flex px-2 mb-2 text-xs justify-between">
              <div className="w-2/5 flex items-center">Capacidad instalada</div>
              <div className="w-2/5 flex justify-between">
                <div className="center-flex">4.5%</div>
                <div className="center-flex">235%</div>
              </div>
            </div>
            <div className="w-[98%] rounded bg-gray-200 text-gray-800 h-12 flex px-2 mb-2 text-xs justify-between">
              <div className="w-2/5 flex items-center">Construcción</div>
              <div className="w-2/5 flex justify-between">
                <div className="center-flex">4.5%</div>
                <div className="center-flex">235%</div>
              </div>
            </div>

            {/* Bottom gradient */}
            {!scrollPosition.isAtBottom && (
              <div
                className="sticky bottom-0 left-0 w-full h-8 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, rgb(55 65 81))",
                }}
              />
            )}
          </div>
        </div>
        <div className="w-full h-[10%] flex items-end justify-center">
          <FaAnglesUp className="h-8 w-32 animate-bounce duration-500 text-orange-custom" />
        </div>
      </div>
    </section>
  );
}

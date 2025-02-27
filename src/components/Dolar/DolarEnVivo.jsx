import React from "react";
import { format } from "date-fns";

const DOLAR_TYPES = {
  oficial: {
    name: "Dólar Oficial",
    color: "bg-green-100 border-green-200",
    textColor: "text-green-800",
  },
  blue: {
    name: "Dólar Blue",
    color: "bg-blue-100 border-blue-200",
    textColor: "text-blue-800",
  },
  mep: {
    name: "Dólar MEP",
    color: "bg-pink-100 border-pink-200",
    textColor: "text-pink-800",
  },
  ccl: {
    name: "Dólar CCL",
    color: "bg-purple-100 border-purple-200",
    textColor: "text-purple-800",
  },
  cripto: {
    name: "Dólar Cripto",
    color: "bg-yellow-100 border-yellow-200",
    textColor: "text-yellow-800",
  },
  mayorista: {
    name: "Dólar Mayorista",
    color: "bg-orange-100 border-orange-200",
    textColor: "text-orange-800",
  },
};

export default function DolarEnVivo({ dolarData }) {
  if (!dolarData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-custom"></div>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-xl overflow-y-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-full">
        {Object.entries(dolarData).map(([type, data]) => {
          if (data.error) return null;

          const dolarInfo = DOLAR_TYPES[type];
          const updateTime = new Date(data.fecha);

          return (
            <div
              key={type}
              className={`${dolarInfo.color} border rounded-xl p-4 transition-transform hover:scale-105 w-full h-full`}
            >
              <div className="flex flex-col h-full">
                <h3
                  className={`${dolarInfo.textColor} text-lg font-semibold mb-2`}
                >
                  {dolarInfo.name}
                </h3>

                <div className="flex justify-between items-center mb-4">
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm">Compra</p>
                    <p className={`${dolarInfo.textColor} text-xl font-bold`}>
                      ${data.compra.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500 text-sm">Venta</p>
                    <p className={`${dolarInfo.textColor} text-xl font-bold`}>
                      ${data.venta.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-auto">
                  <p className="text-gray-500 text-xs">
                    Actualizado: {format(updateTime, "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

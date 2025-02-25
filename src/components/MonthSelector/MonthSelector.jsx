import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MonthSelector({
  months,
  selectedMonth,
  onMonthChange,
}) {
  // Asumimos que months es un array de objetos { id, mes, año }
  const monthNames = months.slice(-12).map((m) => m.mes);
  const currentIndex = monthNames.indexOf(selectedMonth);

  const handlePrevMonth = () => {
    if (currentIndex > 0) {
      console.log("Prev - Current Index:", currentIndex);
      console.log("Prev - Moving to:", monthNames[currentIndex - 1]);
      onMonthChange(monthNames[currentIndex - 1]);
    }
  };

  const handleNextMonth = () => {
    console.log("Next - Current Index:", currentIndex);
    console.log("Next - Total months:", monthNames.length);
    console.log("Next - Current month:", monthNames[currentIndex]);
    console.log("Next - Next month would be:", monthNames[currentIndex + 1]);

    if (currentIndex < monthNames.length - 1) {
      onMonthChange(monthNames[currentIndex + 1]);
    }
  };

  return (
    <div className="w-full px-4 py-2 bg-gray-800 flex items-center justify-between rounded-xl">
      <button
        onClick={handlePrevMonth}
        disabled={currentIndex === 0}
        className="p-2 rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex-1 text-center">
        <span className="text-lg font-semibold text-gray-200">
          {selectedMonth}
        </span>
      </div>

      <button
        onClick={handleNextMonth}
        disabled={currentIndex >= monthNames.length - 1}
        className="p-2 rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

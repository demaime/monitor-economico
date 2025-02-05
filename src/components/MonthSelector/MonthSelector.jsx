import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MonthSelector({
  months,
  selectedMonth,
  onMonthChange,
}) {
  const currentIndex = months.indexOf(selectedMonth);

  const handlePrevMonth = () => {
    if (currentIndex > 0) {
      onMonthChange(months[currentIndex - 1]);
    }
  };

  const handleNextMonth = () => {
    if (currentIndex < months.length - 1) {
      onMonthChange(months[currentIndex + 1]);
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
        disabled={currentIndex === months.length - 1}
        className="p-2 rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

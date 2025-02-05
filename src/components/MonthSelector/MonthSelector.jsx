import React from "react";
import PropTypes from "prop-types";
import {
  FaRegArrowAltCircleRight,
  FaRegArrowAltCircleLeft,
} from "react-icons/fa";

function MonthSelector({ months, selectedMonth, onMonthChange }) {
  const currentMonthIndex = months.indexOf(selectedMonth);

  const handlePreviousMonth = () => {
    const previousIndex =
      currentMonthIndex === 0 ? months.length - 1 : currentMonthIndex - 1;
    onMonthChange(months[previousIndex]); // Notificar al padre
  };

  const handleNextMonth = () => {
    const nextIndex =
      currentMonthIndex === months.length - 1 ? 0 : currentMonthIndex + 1;
    onMonthChange(months[nextIndex]); // Notificar al padre
  };

  return (
    <div className="w-full bg-gray-800 text-white h-12 flex items-center justify-between px-4 rounded-lg">
      <FaRegArrowAltCircleLeft onClick={handlePreviousMonth} />
      <span>{selectedMonth}</span>
      <FaRegArrowAltCircleRight onClick={handleNextMonth} />
    </div>
  );
}

MonthSelector.propTypes = {
  months: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedMonth: PropTypes.string.isRequired, // Mes actual
  onMonthChange: PropTypes.func.isRequired, // Función para actualizar el mes
};

export default MonthSelector;
  
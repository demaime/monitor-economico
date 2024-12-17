import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  FaRegArrowAltCircleRight,
  FaRegArrowAltCircleLeft,
} from "react-icons/fa";


function MonthSelector({ months }) {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  const handlePreviousMonth = () => {
    setCurrentMonthIndex((prevIndex) =>
      prevIndex === 0 ? months.length - 1 : prevIndex - 1
    );
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prevIndex) =>
      prevIndex === months.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="w-full bg-gray-800 text-white h-12 flex items-center justify-between px-2">
      <FaRegArrowAltCircleLeft onClick={handlePreviousMonth} />
      <span>{months[currentMonthIndex]}</span>
      <FaRegArrowAltCircleRight onClick={handleNextMonth} />
    </div>
  );
}

MonthSelector.propTypes = {
  months: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default MonthSelector;

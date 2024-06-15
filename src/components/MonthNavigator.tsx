"use client";
import { useState } from "react";
import dayjs from "dayjs";

const MonthNavigator = () => {
  const [date, setDate] = useState(dayjs());

  const handleNextMonth = () => {
    setDate(date.add(1, "month"));
  };

  const handlePreviousMonth = () => {
    setDate(date.subtract(1, "month"));
  };

  return (
    <div className="flex">
      <button onClick={handlePreviousMonth} className="px-2">
        {" "}
        {"<"}
      </button>
      <h2>{date.format("MMMM YYYY")}</h2>

      <button onClick={handleNextMonth} className="px-2">
        {">"}
      </button>
    </div>
  );
};

export default MonthNavigator;

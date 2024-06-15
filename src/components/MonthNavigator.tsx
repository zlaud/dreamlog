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
    <div>
      <h2>{date.format("MMMM YYYY")}</h2>
      <button onClick={handlePreviousMonth}>Previous</button>
      <button onClick={handleNextMonth}>Next</button>
    </div>
  );
};

export default MonthNavigator;

// "use client";
// import { useState } from "react";
// import dayjs from "dayjs";
//
// const MonthNavigator = () => {
//   const [date, setDate] = useState(dayjs());
//
//   const handleNextMonth = () => {
//     setDate(date.add(1, "month"));
//   };
//
//   const handlePreviousMonth = () => {
//     setDate(date.subtract(1, "month"));
//   };
//
//   return (
//     <div className="flex">
//       <button onClick={handlePreviousMonth} className="px-2">
//         {" "}
//         {"<"}
//       </button>
//       <h2>{date.format("MMMM YYYY")}</h2>
//
//       <button onClick={handleNextMonth} className="px-2">
//         {">"}
//       </button>
//     </div>
//   );
// };
//
// export default MonthNavigator;
"use client";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

interface MonthNavigatorProps {
    onMonthChange: (date: Dayjs) => void;
}

const MonthNavigator: React.FC<MonthNavigatorProps> = ({ onMonthChange }) => {
    const [date, setDate] = useState(dayjs());

    const handleNextMonth = () => {
        const newDate = date.add(1, "month");
        setDate(newDate);
        onMonthChange(newDate);
    };

    const handlePreviousMonth = () => {
        const newDate = date.subtract(1, "month");
        setDate(newDate);
        onMonthChange(newDate);
    };

    return (
        <div className="flex items-center justify-center space-x-4">
            <button onClick={handlePreviousMonth} className="px-2">
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

import React from "react";
import { Calendar } from "antd";
import moment from "moment";
import "./calendar.css";

const PMCalendar = () => {
  const pmDates = [3, 7, 8, 9, 15, 21, 25];
  const dateCellRender = (value) => {
    const cln =
      value.month() === moment().date() ? "active-date" : "disabled-date";
    return pmDates.includes(value.date()) ? (
      <div className={`cell maintenance-date ${cln}`}>{value.date()}</div>
    ) : (
      <div className={`cell ${cln}`}>{value.date()}</div>
    );
  };
  return (
    <Calendar
      fullscreen={false}
      headerRender={({ value }) => {
        return (
          <div className="p-2 mb-3 bg-dark">
            <div className="font-weight-bold text-white">
              PM Calendar - {value.format("MMMM YYYY")}
            </div>
          </div>
        );
      }}
      dateFullCellRender={dateCellRender}
      style={{
        height: "100%",
        border: "1px solid var(--dark)",
        boxShadow:
          "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
      }}
    />
  );
};

export default PMCalendar;

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { DatePicker } from "antd";
import "../style.css";
import moment from "moment";

const dateFormat = "MM/DD/YYYY";

const DataPeriodCard = () => {
  const [dateRange, setDateRange] = useState([moment("01/01/2021", dateFormat), moment("01/10/2021", dateFormat)]);

  const onPickDates = (dates) => {
    setDateRange(dates);
  };

  return (
    <Card
      className="d-flex flex-row mt-4 pl-2"
      style={{ backgroundColor: "#3a4354" }}
    >
      <CardBody className="text-white">
        <CardTitle className="text-white">
          <i className="fa fa-calendar-o mr-2" />
          DATA PERIOD
        </CardTitle>
        <DatePicker.RangePicker
          format={dateFormat}
          className="text-white font-weight-bold"
          value={dateRange}
          onChange={onPickDates}
          style={{ backgroundColor: "#3a4354" }}
        />
      </CardBody>
      <div
        className="d-flex justify-content-center align-items-center text-white"
        style={{ backgroundColor: "#4a5364", width: 60 }}
      >
        <i className="fa fa-calendar-check-o fa-2x" />
      </div>
    </Card>
  );
};

export default DataPeriodCard;

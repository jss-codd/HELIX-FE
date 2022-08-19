import React, { useState, useEffect } from "react";
import moment from "moment";
import { Table } from "antd";

const dateFormat = "MM/DD/YYYY";

const AirQualityTable = ({
  loading,
  data,
  dateRange,
  filter,
  selectedFilter,
}) => {
  const filteredData = data
    .filter(
      (item) =>
        moment(item.date, dateFormat) >= moment(dateRange[0], dateFormat) &&
        moment(item.date, dateFormat) <= moment(dateRange[1], dateFormat)
    )
    .filter((item) =>
      filter in item && selectedFilter !== "All"
        ? item[filter] === selectedFilter
        : true
    );

  const columns = [
    {
      title: <div className="font-weight-bold font-size-small">Site</div>,
      dataIndex: "site",
      className: "font-weight-normal table-column-no-padding font-size-small",
    },
    {
      title: <div className="font-weight-bold font-size-small">Space/Floor</div>,
      dataIndex: "space_or_floor",
      className: "font-weight-normal table-column-no-padding font-size-small",
    },
    {
      title: <div className="font-weight-bold font-size-small">Device</div>,
      dataIndex: "device",
      className: "font-weight-normal table-column-no-padding font-size-small",
    },
    {
      title: (
        <div className="font-weight-bold font-size-small">Temperature (C)</div>
      ),
      dataIndex: "temperature",
      className: "font-weight-normal table-column-no-padding font-size-small",
    },
    {
      title: <div className="font-weight-bold font-size-small">IAQ</div>,
      render: (_, record) =>
        record.temperature < 45 ? (
          <div className="text-success">
            <i className="fa fa-smile-o font-size-18" />
            <br />
            Good (45)
          </div>
        ) : (
          <div className="text-danger">
            <i className="fa fa-frown-o font-size-18" />
            <br />
            Bad (45)
          </div>
        ),
      className: "font-weight-normal table-column-no-padding text-center font-size-small",
    },
    {
      title: <div className="font-weight-bold font-size-small">PM 2.5 (PPM)</div>,
      render: (_, record) =>
        record.pm25 < 10 ? (
          <div className="text-success">
            <i className="fa fa-smile-o font-size-18" /> <br />
            Good (10)
          </div>
        ) : (
          <div className="text-danger">
            <i className="fa fa-frown-o font-size-18" />
            <br />
            Bad (10)
          </div>
        ),
      className: "font-weight-normal table-column-no-padding text-center font-size-small",
    },
  ];

  return (
    <Table
      className="mt-2 no-border header-divided"
      dataSource={filteredData}
      loading={loading}
      rowKey="id"
      columns={columns}
      pagination={false}
      scroll={{ y: 90 }}
    />
  );
};

export default AirQualityTable;

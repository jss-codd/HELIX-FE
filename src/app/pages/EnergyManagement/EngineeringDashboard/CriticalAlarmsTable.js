import React, { useState, useEffect } from "react";
import moment from "moment";
import { Table } from "antd";

const dateFormat = "MM/DD/YYYY";

const CriticalAlarmTable = ({
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
      title: <div className="font-weight-bold font-size-small">Equipment</div>,
      dataIndex: "equipment",
      className: "font-weight-normal table-column-no-padding font-size-small",
    },
    {
      title: (
        <div className="font-weight-bold font-size-small text-normal">
          Time Elapsed
        </div>
      ),
      dataIndex: "time_elapsed",
      className:
        "font-weight-normal table-column-no-padding font-size-small text-danger",
    },
    {
      title: <div className="font-weight-bold font-size-small">Condition</div>,
      dataIndex: "condition",
      className: "font-weight-normal table-column-no-padding font-size-small",
    },
    {
      title: (
        <div className="font-weight-bold font-size-small text-normal">Risk</div>
      ),
      dataIndex: "risk",
      className:
        "font-weight-normal table-column-no-padding font-size-small text-danger",
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
      scroll={{ y: 800 }}
    />
  );
};

export default CriticalAlarmTable;

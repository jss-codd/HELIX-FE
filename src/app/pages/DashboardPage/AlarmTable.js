import React, { useState, useEffect } from "react";
import moment from "moment";
import { Table } from "antd";

const dateFormat = "MM/DD/YYYY";

const data = [
  {
    id: 1,
    description: "Fuel Sensor Fault Alarm",
    count: 20,
  },
  {
    id: 2,
    description: "Fuel Siphon Alarm",
    count: 23,
  },
  {
    id: 3,
    description: "DC Surge Alarm",
    count: 30,
  },
  {
    id: 4,
    description: "Generator in Manual Mode Alarm",
    count: 40,
  },
  {
    id: 5,
    description: "Generator Phase Fault Alarm",
    count: 21,
  },
  {
    id: 6,
    description: "Generator High Temperature Alarm",
    count: 1,
  },
  {
    id: 7,
    description: "Generator Phase Fault Alarm",
    count: 20,
  },
  {
    id: 8,
    description: "Generator Phase Fault Alarm",
    count: 20,
  },
];

const CriticalAlarmTable = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const columns = [
    {
      title: <div className="font-weight-bold">ALARM DESCRIPTION</div>,
      dataIndex: "description",
      className: "font-weight-normal table-column",
    },
    {
      title: <div className="font-weight-bold">ALARM COUNT</div>,
      dataIndex: "count",
      className: "font-weight-normal table-column",
    },
  ];

  return (
    <Table
      bordered
      dataSource={data}
      rowKey="id"
      rowSelection={{
        selectedRowKeys: selectedRows,
        onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys),
      }}
      columns={columns}
      pagination={false}
      className="mt-4 thin-scrollbar"
      scroll={{ y: 500 }}
    />
  );
};

export default CriticalAlarmTable;

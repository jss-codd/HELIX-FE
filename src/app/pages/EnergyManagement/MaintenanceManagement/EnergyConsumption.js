import React from "react";
import { Card, Table } from "antd";
import moment from "moment";

const EnergyConsumption = ({ data }) => {
  const columns = [
    {
      title: <div className="font-weight-bold">Equipment No.</div>,
      dataIndex: "equipmentNumber",
      className: "font-weight-normal",
    },
    {
      title: <div className="font-weight-bold">Date</div>,
      render: (_, record) => moment(record.date).format("DD/MM/YYYY HH:mm:ss"),
      className: "font-weight-normal",
    },
    {
      title: <div className="font-weight-bold">Value</div>,
      dataIndex: "value",
      className: "font-weight-normal",
    },
    {
      title: <div className="font-weight-bold">Type</div>,
      dataIndex: "type",
      className: "font-weight-normal",
    },
  ];
  return (
    <Card
      title="Energy Consumption"
      size="small"
      headStyle={{
        backgroundColor: "var(--dark)",
        fontWeight: "bold",
        color: "var(--light)",
      }}
      style={{
        border: "1px solid var(--dark)",
        boxShadow:
          "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
      }}
    >
      <Table
        dataSource={data}
        rowKey="_id"
        columns={columns}
        pagination={false}
        className="mt-2 no-border header-divided"
      />
    </Card>
  );
};

export default EnergyConsumption;

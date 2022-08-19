import React from "react";
import { Card, Table } from "antd";

const WorkOrderReport = ({ data }) => {
  const columns = [
    {
      title: <div className="font-weight-bold">WO No.</div>,
      dataIndex: "number",
      className: "font-weight-normal",
    },
    {
      title: <div className="font-weight-bold">Equipment No.</div>,
      dataIndex: "equipmentNumber",
      className: "font-weight-normal",
    },
    {
      title: <div className="font-weight-bold">Equipment Name</div>,
      dataIndex: "equipmentName",
      className: "font-weight-normal",
    },
    {
      title: <div className="font-weight-bold">Make</div>,
      dataIndex: "make",
      className: "font-weight-normal",
    },
    {
      title: <div className="font-weight-bold">Market</div>,
      dataIndex: "market",
      className: "font-weight-normal",
    },
  ];
  return (
    <Card
      title="Work Order Wise Report"
      size="small"
      headStyle={{
        backgroundColor: "var(--dark)",
        fontWeight: "bold",
        color: "var(--light)",
      }}
      style={{
        border: "1px solid var(--dark)",
        marginTop: 16,
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

export default WorkOrderReport;

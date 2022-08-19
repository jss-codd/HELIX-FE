import React from "react";
import { Card, Table } from "antd";

const PurchaseOrder = ({ data }) => {
  const columns = [
    {
      title: <div className="font-weight-bold">PO No.</div>,
      dataIndex: "number",
      className: "font-weight-normal",
    },
    {
      title: <div className="font-weight-bold">Status</div>,
      dataIndex: "status",
      className: "font-weight-normal",
    },
  ];
  return (
    <Card
      title="Purchase Order"
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

export default PurchaseOrder;

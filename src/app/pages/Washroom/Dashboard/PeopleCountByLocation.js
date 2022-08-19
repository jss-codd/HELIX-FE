import React from "react";
import { Card, Table } from "antd";
import moment from "moment";

const PeopleCountByLocation = ({ data }) => {
  const columns = [
    {
      title: <div className="font-weight-bold">Name</div>,
      className: "font-weight-normal",
      render: (_, record) =>
        `${record?.type?.toUpperCase()}, ${record.floor?.description}, ${
          record.floor?.infrastructure?.name
        }`,
    },
    {
      title: <div className="font-weight-bold">Location</div>,
      render: (_, record) => record.floor?.infrastructure?.location,
      className: "font-weight-normal",
    },
    {
      title: <div className="font-weight-bold">Date Time</div>,
      render: (_, record) =>
        record.time && moment(record.time).format("DD/MM/YYYY hh:mm:ss A"),
      className: "font-weight-normal",
    },
    {
      title: <div className="font-weight-bold">People Count</div>,
      dataIndex: "people_count",
      className: "font-weight-normal",
    },
  ];
  return (
    <Card
      title="Last Hour People Count by Locations"
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
        scroll={{ y: 260 }}
      />
    </Card>
  );
};

export default PeopleCountByLocation;

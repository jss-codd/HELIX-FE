import React, { useState, useEffect } from "react";
import moment from "moment";
import { Table } from "antd";

const dateFormat = "MM/DD/YYYY hh:mm A";

const data = [
  {
    id: 1,
    site_id: 1900,
    site_name: "MSFT-A",
    severity: "Critical",
    alarm: "Fuel Sensor Fault Alarm",
    count: 20,
    start: "08/01/2021 05:00 AM",
    end: "08/01/2021 05:20 AM",
  },
  {
    id: 2,
    alarm: "Fuel Siphon Alarm",
    count: 23,
    site_id: 1901,
    site_name: "MSFT-B",
    severity: "Major",
    start: "08/02/2021 07:00 AM",
    end: "08/02/2021 08:20 AM",
  },
  {
    id: 3,
    alarm: "DC Surge Alarm",
    count: 30,
    site_id: 1902,
    site_name: "MSFT-C",
    severity: "Minor",
    start: "08/02/2021 08:00 AM",
    end: "08/02/2021 10:01 AM",
  },
  {
    id: 4,
    alarm: "Generator in Manual Mode Alarm",
    count: 40,
    site_id: 1903,
    site_name: "MSFT-D",
    severity: "Event",
    start: "08/03/2021 08:00 AM",
    end: "08/03/2021 10:01 AM",
  },
  {
    id: 5,
    alarm: "Generator Phase Fault Alarm",
    count: 21,
    site_id: 1904,
    site_name: "MSFT-E",
    severity: "Critical",
    start: "08/03/2021 08:00 AM",
    end: "08/03/2021 10:01 AM",
  },
  {
    id: 6,
    alarm: "Generator High Temperature Alarm",
    count: 1,
    site_id: 1905,
    site_name: "MSFT-F",
    severity: "Event",
    start: "08/03/2021 08:00 AM",
    end: "08/03/2021 10:01 AM",
  },
  {
    id: 7,
    alarm: "Generator Phase Fault Alarm",
    count: 20,
    site_id: 1906,
    site_name: "MSFT-G",
    severity: "Minor",
    start: "08/03/2021 08:00 AM",
    end: "08/03/2021 10:01 AM",
  },
  {
    id: 8,
    alarm: "Generator Phase Fault Alarm",
    count: 20,
    site_id: 1907,
    site_name: "MSFT-H",
    severity: "Major",
    start: "08/03/2021 08:00 AM",
    end: "08/03/2021 10:01 AM",
  },
];

const COLOR = {
  Critical: "red",
  Major: "orange",
  Minor: "blueviolet",
  Event: "deepskyblue",
};

const AlarmRecordTable = () => {
  const columns = [
    {
      title: (
        <div className="font-weight-bold text-left">
          ALARM RECORDS
          <div className="float-right">
            <i className="fa fa-filter mr-2" />
            SHOW CURRENT ALARM ONLY
          </div>
        </div>
      ),
      className: "font-weight-normal table-column",
      children: [
        {
          title: <div className="font-weight-bold">Site ID</div>,
          dataIndex: "site_id",
          className: "font-weight-normal table-column",
        },
        {
          title: <div className="font-weight-bold">Site Name</div>,
          dataIndex: "site_name",
          className: "font-weight-normal table-column",
        },
        {
          title: <div className="font-weight-bold">Severity</div>,
          render: (_, record) => (
            <div style={{ color: COLOR[record.severity] }}>
              {record.severity}
            </div>
          ),
          className: "font-weight-bold table-column",
        },
        {
          title: <div className="font-weight-bold">Alarms/Events</div>,
          dataIndex: "alarm",
          className: "font-weight-normal table-column",
          // ellipsis: true,
        },
        {
          title: <div className="font-weight-bold">Count</div>,
          dataIndex: "count",
          className: "font-weight-normal table-column",
        },
        {
          title: <div className="font-weight-bold">Start</div>,
          dataIndex: "start",
          className: "font-weight-normal table-column",
        },
        {
          title: <div className="font-weight-bold">End</div>,
          dataIndex: "end",
          className: "font-weight-normal table-column",
        },
        {
          title: <div className="font-weight-bold">Duration</div>,
          render: (_, record) => {
            const startTime = moment(record.start, dateFormat);
            const endTime = moment(record.end, dateFormat);
            const hrs = moment.utc(endTime.diff(startTime)).format("HH");
            const min = moment.utc(endTime.diff(startTime)).format("mm");
            return `${hrs}:${min}`;
          },
          className: "font-weight-normal table-column",
        },
      ],
    },
  ];

  return (
    <Table
      bordered
      dataSource={data}
      rowKey="id"
      columns={columns}
      pagination={false}
      className="mt-4 thin-scrollbar"
      scroll={{ y: 560 }}
    />
  );
};

export default AlarmRecordTable;

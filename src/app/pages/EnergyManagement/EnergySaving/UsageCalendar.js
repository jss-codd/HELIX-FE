import React, { useState } from "react";
import { Card, Tabs } from "antd";
import moment from "moment";
import FanImage from "@images/fan.png";
import SwitchImage from "@images/light_switch.png";
import PlugImage from "@images/plug_and_socket.png";
import ServerImage from "@images/server.png";
import BoltImage from "@images/bolt_arrow.png";

const { TabPane } = Tabs;

const Usage = ({ time }) => {
  let timeString = "";
  const now = moment();
  switch (time) {
    case "NOW":
      timeString = `${now.format("h:mm A")}`;
      break;
    case "HOUR":
      const oClock = now.clone().minute(0).second(0);
      timeString = `${oClock.format("h:mm A")} - ${now.format("h:mm A")}`;
      break;
    case "TODAY":
      timeString = `12:00 AM - ${now.format("h:mm A")}`;
      break;
    case "MONTH":
      const startOfMonth = moment().date(1).hour(1);
      timeString = `${startOfMonth.format("DD/MM/YYYY")} - ${now.format(
        "DD/MM/YYYY"
      )}`;
      break;
    case "YEAR":
      const startOfYear = moment().month(0).date(1).hour(1);
      timeString = `${startOfYear.format("DD/MM/YYYY")} - ${now.format(
        "DD/MM/YYYY"
      )}`;
      break;
    default:
      break;
  }

  return (
    <div
      style={{
        color: "var(--dark)",
        border: "1px solid var(--dark)",
        padding: "8px 8px",
      }}
    >
      Electricity End Use Breakdown
      <div className="d-inline float-right font-size-11">{timeString}</div>
      <div className="d-flex justify-content-between mt-2">
        <div
          style={{ background: "white", borderRadius: 4, textAlign: "center" }}
        >
          <img alt="fan-icon" src={FanImage} width={60} height={80} />
          <div style={{ width: 60, background: "#f5b536", color: "white" }}>
            HVAC
          </div>
        </div>
        <div
          style={{
            background: "rgb(84,181,141, 0.4)",
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <img alt="fan-icon" src={SwitchImage} width={60} height={80} />
          <div style={{ width: 60, background: "#54b58d", color: "white" }}>
            LIGHTS
          </div>
        </div>
        <div
          style={{
            background: "rgb(57,111,190, 0.4)",
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <img alt="fan-icon" src={PlugImage} width={60} height={80} />
          <div
            style={{ width: 60, background: "rgb(57,111,190)", color: "white" }}
          >
            PLUGS
          </div>
        </div>
        <div
          style={{
            background: "rgb(22,166,197, 0.2)",
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <img alt="fan-icon" src={ServerImage} width={60} height={80} />
          <div
            style={{
              width: 60,
              background: "rgb(22,166,197, 0.6)",
              color: "white",
            }}
          >
            SERVER
          </div>
        </div>
        <div
          style={{
            background: "rgb(216, 78, 89, 0.4)",
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <img alt="fan-icon" src={BoltImage} width={60} height={80} />
          <div style={{ width: 60, background: "#d84e59", color: "white" }}>
            OTHERS
          </div>
        </div>
      </div>
    </div>
  );
};
const UsageCalendar = () => {
  const [activeTab, setActiveTab] = useState("NOW");
  const onTabChange = (key) => setActiveTab(key);
  return (
    <Card
      title="Usage Calendar"
      size="small"
      headStyle={{
        backgroundColor: "var(--dark)",
        fontWeight: "bold",
        color: "var(--light)",
      }}
      style={{
        border: "1px solid var(--dark)",
        backgroundImage: "linear-gradient(var(--light), rgb(161, 203, 255))",
        boxShadow:
          "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
      }}
      className="mt-4 pb-2"
    >
      <div className="card-container">
        <Tabs
          onChange={onTabChange}
          tabPosition="bottom"
          type="card"
          activeKey={activeTab}
          tabBarGutter={0}
        >
          <TabPane tab="NOW" key="NOW">
            <Usage time="NOW" />
          </TabPane>
          <TabPane tab="HOUR" key="HOUR">
            <Usage time="HOUR" />
          </TabPane>
          <TabPane tab="TODAY" key="TODAY">
            <Usage time="TODAY" />
          </TabPane>
          <TabPane tab="MONTH" key="MONTH">
            <Usage time="MONTH" />
          </TabPane>
          <TabPane tab="YEAR" key="YEAR">
            <Usage time="YEAR" />
          </TabPane>
        </Tabs>
      </div>
    </Card>
  );
};

export default UsageCalendar;

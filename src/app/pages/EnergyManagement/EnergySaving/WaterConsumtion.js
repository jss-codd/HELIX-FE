import React from "react";
import { Card } from "antd";
import GaugeImage from "@images/linear_gauge.jpg";

const EnergyConsumption = () => {
  return (
    <Card
      title="Water Consumption"
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
      className="mt-4"
    >
      <div className="row">
        <div
          className="col col-md-4 text-center"
          style={{ color: "var(--dark)" }}
        >
          <img alt="water-consumption" src={GaugeImage} height={150} />
          <div>Water Consumption</div>
          <div className="text-light bg-dark font-size-14">645 Ltrs</div>
        </div>
        <div
          className="col col-md-4 text-center"
          style={{ color: "var(--dark)" }}
        >
          <img alt="rain-harvest" src={GaugeImage} height={150} />
          <div>Rain Water Harvesting</div>
          <div className="text-light bg-dark font-size-14">145 Ltrs</div>
        </div>
        <div
          className="col col-md-4 text-center"
          style={{ color: "var(--dark)" }}
        >
          <img alt="total-wastage" src={GaugeImage} height={150} />
          <div>Total Water Wastage</div>
          <div className="text-light bg-dark font-size-14">25 Ltrs</div>
        </div>
      </div>
    </Card>
  );
};

export default EnergyConsumption;

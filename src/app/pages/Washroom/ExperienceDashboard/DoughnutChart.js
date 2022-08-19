import React, { useState, useEffect } from "react";
import HalfDonutChart from "@app/core/components/HalfDonutChart/index";
import "../../EnergyManagement/dashboard.scss";

const DoughnutChart = ({
  id,
  title,
  value,
  maxValue,
  labels = [
    { range: [0, 0.5], label: "Low", color: "green" },
    { range: [0.5, 1], label: "High", color: "red" },
  ],
  formater,
}) => {
  const percentage = value / maxValue;
  const label = labels.find(
    (lb) => lb.range[0] <= percentage && lb.range[1] >= percentage
  );
  return (
    <div>
      {title}
      <HalfDonutChart
        animDelay={0}
        percent={percentage}
        arcsLength={[percentage, 1 - percentage]}
        colors={["#1497ea", "#cdcdcd"]}
        textColor="#3a4354"
        arcPadding={0}
        cornerRadius={0}
        id={id}
        arcWidth={0.3}
        formatTextValue={formater ? formater : (vl) => value}
      />
      <div style={{ color: label ? label.color : "red" }}>{label?.label}</div>
    </div>
  );
};

export default DoughnutChart;

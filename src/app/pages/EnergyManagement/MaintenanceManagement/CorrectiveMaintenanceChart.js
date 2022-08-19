import React from "react";
import { Card } from "antd";
import { Doughnut } from "react-chartjs-2";

const CorrectiveMaintenanceChart = ({ data }) => {
  const chartData = {
    labels: data?.corrective_maintenance.labels || [],
    datasets: [
      {
        data: data?.corrective_maintenance.data || [],
        backgroundColor: ["#396fbe", "#1a577b", "#2bc3e9"],
        borderColor: ["#396fbe", "#1a577b", "#2bc3e9"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    legend: {
      position: "top",
    },
    cutout: "75%",
    radius: 120,
  };

  return (
    <Card
      title="Corrective Maintenance"
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
      <div>
        <Doughnut data={chartData} options={options} height={260} />
      </div>
    </Card>
  );
};

export default CorrectiveMaintenanceChart;

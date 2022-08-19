import React from "react";
import { Card } from "antd";
import { Bar } from "react-chartjs-2";

const COLORS = ["#396fbe", "#1a577b", "#2bc3e9"];
const PreventiveMaintenanceChart = ({ data }) => {
  const chartData = {
    labels: ["Preventive Maintenance"],
    datasets: data?.preventive_maintenance.data.map((d, index) => ({
      label: data?.preventive_maintenance.labels[index],
      data: [d],
      backgroundColor: COLORS[index],
      borderColor: COLORS[index],
      borderWidth: 1,
    })),
  };

  const options = {
    legend: {
      position: "top",
    },
    scales: {
      xAxes: [
        {
          display: false,
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
  return (
    <Card
      title="Preventive Maintenance"
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
      <Bar data={chartData} options={options} height={260} />
    </Card>
  );
};

export default PreventiveMaintenanceChart;

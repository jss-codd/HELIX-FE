import React from "react";
import { Card } from "antd";
import { Bar } from "react-chartjs-2";

const Top5Location = ({ data }) => {
  const chartData = {
    labels:
      data?.map(
        (item) =>
          `${item?.type?.toUpperCase()}, ${item.floor?.description}, ${
            item.floor?.infrastructure?.name
          }`
      ) || [],
    datasets: [
      {
        label: "People Count",
        data: data?.map((item) => item.people_count) || [],
        borderColor: "rgba(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    legend: {
      position: "bottom",
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          type: "linear",
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    maintainAspectRatio: false,
  };

  return (
    <Card
      title="Top 5 Locations"
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
        <Bar data={chartData} options={options} height={320} />
      </div>
    </Card>
  );
};

export default Top5Location;

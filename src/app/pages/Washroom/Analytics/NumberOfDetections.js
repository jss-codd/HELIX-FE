import React from "react";
import { Card } from "antd";
import { Line } from "react-chartjs-2";

const NumberOfDetections = ({ washroomData }) => {
  const chartData = {
    labels: washroomData?.map((item) => item.ds) || [],
    datasets: [
      {
        type: "line",
        label: "Number of Detections",
        data:
          washroomData?.map((item) => Number(item.occupancylasthour) * 2) || [],
        fill: true,
        borderColor: "rgba(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        radius: 0,
        hitRadius: 2,
      },
    ],
  };

  const options = {
    legend: {
      display: false,
      position: "bottom",
    },
    spanGaps: 1000 * 60 * 60 * 24,
    scales: {
      xAxes: [
        {
          type: "time",
          display: true,
          gridLines: {
            display: false,
          },
          ticks: {
            autoSkip: false,
            maxRotation: 0,
            major: {
              enabled: true,
            },
            // color: function(context) {
            //   return context.tick && context.tick.major ? '#FF0000' : 'rgba(0,0,0,0.1)';
            // },
            font: function (context) {
              if (context.tick && context.tick.major) {
                return {
                  weight: "bold",
                };
              }
            },
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
  };

  return (
    <Card
      title="Number of Detections"
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
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default NumberOfDetections;

import React from "react";
import { Card } from "antd";
import { Line } from "react-chartjs-2";

const AirQualityChart = ({ washroomData }) => {
  const chartData = {
    labels: washroomData?.map((item) => item.ds) || [],
    datasets: [
      {
        type: "line",
        label: "Temperature",
        data: washroomData?.map((item) => Number(item.temperatur)) || [],
        fill: true,
        borderColor: "rgba(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        radius: 0,
        hitRadius: 2,
        yAxisID: "y-1",
      },
      {
        type: "line",
        label: "humidity",
        data: washroomData?.map((item) => Number(item.humidit)) || [],
        fill: true,
        borderColor: "rgba(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        radius: 0,
        hitRadius: 2,
        yAxisID: "y-2",
      },
      {
        type: "line",
        label: "Pressure",
        data: washroomData?.map((item) => Number(item.pressur)) || [],
        fill: true,
        borderColor: "rgba(255, 206, 86)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderWidth: 2,
        radius: 0,
        hitRadius: 2,
        yAxisID: "y-3",
      },
    ],
  };

  const options = {
    legend: {
      position: "bottom",
    },
    spanGaps: 1000 * 60 * 60 * 24,
    scales: {
      xAxes: [
        {
          type: "time",
          display: true,
          title: {
            display: true,
            text: "Date",
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
          display: true,
          position: "left",
          id: "y-1",
          scaleLabel: {
            display: true,
            labelString: "Temperature",
          },
        },
        {
          type: "linear",
          ticks: {
            beginAtZero: true,
          },
          display: true,
          position: "left",
          id: "y-2",
          gridLines: {
            drawOnArea: false,
          },
          scaleLabel: {
            display: true,
            labelString: "Humidity",
          },
        },
        {
          type: "linear",
          ticks: {
            beginAtZero: true,
          },
          display: true,
          position: "right",
          id: "y-3",
          gridLines: {
            drawOnArea: false,
          },
          scaleLabel: {
            display: true,
            labelString: "Pressure",
          },
        },
      ],
    },
  };

  return (
    <Card
      title="Air Quality"
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

export default AirQualityChart;

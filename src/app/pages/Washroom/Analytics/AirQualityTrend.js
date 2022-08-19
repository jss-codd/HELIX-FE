import React from "react";
import { Card } from "antd";
import { Line } from "react-chartjs-2";

const threshold = 200;

const PeopleCountTrend = ({ washroomData, trendData }) => {
  const chartData = {
    labels: trendData?.map((item) => item.ds) || [],
    datasets: [
      {
        type: "scatter",
        label: "Actuals",
        data:
          washroomData?.map((item) => ({
            x: item.ds,
            y: Number(item.iaq) < threshold ? Number(item.iaq) : NaN,
          })) || [],
        backgroundColor: "#3a4354",
      },
      {
        type: "scatter",
        label: "W/O generated",
        data:
          washroomData?.map((item) => ({
            x: item.ds,
            y: Number(item.iaq) >= threshold ? Number(item.iaq) : NaN,
          })) || [],
        backgroundColor: "rgba(255, 0, 0, 1)",
      },
      {
        type: "line",
        label: "Threshold",
        data:
          trendData?.map((item) => ({
            x: item.ds,
            y: threshold,
          })) || [],
        fill: false,
        borderColor: "rgba(255, 99, 132)",
        borderWidth: 3,
        radius: 0,
      },
      {
        type: "line",
        label: "Predicts",
        data:
          trendData?.map((item) => ({
            x: item.ds,
            y: Number(item.yhat) < threshold ? Number(item.yhat) : NaN,
          })) || [],
        // fill: false,
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 2,
        radius: 0,
      },
      {
        type: "scatter",
        label: "W/O predicted",
        data:
          trendData?.map((item) => ({
            x: item.ds,
            y: Number(item.yhat) >= threshold ? Number(item.yhat) : NaN,
          })) || [],
        fill: false,
        borderColor: "#a52a2a",
        backgroundColor: "#a52a2a",
        borderWidth: 2,
        radius: 2,
      },
      {
        type: "line",
        label: "Predicts Lower",
        data:
          trendData?.map((item) => ({
            x: item.ds,
            y: item.yhat_lower,
          })) || [],
        fill: "+1",
        pointHitRadius: 0,
        backgroundColor: "rgb(54, 162, 235, 0.5)",
        borderWidth: 0,
        radius: 0,
      },
      {
        type: "line",
        label: "Predicts Upper",
        data:
          trendData?.map((item) => ({
            x: item.ds,
            y: item.yhat_upper,
          })) || [],
        fill: false,
        pointHitRadius: 0,
        backgroundColor: "rgb(54, 162, 235, 0.5)",
        borderWidth: 0,
        radius: 0,
      },
    ],
  };

  const options = {
    legend: {
      display: false,
      position: "top",
      labels: {
        filter: function (item, chart) {
          return item.datasetIndex <= 1;
        },
      },
    },
    // spanGaps: 1000 * 60 * 60 * 24,
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
    },
  };

  return (
    <Card
      title="Air Quality Trend"
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

export default PeopleCountTrend;

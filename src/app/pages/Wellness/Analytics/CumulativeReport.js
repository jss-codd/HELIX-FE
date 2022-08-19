import React from "react";
import { Card } from "antd";
import { Line } from "react-chartjs-2";

const PeopleCountTrend = ({ washroomData }) => {
  const chartData = {
    labels: washroomData?.map((item) => item.ds) || [],
    datasets: [
      {
        type: "line",
        label: "People Count",
        data: washroomData?.map((item) => Number(item.occupancylasthour)) || [],
        fill: false,
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 2,
        radius: 0,
        yAxisID: "y-1",
      },
      {
        type: "line",
        label: "Odour",
        data: washroomData?.map((item) => Number(item.staticIaqValue)) || [],
        fill: false,
        borderColor: "rgba(255, 99, 132)",
        borderWidth: 2,
        radius: 0,
        yAxisID: "y-2",
      },
      {
        type: "line",
        label: "CO2",
        data: washroomData?.map((item) => Number(item.co2Value)) || [],
        fill: false,
        borderColor: "rgba(255, 206, 86)",
        borderWidth: 2,
        radius: 0,
        yAxisID: "y-3",
      },
      {
        type: "line",
        label: "VOC",
        data: washroomData?.map((item) => Number(item.voc)) || [],
        fill: false,
        borderColor: "rgba(75, 192, 192)",
        borderWidth: 2,
        radius: 0,
        yAxisID: "y-4",
      },
      {
        type: "line",
        label: "Air Quality",
        data: washroomData?.map((item) => Number(item.iaq)) || [],
        fill: false,
        borderColor: "rgba(153, 102, 255)",
        borderWidth: 2,
        radius: 0,
        yAxisID: "y-5",
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
            labelString: "People Count",
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
            labelString: "Odour",
          },
        },
        {
          type: "linear",
          ticks: {
            beginAtZero: true,
          },
          display: true,
          position: "left",
          id: "y-3",
          gridLines: {
            drawOnArea: false,
          },
          scaleLabel: {
            display: true,
            labelString: "CO2",
          },
        },
        {
          type: "linear",
          ticks: {
            beginAtZero: true,
          },
          display: true,
          position: "right",
          id: "y-4",
          gridLines: {
            drawOnArea: false,
          },
          scaleLabel: {
            display: true,
            labelString: "VOC",
          },
        },
        {
          type: "linear",
          ticks: {
            beginAtZero: true,
          },
          display: true,
          position: "right",
          id: "y-5",
          gridLines: {
            drawOnArea: false,
          },
          scaleLabel: {
            display: true,
            labelString: "Air Quality",
          },
        },
      ],
    },
  };

  return (
    <Card
      title="Cumulative Report"
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

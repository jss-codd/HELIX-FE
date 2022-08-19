import React, { useState, useEffect } from "react";
import apiClient from "@app/util/axios";
import { Line } from "react-chartjs-2";
import { Card, CardBody, CardTitle } from "reactstrap";
import { Card as AntCard } from "antd";
// import { Line } from "@reactchartjs/react-chart.js";

const StatisticCard = ({ title, goal, data }) => {
  const options = {
    legend: { display: false },
    scales: {
      xAxes: [
        {
          display: false,
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          display: false,
          gridLines: {
            display: false,
          },
        },
      ],
    },
  };

  const chartData = {
    labels: data,
    datasets: [
      {
        data,
        fill: true,
        backgroundColor:
          goal >= data[data.length - 1]
            ? "rgb(19, 201, 100, 0.2)"
            : "rgb(220, 53, 69, 0.2)",
        pointRadius: 0,
      },
    ],
  };

  return (
    <AntCard
      title={title}
      size="small"
      headStyle={{
        backgroundColor: "var(--dark)",
        fontWeight: "bold",
        color: "var(--light)",
      }}
      style={{
        marginTop: 16,
        border: "1px solid var(--dark)",
        boxShadow:
          "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
      }}
    >
      {goal >= data[data.length - 1] ? (
        <>
          <div className="d-flex align-items-center text-success px-2">
            <span className="font-weight-bold font-size-36">
              {data[data.length - 1]}
            </span>
            <i className="fa fa-check" />
          </div>
          <p className="font-weight-normal px-2">
            Goal: {goal} (
            {goal - data[data.length - 1] >= 0
              ? `+${goal - data[data.length - 1]}`
              : goal - data[data.length - 1]}
            )
          </p>
        </>
      ) : (
        <>
          <div className="d-flex align-items-center text-danger px-2">
            <span className="font-weight-bold font-size-36">
              {data[data.length - 1]}
            </span>
            <i className="fa fa-exclamation" />
          </div>
          <p className="font-weight-normal px-2">
            Goal: {goal} (
            {goal - data[data.length - 1] >= 0
              ? `+${goal - data[data.length - 1]}`
              : goal - data[data.length - 1]}
            )
          </p>
        </>
      )}
      <div className="card-chart-containter">
        <Line data={chartData} options={options} height={100} />
      </div>
    </AntCard>
  );
};

export default StatisticCard;

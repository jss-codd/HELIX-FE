import React, { useState, useEffect } from "react";
import apiClient from "@app/util/axios";
import { Line } from "react-chartjs-2";
// import { Line } from "@reactchartjs/react-chart.js";
import { Spin } from "antd";

const PowerChart = () => {
  const [powerData, setPowerData] = useState({});
  const [loading, setLoading] = useState(true);

  const options = {
    legend: { display: false },
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
          gridLines: {
            display: false,
          },
        },
      ],
    },
  };

  useEffect(() => {
    apiClient
      .get("/powers")
      .then((response) => {
        if (response) {
          const consumtionData = response.data.map((d) => d.consumption);
          const threshold = new Array(consumtionData.length).fill(400);
          setPowerData({
            labels: response.data.map((d) => d.month),
            datasets: [
              {
                label: "Power",
                data: consumtionData,
                fill: false,
                backgroundColor: "rgb(0, 170, 255)",
                borderColor: "rgba(0, 170, 255, 0.8)",
              },
              {
                label: "threshold",
                data: threshold,
                fill: false,
                borderColor: "#3a4354",
                pointRadius: 0,
                borderDash: [5, 5],
              },
            ],
          });
        }
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="mt-3 px-2">
      {loading ? (
        <Spin />
      ) : (
        <Line data={powerData} options={options} height={60} />
      )}
    </div>
  );
};

export default PowerChart;

import React from "react";
import { Card } from "antd";
import { Line } from "react-chartjs-2";
import BuildingImage from "@images/energy-building.png";
import PerformanceImage from "@images/performance.png";

function getRandomElements(arr, n) {
  let result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    let x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

const data = {
  labels: [...Array(50).keys()].map((i) => i.toString()),
  datasets: [
    {
      label: "Energy Consumption",
      data: getRandomElements([...Array(200).keys()], 50),
      fill: false,
      pointRadius: 0,
      backgroundColor: "rgb(22,166,197, 0.8)",
      borderColor: "rgb(22,166,197, 0.4)",
    },
  ],
};

const options = {
  legend: {
    display: false,
  },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const EnergyConsumption = () => {
  return (
    <Card
      title="Energy Consumption"
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
      <div className="row">
        <div className="col col-md-8">
          <Line data={data} options={options} />
        </div>
        <div className="col col-md-4 pl-0">
          <div
            className="border"
            style={{
              backgroundImage: "linear-gradient(var(--light), rgb(161, 203, 255))",
              minHeight: 72,
            }}
          >
            <div className="px-2 py-2 d-flex justify-content-center align-items-center">
              <img alt="energy-building" src={BuildingImage} height={25} />
              <div
                className="text-center"
                style={{
                  fontSize: "0.85em",
                  color: "var(--dark)",
                  marginLeft: "auto",
                }}
              >
                Total Energy
                <div>{(2459688).toLocaleString()}</div>
                KWh
              </div>
            </div>
          </div>
          <div
            className="border mt-3"
            style={{
              backgroundImage: "linear-gradient(var(--light), rgb(161, 203, 255))",
              minHeight: 72,
            }}
          >
            <div className="px-2 py-2 d-flex justify-content-center align-items-center">
              <img alt="energy-building" src={PerformanceImage} height={25} />
              <div
                className="text-center"
                style={{
                  fontSize: "0.85em",
                  color: "var(--dark)",
                  marginLeft: "auto",
                  height: "auto",
                }}
              >
                Performance Now
                <div style={{ fontSize: "1.25em" }}>
                  7
                  <i className="fa fa-caret-up text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EnergyConsumption;

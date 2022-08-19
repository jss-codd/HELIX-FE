import React from "react";
import { Pie } from "react-chartjs-2";

const SavingsCard = ({ data }) => {
  const chartData = {
    labels: ["Utility", "DG", "Solar"],
    datasets: [
      {
        data: [35.36, 52.14, 11.3],
        backgroundColor: ["#396fbe", "#1a577b", "#2bc3e9"],
        borderColor: ["#396fbe", "#1a577b", "#2bc3e9"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    legend: {
      position: "bottom",
    },
    responsive: true,
    aspectRatio: 1,
  };
  return (
    <div className="mt-3 d-flex align-items-center justify-content-center h-100 p-4">
      <Pie data={chartData} options={options} height={300} />
    </div>
  );
};

export default SavingsCard;

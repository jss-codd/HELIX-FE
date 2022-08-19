import React from "react";
import { Card } from "antd";

const StatisticCard = ({ img, title, value, bottomText, className = "" }) => {
  return (
    <Card
      title={title}
      size="small"
      headStyle={{
        backgroundColor: "var(--dark)",
        fontSize: "1em",
        fontWeight: "bold",
        color: "var(--light)",
        textAlign: "center",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      }}
      style={{
        border: "1px solid var(--dark)",
        textAlign: "center",
        marginTop: 16,
        borderRadius: 8,
        backgroundImage: "linear-gradient(to right, var(--light), rgb(161, 203, 255))",
        boxShadow:
          "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
      }}
      className={className}
    >
      <div className="d-flex justify-content-center align-items-center px-3">
        <img alt="light-buld" src={img} height={50} />
        <div
          style={{
            fontSize: "1.5em",
            color: "rgb(57,111,190)",
            marginLeft: 24,
          }}
        >
          {value}
        </div>
      </div>
      {bottomText}
    </Card>
  );
};

export default StatisticCard;

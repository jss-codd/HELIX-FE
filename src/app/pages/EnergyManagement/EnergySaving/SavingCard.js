import React from "react";
import { Card } from "antd";
import FactoryImage from "@images/factory.png";
import LightBulb from "@images/light_bulb.png";
import Co2Icon from "@images/co2.png";
import MoneyIcon from "@images/money.png";
import ForestIcon from "@images/forest.png";
import StatisticCard from "@app/core/components/StatisticCard";
import SavingChart from "./SavingChart";

const SavingsCard = ({ data }) => {
  return (
    <Card
      title="Energy Saving"
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
        <div className="col col-md-4">
          <div className="cloud ml-auto mr-auto">
            <img src={FactoryImage} alt="factory-img" width="25%" />
            <div className="text-white text-center ml-2">
              Kwh/Sqm/Annum
              <div>
                <strong>4.568</strong>
              </div>
            </div>
          </div>
          <StatisticCard
            title="% Energy Saved"
            value="26.52%"
            img={LightBulb}
            bottomText="TARGET: BELOW 245KG"
          />
          <StatisticCard
            title="Co2 Saved"
            value="33%"
            img={Co2Icon}
            bottomText="TARGET: BELOW 245KG"
          />
          <StatisticCard
            title="Doller Saved"
            value="Rs.3647"
            img={MoneyIcon}
            bottomText="TARGET: BELOW 245KG"
          />
          <StatisticCard
            title="Acers for Forest"
            value="4.23"
            img={ForestIcon}
            bottomText="TARGET: BELOW 245KG"
            className="mb-3"
          />
        </div>
        <div className="col col-md-8">
          <SavingChart />
        </div>
      </div>
    </Card>
  );
};

export default SavingsCard;

import React from "react";
import "./style.scss";

const BorderLeftCard = ({ title, value }) => {
  return (
    <div className="card-raised py-2 h-100 border-left-card bg-dark">
      <div style={{ padding: "1.25rem" }}>
        <div className="row no-gutters align-items-center">
          <div className="col mr-2">
            <div className="font-xsmall font-weight-bold text-light text-uppercase mb-1">
              {title}
            </div>
            <div className="h5 mb-0 font-weight-bold text-light">
              {value}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorderLeftCard;

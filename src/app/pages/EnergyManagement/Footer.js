import React from "react";
import SunIcon from "@images/icons/sun.svg";
import CloudyIcon from "@images/icons/clouds.svg";
import RainIcon from "@images/icons/rainy.svg";
import DropIcon from "@images/icons/drop.svg";
import WindTurbinIcon from "@images/icons/wind-power.svg";
import WindDirectionIcon from "@images/icons/wind-direction.svg";

const Footer = () => {
  return (
    <div className="row px-2 footer">
      <div className="col-md-2 pr-0 col-sm-6 pt-2 col-xs-12 d-inline-flex justify-content-center text-white text-center">
        <img className="footer-img" alt="sun-icon" src={SunIcon} height={36} />
        <div className="d-flex flex-column">
          Temperature
          <div className="font-size-14 font-weight-bold">86 F (30 C)</div>
        </div>
      </div>
      <div className="col-md-2 col-sm-6 pt-2 col-xs-12 pr-0 d-inline-flex justify-content-center text-white text-center border-left">
        <img className="footer-img" alt="cloud-icon" src={CloudyIcon} width={36} height={36} />
        <div className="d-flex flex-column">
          Sky Conditions
          <div className="font-size-14 font-weight-bold">Mostly Cloudy</div>
        </div>
      </div>
      <div className="col-md-2 col-sm-6 pt-2 col-xs-12 pr-0 d-inline-flex justify-content-center text-white text-center border-left">
        <img className="footer-img" alt="rain-icon" src={RainIcon} height={36} />
        <div className="d-flex flex-column">
          Relative Humidity
          <div className="font-size-14 font-weight-bold">79%</div>
        </div>
      </div>
      <div className="col-md-2 col-sm-6 pt-2 col-xs-12 pr-0 d-inline-flex justify-content-center text-white text-center border-left">
        <img className="footer-img" alt="drop-icon" src={DropIcon} height={36} />
        <div className="d-flex flex-column">
          Dew point
          <div className="font-size-14 font-weight-bold">78 F (26 C)</div>
        </div>
      </div>
      <div className="col-md-2 col-sm-6 pt-2 col-xs-12 pr-0 d-inline-flex justify-content-center text-white border-left">
        <img className="footer-img" alt="wind-icon" src={WindTurbinIcon} height={36} />
        <div className="d-flex flex-column font-size-12">
          <div>
            Pressure: <strong>29.68</strong> in .Hg
          </div>
          <div>
            Visibility: <strong>1 mile(s)</strong>
          </div>
        </div>
      </div>
      <div className="col-md-2 col-sm-6 pt-2 col-xs-12 pr-0 d-inline-flex justify-content-center text-white text-center border-left">
        <img className="footer-img" alt="a-icon" src={WindDirectionIcon} height={36} />
        <div className="d-flex flex-column font-size-12">
          <div>Wind Direction</div>
          <strong>from the ESE (120 degrees) at 6MPH (5KT)</strong>
        </div>
      </div>
    </div>
  );
};

export default Footer;

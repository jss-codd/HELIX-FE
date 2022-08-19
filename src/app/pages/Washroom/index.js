import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import useFetch from "@app/util/useFetch";
import Analytics from "./Analytics/index";
import ExperienceDashboard from "./ExperienceDashboard/index";
import Dashboard from "./Dashboard/index";
import NewDashboard from "./NewDashboard/index";

const WashroomDashboard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const getDashboard = (index) => {
    switch (index) {
      case 0:
        return (
          <NewDashboard
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        );
      case 1:
        return (
          <Analytics
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        );
      case 2:
        return (
          <Dashboard
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        );
      case 3:
        return (
          <ExperienceDashboard
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        );
      default:
        return (
          <Analytics
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        );
    }
  };
  return getDashboard(activeIndex);
};

export default WashroomDashboard;

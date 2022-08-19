import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import "./dashboard.scss";
import useFetch from "@app/util/useFetch";
import MaintenanceManagement from "./MaintenanceManagement/index";
import EnergySaving from "./EnergySaving/index";
import ExperienceDashboard from "./EngineeringDashboard";
import Footer from "./Footer";

const Dashboards = () => {
  const { loading, data: sites, fetchData: getSites } = useFetch({
    url: `${process.env.API_URL}/user/sites`,
    method: "GET",
  });

  useEffect(() => {
    getSites();
    // eslint-disable-next-line
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const getDashboard = (index) => {
    switch (index) {
      case 1:
        return (
          <MaintenanceManagement
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            sites={sites}
          />
        );
      case 0:
        return (
          <EnergySaving
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            sites={sites}
          />
        );
      case 2:
        return (
          <ExperienceDashboard
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            sites={sites}
          />
        );
      default:
        return (
          <MaintenanceManagement
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        );
    }
  };
  return loading ? (
    <div style={{ textAlign: "center", marginTop: 96 }}>
      <Spin />
    </div>
  ) : (
    <>
      {getDashboard(activeIndex)}
      <Footer />
    </>
  );
};

export default Dashboards;

import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
import { Divider, Spin, message, Button } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import useFetch from "@app/util/useFetch";
import AnalyticIcon from "@images/icons/analytics.svg";
import BorderLeftSuccessCard from "@app/core/components/BorderLeftSuccessCard";
import BorderLeftInfoCard from "@app/core/components/BorderLeftInfoCard";
import BorderLeftPrimaryCard from "@app/core/components/BorderLeftPrimaryCard";
import BorderLeftWarningCard from "@app/core/components/BorderLeftWarningCard";
import PeopleCountByLocation from "./PeopleCountByLocation";
import Top5Location from "./Top5Location";

const Dashboard = ({ activeIndex, setActiveIndex }) => {
  const {
    loading,
    data: washroomData,
    fetchData: getWashroomStatistic,
  } = useFetch((params) => ({
    url: `${process.env.API_URL}/washrooms/statistic`,
    method: "POST",
    body: JSON.stringify(params),
    onError: (error) => {
      message.error(error);
    },
  }));

  useEffect(() => {
    const now = moment();
    const last_2_hour = now.clone().subtract(2, "hours");
    getWashroomStatistic({
      from: last_2_hour.toISOString(),
      to: now.toISOString(),
    });
  }, []);

  const people_count_all =
    washroomData?.sensorData.reduce(
      (a, b) => a + Number(b.occupancylasthour),
      0
    ) || 0;

  const data = washroomData?.washrooms
    .filter((washroom) => washroom.sensors.length > 0)
    .map((washroom) => {
      const sensor_codes = washroom.sensors.map((s) => s.code);
      const sensor_data_by_washroom = washroomData?.sensorData
        .filter((item) => sensor_codes.includes(item.deviceid))
        .sort((a, b) => {
          if (moment(a.timez) > moment(b.timez)) return 1;
          if (moment(a.timez) < moment(b.timez)) return -1;
          return 0;
        });
      const people_count = sensor_data_by_washroom.reduce(
        (a, b) => a + Number(b.occupancylasthour),
        0
      );
      return {
        ...washroom,
        time: sensor_data_by_washroom[0]?.timez,
        people_count,
      };
    });

  const all_sensors = washroomData?.washrooms.map((wr) => wr.sensors).flat();

  return (
    <div className="p-4" style={{ marginBottom: 150 }}>
      <div className="row position-relative">
        <div className="col-md-6">
          <h2 className="text-mandy font-weight-bold">
            <img
              src={AnalyticIcon}
              width="50"
              height="50"
              className="mr-3"
              style={{ marginTop: -8 }}
            />
            Dashboard
          </h2>
        </div>
        <div
          className="d-flex justify-content-end"
          style={{ position: "absolute", top: 0, right: 16 }}
        >
          <Button
            className="border-0"
            size="large"
            ghost
            icon={<ArrowLeftOutlined style={{ color: "#4e5664" }} />}
            disabled={activeIndex < 1}
            onClick={() => setActiveIndex(activeIndex - 1)}
          />
          <Button
            className="border-0"
            size="large"
            ghost
            icon={<ArrowRightOutlined style={{ color: "#4e5664" }} />}
            disabled={activeIndex > 2}
            onClick={() => setActiveIndex(activeIndex + 1)}
          />
        </div>
      </div>
      <Divider style={{ border: "1px solid #d84e59", marginTop: 0 }} />
      {loading ? (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <Spin />
          <h5>Fetching data from server ...</h5>
        </div>
      ) : (
        <>
          <div className="row mb-3">
            <div className="col-sm-6 col-lg-3 mb-2">
              <BorderLeftPrimaryCard
                title="LAST HOUR PEOPLE DENSITY ACROSS ALL LOCATIONS"
                value={people_count_all}
              />
            </div>
            <div className="col-sm-6 col-lg-3 mb-2">
              <BorderLeftSuccessCard
                title="LAST HOUR NUMBER OF DETECTIONS ACROSS ALL LOCATIONS"
                value={people_count_all * 2}
              />
            </div>
            <div className="col-sm-6 col-lg-3 mb-2">
              <BorderLeftInfoCard
                title="NUMBER OF LOCATIONS"
                value={washroomData?.washrooms.length || 0}
              />
            </div>
            <div className="col-sm-6 col-lg-3 mb-2">
              <BorderLeftWarningCard
                title="NUMBER OF SENSORS"
                value={all_sensors?.length || 0}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-lg-6 mb-2">
              <PeopleCountByLocation data={data} />
            </div>
            <div className="col-lg-6 mb-2">
              <Top5Location data={data} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

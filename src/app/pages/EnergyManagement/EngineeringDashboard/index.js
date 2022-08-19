import React, { useState, useEffect } from "react";
import apiClient from "@app/util/axios";
import { Row, Col, Card, CardBody } from "reactstrap";
import { Button, Select, Divider, Card as AntCard } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import moment from "moment";
import DateSliderWithPicker from "@app/core/components/DateSliderWithPicker";
import "../dashboard.scss";
import FanIcon from "@images/icons/fan2.svg";
import AlarmIcon from "@images/icons/alarm_light.svg";
import PowerConsumtionTable from "./PowerConsumtionTable";
import PowerChart from "./PowerChart";
import AirQualityTable from "./AirQualityTable";
import CriticalAlarmsTable from "./CriticalAlarmsTable";
import CommodityTransactionTable from "./CommodityTransactionTable";
import StatisticCard from "./StatisticCard";

const dateFormat = "MM/DD/YYYY";

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const EngineeringDashboard = ({ activeIndex, setActiveIndex }) => {
  const [airQualityData, setAirQualityData] = useState([]);
  const [powerConsumtions, setPowerConsumtion] = useState([]);
  const [criticalAlarms, setCriticalAlarms] = useState([]);
  const [commodityTransactions, setCommodityTransactions] = useState([]);

  const [dateRange, setDateRange] = useState([]);
  const [filter, setFilter] = useState("site");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/air-quality")
      .then((response) => {
        if (response) {
          setAirQualityData(response.data);
        }
      })
      .catch((err) => console.log(err));
    apiClient
      .get("/power-consumtions")
      .then((response) => {
        if (response) {
          setPowerConsumtion(response.data);
        }
      })
      .catch((err) => console.log(err));
    apiClient
      .get("/critical-alarms")
      .then((response) => {
        if (response) {
          setCriticalAlarms(response.data);
        }
      })
      .catch((err) => console.log(err));
    apiClient
      .get("/commodity-transactions")
      .then((response) => {
        if (response) {
          setCommodityTransactions(response.data);
        }
      })
      .catch((err) => console.log(err));
    setLoading(false);
  }, []);

  const onChangeDateRange = (values) => {
    setDateRange(values);
  };

  const allData = [
    ...airQualityData,
    ...powerConsumtions,
    ...criticalAlarms,
    ...commodityTransactions,
  ].map((a) => a.date);
  const minDate = allData.reduce(
    (a, b) => (moment(a, dateFormat) > moment(b, dateFormat) ? b : a),
    "01/01/2021"
  );

  const maxDate = allData.reduce(
    (a, b) => (moment(a, dateFormat) < moment(b, dateFormat) ? b : a),
    "01/01/2021"
  );

  const options = [
    ...airQualityData,
    ...powerConsumtions,
    ...criticalAlarms,
    ...commodityTransactions,
  ]
    .map((item) => (filter in item ? item[filter] : null))
    .filter((it) => it)
    .filter(onlyUnique);

  return (
    <Card className="mt-2 px-0 pt-0" style={{ marginBottom: 150 }}>
      <CardBody>
        <Row sm="12">
          <Col className="m-2">
            <Row className="position-relative">
              <Col md="6">
                <h2 className="text-mandy font-weight-bold">
                  <i
                    className="fa fa-cogs fa-2x mr-2"
                    style={{ color: "#3a4354" }}
                  />
                  Engineering Dashboard
                </h2>
              </Col>
              <Col md="4">
                <div className="d-flex mt-3">
                  <div className="d-flex flex-column mr-3">
                    <Select
                      options={[{ value: "site", label: "Site" }]}
                      value={filter}
                      onSelect={(value) => setFilter(value)}
                      style={{ minWidth: 100 }}
                    />
                    <Select
                      options={["All", ...options].map((vl) => ({
                        value: vl,
                        label: vl,
                      }))}
                      value={selectedFilter}
                      onSelect={(value) => setSelectedFilter(value)}
                      style={{ minWidth: 100 }}
                    />
                  </div>
                  {!loading && (
                    <DateSliderWithPicker
                      start={minDate}
                      end={maxDate}
                      onChange={onChangeDateRange}
                    />
                  )}
                </div>
              </Col>
              <div
                className="d-flex justify-content-end"
                style={{ position: "absolute", top: 16, right: 16 }}
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
                  disabled={activeIndex > 1}
                  onClick={() => setActiveIndex(activeIndex + 1)}
                />
              </div>
            </Row>
          </Col>
        </Row>
        <Divider style={{ border: "1px solid #d84e59", marginTop: 0 }} />
        <Row sm="12">
          <Col md="6" className="my-2">
            <Row>
              <Col md="12">
                <AntCard
                  title={
                    <div className="text-center">
                      <i className="fa fa-bolt mr-3" />
                      Power Consumption
                    </div>
                  }
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
                  <PowerConsumtionTable
                    loading={loading}
                    data={powerConsumtions}
                    dateRange={dateRange}
                    filter={filter}
                    selectedFilter={selectedFilter}
                  />
                  <PowerChart />
                </AntCard>
              </Col>
              <Col md="12">
                <AntCard
                  title={
                    <div className="text-center">
                      <img
                        src={FanIcon}
                        width="22"
                        height="22"
                        className="text-icon"
                      />
                      Air Quality
                    </div>
                  }
                  size="small"
                  headStyle={{
                    backgroundColor: "var(--dark)",
                    fontWeight: "bold",
                    color: "var(--light)",
                  }}
                  style={{
                    marginTop: 16,
                    border: "1px solid var(--dark)",
                    boxShadow:
                      "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
                  }}
                >
                  <AirQualityTable
                    loading={loading}
                    data={airQualityData}
                    dateRange={dateRange}
                    filter={filter}
                    selectedFilter={selectedFilter}
                  />
                </AntCard>
              </Col>
              <Col sm="6">
                <StatisticCard
                  title="Temperature (C)"
                  goal={27}
                  data={airQualityData.map((d) => d.temperature)}
                />
              </Col>
              <Col sm="6">
                <StatisticCard
                  title="Humidity (%)"
                  goal={10}
                  data={airQualityData.map((d) => d.humidity)}
                />
              </Col>
              <Col sm="6">
                <StatisticCard
                  title="CO2 Level"
                  goal={10}
                  data={airQualityData.map((d) => d.co2)}
                />
              </Col>
              <Col sm="6">
                <StatisticCard
                  title="Luminance"
                  goal={10}
                  data={airQualityData.map((d) => d.luminance)}
                />
              </Col>
            </Row>
          </Col>
          <Col md="6" className="my-2">
            <AntCard
              title={
                <div className="text-center">
                  <img
                    src={AlarmIcon}
                    width="22"
                    height="22"
                    className="text-icon"
                  />
                  Critical Alarms
                </div>
              }
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
              <CriticalAlarmsTable
                loading={loading}
                data={criticalAlarms}
                dateRange={dateRange}
                filter={filter}
                selectedFilter={selectedFilter}
              />
            </AntCard>
          </Col>
        </Row>
        <Row sm="12">
          <Col sm="12">
            <AntCard
              title={
                <div className="text-center">
                  <i className="fa fa-arrows-h mr-3" />
                  Commodity Transaction
                </div>
              }
              size="small"
              headStyle={{
                backgroundColor: "var(--dark)",
                fontWeight: "bold",
                color: "var(--light)",
              }}
              style={{
                marginTop: 16,
                border: "1px solid var(--dark)",
                boxShadow:
                  "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
              }}
            >
              <CommodityTransactionTable
                loading={loading}
                data={commodityTransactions}
                dateRange={dateRange}
                filter={filter}
                selectedFilter={selectedFilter}
              />
            </AntCard>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default EngineeringDashboard;

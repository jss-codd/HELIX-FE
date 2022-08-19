import React from "react";
import { Card, CardHeader } from "reactstrap";
import { Row, Col } from "antd";
import DoughnutChart from "./DoughnutChart";
import "../../EnergyManagement/dashboard.scss";

const MeetingRoom3 = ({data}) => {

  const avgTemperature =
    data.reduce((a, b) => a + b.temperature, 0) / data.length;
  const avgHumid = data.reduce((a, b) => a + b.humidity, 0) / data.length;
  const avgCo2 = data.reduce((a, b) => a + b.co2, 0) / data.length;
  const avgVoc = data.reduce((a, b) => a + b.voc, 0) / data.length;
  const avgPM25 = data.reduce((a, b) => a + b.pm2_5, 0) / data.length;
  const avgPM10 = data.reduce((a, b) => a + b.pm10, 0) / data.length;
  const avgO3 = data.reduce((a, b) => a + b.O3, 0) / data.length;
  return (
    <Card className="border-0">
      <CardHeader className="border-0 statistic-card-header-small">
        Meeting Room 3
      </CardHeader>
      <Row className="my-3 text-center font-size-11">
        <Col xs={8} sm={6} md={{ span: 3, offset: 1 }}>
          <DoughnutChart
            title="Temperature (F)"
            id="meet-3-gauge-chart-2"
            value={avgTemperature.toFixed(2)}
            maxValue={200}
            labels={[
              { range: [0, 0.25], label: "Cold", color: "blue" },
              { range: [0.25, 0.6], label: "Warm", color: "yellow" },
              { range: [0.6, 1], label: "Hot", color: "red" },
            ]}
          />
        </Col>
        <Col xs={8} sm={6} md={3}>
          <DoughnutChart
            title="Humidity %"
            id="meet-3-gauge-chart-3"
            value={avgHumid.toFixed(2)}
            maxValue={100}
            labels={[
              { range: [0, 0.5], label: "Dry", color: "yellow" },
              { range: [0.5, 0.8], label: "Good", color: "green" },
              { range: [0.85, 1], label: "Wet", color: "red" },
            ]}
          />
        </Col>
        <Col xs={8} sm={6} md={3}>
          <DoughnutChart
            title="CO2 (ppm)"
            id="meet-3-gauge-chart-4"
            value={avgCo2.toFixed(2)}
            maxValue={2000}
            formater={(value) => `${(value / 50).toFixed(2)}K`}
          />
        </Col>
        <Col xs={8} sm={6} md={3}>
          <DoughnutChart
            title="VOC (ppb)"
            id="meet-3-gauge-chart-5"
            value={avgVoc.toFixed(2)}
            maxValue={1000}
            labels={[
              { range: [0, 0.5], label: "Good", color: "green" },
              { range: [0.5, 1], label: "Unhealthy", color: "red" },
            ]}
          />
        </Col>
        <Col xs={8} sm={6} md={3}>
          <DoughnutChart
            title="PM2.5 (ug/m3)"
            id="meet-3-gauge-chart-6"
            value={avgPM25.toFixed(2)}
            maxValue={10000}
            labels={[
              { range: [0, 0.5], label: "Good", color: "green" },
              { range: [0.5, 1], label: "Unhealthy", color: "red" },
            ]}
          />
        </Col>
        <Col xs={8} sm={6} md={3}>
          <DoughnutChart
            title="PM10 (ug/m3)"
            id="meet-3-gauge-chart-6"
            value={avgPM10.toFixed(2)}
            maxValue={100}
            labels={[
              { range: [0, 0.5], label: "Good", color: "green" },
              { range: [0.5, 1], label: "Unhealthy", color: "red" },
            ]}
          />
        </Col>
        <Col xs={8} sm={6} md={3}>
          <DoughnutChart
            title="O3 (ppb)"
            id="meet-3-gauge-chart-7"
            value={avgO3.toFixed(2)}
            maxValue={1000}
            labels={[
              { range: [0, 0.5], label: "Good", color: "green" },
              { range: [0.5, 1], label: "Hazardous", color: "red" },
            ]}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default MeetingRoom3;

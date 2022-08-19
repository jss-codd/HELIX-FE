import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import { Breadcrumb, Menu } from "antd";
import "../style.css"

const LocationCard = () => {
  return (
    <Card className="mt-4 pl-2" style={{ backgroundColor: "#3a4354" }}>
      <CardBody className="text-white" style={{ height: 100 }}>
        <CardTitle className="text-white">
          <i className="fa fa-map-marker mr-2" />
          LOCATION
        </CardTitle>
        <Breadcrumb separator={<span className="text-white">&#62;</span>}>
          <Breadcrumb.Item className="text-white font-weight-bold font-size-16">
            G1
          </Breadcrumb.Item>
          <Breadcrumb.Item className="text-white font-weight-bold font-size-16">
            R1
          </Breadcrumb.Item>
          <Breadcrumb.Item className="text-white font-weight-bold font-size-16">
            SR1
          </Breadcrumb.Item>
          <Breadcrumb.Item className="text-white font-weight-bold font-size-16">
            ALL SITES
          </Breadcrumb.Item>
        </Breadcrumb>
      </CardBody>
    </Card>
  );
};

export default LocationCard;

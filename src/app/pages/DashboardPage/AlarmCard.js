import React, { useState, useEffect } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";

const AlarmCard = ({ title, count, color }) => {
  return (
    <Card className="mt-4 pl-2" style={{ backgroundColor: color }}>
      <CardBody className="text-white" style={{ height: 100 }}>
        <CardTitle className="text-white">{title}</CardTitle>
        <div className="text-right font-size-24">{count}</div>
      </CardBody>
    </Card>
  );
};

export default AlarmCard;

import React, { useState, useEffect, useMemo } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "material-ui-core";
import moment from "moment";

function WorkOrderAnalysisTable(props) {
  const { workOrders, yearFilter, header , city , businessPark } = props;

  const WorkOrderData = useMemo(() => {
    return workOrders?.reduce?.(
      (pv, cv) => {
        if (cv.year == yearFilter) {
          pv.totalTickets += cv.workOrdersPerMonth;
          pv.avgResolutionTime += cv["timeAvgResolutionMin)"];
        }
        return pv;
      },
      {
        totalTickets: 0,
        avgResolutionTime: 0,
        csatLevel: 0,
      }
    );
  }, [workOrders, yearFilter]);

  const minutes = parseInt(WorkOrderData?.avgResolutionTime % 60, 10) || 0;
  const hours = parseInt(WorkOrderData?.avgResolutionTime / 60, 10) || 0;
  const newMinutes = minutes > 9 ? minutes : "0" + minutes;
  const newHours = hours > 9 ? hours : "0" + hours;
  const totalTimeinHours = +newHours + +newMinutes / 100;

  return (
    <>
      <div style={{ height: "18%" }} className="box-shadow-right">
        <div
          style={{
            backgroundColor: "#5dbae6",
            color: "#fff",
            textAlign:"center",
            fontSize: "13px",
            borderRadius: "10px 10px 0 0 "

          }}
        >
          <h4 style={{fontWeight: "400"}}>Work Orders Analysis</h4>
        </div>

        <TableContainer className="table-container">
          <Table size="small">
            <TableBody>
              <TableRow style={{ backgroundColor: "#FFFFFF" }}>
                <TableCell align="left" style={{ borderColor: "#FFFFFF" }}>
                  Total Tickets
                </TableCell>
                <TableCell
                  align="right"
                  style={{ fontWeight: "bold", borderColor: "#FFFFFF" }}
                >
                  {WorkOrderData?.totalTickets?.toFixed(0)}
                </TableCell>
              </TableRow>

              <TableRow style={{ backgroundColor: "#FFFFFF" }}>
                <TableCell align="left" style={{ borderColor: "#FFFFFF" }}>
                  Avg Resolution Time(in Hrs)
                </TableCell>
                <TableCell
                  align="right"
                  style={{ fontWeight: "bold", borderColor: "#FFFFFF" }}
                >
                  {totalTimeinHours ? totalTimeinHours : "00.00"} 
                </TableCell>
              </TableRow>

              <TableRow style={{ backgroundColor: "#FFFFFF" }}>
                <TableCell align="left" style={{ borderColor: "#FFFFFF" }}>
                  CSAT Level (%)
                </TableCell>
                <TableCell
                  align="right"
                  style={{ fontWeight: "bold", borderColor: "#FFFFFF" }}
                >
                  {businessPark === "Dellas Center" && city === "Hyderabad" ? "92" : "00"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default WorkOrderAnalysisTable;

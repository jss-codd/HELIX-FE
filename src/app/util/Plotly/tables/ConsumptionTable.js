import React, { useState, useEffect, useMemo } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "material-ui-core";
import moment from "moment";

function ConsumptionTable(props) {
  const { ConsumptionData, yearFilter, header } = props;

  const ConsData =            (() => {
    return ConsumptionData?.reduce?.(
      (pv, cv) => {
        if (cv.year == yearFilter) {
          pv.totalSpend += cv.costPerMonth;
        }

        if (
          cv.year == yearFilter - 1 &&
          new Date().getMonth() + 1 >=
            moment().month(cv.measureMonth).format("M")
        ) {
          pv.lastYearTotal += cv.costPerMonth;
          if (
            new Date().getMonth() + 1 ==
            moment().month(cv.measureMonth).format("M")
          ) {
            pv.sameMonthLY += cv.costPerMonth;
          }
        }
        return pv;
      },
      {
        totalSpend: 0,
        lastYearTotal: 0,
        sameMonthLY: 0,
      }
    );
  }, [ConsumptionData, yearFilter]);

  return (
    <>
      <div style={{ height: "17%" }} className="box-shadow-right">
        <div
          style={{
            backgroundColor: "#5dbae6",
            color: "#fff",
            textAlign: "center",
            fontSize: "13px",
            borderRadius: "10px 10px 0 0 "
          }}
        >
          <h4 style={{ fontWeight: "400" }}>{header}</h4>
        </div>

        <TableContainer className="table-container">
          <Table size="small">
            <TableBody>
              <TableRow style={{ backgroundColor: "#FFFFFF" }}>
                <TableCell align="left" style={{ borderColor: "#FFFFFF" }}>
                  Total spend
                </TableCell>
                <TableCell
                  align="right"
                  style={{ fontWeight: "bold", borderColor: "#FFFFFF" }}
                >
                  {ConsData?.totalSpend
                    ? ConsData?.totalSpend?.toFixed(0)
                    : "0"}
                </TableCell>
              </TableRow>

              <TableRow style={{ backgroundColor: "#FFFFFF" }}>
                <TableCell align="left" style={{ borderColor: "#FFFFFF" }}>
                  YTD Last YR
                </TableCell>
                <TableCell
                  align="right"
                  style={{ fontWeight: "bold", borderColor: "#FFFFFF" }}
                >
                  {ConsData?.lastYearTotal
                    ? ConsData?.lastYearTotal?.toFixed(0)
                    : "0"}
                </TableCell>
              </TableRow>

              <TableRow style={{ backgroundColor: "#FFFFFF" }}>
                <TableCell align="left" style={{ borderColor: "#FFFFFF" }}>
                  Same month LY
                </TableCell>
                <TableCell
                  align="right"
                  style={{ fontWeight: "bold", borderColor: "#FFFFFF" }}
                >
                  {ConsData?.sameMonthLY
                    ? ConsData?.sameMonthLY?.toFixed(0)
                    : "0"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default ConsumptionTable;

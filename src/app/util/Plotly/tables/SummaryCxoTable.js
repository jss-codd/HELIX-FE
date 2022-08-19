import React, { useState, useEffect, useMemo } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "material-ui-core";
import moment from "moment";

function SummaryCxoTable(props) {
  //   const { ConsumptionData, yearFilter, header } = props;
  //   const ConsData = useMemo(() => {
  //     return ConsumptionData?.reduce?.(
  //       (pv, cv) => {
  //         if (cv.year == yearFilter) {
  //           pv.totalSpend += cv.costPerMonth;
  //         }
  //         if (cv.year == yearFilter - 1) {
  //           pv.lastYearTotal += cv.costPerMonth;
  //           if (
  //             new Date().getMonth() + 1 ==
  //             moment().month(cv.measureMonth).format("M")
  //           ) {
  //             pv.sameMonthLY += cv.costPerMonth;
  //           }
  //         }
  //         return pv;
  //       },
  //       {
  //         totalSpend: 0,
  //         lastYearTotal: 0,
  //         sameMonthLY: 0,
  //       }
  //     );
  //   }, [ConsumptionData, yearFilter]);
  const { city, businessPark } = props;
  return (
    <>
      <div
        style={{ height: "26%", backgroundColor: "#1ababd"}}
        className="box-shadow-right"
      >
        <div
          style={{
            backgroundColor: "#1ababd",
            color: "#f2f2f2",
            textAlign: "center",
            fontSize: "13px",
            borderRadius: "10px 10px 0 0 ",
            borderBottom:"2px solid #f2f2f2"


          }}
        >
          <h4 style={{ fontWeight: "800" }}> Summary </h4>
        </div>

        <TableContainer className="table-container" style={{color:"#f2f2f2" }}>
          <Table size="small">
            <TableBody >
              <TableRow style={{ backgroundColor: "#1ababd" , color: "#f2f2f2",}}>
                <TableCell align="left" style={{ borderColor: "#1ababd", color: "#f2f2f2", }}>
                  <span>Power</span>
                </TableCell>
                <TableCell align="right" style={{ borderColor: "#1ababd", color: "#f2f2f2", }}>
                  <b>
                    {businessPark === "Dellas Center" && city === "Hyderabad"
                      ? "25k"
                      : "00"}
                  </b>
                </TableCell>
              </TableRow>

              <TableRow style={{ backgroundColor: "#1ababd" }}>
                <TableCell align="left" style={{ borderColor: "#1ababd", color: "#f2f2f2", }}>
                  <span>Water</span>
                </TableCell>
                <TableCell align="right" style={{ borderColor: "#1ababd", color: "#f2f2f2", }}>
                  <b>
                    {businessPark === "Dellas Center" && city === "Hyderabad"
                      ? "250"
                      : "00"}
                  </b>
                </TableCell>
              </TableRow>

              <TableRow style={{ backgroundColor: "#1ababd" }}>
                <TableCell align="left" style={{ borderColor: "#1ababd", color: "#f2f2f2", }}>
                  <span>Inventory</span>
                </TableCell>
                <TableCell align="right" style={{ borderColor: "#1ababd" , color: "#f2f2f2",}}>
                  <b>
                    {businessPark === "Dellas Center" && city === "Hyderabad"
                      ? "150"
                      : "00"}
                  </b>
                </TableCell>
              </TableRow>
              <TableRow style={{ backgroundColor: "#1ababd" }}>
                <TableCell align="left" style={{ borderColor: "#1ababd", color: "#f2f2f2", }}>
                  <span>Manpower</span>
                </TableCell>
                <TableCell align="right" style={{ borderColor: "#1ababd" , color: "#f2f2f2",}}>
                  <b>
                    {businessPark === "Dellas Center" && city === "Hyderabad"
                      ? "150"
                      : "00"}
                  </b>
                </TableCell>
              </TableRow>
              <TableRow style={{ backgroundColor: "#1ababd" }}>
                <TableCell align="left" style={{ borderColor: "#1ababd", color: "#f2f2f2", }}>
                  <span>Total Spent</span>
                </TableCell>
                <TableCell align="right" style={{ borderColor: "#1ababd", color: "#f2f2f2", }}>
                  <b>
                    {businessPark === "Dellas Center" && city === "Hyderabad"
                      ? "150"
                      : "00"}
                  </b>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default SummaryCxoTable;

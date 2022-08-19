import React, { useState, useEffect, useMemo } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "material-ui-core";
import moment from "moment";
import { BorderBottom } from "@material-ui/icons";

function BrookCxoTable(props) {
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

const {city ,businessPark} = props ;
  return (
    <>
      <div
        style={{ height: "17%" ,backgroundColor: "#fea47d"}}
        className="box-shadow-right"
        
      >
        <div
          style={{
            backgroundColor: "#fea47d",
            color: "#f2f2f2",
            fontSize: "13px",
            textAlign:"center",
            borderRadius: "10px 10px 0 0 ",
           borderBottom:"2px solid #f2f2f2",
           
          }}
        >
          <h4 style={{fontWeight: "800"}}>{businessPark} {city}</h4>
        </div>

        <TableContainer className="table-container">
          <Table size="small">
            <TableBody>
              <TableRow style={{ backgroundColor: "#fea47d" , color: "#f2f2f2", }}>
                <TableCell align="left" style={{ borderColor: "#fea47d" , color: "#f2f2f2", }}>
                  <span>Area (in SQFT)</span>
                </TableCell>
                <TableCell align="right" style={{ borderColor: "#fea47d" , color: "#f2f2f2",}}>
                  <b>{businessPark === "Dellas Center" && city === "Hyderabad" ? "25K" : "00"}</b>
                </TableCell>
              </TableRow>

              <TableRow style={{ backgroundColor: "#fea47d" }}>
                <TableCell align="left" style={{ borderColor: "#fea47d", color: "#f2f2f2", }}>
                  <span>Total Capacity</span>
                </TableCell>
                <TableCell align="right" style={{ borderColor: "#fea47d", color: "#f2f2f2", }}>
                  <b >{businessPark === "Dellas Center" && city === "Hyderabad" ? "250" : "00"}</b>
                </TableCell>
              </TableRow>

              <TableRow style={{ backgroundColor: "#fea47d" }}>
                <TableCell align="left" style={{ borderColor: "#fea47d" , color: "#f2f2f2",}}>
                  <span>Total Occupancy</span>
                </TableCell>
                <TableCell align="right" style={{ borderColor: "#fea47d", color: "#f2f2f2", }}>
                  <b >{businessPark === "Dellas Center" && city === "Hyderabad" ? "150" : "00"}</b>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default BrookCxoTable;

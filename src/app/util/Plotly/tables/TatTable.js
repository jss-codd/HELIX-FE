import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "material-ui-core";
import { groupBy } from "lodash";
import moment from "moment";
import "../App.css";

export default function TatDataTable(props) {
  const { tatTableData } = props;
  const {modalHeight, modalWidth } = props.modalResolution || {};

  const sortedArray = tatTableData?.sort(function (a, b) {
    return new Date(a.date).getMonth() - new Date(b.date).getMonth();
  });
  const groupByDate = groupBy(...sortedArray, "date");
  const groupByData = groupBy(...sortedArray, "equipment");

  return (
    <TableContainer style={{height:modalHeight?"12vh":"14vh"}} component={Paper}>
      <Table className="table-tat" aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style= {{minWidth: "6rem"}} className="table-head" align="center">
              Month Name{" "}
            </TableCell>
            {Object.keys(groupByDate)?.map((key,idx) => {
              return (
                <React.Fragment key={idx}>
                  <TableCell colSpan="3" style= {{minWidth: "300px"}} className="table-head" align="center">
                    {moment(key).format("MMMM")}
                  </TableCell>
                </React.Fragment>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="center">Equipment</TableCell>
            {Object.keys(groupByDate)?.map((dt,idx) => {
              return (
                <React.Fragment key={idx}>
                  <TableCell style= {{minWidth: "150px"}} align="center">Uptime (hrs)(%)</TableCell>
                  <TableCell style= {{minWidth: "150px"}} align="center">Downtime (hrs)(%)</TableCell>
                  <TableCell style= {{minWidth: "150px"}} align="center">Availability (%)</TableCell>
                </React.Fragment>
              );
            })}
          </TableRow>

          {Object.values(groupByData)?.map((eq,idx) => (
            <TableRow key={idx}>
              <TableCell align="center">{eq[0]?.equipment}</TableCell>
              {eq?.map((dt,idx) => (
                <React.Fragment key={idx}>
                  <TableCell className="table-data-cell" align="right">{dt["uptimeHrs)"]}</TableCell>
                  <TableCell className="table-data-cell" align="right">{dt["downtimeHrs)"]}</TableCell>
                  <TableCell className="table-data-cell" align="right">{dt["availability)"]?.toFixed(2)}</TableCell>
                </React.Fragment>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

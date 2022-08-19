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

export default function TeepDataTable(props) {
  const { teepTableData } = props;
  const sortedArray = teepTableData?.sort(function (a, b) {
    return new Date(a.date).getMonth() - new Date(b.date).getMonth();
  });
  const groupByDate = groupBy(...sortedArray, "date");
  const groupByData = groupBy(...sortedArray, "equipment");

  return (
    <>
      {Object.keys(groupByDate)?.length > 0 ? (
        <TableContainer
          style={{ height: "14vh", overflowX: "unset" }}
          component={Paper}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="table-head" align="center">
                  Month Name{" "}
                </TableCell>
                {Object.keys(groupByDate)?.map((key, idx) => {
                  return (
                    <React.Fragment key={key}>
                      <TableCell
                        colSpan="3"
                        style={{ minWidth: "250px" }}
                        className="table-head"
                        align="center"
                      >
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
                {Object.keys(groupByDate)?.map((dt, idx) => {
                  return (
                    <React.Fragment key={idx}>
                      <TableCell align="center">(OEE) (%)</TableCell>
                      <TableCell align="center">(UT) (%)</TableCell>
                      <TableCell align="center">(TEEP) (%)</TableCell>
                    </React.Fragment>
                  );
                })}
              </TableRow>

              {Object.values(groupByData)?.map((eq, idx) => (
                <TableRow key={idx}>
                  <TableCell align="center">{eq[0]?.equipment}</TableCell>
                  {eq?.map((dt, idx) => (
                    <React.Fragment key={idx}>
                      <TableCell className="table-data-cell" align="right">
                        {dt["Oee)"]}
                      </TableCell>
                      <TableCell className="table-data-cell" align="right">
                        {dt["ut)"]}
                      </TableCell>
                      <TableCell className="table-data-cell" align="right">
                        {dt["Teep)"]}
                      </TableCell>
                    </React.Fragment>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div className="dnf">Data Not found</div>
      )}
    </>
  );
}

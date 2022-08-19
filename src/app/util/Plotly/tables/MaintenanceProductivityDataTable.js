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
import moment from "moment";
import "../App.css";

export default function MaintenanceProductivityDataTable(props) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="table-head">Create Date</TableCell>
            <TableCell className="table-head" align="center">
              Id
            </TableCell>
            {/* {/ <TableCell align="right">Age(Hours)</TableCell> /} */}
            <TableCell className="table-head" align="center">
              Status
            </TableCell>
            <TableCell className="table-head" align="center">
              Type
            </TableCell>
            <TableCell className="table-head" align="center">
              Asset Name
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { props.jsonData.map((row,idx) => (
              <TableRow key={idx}>
                <TableCell component="th" scope="row">
                  {moment(row.createdDate).format("DD/MM/YYYY hh:mm:ss A")}
                </TableCell>
                <TableCell align="center">{row.workorderId}</TableCell>
                {/* {/ <TableCell align="right">{row.Age}</TableCell> /} */}
                <TableCell align="center">{row?.status?.replaceAll("_", " ")}</TableCell>
                <TableCell align="center">{row.type}</TableCell>
                <TableCell align="center">{row.assetNumber}</TableCell>
              </TableRow>
            ))}
             {/* <TableRow>
                <TableCell style={{fontWeight: "bolder"}} component="th" scope="row">
                  Total
                </TableCell>
                <TableCell align="center"></TableCell>
                <TableCell style={{fontWeight: "bolder"}} align="center">1234</TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center"></TableCell>
              </TableRow> */}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

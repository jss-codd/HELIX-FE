import React, { useState } from "react";
import { Box, Grid, Button, darken } from "material-ui-core";

export default function OrderStatusTable(props) {
  const [isChecked, setIsChecked] = useState({});

  const handleChecked = (idx, rowData) => {
    setIsChecked((prev) => ({
      ...prev,
      [rowData.status]: !prev[rowData.status],
    }));
  };
  const { Closed, Open, Total, CloseCount, OpenCount } = props.orderCounts;

  // const rows = [
  //   {
  //     status: "Closed",
  //     order: CloseCount,
  //     Collapse: true,
  //     childRow: [{ status: "DONE", order: Closed.DONE }],
  //   },
  //   {
  //     status: "Open",
  //     order: OpenCount,
  //     Collapse: true,
  //     childRow: [
  //       { status: "READY TO MAINTENANCE", order: Open.READY_TO_MAINTENANCE },
  //       { status: "IN PROGRESS", order: Open.IN_PROGRESS },
  //       // {status:"READY",order: Open.READY},
  //     ],
  //   },
  //   { status: "Total", order: Total, Collapse: false },
  // ];
  return (
    <Grid className="box-open-close-container">
      <div className="close-box">
        <div className="close-top-div">{CloseCount}</div>
        <div className="close-bottum">
          Closed
          <div className="circle-close">{CloseCount}</div>
        </div>
      </div>
      <div className="open-box">
        <div className="open-top-div">
          <div style={{ width: "100%" }}>
            <div className="status-div">
              <p style={{ fontSize: "15px", fontWeight: "500" }}>InProgress</p>
              <span style={{ fontSize: "25px" }}>{Open.IN_PROGRESS}</span>
            </div>
            <div className="status-div">
              <p style={{ fontSize: "15px", margin: "0", fontWeight: "500" }}>
                Ready
              </p>
              <span style={{ fontSize: "25px" }}>{Open.READY_TO_MAINTENANCE}</span>
            </div>
          </div>
        </div>
        <div className="open-bottum">
          Open
          <div className="circle-open">{OpenCount}</div>
        </div>
      </div>
    </Grid>
    // <TableContainer component={Paper}>
    //   <Table aria-label="simple table">
    //     <TableHead>
    //       <TableRow>
    //         <TableCell className="table-header">status</TableCell>
    //         <TableCell className="table-header">Orders</TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       {rows.map((row, index) => (
    //         <React.Fragment key={row.status+index}>
    //           <TableRow>
    //             <TableCell
    //               className="table-row-heading"
    //               component="th"
    //               scope="row"
    //             >
    //               <div
    //                 style={{
    //                   display: "flex",
    //                   alignItems: "center",
    //                   paddingLeft: "10px",
    //                 }}
    //               >
    //                 {
    //                   <div
    //                     style={{
    //                       visibility: !row.Collapse ? "hidden" : "visible",
    //                     }}
    //                     className="collapse-Icon"
    //                     onClick={() => handleChecked(index, row)}
    //                   >
    //                     {isChecked[row.status] ? "-" : "+"}
    //                   </div>
    //                 }
    //                 <div>{row.status}</div>
    //               </div>
    //             </TableCell>
    //             <TableCell className="table-row-heading" align="right">
    //               {row.order}
    //             </TableCell>
    //           </TableRow>
    //           {isChecked[row.status] &&
    //             row.childRow.map((dt, index) => (
    //               <TableRow key={dt.status+index}>
    //                 <TableCell
    //                   className="table-row-chiled"
    //                   component="th"
    //                   scope="row"
    //                 >
    //                   {dt.status}
    //                 </TableCell>
    //                 <TableCell align="right">{dt.order}</TableCell>
    //               </TableRow>
    //             ))}
    //         </React.Fragment>
    //       ))}
    //     </TableBody>
    //   </Table>
    // </TableContainer>
  );
}

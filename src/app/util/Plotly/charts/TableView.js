import React, { useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper"
// import TablePagination from '@mui/material/TablePagination';
import Pagination from '@mui/material/Pagination';

function TableView(props) {
    const tableRow = props?.tableRow ? props?.tableRow : 5 
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);
    const sortedArray = props.rowsNew?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    useEffect(() => {
        if (sortedArray) {
            setPages(Math.ceil(sortedArray.length / tableRow))
        }
    }, [sortedArray]);

    const headers = sortedArray.length ? Object?.keys(sortedArray[0]) : "";
    const newHeaders = headers?.length && headers?.map((head) => {
        return head?.charAt(0).toUpperCase() + head?.slice(1);
    })
    const handlePageClick = (e, p) => {
        setPage(p - 1);
    }

    let tableDataPagination = sortedArray ? sortedArray.slice(page * tableRow, (page + 1) * tableRow) : sortedArray;
    return (
        <>
            <div style={{ height: 'calc(100% - 40px)', overflowX: "auto", cursor: "pointer" }}>
                {newHeaders.length ?
                    <div>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        {newHeaders?.map((dt, index) => {
                                            return <TableCell key={index} align="center">{dt}</TableCell>
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableDataPagination?.map((row, index) => (
                                        <TableRow key={index}>
                                            {headers?.map((td) => {
                                                return <TableCell key={td} align="center">{row[td]}</TableCell>
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    :
                    <div className="data-not-found"> data not found ! </div>}
            </div>
            <div style={{ height: '40px' }}>
                <Pagination
                    color="primary"
                    className="table-pagination"
                    count={pages}
                    shape="rounded"
                    onChange={(event, value) => handlePageClick(event, value)}
                />
            </div>
        </>
    );
}

export default TableView;

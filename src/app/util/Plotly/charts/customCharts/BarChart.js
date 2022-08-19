import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { useWindowSize } from "react-use";
import { groupBy } from "lodash";
import moment from "moment";
import TableView from "../TableView";


function BarChart(props) {
  const customRowData = props.data;
  const {
    data,
    title,
    xAxisCol,
    yAxisCol,
    y2AxisCol,
    ycolor,
    y2color,
    tableRow,
    chartMode,
    dataName,
    yLegend,
    xLegend,
    width,
    height,
    showLegend,
    showAxis,
    barWidth,
    scatterSize,
    colsNumber,
    showText,
    barGap,
    xGroupBy,
    axisFontSize,
    tableView
  } = customRowData;

  const plotHeight = tableView ? (height - 30) / 2 : (height - 30)

  // const handleData = (label) => {
  //   return data?.map?.((dt) => {
  //     return dt[label];
  //   });
  // };

  const groupbyData =
    xAxisCol &&
    groupBy(data, (dt) => {
      switch (xGroupBy) {
        case "Minutes":
          return moment(dt[xAxisCol]).format("YYYY-MM-DD HH:mm");
        case "Hours":
          return moment(dt[xAxisCol]).format("YYYY-MM-DD HH");
        case "Day":
          return moment(dt[xAxisCol]).format("YYYY-MM-DD");
        case "Month":
          return moment(dt[xAxisCol]).format("YYYY-MM");
        case "Year":
          return moment(dt[xAxisCol]).format("YYYY");
        default:
          return dt[xAxisCol];
      }
    });
  function getStandardDeviation(array) {
    const n = array?.length;
    if (n === 1) {
      return array[n - 1];
    }
    const mean = array.reduce((a, b) => a + b) / n;
    return Math.sqrt(
      array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
    );
  }
  function median(numbers) {
    const sorted = Array.from(numbers).sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
  }


  const handelYData = (col, operation) => {
    const arr = Object.values(groupbyData || {})?.map((dt) => {
      let colArray = [];
      const data = dt?.reduce((pv, cv, idx) => {
        switch (operation) {
          case "SUM":
            pv += +cv[col] ? cv[col] : 0;
            break;
          case "AVERAGE":
            pv += +(cv[col] / dt.length)?.toFixed(2);
            break;
          case "MIN":
            return idx === 0 ? cv[col] : Math.min(pv, cv[col]);
          case "MAX":
            return idx === 0 ? cv[col] : Math.max(pv, cv[col]);
          case "DEV":
            return (pv = getStandardDeviation(colArray));
          case "MEDIAN":
            return (pv = median(colArray));
          default:
            return cv[col];
        }
        return pv;
      }, 0)
      return typeof data === "string" ? data : data?.toFixed(2)
    });
    return arr;
  };

  const handelXData = (col) => {
    return Object.keys(groupbyData || {})?.map((dt) => {
      return dt;
    });
  };

  const handleBarData = () => {
    const dataArray = [];
    colsNumber &&
      [...Array(+colsNumber)?.keys()].map((dt, index) => {
        let yColName = "yAxisCol" + (+index + 1);
        let colorName = "yColor" + (+index + 1);
        let operationMethod = "colOperationY" + (+index + 1);
        const obj = {
          type: "bar",
          x: handelXData(),
          y: handelYData(
            customRowData[yColName],
            customRowData[operationMethod]
          ),
          // width: barWidth,
          marker: {
            color: customRowData[colorName],
          },
          name: customRowData[yColName],
          textposition: "outside",
          // font: {
          //   size: 50,
          //   color: "red"
          // },
        };
        if (showText) {
          obj.text = handelYData(
            customRowData[yColName],
            customRowData[operationMethod]
          );
        }
        dataArray.push(obj);
      });
    return dataArray;
  };
  const plotArray = handleBarData();

  const rowsNew = plotArray[0]?.x?.map((xData, idx) => {
    const dt = {};
    dt[xAxisCol] = xData;
    plotArray.map((p, i) => {
      let yColName = "yAxisCol" + (+i + 1);
      if (customRowData[yColName] !== undefined) {
        dt[customRowData[yColName]] = p.y[idx]
      }
    });
    return dt;
  })
  const config = {
    scrollZoom: true,
    displayModeBar: true,
    // editable: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['zoom2d', 'select2d', 'lasso2d']
  };
  return (
    <>
      <div style={{ height: "100%", width: "100%" }}>
        <div>
          <Plot
            data={handleBarData()}
            layout={{
              barmode: chartMode,
              title: title,
              orientation: "v",
              y: 1,
              x: 1,
              font: {
                family: "sans-serif",
                size: axisFontSize,
                color: "#5c5c5c"
                ,
              },
              width: width,
              height: plotHeight,
              margin: {
                l: 40,
                r: 20,
                b: 70,
                t: 70,
                pad: 0,
              },
              xaxis: {
                title: xAxisCol,
                tickfont: {
                  size: axisFontSize,
                },
                // fixedrange: true,
                // showticklabels: showAxis,
              },
              yaxis: {
                title: customRowData.yAxisCol1,
                tickfont: {
                  size: axisFontSize,
                },
                // fixedrange: true,
                // showticklabels: showAxis,
              },
              bargap: barGap,
              showlegend: showLegend,
            }}
            config={config}
          /></div>
        {tableView && <div style={{ height: "47%" }}><TableView rowsNew={rowsNew} tableRow={tableRow} /></div>}
      </div>
    </>
  );
}

export default BarChart;

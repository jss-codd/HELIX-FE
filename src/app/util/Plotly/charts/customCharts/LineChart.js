import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import { useWindowSize } from "react-use";
import moment from "moment";
import { groupBy } from "lodash";
import TableView from "../TableView";
import { Button, CircularProgress } from "@mui/material";
function LineChart(props) {
  const customRowData = props.data;
  const { setChartLoader, chartLoader, zoomedHeight, editableBox, idx, setContainers, containers, zoomed } = props;
  const [jsonData, setJsonData] = useState(customRowData.data);

  useEffect(() => {
    setTimeout(() => {
      setChartLoader(false)
    }, 3000);
  }, [customRowData])

  const {
    data,
    title,
    xAxisCol,
    yAxisCol,
    chartMode,
    dataName,
    tableRow,
    width,
    height,
    axisFontSize,
    lineWidth,
    scatterSize,
    showText,
    markers,
    xGroupBy,
    colsNumber,
    tableView,
    xRange,
    yRange,
  } = customRowData;
  const newFontSize = zoomed === idx ? axisFontSize + 2 : axisFontSize;
  const newheight = zoomed === idx ? zoomedHeight : 225;
  const plotHeight = tableView && zoomed === idx ? (newheight - 30) / 2 : (newheight - 30)
  const groupbyData =
    xAxisCol &&
    groupBy(jsonData, (dt) => {
      switch (xGroupBy) {
        case "Seconds":
          return moment(dt[xAxisCol]).format("YYYY-MM-DD HH:mm:ss");
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
        case "Week":
          return moment(dt[xAxisCol]).format("YYYY-MM W");
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
    const arr = Object.values(groupbyData || {})?.map((dt, index) => {
      let colArray = [];
      const data = dt
        ?.reduce((pv, cv, idx, array) => {
          colArray.push(cv[col]);
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
      return typeof data === "string" || Number.isInteger(data) ? data : data?.toFixed(2);
    });
    return arr;
  };

  const handelXData = (col) => {
    return Object.keys(groupbyData || {}).map((dt) => {
      return dt;
    });
  };

  const handleLineData = () => {
    var mode = "lines";
    if (showText) {
      mode += "+text";
    }
    if (markers) {
      mode += "+markers";
    }

    const dataArray = [];
    colsNumber &&
      [...Array(+colsNumber)?.keys()].map((dt, index) => {
        let yColName = "yAxisCol" + (+index + 1);
        let colorName = "yColor" + (+index + 1);
        let operationMethod = "colOperationY" + (+index + 1);
        const obj = {
          x: handelXData(),
          y: handelYData(
            customRowData[yColName],
            customRowData[operationMethod]
          ),
          type: "scatter",
          mode: mode,
          marker: {
            size: scatterSize,
            // color: ycolor,
          },
          line: {
            width: lineWidth,
            color: customRowData[colorName],
          },
          text: handelYData(
            customRowData[yColName],
            customRowData[operationMethod]
          ),
          textposition: "top center",
          textfont: {
            size: newFontSize,
          },
          name: customRowData[yColName],
        };
        if (customRowData["legendStatus"]?.includes(index)) {
          obj.visible = "legendonly"
        }
        // visible: customRowData["legendStatus"]?.includes(index) ? "legendonly" : false
        dataArray.push(obj);
      });

    // setTimeout(setChartLoader(false), 50000);
    return dataArray;
  };
  const plotArray = handleLineData();

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


  let layout = {
    autosize: true,
    hovermode: "closest",
    font: {
      family: "sans-serif",
      size: newFontSize,
      color: "#000000",
    },
    yaxis: {
      title: yAxisCol,
      tickfont: {
        size: newFontSize,
        color: "black"
      },
      range: yRange
      // fixedrange: true,
      // showticklabels: showAxis,
    },
    showlegend: zoomed === idx ? true : false,
    xaxis: {
      title: xAxisCol,
      tickfont: {
        size: newFontSize,
        color: "#000000"
      },
      range: xRange,
      // fixedrange: true,
      // showticklabels: showAxis,
    },
    title: {
      text: title,
      font: {
        size: 15,
        color: "#000000",
      },
      y: zoomed === idx ? "auto" : 0.89,
    },
    legend: {
      orientation: "v",
      y: 1,
      x: 1,
      font: {
        family: "sans-serif",
        size: newFontSize,
        color: "#000000"
        ,
      },
    },

    // width: zoomed === idx ? 950 : width,
    height: plotHeight,
    margin: {
      l: 30,
      r: 20,
      b: 50,
      t: 30,
      pad: 0,
    },
  };
  const config = {
    responsive: true,
    scrollZoom: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['zoom2d', 'select2d', 'lasso2d']
  };
  const handleLegend = (e) => {
    setContainers((prev) =>
      prev.map((dt, index) => {
        if (idx === index) {
          let arr = dt?.legendStatus ? dt?.legendStatus : []
          if (arr.includes(e.expandedIndex)) {
            arr.splice(arr.indexOf(e.expandedIndex), 1);
          } else {
            arr.push(e.expandedIndex)
          }
          return {
            ...dt,
            legendStatus: arr
          };
        }
        return dt;
      })
    );
  }

  const handleUpdate = (layout) => {
    let arr = containers;
    arr[idx].yRange = layout?.yaxis?.range;
    arr[idx].xRange = layout?.xaxis?.range;
    setContainers(arr);
  }

  return (
    <>
      {/* {chartLoader && editableBox === idx && (
        <div className="app-loader">
          <div>
            <CircularProgress size={20} color="primary" />
          </div>
        </div>
      )} */}
      <div style={{ height: "100%", width: "100%" }}>
        <div>
          <Plot
            data={handleLineData()}
            layout={layout}
            config={config}
            onUpdate={(e) => handleUpdate(e.layout)}
            onLegendClick={(e) => handleLegend(e)}
            style={{ width: "100%", height: "100%" }}
          /></div>
        {tableView && zoomed === idx && <div style={{ height: "47%" }}><TableView rowsNew={rowsNew} tableRow={tableRow} /></div>}
      </div>
    </>
  );
}

export default LineChart;

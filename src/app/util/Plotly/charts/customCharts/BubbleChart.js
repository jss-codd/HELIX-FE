import React, { useState, useEffect, useCallback, useMemo } from "react";
import Plot from "react-plotly.js";
import TableView from "../TableView";


function BubbleChart(props) {
  const customRowData = props.data;

  const {
    data,
    title,
    xAxisCol,
    yAxisCol,
    tableRow,
    showText,
    width,
    height,
    tableView,
    showLegend,
    showAxis,
    axisFontSize,
    colsNumber,
    barWidth,
  } = customRowData;
  const plotHeight = tableView ? (height - 30) / 2 : (height - 30)
  const handleData = (label) => {
    return data?.map?.((dt) => {
      return dt[label];
    });
  };

  const sizes = useMemo(
    () =>
      data?.map?.((dt, idx) => {
        return (Math.random() * 10) + 10;
      }),
    []
  );

  const handleBarData = () => {
    var mode = "markers";
    if (showText) {
      mode += "+text";
    }
    const dataArray = [];
    colsNumber &&
      [...Array(+colsNumber)?.keys()].map((dt, index) => {
        let yColName = "yAxisCol" + (+index + 1);
        let colorName = "yColor" + (+index + 1);
        const obj = {
          x: handleData(customRowData["xAxisCol"]),
          y: handleData(customRowData[yColName]),
          mode: mode,
          marker: {
            size: sizes,
            color: customRowData[colorName],
            opacity: 0.7,
          },
          name: customRowData[yColName],
          textposition: "outside",
          text: handleData(customRowData[yColName])
        };
        // if (showText) {
        //   obj.text = handleData(customRowData["xAxisCol"]);
        // }
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
    modeBarButtonsToRemove: ['zoom2d']
  };

  const layout = {
    yaxis: {
      title: yAxisCol,
      tickfont: {
        size: axisFontSize,
      },
      // fixedrange: true,
      // showticklabels: showAxis,
    },
    showlegend: showLegend,
    xaxis: {
      title: xAxisCol,
      tickfont: {
        size: axisFontSize,
      },
      // fixedrange: true,
      // showticklabels: showAxis,
    },
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
      t: 30,
      pad: 0,
    },
  }
  return (
    <>
      <div style={{ height: "100%", width: "100%" }}>
        <div>
          <Plot data={handleBarData()}
            layout={layout}
            config={config}
          /></div>
        {tableView && <div style={{ height: "47%" }}><TableView rowsNew={rowsNew} tableRow={tableRow} /></div>}
      </div>
    </>
  );
}

export default BubbleChart;

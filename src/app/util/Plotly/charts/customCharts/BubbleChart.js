import React, { useState, useEffect, useCallback, useMemo } from "react";
import Plot from "react-plotly.js";
import TableView from "../TableView";
import { Button, CircularProgress } from "@mui/material";

function BubbleChart(props) {
  const customRowData = props.data;
  const { setChartLoader, chartLoader, editableBox, zoomedHeight, idx, setContainers, containers, zoomed } = props;
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
    axisFontSize,
    colsNumber,
    xRange,
    yRange,
  } = customRowData;

  useEffect(() => {
    setTimeout(() => {
      setChartLoader(false)
    }, 3000);
  }, [customRowData])


  const newFontSize = zoomed === idx ? axisFontSize + 2 : axisFontSize;
  const newheight = zoomed === idx ? zoomedHeight : height;
  const plotHeight = tableView &&  zoomed === idx ? (newheight - 30) / 2 : (newheight - 30)
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
          textfont: {
            size: newFontSize,
          },
          text: handleData(customRowData[yColName])
        };
        if (customRowData["legendStatus"]?.includes(index)) {
          obj.visible = "legendonly"
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
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['zoom2d']
  };

  const layout = {
    autosize: true,
    yaxis: {
      title: yAxisCol,
      tickfont: {
        size: newFontSize,
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
    orientation: "v",
    y: 1,
    x: 1,
    font: {
      family: "sans-serif",
      size: newFontSize,
      color: "#5c5c5c"
      ,
    },
    // width: width,
    height: plotHeight,
    margin: {
      l: 40,
      r: 20,
      b: 50,
      t: 30,
      pad: 0,
    },
  }

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
    <>  {chartLoader && editableBox === idx && (
      <div className="app-loader">
        <div>
          <CircularProgress size={20} color="primary" />
        </div>
      </div>
    )}
      <div style={{ height: "100%", width: "100%" }}>
        <div>
          <Plot
            data={handleBarData()}
            layout={layout}
            config={config}
            onUpdate={(e) => handleUpdate(e.layout)}
            onLegendClick={(e) => handleLegend(e)}
            style={{ width: "100%", height: "100%" }}
          /></div>
        {tableView &&  zoomed === idx && <div style={{ height: "47%" }}><TableView rowsNew={rowsNew} tableRow={tableRow} /></div>}
      </div>
    </>
  );
}

export default BubbleChart;

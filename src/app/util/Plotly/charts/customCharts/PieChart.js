import React, { useEffect } from "react";
import Plot from "react-plotly.js";
import { groupBy } from "lodash";
import { Button, CircularProgress } from "@mui/material";


const PieChart = (props) => {
  const customRowData = props.data;
  const { setChartLoader, chartLoader, zoomedHeight, editableBox, idx, setContainers, containers, zoomed } = props;
  const {
    data,
    title,
    ycolor,
    y2color,
    chartMode,
    textPosition,
    dataName,
    yLegend,
    xLegend,
    width,
    height,
    showLegend,
    textInfo,
    targetCol,
    axisFontSize
  } = customRowData;

  const newFontSize = zoomed === idx ? axisFontSize + 2 : axisFontSize;
  const newheight = zoomed === idx ? zoomedHeight : height;
  const plotHeight = (newheight - 30)

  useEffect(() => {
    setTimeout(() => {
      setChartLoader(false)
    }, 3000);
  }, [customRowData])

  const groupByData = groupBy(data, targetCol);

  const handleLabels = () => {
    let labels = [];
    labels = (Object.keys(groupByData).map((dt) => {
      return dt;
    }))
    return labels;
  }

  const handleData = (label) => {
    return Object.values(groupByData)?.map?.((dt) => {
      return dt.length;
    });
  };

  const config = {
    responsive: true,
    scrollZoom: true,
    displayModeBar: true,
    // editable: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['zoom2d', 'select2d', 'lasso2d']
  };

  const handleLegend = (e) => {
    console.log(e,"this is the event ");
    // setContainers((prev) =>
    //   prev.map((dt, index) => {
    //     if (idx === index) {
    //       let arr = dt?.legendStatus ? dt?.legendStatus : []
    //       if (arr.includes(e.expandedIndex)) {
    //         arr.splice(arr.indexOf(e.expandedIndex), 1);
    //       } else {
    //         arr.push(e.expandedIndex)
    //       }
    //       return {
    //         ...dt,
    //         legendStatus: arr
    //       };
    //     }
    //     return dt;
    //   })
    // );
  }

  return (
    <>
      {chartLoader && editableBox === idx && (
        <div className="app-loader">
          <div>
            <CircularProgress size={20} color="primary" />
          </div>
        </div>
      )}
      <div style={{ height: "100%", width: "100%" }}>
        <div>
          <Plot
            data={[
              {
                values: handleData(),
                labels: handleLabels(),
                textinfo: "label+percent",
                marker: {
                  colors: ["#f9c565", "#b8df53"]
                },
                textposition: textPosition,
                type: "pie",
                textinfo: textInfo ? textInfo : 'none'
              },
            ]}
            layout={{
              autosize: true,
              title: title,
              font: {
                family: "sans-serif",
                size: newFontSize,
                color: "#5c5c5c",
              },
              // width: width,
              height: plotHeight,
              margin: {
                l: 20,
                r: 20,
                b: 20,
                t: 30,
                pad: 0,
              },
              // showlegend: zoomed === idx ? true : false,
              legend: { orientation: "h", y: yLegend, x: xLegend },
            }}
            onLegendClick={(e) => handleLegend(e)}
            config={config}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </>
  );
};

export default PieChart;

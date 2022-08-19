import React, { Component } from "react";
import Plot from "react-plotly.js";
import { groupBy } from "lodash";

const PieChart = (props) => {
  const customRowData = props.data;

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
    targetCol
  } =  customRowData ;

const groupByData = groupBy(data,targetCol);

 const handleLabels =()=>{
    let labels= [];
    labels= (Object.keys(groupByData).map((dt)=>{
          return dt;
    }))
    return labels;
 }

 const handleData = (label) => {
  return Object.values(groupByData)?.map?.((dt) => {
     return dt.length;
  });
};

  return (
    <Plot
      data={[
        {
          values:handleData(),
          labels: handleLabels(),
          textinfo: "label+percent",
          marker: {
            colors: ["#f9c565" , "#b8df53"]
          },
          textposition:textPosition,
          type: "pie",
          textinfo: textInfo ? textInfo :'none'
        },
      ]}
      layout={{
        title: title,
        width: width  ,
        height: height - 40,
        margin: {
          l: 20,
          r: 20,
          b: 20,
          t: 30,  
          pad: 0,
        },
        showlegend: showLegend,
        legend: { orientation: "h", y: yLegend, x: xLegend },
      }}
    />
  );
};

export default PieChart;

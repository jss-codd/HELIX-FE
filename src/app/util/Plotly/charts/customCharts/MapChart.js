import React, { Component, useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { groupBy } from "lodash";
import * as d3 from "d3";

const MapChart = (props) => {
  const customRowData = props.data;
  const [dimentiondata, setDimentionState] = useState([]);

  const {
    data,
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
  } = customRowData;

  useEffect(() => {
    d3.csv(
      "https://raw.githubusercontent.com/plotly/datasets/master/2015_06_30_precipitation.csv",
      (err, raws) => {
        function unpack(rows, key) {
			return rows.map(function(row) {
				return row[key];
			});
		}
      });
  }, []);

  return (
    <Plot
      data={[
        {  
          type: "scattermapbox",
        //   text: unpack(dimentiondata, "Globvalue"),
        //   lon: unpack(dimentiondata, "Lon"),
        //   lat: unpack(dimentiondata, "Lat"),
          marker: { color: "fuchsia", size: 4 },
        },
      ]}
      layout={{
        mapbox: {
          style: "open-street-map",
          zoom: 2,
          center: { lon: -150, lat: 60 },
        },
        margin: { t: 0, b: 0 },
        width: width,
        height: height,
      }}
      config={{
        mapboxAccessToken:
          "pk.eyJ1IjoicmlzaGl3ZWJpd29yayIsImEiOiJjbDI0aGRpaWMwOGF0M2NxaXJnanJyODJwIn0.5EEt7w8x2fGIZDCq8OgiZw",
      }}
    />
  );
};
export default MapChart;

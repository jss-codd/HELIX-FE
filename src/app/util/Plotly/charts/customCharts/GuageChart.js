import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";


function GaugeChart(props) {
    const { container } = props;
    const Title = container?.targetCol && container?.operation ?`${container?.targetCol}(${container?.operation})`: "";

    var data = [
        {
            type: "indicator",
            mode: "gauge+number+delta",
            value: props.CalculatedData,
            title: { text: Title, font: { size: 10, } },
            gauge: {
                axis: { tickwidth: 1, tickcolor: "#3a4354" },
                bar: { color: "#3a4354" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
                steps: [
                    { range: [0, 250], color: "cyan" },
                    { range: [250, 400], color: "royalblue" }
                ],
                threshold: {
                    line: { color: "red", width: 4 },
                    thickness: 0.75,
                    value: 490
                }
            }
        }
    ];
    var layout = {
        width: container.width,
        height: container.height,
        margin: { t: 38, r: 5, l: 5, b: 10 },
        paper_bgcolor: "lavender",
        font: { color: "#3a4354", family: "Arial" }
    };

    return (
        <>
            <Plot data={data} layout={layout} />
        </>
    );
}

export default GaugeChart;

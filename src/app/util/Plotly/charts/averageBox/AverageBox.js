import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { Delete, Close, Edit } from "@material-ui/icons";
import GaugeChart from '../customCharts/GuageChart';

function AverageBox(props) {

    const { container, } = props;
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
    let colArray = [];
    const CalculatedData = container?.data
        ?.reduce((pv, cv, idx, array) => {
            colArray.push(cv[container.targetCol]);
            switch (container.operation) {
                case "SUM":
                    pv += +cv[container.targetCol] ? cv[container.targetCol] : 0;
                    break;
                case "AVERAGE":
                    pv += +(cv[container.targetCol] / container?.data?.length)?.toFixed(2);
                    break;
                case "MIN":
                    return idx === 0 ? cv[container.targetCol] : Math.min(pv, cv[container.targetCol]);
                case "MAX":
                    return idx === 0 ? cv[container.targetCol] : Math.max(pv, cv[container.targetCol]);
                case "DEV":
                    return (pv = getStandardDeviation(colArray));
                case "MEDIAN":
                    return (pv = median(colArray));
                default:
                    return cv[container.targetCol];
            }
            return pv;
        }, 0);
    const Title = container?.targetCol && container?.operation ? `${container?.targetCol}(${container?.operation})` : "";

    return (
        <>
            <Rnd
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    props.setCurrentBoxIndex(props?.idx);
                    props.setTab(1);
                }}
                className={`calculation-card ${props?.is_selected ? "is_selected_cal" : ""} `}
                position={{ x: container.xaxis, y: container.yaxis }}
                size={{
                    width: container?.width,
                    height: container?.height,
                }}
                resizeHandleWrapperClass="resizeClass"
                // cancel=".draglayer"
                onDrag={(e, d) => {
                    e.preventDefault();
                    e.stopPropagation();
                    props.setContainers((prev) =>
                        prev.map((dt, index) => {
                            if (props?.idx === index) {
                                return {
                                    ...dt,
                                    xaxis: d.x,
                                    yaxis: d.y,
                                };
                            }
                            return dt;
                        })
                    );
                }}
                onResizeStart={(e, direction, ref, delta, position) => {
                    props.setIsResizableIdx(props?.idx);
                    // const ele = document.getElementsByClassName("resizeClass");
                    // if (ele?.length) {
                    //     ele[props.isResizableIdx].addEventListener("mousedown", function () {
                    //         // document.getElementById("hightwidth").id = "hightwidth-new";
                    //         document.getElementById(
                    //             "hightwidth" + props.isResizableIdx
                    //         ).style.display = "block";
                    //     });
                    // }
                }}
                onResize={(e, direction, ref, delta, position) => {
                    e.preventDefault();
                    e.stopPropagation();
                    props.setContainers((prev) =>
                        prev.map((dt, index) => {
                            if (props?.idx === index) {
                                return {
                                    ...dt,
                                    width: ref.offsetWidth,
                                    height: ref.offsetHeight,
                                    xaxis: position.x,
                                    yaxis: position.y,
                                };
                            }
                            return dt;
                        })
                    );
                }}
                default={{
                    x: props?.xaxis,
                    y: props?.yaxis,
                    width: 150,
                    height: 75,
                }}
                minWidth={150}
                minHeight={75}
                maxWidth={200}
                maxHeight={100}
                bounds=".chart-container"
            >  <div className="calculation-div">
                    {!container.gaugeMode ?
                        <div className="calculation-box" style={{backgroundColor: container?.boxColor , color: container.textColor }}>
                            <div>
                                {Title && <div className="calculation-title">
                                {Title}
                                </div>}
                                <div className="calculation-data">
                                    {CalculatedData ? CalculatedData.toFixed(2) : "00.00"}
                                </div>
                            </div>
                            {/* <div className="calculation-operation">
                                {container.operation}
                            </div> */}

                        </div>
                        :
                        <div className="gaugeChart-div">
                            <GaugeChart
                                container={container}
                                CalculatedData={CalculatedData}
                            />
                        </div>}
                    <div className="option-trey-cal" style={{ left: container.width - 50 }}>
                        <button
                            id="delete-button"
                            className="delete-button-cal"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                props.setDeletePopUp({
                                    open: true,
                                    index: props.idx,
                                });
                            }}
                        >
                            <Delete />
                        </button>
                        <button
                            className="edit-button-cal"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                props.setCurrentBoxIndex(props.idx, e);
                            }}
                        >
                            <Edit />
                        </button>
                    </div>
                    {/* <span className="Wh-info" id={"hightwidth" + props.idx}></span> */}
                </div>
            </Rnd>
        </>
    );
}

export default AverageBox;

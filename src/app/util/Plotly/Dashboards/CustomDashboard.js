import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { Close, Delete, Edit } from "@material-ui/icons";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import { CircularProgress } from "@mui/material";
import { Button as Button2 } from "antd";
import {
  Box, Dialog, DialogActions,
  DialogContent, DialogTitle, Grid, IconButton, Typography
} from "material-ui-core";
import moment from "moment";
import React, { useEffect, useState, useRef } from "react";
import { Rnd } from "react-rnd";
import logo from "../assets/images/logo.svg";
import AverageBox from "../charts/averageBox/AverageBox";
import BarChart from "../charts/customCharts/BarChart";
import BubbleChart from "../charts/customCharts/BubbleChart";
import LineChart from "../charts/customCharts/LineChart";
import MapChart from "../charts/customCharts/MapChart";
import PieChart from "../charts/customCharts/PieChart";
import "../index.scss";
import { ChartModes, ChartType } from "../utils/util";
import { Prompt } from 'react-router-dom';
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';
import DateRangeSharpIcon from '@mui/icons-material/DateRangeSharp';


export default function CustomDashboard(props) {
  const ref = useRef(null);
  const device = new URLSearchParams(location.search).get('device');
  const { containers, setContainers, chartLoader, setChartLoader, sensorData, editableBox, setEditableBox, setSaveDash, loader, setLoader } = props
  const [xaxis, setXaxis] = useState(10);
  const [yaxis, setYaxis] = useState(10);
  const [deviceId, setDeviceId] = useState(device);
  const [zoomedHeight, setZoomedHeight] = useState(630);
  const [zoomedWidth, setZoomedWidth] = useState(970);
  const [zoomed, setZoomed] = useState("")
  const [widgetAxis, setWidgetAxis] = useState({
    x: 0,
    y: 0
  })
  const [widgetCount, setWidgetCount] = useState(0);

  //this code for tab feature . 
  const [tab, setTab] = React.useState(0);
  const [titleFocus, setTitleFocus] = useState(false);

  useEffect(() => {
    window.onbeforeunload = function () {
      return 'You have unsaved changes!';
    }
  }, []);

  useEffect(() => {
    if (document.getElementById('list')) {
      console.log(document.getElementById('list'), "document.getElementById('list')");
      sortable(document.getElementById('list'), function (item) {
        console.log(item);
      });
    }
  }, [document.getElementById('list')])

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div {...other}>
        {value === index && <Box>{children}</Box>}
      </div>
    );
  }
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };


  const [isResizableIdx, setIsResizableIdx] = useState(0);
  const [deletePopUp, setDeletePopUp] = React.useState({
    open: false,
    index: "",
  });

  useEffect(() => {
    openNav();
    const elem = document.getElementById("containerHeight");
    if (elem) {
      setZoomedHeight(elem.offsetHeight - 30)
      setZoomedWidth(elem.offsetWidth - 280)
      console.log(elem.offsetWidth, "this is the container height")
    }
  }, [])

  const componentsArray = [
    {
      name: "Pie",
      Component: PieChart,
    },
    {
      name: "Line",
      Component: LineChart,
    },
    {
      name: "Bar",
      Component: BarChart,
    },
    {
      name: "Bubble",
      Component: BubbleChart,
    },
    {
      name: "Map",
      Component: MapChart,
    },
  ];


  useEffect(() => {
    let widgetCount = 0;
    containers.map((dt) => {
      if (dt.tabName === "Widget") {
        widgetCount += 1;
      }
    })
    setWidgetCount(widgetCount);

    setContainers((prev) =>
      prev.map((dt, idx) => {
        if (editableBox === idx) {
          return {
            ...dt,
            data: sensorData,
          };
        }
        return dt;
      })
    );
  }, [containers.length]);

  useEffect(() => {
    setContainers((prev) =>
      prev.map((dt, idx) => {
        return {
          ...dt,
          data: sensorData,
        };
      }
      )
    );
  }, [sensorData]);


  const handleAddContainer = () => {
    let obj;
    let arr;
    const endDate = moment().format('YYYY-MM-DD');
    const startDate = moment().subtract(1, 'd').format('YYYY-MM-DD');
    //  modified
    if (tab === 0) {
      // if (containers.length  < 6) {
      if (containers.length + 1 > 0 && xaxis > 600) {
        setXaxis(10);
        setYaxis(yaxis + 280);
      } else {
        // if (containers.length) {
        setXaxis(xaxis + 320);
        setYaxis(yaxis);
        // } else {
        //   setXaxis(xaxis + 320);
        //   setYaxis(yaxis);
        // }
      }
      obj = {
        tabName: "Chart",
        dataName: "",
        data: [],
        startDate: startDate,
        endDate: endDate,
        chartType: "",
        tableRow: 5,
        axisFontSize: 8,
        lineWidth: 2,
        barWidth: 5,
        barGap: 2,
        scatterSize: 5,
        height: 270,
        width: 310,
        yColor1: "#1f77b4",
        yColor2: "#ff7f0e",
        yColor3: "#2ca02c",
        yColor4: "#d62728",
        axisFontSize: 8,
        showLegend: true,
        showAxis: false,
        xaxis: xaxis,
        yaxis: yaxis,
        colsNumber: 1,
        legendStatus: [],
        xRange: [],
        yRange: []
      };
      // }
    }
    else if (tab === 1) {
      if (containers.length + 1 > 0 && xaxis > 800) {
        setXaxis(10);
        setYaxis(yaxis + 85);
      } else {
        setXaxis(xaxis + 160);
        setYaxis(yaxis);
      }

      obj = {
        tabName: "Widget",
        dataName: "",
        data: [],
        height: 75,
        width: 150,
        textColor: "#404040",
        boxColor: "#ffffff",
        xaxis: xaxis,
        yaxis: yaxis,
      };
      setWidgetCount(widgetCount + 1);
    }
    if (Object.keys(obj).length) {
      arr = [...containers, obj];
      setEditableBox(arr.length - 1);
      setContainers(arr);
      openNav();
    }
  };

  const handleSelect = (e, Yaxiscols) => {
    e.persist();
    setContainers((prev) =>
      prev.map((dt, idx) => {
        // console.log("----prev----",prev);
        if (editableBox === idx) {
          let isAlreadyExists = false
          // console.log("--------e.target?.name---",e.target?.name,"e?.target?.value",e?.target?.value);
          if (Yaxiscols !== undefined && e.target?.name === Yaxiscols) {

            // console.log("------Yaxiscols---",Yaxiscols);
            for (let i = 0; i < dt.colsNumber; i++) {
              if (dt[`yAxisCol${i + 1}`] === e.target.value) {
                isAlreadyExists = true

              }
            }

          }
          if (!isAlreadyExists) {
            if (e.target?.name === "chartMode" && e.target?.value === "single data") {
              return {
                ...dt,
                [e.target?.name]: e?.target?.value,
                colsNumber: 1,
              }
            } else {
              return {
                ...dt,
                [e.target?.name]:
                  e.target.type === "checkbox"
                    ? e.target.checked
                    : e?.target?.value,
              };
            }
          } else {
            return dt
          }



        }
        return dt;
      })
    );
  };

  const handleInput = (e) => {
    const copyContainer = [...containers];
    copyContainer[editableBox].title = e?.target?.value;
    setContainers(copyContainer);
  };

  const setCurrentBoxIndex = (index, isTab) => {
    openNav();
    setEditableBox(index);
    setTab(isTab);
  };
  const handleDeleteContainer = (index, event) => {
    if (index || index === 0) {
      const arr = containers.filter((_, idx) => idx !== index);
      setXaxis(containers[index].xaxis);
      setYaxis(containers[index].yaxis);
      setContainers(arr);
      setDeletePopUp({
        open: false,
        index: "",
      });
    }
    if (containers[index].tabName === "Widget") {
      setWidgetCount(widgetCount - 1);
    }
    if (containers.length - 1 === 0) {
      closeNav();
    }
  };

  const ContainerPerent = (props) => {
    // const [startDate, setStartDate] = useState();
    // const [endDate, setEndDate] = useState();
    const data = componentsArray.find(
      (dt) => dt.name === containers[props.idx]?.chartType
    );
    const Component = data?.Component;
    const classname = `text-white-toolButton remove-class${props.idx}`;
    return (
      <>

        <div
          className="groupby-trey">
          <div className="group-trey-text" >sensor chart</div>
          <div>
            <DateRangeSharpIcon  fontSize="inherit" color='inherit' className="group-trey-icon" />
            <Delete fontSize="inherit" color='inherit' className="group-trey-icon" />
            <Edit fontSize="inherit" color='inherit' className="group-trey-icon" />
            <FullscreenRoundedIcon fontSize="small" color='inherit' className="group-trey-icon-fullscreen " />
          </div>
          {/* <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
            > */}
          {/* {zoomed === props.idx ?
            <ZoomInMapIcon
              onClick={
                (e) => {
                  e.preventDefault();
                  console.log("clicked")
                  setZoomed("")
                }
              }
              className="zoomOut-icon"
            /> :
            <ZoomOutMapIcon
              onClick={
                () => {
                  console.log("clicked")
                  setZoomed(props.idx)
                }
              }
              className="zoomOut-icon"
            />} */}
          {/* </div>
            <div className="dateDiv">
              <input
                className="startdate"
                type="date"
                id="startdate"
                onChange={(e) => handleSelect(e)}
                value={containers[props.idx]?.startDate}
                name="startDate"
                onKeyDown={(e) => e.preventDefault()}
                data-date-inline-picker="true"
              ></input>
            </div>

            <span className="To_text">To</span>
            <div className="dateDiv">
              <input
                className="enddate"
                type="date"
                id="enddate"
                onChange={(e) => handleSelect(e)}
                value={containers[props.idx]?.endDate}
                name="endDate"
                onKeyDown={(e) => e.preventDefault()}
              ></input>
            </div>
          </div> */}
        </div>
        <div className="box container-perent">
          {Component && <Component
            data={props?.data}
            idx={props.idx}
            editableBox={editableBox}
            chartLoader={chartLoader}
            setChartLoader={setChartLoader}
            setContainers={setContainers}
            containers={containers}
            zoomed={zoomed}
            zoomedHeight={zoomedHeight}
          />
          }
        </div>
        {/* <div className="option-trey" style={{ left: (zoomed === props.idx ? zoomedWidth : props?.data.width) - 100 }}>
          <button
            id="delete-button"
            className="delete-button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setDeletePopUp({
                open: true,
                index: props.idx,
              });
            }}
          >
            <Delete />
          </button>
          <button
            className="edit-button"
            onClick={(e) => {
              setCurrentBoxIndex(props.idx, 0);
            }}
          >
            <Edit />
          </button>
        </div> */}
      </>
    );
  };

  const divContainer = () => {
    return containers.map((dt, idx) => {
      const is_selected = (idx === editableBox);
      return (
        // <div style={{ position: "relative" }}>
        !dt.tabName || dt.tabName !== "Widget" ?
          <div
            id={`div${idx + 1}`}
            draggable={true}
            // style={{ height: `200px`, width: `250px` }}
            className={`divRec ${is_selected ? "is_selected" : ""}  ${zoomed === idx ? "zoomed-graph" : ""}`}
            onClick={(e) => {
              e.preventDefault()
              setEditableBox(idx);

            }}
          >
            {/* <Rnd
              onClick={(e) => {

                setEditableBox(idx);

              }}
              className={`graph-card ${is_selected ? "is_selected" : ""}  ${zoomed === idx ? "zoomed-graph" : ""}`}
              position={{
                x: zoomed === idx ? 0 : containers[idx]?.xaxis,
                y: zoomed === idx ? 0 : containers[idx]?.yaxis
              }}
              size={{
                width: zoomed === idx ? zoomedWidth : containers[idx]?.width,
                height: zoomed === idx ? zoomedHeight : containers[idx]?.height,
              }}
              resizeHandleWrapperClass="resizeClass"
              cancel=".draglayer"
              onDrag={(e, d) => {
                e.preventDefault();
                e.stopPropagation();
                setContainers((prev) =>
                  prev.map((dt, index) => {
                    if (idx === index) {
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
                setIsResizableIdx(idx);
                // const ele = document.getElementsByClassName("resizeClass");
                // if (ele?.length) {
                //   ele[isResizableIdx].addEventListener("mousedown", function () {
                //     // document.getElementById("hightwidth").id = "hightwidth-new";
                //     document.getElementById(
                //       "hightwidth" + isResizableIdx
                //     ).style.display = "block";
                //   });
                // }
              }}
              onResize={(e, direction, ref, delta, position) => {
                e.preventDefault();
                e.stopPropagation();
                setContainers((prev) =>
                  prev.map((dt, index) => {
                    if (idx === index) {
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
              enableResizing={false}
              // disableDragging={zoomed ? true : false}
              disableDragging={true}

              default={{
                x: xaxis,
                y: yaxis,
                // width: "100%",
                // height: "100%",
              }}
              minWidth={310}
              minHeight={270}
              // maxHeight={400}
              // maxWidth={450}
              bounds=".chart-container"
            > */}
            {/* <div style={{height: `200px` , width: `250px`}}> */}
            <ContainerPerent data={dt} idx={idx} />
            {/* </div> */}
            {/* </Rnd> */}
          </div>
          :
          <div
            id={`div${idx + 1}`}
            draggable={true}
            className={`divQuad ${is_selected ? "is_selected" : ""}`}
            onClick={(e) => {
              setEditableBox(idx);
            }}
          >
            <AverageBox
              idx={idx}
              setCurrentBoxIndex={setCurrentBoxIndex}
              is_selected={is_selected}
              container={containers[idx]}
              setContainers={setContainers}
              setIsResizableIdx={setIsResizableIdx}
              isResizableIdx={isResizableIdx}
              setTab={setTab}
              setDeletePopUp={setDeletePopUp}
              xaxis={widgetAxis.x}
              yaxis={widgetAxis.y}
            />
          </div>
      );
    });
  };
  const ColOptions = (key) => {
    if (containers?.length > 0) {
      const colsObj = containers[editableBox]?.data;
      if (colsObj?.length) {
        return (
          Object?.keys(colsObj[0]) &&
          Object.keys(colsObj[0])
            .filter((dt) => {
              if (key === "xcol") {
                return dt === "timestamp" ? true : false;
              }
              else {
                return true;
              }
            })
            .map((dt, idx) => (
              <option key={idx} value={dt}>
                {dt}
              </option>
            ))
        );
      } else {
        return (
          <option key="key" value="">
            please Select Data
          </option>
        );
      }
    }
  };

  const wedgetsColOptions = (key) => {
    if (containers?.length > 0) {
      const colsObj = containers[editableBox]?.data;
      if (colsObj?.length) {
        return (
          Object?.keys(colsObj[0]) &&
          Object.keys(colsObj[0])
            // .filter((dt) => dt != selectionData?.xAxisCol)
            .map((dt, idx) => {
              if (dt !== "timestamp") {
                return (
                  <option key={idx} value={dt}>
                    {dt}
                  </option>
                )
              }
            })
        );
      } else {
        return (
          <option key="key" value="">
            please Select JsonData Data
          </option>
        );
      }
    }
  };

  function openNav() {
    document.getElementById("mySidebar").style.width = "350px";
    document.getElementById("perent-container").style.marginLeft = "280px";
    const elem = document.getElementById("containerHeight");
    // setZoomedHeight(elem.offsetHeight - 30)
    console.log(elem.offsetWidth, "this is the elem widht ")
    // setZoomedWidth(elem.offsetWidth - 280)
  }

  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("perent-container").style.marginLeft = "0";
    const elem = document.getElementById("containerHeight");
    // setZoomedHeight(elem.offsetHeight - 30)
    setZoomedWidth(elem.offsetWidth + 280)
  }

  const handleClose = () => {
    setDeletePopUp({
      open: false,
      index: "",
    });
  };

  const inputCols = () => {
    return (
      containers[editableBox]?.colsNumber &&
      [...Array(+containers[editableBox]?.colsNumber)?.keys()]?.map(
        (dt, index) => {
          const inputName = "yAxisCol" + (+index + 1);
          const colorName = "yColor" + (+index + 1);
          const operationName = "colOperationY" + (+index + 1);
          return (
            <div className="col-container" key={index}>
              <div key={index} className="color-perent-div">
                <div className="dropdown-select">
                  <h6 className="text-size">Select Yaxis{index + 1}</h6>
                  <select
                    className="form-select dropdown-style form-field"
                    aria-label="Default select example"
                    onChange={(e) => handleSelect(e, inputName)}
                    name={inputName}
                    value={containers[editableBox][`${inputName}`]}
                  >
                    <option value="">--Select yAxis{index + 1} col--</option>
                    {ColOptions("ycol")}
                  </select>
                </div>
                {/* <div className="select-operation">
                  <h6 className="text-size">Operation</h6>
                  <select
                    className="form-select dropdown-style form-field"
                    aria-label="Default select example"
                    onChange={(e) => handleSelect(e)}
                    name={operationName}
                    disabled={containers[editableBox]?.xAxisCol !== "timestamp"}
                    value={containers[editableBox]?.operationName}
                  >
                    <option value="">--select method--</option>
                    <option selected value="SUM">
                      SUM
                    </option>
                    <option value="AVERAGE">AVERAGE</option>
                    <option value="MIN">MIN</option>
                    <option value="MAX">MAX</option>
                    <option value="DEV">DEV</option>
                    <option value="MEDIAN">MEDIAN</option>
                  </select>
                </div> */}
                <div className="color-div">
                  <h6 className="text-size">Color</h6>
                  <input
                    className="color-plate "
                    type="color"
                    id="favcolor"
                    name={colorName}
                    onChange={(e) => handleSelect(e)}
                    value={containers[editableBox]?.[colorName]}
                  ></input>
                </div>
              </div>
            </div>
          );
        }
      )
    );
    // }
  };

  function sortable(section, onUpdate) {
    var dragEl, nextEl, newPos, dragGhost;
    console.log(section, "section");
    let oldPos = [...section.children].map(item => {
      item.draggable = true
      let pos = document.getElementById(item.id).getBoundingClientRect();
      return pos;
    });

    function _onDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      var target = e.target;
      console.log(target.draggable, "target.draggable")
      if (target && target !== dragEl && target.nodeName == 'DIV' && target.draggable) {
        if (target.classList.contains('inside')) {
          e.stopPropagation();
        } else {
          //getBoundinClientRect contains location-info about the element (relative to the viewport)
          var targetPos = target.getBoundingClientRect();
          //checking that dragEl is dragged over half the target y-axis or x-axis. (therefor the .5)
          var next = (e.clientY - targetPos.top) / (targetPos.bottom - targetPos.top) > .5 || (e.clientX - targetPos.left) / (targetPos.right - targetPos.left) > .5;
          console.log(target.nextSibling, "target.nextSibling")
          console.log(target, "this is the tartget");
          section.insertBefore(dragEl, next && target.nextSibling || target);

          /*  console.log("oldPos:" + JSON.stringify(oldPos));
           console.log("newPos:" + JSON.stringify(newPos)); */
          /* console.log(newPos.top === oldPos.top ? 'They are the same' : 'Not the same'); */
          console.log(oldPos);
        }
      }
    }
    function _onDragEnd(evt) {
      evt.preventDefault();
      newPos = [...section.children].map(child => {
        let pos = document.getElementById(child.id).getBoundingClientRect();
        return pos;
      });
      console.log(newPos);
      dragEl.classList.remove('ghost');
      section.removeEventListener('dragover', _onDragOver, false);
      section.removeEventListener('dragend', _onDragEnd, false);

      // eslint-disable-next-line no-unused-expressions
      nextEl !== dragEl.nextSibling ? onUpdate(dragEl) : false;
    }

    section.addEventListener('dragstart', function (e) {
      dragEl = e.target;
      nextEl = dragEl.nextSibling;
      /* dragGhost = dragEl.cloneNode(true);
      dragGhost.classList.add('hidden-drag-ghost'); */

      /*  document.body.appendChild(dragGhost);
       e.dataTransfer.setDragImage(dragGhost, 0, 0); */

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('Text', dragEl.textContent);

      section.addEventListener('dragover', _onDragOver, false);
      section.addEventListener('dragend', _onDragEnd, false);

      setTimeout(function () {
        dragEl.classList.add('ghost');
      }, 0)

    });
  }

  console.log(zoomed, "zoomed-------->")
  return (
    <>
      <Prompt
        when={containers}
        message="Changes that you made may not be saved.Please 
        save dashboard changes before leave the page ."
      />
      {props?.loader && (
        <div className="app-loader">
          <div>
            <CircularProgress color="primary" />
          </div>
        </div>
      )}
      <div id="mySidebar" className="sidebar">
        <div>
          <img src={logo} alt={"close"} className="logo-size" />
          <div className="closebtn" onClick={() => closeNav()}>
            ??
          </div>
        </div>
        <AppBar position="static">
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab label="Charts" />
            <Tab label="Widgets" />
          </Tabs>
        </AppBar>
        <TabPanel value={tab} name="chartsMode" index={0}>
          <div>
            <div className="equ-id  ">
              <h6 className="text-size">Select Chart Type</h6>
              <select
                className="form-select dropdown-style form-field"
                aria-label="Default select example"
                onChange={(e) => handleSelect(e)}
                name="chartType"
                // disabled={!filterKeys.country}
                value={containers[editableBox]?.chartType}
              >
                <option value="" className="bg-field">
                  --Select Chart--
                </option>
                {ChartType.map((dt, index) => (
                  <option key={index} className="bg-field" value={dt.name}>
                    {dt.name}
                  </option>
                ))}
              </select>
            </div>
            {containers[editableBox]?.chartType && <div className="equ-id  ">
              <h6 className="text-size">Chart Title</h6>
              <input
                className="form-select titleChart dropdown-style form-field"
                aria-label="Default select example"
                onChange={(e) => handleInput(e)}
                onClick={(e) => {
                  setTitleFocus(true)
                }}
                onBlur={() => {
                  setTitleFocus(false)
                }}
                name="title"
                autoFocus={titleFocus}
                // disabled={!filterKeys.country}
                value={containers[editableBox]?.title}
              >
              </input>
            </div>}
            {/* <div className="equ-id  ">
            <h6 className="text-size">Selected Deviced Id</h6>
            <select
              className="form-select dropdown-style form-field"
              aria-label="Default select example"
              onChange={(e) => handleSelect(e)}
              name="dataName"
              // disabled={!filterKeys.country}
              value={containers[editableBox]?.dataName}
            >
              <option value="">--Select fileData--</option>
              {dropdownjsonData.map((dt) => (
                <option value={dt.name}>{dt.name}</option>
              ))}
            </select>
              <input
                      className="input-legend form-field"
                      type="text"
                      name="colsNumber"
                      // step="1"
                      // min="1"
                      // max={5}
                      disabled={true}
                      
                      value={localStorage.getItem("device_id")}
                    />
          </div> */}
            {containers[editableBox]?.chartType !== "Pie" ? (
              <>
                <div className="chart-mode-perent">
                  <div className="chart-mode-div">
                    <h6 className="text-size">Select Chart Mode</h6>
                    <select
                      className="form-select dropdown-style form-field"
                      aria-label="Default select example"
                      onChange={(e) => handleSelect(e)}
                      name="chartMode"
                      // disabled={!filterKeys.country}
                      value={containers[editableBox]?.chartMode ? containers[editableBox]?.chartMode : ""}
                    >
                      <option default value="">--Select Chart Mode--</option>
                      {ChartModes.filter((dt) => {
                        if (
                          containers[editableBox]?.chartType !== "Bar" &&
                          dt.name === "stack data"
                        ) {
                          return false;
                        }
                        return true;



                      }).map((dt, idx) => (
                        <option key={idx} value={dt.name}>{dt.name}</option>
                      ))}
                    </select>
                  </div>
                  {containers[editableBox]?.chartMode === "group data" && (
                    <div className="input-number-cols">
                      <h6 className="text-size">Trace</h6>
                      <div className="trace-div">
                        <div className="input-legend div-input form-field">
                          {containers[editableBox]?.colsNumber}
                        </div>
                        {/* <input
                          className="input-legend form-field"
                          type="number"
                          name="colsNumber"
                          step="1"
                          min="1"
                          // max={5}
                          onChange={(e) => handleSelect(e)}
                          value={containers[editableBox]?.colsNumber}
                        /> */}
                        <div className="trace-updown">
                          <ArrowDropUpIcon
                            onClick={() => {
                              setContainers((prev) =>
                                prev.map((dt, idx) => {
                                  if (editableBox === idx) {
                                    return {
                                      ...dt,
                                      "colsNumber": +dt["colsNumber"] + 1
                                    };
                                  }
                                  return dt;
                                })
                              );
                            }}
                            className="trace-up"
                          // sx={{ color: "#3a4354" }}
                          />
                          <ArrowDropDownIcon
                            onClick={() => {
                              if (containers[editableBox]?.colsNumber !== 1) {
                                setContainers((prev) =>
                                  prev.map((dt, idx) => {
                                    if (editableBox === idx) {
                                      return {
                                        ...dt,
                                        "colsNumber": +dt["colsNumber"] - 1
                                      };
                                    }
                                    return dt;
                                  })
                                );
                              }
                            }}
                            className="trace-down"
                          // sx={{ color: "#3a4354" }} 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {zoomed === editableBox && <div className="x-col-div">
                  <h6 className="text-size">Select Table Row Per Page</h6>
                  <select
                    className="form-select dropdown-style form-field"
                    aria-label="Default select example"
                    onChange={(e) => handleSelect(e)}
                    name="tableRow"
                    value={containers[editableBox]?.tableRow ? containers[editableBox]?.tableRow : 5}
                  >
                    <option value="">--Select Number Of Rows</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                  </select>
                </div>}

                {/* <div className="x-axis-div"> */}
                <div className="x-col-div">
                  <h6 className="text-size">Select Xaxis</h6>
                  <select
                    className="form-select dropdown-style form-field"
                    aria-label="Default select example"
                    onChange={(e) => handleSelect(e)}
                    name="xAxisCol"
                    value={containers[editableBox]?.xAxisCol}
                  // disabled={!selectionData.chartType}
                  >
                    <option value="">--Select xAxis col--</option>
                    {ColOptions("xcol")}
                  </select>
                </div>
                {inputCols()}
                {zoomed === editableBox && <div className="custom-width">
                  <div className="showAxis-switch">
                    <h6 className="text-size">Show Text</h6>
                    <input
                      className="input-legend"
                      onChange={(e) => handleSelect(e)}
                      name="showText"
                      checked={containers[editableBox]?.showText}
                      type="checkbox"
                      id="showtext-switch"
                    />
                    <label htmlFor="showtext-switch" className="toggleButton" >Toggle</label>
                  </div>
                  <div className="tableView-switch">
                    <h6 className="text-size">Table View</h6>
                    <input
                      className="input-legend"
                      onChange={(e) => handleSelect(e)}
                      name="tableView"
                      checked={containers[editableBox]?.tableView}
                      type="checkbox"
                      id="table-switch"
                    />
                    <label htmlFor="table-switch" className="toggleButton">Toggle</label>
                  </div>
                  <div className="input-width-showfont">
                    <h6 className="text-size">Font Size</h6>

                    <div className="trace-div">
                      <div className="input-legend div-input form-field">
                        {containers[editableBox]?.axisFontSize}
                      </div>
                      {/* <input
                        className="input-legend form-field"
                        type="number"
                        name="axisFontSize"
                        step="1"
                        min="0"
                        // disabled={!containers[editableBox]?.showAxis}
                        onChange={(e) => handleSelect(e)}
                        value={containers[editableBox]?.axisFontSize}
                      /> */}
                      <div className="trace-updown">
                        <ArrowDropUpIcon
                          onClick={() => {
                            setContainers((prev) =>
                              prev.map((dt, idx) => {
                                if (editableBox === idx) {
                                  return {
                                    ...dt,
                                    "axisFontSize": +dt["axisFontSize"] + 1
                                  };
                                }
                                return dt;
                              })
                            );
                          }}
                          className="trace-up"
                        // sx={{ color: "#3a4354" }}
                        />
                        <ArrowDropDownIcon
                          onClick={() => {
                            if (containers[editableBox]?.axisFontSize > 5) {
                              setContainers((prev) =>
                                prev.map((dt, idx) => {
                                  if (editableBox === idx) {
                                    return {
                                      ...dt,
                                      "axisFontSize": +dt["axisFontSize"] - 1
                                    };
                                  }
                                  return dt;
                                })
                              );
                            }
                          }}
                          className="trace-down"
                        // sx={{ color: "#3a4354" }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>}
                {containers[editableBox]?.chartType === "Bar" && (
                  <div className="custom-width">
                    <div className="bar-width-div">
                      <h6 className="text-size">
                        {containers[editableBox]?.chartType.concat(" ", "Width")}
                      </h6>

                      <div className="trace-div">
                        <div className=" div-input input-bar-info">
                          {containers[editableBox]?.barWidth}
                        </div>
                        {/* <input
                          className="input-bar-info"
                          type="number"
                          name="barWidth"
                          step="0.1"
                          min="0"
                          // max="2"
                          // disabled={!containers[editableBox]?.yAxisCol}
                          onChange={(e) => handleSelect(e)}
                          value={containers[editableBox]?.barWidth}
                        /> */}
                        <div className="trace-updown">
                          <ArrowDropUpIcon
                            onClick={() => {
                              setContainers((prev) =>
                                prev.map((dt, idx) => {
                                  if (editableBox === idx) {
                                    return {
                                      ...dt,
                                      "barWidth": +dt["barWidth"] + 1
                                    };
                                  }
                                  return dt;
                                })
                              );
                            }}
                            className="trace-up"
                          // sx={{ color: "#3a4354" }}
                          />
                          <ArrowDropDownIcon
                            onClick={() => {
                              if (containers[editableBox]?.barWidth > 1) {
                                setContainers((prev) =>
                                  prev.map((dt, idx) => {
                                    if (editableBox === idx) {
                                      return {
                                        ...dt,
                                        "barWidth": +dt["barWidth"] - 1
                                      };
                                    }
                                    return dt;
                                  })
                                );
                              }
                            }}
                            className="trace-down"
                          // sx={{ color: "#3a4354" }} 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="input-width">
                      <h6 className="text-size">Bar Gap</h6>
                      <div className="trace-div">
                        <div className=" div-input input-bar-info">
                          {containers[editableBox]?.barGap}
                        </div>
                        {/* <input
                        className="input-bar-info form-field"
                        type="number"
                        name="barGap"
                        step="0.1"
                        min="0"
                        // max="1"
                        // disabled={!containers[editableBox]?.showAxis}
                        onChange={(e) => handleSelect(e)}
                        value={containers[editableBox]?.barGap}
                      /> */}
                        <div className="trace-updown">
                          <ArrowDropUpIcon
                            onClick={() => {
                              setContainers((prev) =>
                                prev.map((dt, idx) => {
                                  if (editableBox === idx) {
                                    return {
                                      ...dt,
                                      "barGap": +dt["barGap"] + 1
                                    };
                                  }
                                  return dt;
                                })
                              );
                            }}
                            className="trace-up"
                          // sx={{ color: "#3a4354" }}
                          />
                          <ArrowDropDownIcon
                            onClick={() => {
                              if (containers[editableBox]?.barGap > 1) {
                                setContainers((prev) =>
                                  prev.map((dt, idx) => {
                                    if (editableBox === idx) {
                                      return {
                                        ...dt,
                                        "barGap": +dt["barGap"] - 1
                                      };
                                    }
                                    return dt;
                                  })
                                );
                              }
                            }}
                            className="trace-down"
                          // sx={{ color: "#3a4354" }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {containers[editableBox]?.chartType === "Line" && (
                  <div className="custom-width">
                    <div className="showAxis-switch">
                      <h6 className="text-size">Markers</h6>
                      <input
                        className="input-legend"
                        onChange={(e) => handleSelect(e)}
                        name="markers"
                        checked={containers[editableBox]?.markers}
                        type="checkbox"
                        id="markers-switch"
                      />
                      <label htmlFor="markers-switch" className="toggleButton" >Toggle</label>
                    </div>
                    <div className="bar-width-div">
                      <h6 className="text-size">
                        {containers[editableBox]?.chartType.concat(" ", "Width")}
                      </h6>
                      <div className="trace-div">

                        <div className=" div-input input-bar-info">
                          {containers[editableBox]?.lineWidth}
                        </div>
                        {/* <input
                          className="input-bar-info "
                          type="number"
                          name="lineWidth"
                          step="1"
                          min="0"
                          max="15"
                          // disabled={!containers[editableBox]?.yAxisCol}
                          onChange={(e) => handleSelect(e)}
                          value={containers[editableBox]?.lineWidth}
                        /> */}
                        <div className="trace-updown">
                          <ArrowDropUpIcon
                            onClick={() => {
                              setContainers((prev) =>
                                prev.map((dt, idx) => {
                                  if (editableBox === idx) {
                                    return {
                                      ...dt,
                                      "lineWidth": +dt["lineWidth"] + 1
                                    };
                                  }
                                  return dt;
                                })
                              );
                            }}
                            className="trace-up"
                          // sx={{ color: "#3a4354" }}
                          />
                          <ArrowDropDownIcon
                            onClick={() => {
                              if (containers[editableBox]?.lineWidth > 1) {
                                setContainers((prev) =>
                                  prev.map((dt, idx) => {
                                    if (editableBox === idx) {
                                      return {
                                        ...dt,
                                        "lineWidth": +dt["lineWidth"] - 1
                                      };
                                    }
                                    return dt;
                                  })
                                );
                              }
                            }}
                            className="trace-down"
                          // sx={{ color: "#3a4354" }} 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="input-scatter-width">
                      <h6 className="text-size">Marker Size</h6>
                      <div className="trace-div">

                        <div className="div-input input-bar-info">
                          {containers[editableBox]?.scatterSize}
                        </div>
                        {/* <input
                          className="input-bar-info"
                          type="number"
                          name="scatterSize"
                          step="1"
                          min="0"
                          max="40"
                          // disabled={true}
                          // onChange={(e) => handleSelect(e)}
                          value={containers[editableBox]?.scatterSize}
                        /> */}
                        <div className="trace-updown">
                          <ArrowDropUpIcon
                            onClick={() => {
                              setContainers((prev) =>
                                prev.map((dt, idx) => {
                                  if (editableBox === idx) {
                                    return {
                                      ...dt,
                                      "scatterSize": +dt["scatterSize"] + 1
                                    };
                                  }
                                  return dt;
                                })
                              );
                            }}
                            className="trace-up"
                          // sx={{ color: "#3a4354" }}
                          />
                          <ArrowDropDownIcon
                            onClick={() => {
                              if (containers[editableBox]?.scatterSize > 1) {
                                setContainers((prev) =>
                                  prev.map((dt, idx) => {
                                    if (editableBox === idx) {
                                      return {
                                        ...dt,
                                        "scatterSize": +dt["scatterSize"] - 1
                                      };
                                    }
                                    return dt;
                                  })
                                );
                              }
                            }}
                            className="trace-down"
                          // sx={{ color: "#3a4354" }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="equ-id  ">
                  <h6 className="text-size">Select Target Column</h6>
                  <select
                    className="form-select dropdown-style form-field"
                    aria-label="Default select example"
                    onChange={(e) => handleSelect(e)}
                    name="targetCol"
                    value={containers[editableBox]?.targetCol}
                  // disabled={!selectionData.xAxisCol}
                  >
                    <option value="">--Select Target Col--</option>
                    {ColOptions("ycol")}
                  </select>
                </div>
                <div className="custom-legend">
                  <div className="legend-switch">
                    <h6 className="text-size">Text Info</h6>
                    <input
                      className="input-legend"
                      onChange={(e) => handleSelect(e)}
                      name="textInfo"
                      checked={containers[editableBox]?.textInfo}
                      type="checkbox"
                      id="textInfo-switch"
                    />
                    <label htmlFor="textInfo-switch" className="toggleButton">Toggle</label>
                  </div>
                  <div className="input-text-position">
                    <h6 className="text-size">Select Text Position</h6>
                    <select
                      className="form-select dropdown-style form-field"
                      aria-label="Default select example"
                      onChange={(e) => handleSelect(e)}
                      name="textPosition"
                      value={containers[editableBox]?.textPosition}
                      disabled={!containers[editableBox]?.textInfo}
                    >
                      <option value="">--Select Text Position--</option>
                      <option value="inside">inside</option>
                      <option value="outside">outside</option>
                    </select>
                  </div>
                </div>
              </>
            )}

          </div>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          {/* <div className="equ-id">
            <h6 className="text-size">Select Data</h6>
            <select
              className="form-select dropdown-style form-field"
              aria-label="Default select example"
              onChange={(e) => handleSelect(e)}
              name="dataName"
              // disabled={!filterKeys.country}
              value={containers[editableBox]?.dataName}
            >
              <option value="">--Select fileData--</option> 
              
            </select>
          </div> */}

          <div className="option-field-avg">
            <h6 className="text-size">Operation</h6>
            <select
              className="form-select dropdown-style form-field"
              aria-label="Default select example"
              onChange={(e) => handleSelect(e)}
              name="operation"
              value={containers[editableBox]?.operation}
            >
              <option value="">--select method--</option>
              <option value="SUM">
                SUM
              </option>
              <option value="AVERAGE">AVERAGE</option>
              <option value="MIN">MIN</option>
              <option value="MAX">MAX</option>
              <option value="DEV">DEV</option>
              <option value="MEDIAN">MEDIAN</option>
              <option value="LETEST">LETEST</option>
            </select>
          </div>
          <div className="option-field-avg">
            <h6 className="text-size">Select Target Col</h6>
            <select
              className="form-select dropdown-style form-field"
              aria-label="Default select example"
              onChange={(e) => handleSelect(e)}
              name="targetCol"
              value={containers[editableBox]?.targetCol}
            >
              <option value="">--Select Target Col--</option>
              {wedgetsColOptions("ycol")}
            </select>
          </div>
          <div className="custom-width">
            <div className="showAxis-switch">
              <h6 className="text-size">Gauge Mode</h6>
              <input
                className="input-legend"
                onChange={(e) => handleSelect(e)}
                name="gaugeMode"
                checked={containers[editableBox]?.gaugeMode}
                type="checkbox"
                id="gauge-switch"
              />
              <label htmlFor="gauge-switch" className="toggleButton">Toggle</label>
            </div>
            <div className="color-div">
              <h6 className="text-size">Text Color</h6>
              <input
                className="color-plate "
                type="color"
                id="favcolor"
                name="textColor"
                onChange={(e) => handleSelect(e)}
                value={containers[editableBox]?.textColor}
              ></input>
            </div>
            <div className="color-div">
              <h6 className="text-size">BG Color</h6>
              <input
                className="color-plate "
                type="color"
                id="favcolor"
                name="boxColor"
                onChange={(e) => handleSelect(e)}
                value={containers[editableBox]?.boxColor}
              ></input>
            </div>
          </div>
        </TabPanel>
      </div>
      <Box id="perent-container" className="box-wrapper">
        <Box id="box1">
          {/* <img
            src={back}
            onClick={props.handleOpenAccodion}
            className="img-size"
            alt="back"
          /> */}
          <Grid item xs={12} lg={12} md={12} sm={12} className="flex-style">
            <Grid item xs={12} lg={12} md={12} sm={12}>
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                  <div className="heading-text">{deviceId}</div>
                </div>
                <div style={{ display: "flex" }}>
                  <Button2
                    type="default"
                    block
                    onClick={() => {
                      setXaxis(10);
                      setYaxis(10);
                      setContainers([]);
                    }}
                    style={{ width: "200px", height: "26px", fontSize: "13px", marginRight: "10px" }}
                  >
                    Remove All Charts
                  </Button2>
                  <Button2
                    type="default"
                    block
                    onClick={() => { setSaveDash(prev => prev + 1) }}
                    style={{ width: "200px", height: "26px", fontSize: "13px" }}
                  >
                    Save Dashboard
                  </Button2>
                </div>
              </div>
            </Grid>
          </Grid>
        </Box>

        <Grid
          container
          id="containerHeight"
          style={{
            height: "calc(100% - 9vh - 12px )",
            flex: "1 0 auto",
            position: "relative",
          }}
        >
          <Grid
            item
            xs={12}
            lg={12}
            md={12}
            sm={12}
            className="box-container-cxo"
          >
            {/* <Grid
              item
              xs={12}
              lg={12}
              md={12}
              sm={12}
              style={{ height: "100%" }}
              id="editor-container"
              className="box-shadow"
            > */}
            <div className="chart-container">
              <section id="list">
                {divContainer()}
              </section>
              {/* <section id="list">
              <div id='div1' class='divRec'><div class='inside'>item 1</div></div>
              <div id='div2' class='divQuad'><div class='inside'>item 2</div></div>
              <div id='div3' class='divRec'><div class='inside'>item 3</div></div>
              <div id='div4' class='divCard'><div class='inside'>item 4</div></div>
              <div id='div5' class='divRec'><div class='inside'>item 5</div></div>
              <div id='div6' class='divQuad'><div class='inside'>item 6</div></div>
              <div id='div7' class='divCard'><div class='inside'>item 7</div></div>
              <div id='div8' class='divRec'><div class='inside'>item 8</div></div>
            </section> */}
            </div>

            {/* </Grid> */}
            <Dialog open={deletePopUp.open} maxWidth="sm" fullWidth>
              <DialogTitle>Are you sure you want delete this graph ?</DialogTitle>
              <Box position="absolute" top={0} right={0}>
                <IconButton onClick={handleClose}>
                  <Close />
                </IconButton>
              </Box>
              <DialogContent>
                <Typography>
                  {containers[deletePopUp?.index]?.dataName}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button2
                  type="primary"
                  danger
                  onClick={handleClose}
                >
                  Cancel
                </Button2>
                <Button2
                  className="popup-confirm"
                  type="primary"
                  onClick={(e) => handleDeleteContainer(deletePopUp?.index, e)}
                >
                  Confirm
                </Button2>
              </DialogActions>
            </Dialog>
          </Grid>
          {/* <div className="opensidebar"> */}
          {zoomed === "" && <button
            id="openbtn"
            className="openbtn"
            onClick={() => handleAddContainer()}
          >
            +
          </button>}
          {/* </div> */}
        </Grid>
      </Box>
    </>
  );
}

// const mapStateToProps = (state) => {
//   return {
//     deviceId: state.sensorDeviceReducer.deviceId
//   };
// };
// // export default LineChart;
// export default connect(mapStateToProps, null)(CustomDashboard);

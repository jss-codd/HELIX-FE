
import React, { useState, useEffect, useContext } from "react";
import CustomDashboard from "../../../util/Plotly/Dashboards/CustomDashboard";
import socketio from "socket.io-client";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "../../../../app";
import { connect } from "react-redux";

import { cloneDeep } from "lodash";



export default function Chart() {

  const [containers, setContainers] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [editableBox, setEditableBox] = useState(0);
  const [ioData, setIoData] = useState([]);
  const [saveDash, setSaveDash] = useState(false)
  const [loader, setLoader] = useState(false);
  const value = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    let resdata = [];
    const accessToken = localStorage.getItem("accessToken");
    const device_id = new URLSearchParams(location.search).get('device');
    await axios
      .get(
        `${process.env.API_URL}/sensor_data?deviceId=${device_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        const sensors = res.data;
        console.log("---feych- by device id--", sensors);
        resdata = sensors;
        let filter_data = sensors.map(dt => {
          delete dt.device_id
          return dt
        })

        filter_data.sort(function (x, y) {
          return new Date(x.timestamp) - new Date(y.timestamp);
        })
        // console.log("-----------filter data------",filter_data)
        setSensorData(filter_data);
        // setDropDownjsonData((prev) => {
        //   prev[0].data = sensors;
        //   return prev;
        // });
        // setLoader(false);
      });

    return resdata;
  };


  // ----------------------filter date------------------------------


  useEffect(() => {
    const device_id = new URLSearchParams(location.search).get('device');
    const accessToken = localStorage.getItem("accessToken");

    const fetchData = async () => {
      // setLoader(true);
      // const start = moment(containers[editableBox]?.startDate).format(
      //   "MM-DD-YYYY"
      // );
      // const end = moment(containers[editableBox]?.endDate).format("MM-DD-YYYY");
      await axios
        .get(
          `${process.env.API_URL}/sensor_data/getFilterSensorData?startDate=${containers[editableBox]?.startDate}&endDate=${containers[editableBox]?.endDate}&deviceId=${device_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          const sensors = res.data;

          let filter_data = sensors.map(dt=>{
            delete dt.device_id
            return dt
          })

          setSensorData(filter_data);
          // setLoader(false);
        });
    };
    if (
      containers[editableBox]?.startDate &&
      containers[editableBox]?.endDate
    ) {
      fetchData();
    }
  }, [containers[editableBox]?.startDate, containers[editableBox]?.endDate]);


  // -----------------------------socket data----------------------

  useEffect(() => {
    if (ioData !== "") {
      const sensorDataCopy = sensorData.concat(ioData);
      sensorDataCopy.sort(function (x, y) {
        return new Date(x.timestamp) - new Date(y.timestamp);
      })

      setSensorData(sensorDataCopy);
    }
  }, [ioData]);

  useEffect(() => {
    const socket = socketio.connect(process.env.REACT_APP_SERVER_URL);
    const device_id = new URLSearchParams(location.search).get('device');

    socket.on("connected", function (data) {
      socket.emit("ready for data", {});
    });
    socket.on(value?.userInfo?.sub, function (data) {
      console.log(data, "data----------socket")
      let socket_data = JSON.parse(data)
      if (socket_data.device_id === device_id) {
        delete socket_data.device_id
        setIoData(socket_data);

      }
    });
  }, [value]);


  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const containerCopy = cloneDeep(containers);
    const device_id = new URLSearchParams(location.search).get('device');

    if (containerCopy !== undefined && containerCopy.length > 0) {
      setLoader(true)
      let sendData = containerCopy.map((d) => {
        d.data = [];
        d.startDate = '';
        d.endDate = ''
        return d;
      });

      let plottt = axios
        .post(
          `${process.env.API_URL}/plotly_dash/createPlotlyDash?deviceId=${device_id}`,
          sendData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          setLoader(false)

        }).catch((e) => {
          setLoader(false)
          console.log(e)
        });
    }
  }, [saveDash]);


  // -----------------------ploty data------------------------

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const device_id = new URLSearchParams(location.search).get('device');
    axios
      .get(
        `${process.env.API_URL}/plotly_dash?deviceId=${device_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(async (res) => {
        if (res.data !== "") {
          console.log("-------plotly dta------", res);
          let dta = res?.data?.data;

          let sens = await fetchData();

          const newArray = dta.map((dt) => {
            //  dt.data.push("new string");

            return {
              ...dt,
              data: sens,
            };
            // return dt ;
          });

          setContainers(cloneDeep(newArray));
        } else {
          // setContainers([]);
        }
      });


  }, []);

  return (
    <>
      <div className="App">
        <>
          <CustomDashboard
            containers={containers}
            setContainers={setContainers}
            sensorData={sensorData}
            setSensorData={setSensorData}
            editableBox={editableBox}
            setEditableBox={setEditableBox}
            setSaveDash={setSaveDash}
            loader={loader}
            setLoader={setLoader}

          />
        </>

      </div>
    </>
  );
}

{/* const mapStateToProps = (state) => {
  return {
    deviceId: state.sensorDeviceReducer.deviceId
  };
};
// export default LineChart;
export default connect(mapStateToProps, null)(Chart); */}

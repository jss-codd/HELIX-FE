
import React, { useState, useEffect, useContext } from "react";
import CustomDashboard from "../../../util/Plotly/Dashboards/CustomDashboard";
import socketio, { io } from "socket.io-client";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../../../../app";
import { connect } from "react-redux";

import { cloneDeep } from "lodash";



export default Chart = (props) => {
  const [containers, setContainers] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [editableBox, setEditableBox] = useState(0);
  const [ioData, setIoData] = useState([]);
  const [saveDash, setSaveDash] = useState(0)
  const [loader, setLoader] = useState(false);
  const [chartLoader, setChartLoader] = useState(false);
  const value = useContext(AuthContext);


  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   if (containers[editableBox]?.xAxisCol && containers[editableBox]?.yAxisCol1 && containers[editableBox]?.data?.length) {
  //     setChartLoader(true);
  //   }
  // }, [containers])

  const convertIntoLocalTime = (date) => {
    var dateFormat = 'YYYY-MM-DD HH:mm:ss';
    var testDateUtc = moment.utc(date);
    var localDate = testDateUtc.local();
    return localDate.format(dateFormat)
  }

  const calculateDew = (arr) => {
    const dataArr = [];
    const a = 17.625;
    const b = 243.04;

    dataArr.push(...arr?.map((dt) => {
      const localTime = convertIntoLocalTime(dt.timestamp);
      const alpha = Math.log(dt.humidity / 100) + (a * dt.temperature) / (b + dt.temperature);
      const dewPoint = (b * alpha / (a - alpha));
      return {
        ...dt,
        "timestamp": localTime,
        "dew": dewPoint?.toFixed(2),
      }
    }))

    return dataArr;
  }

  const fetchData = async () => {
    console.log("---------------sftech-----555555----");
    let resdata = [];
    const accessToken = localStorage.getItem("accessToken");
    const device_id = new URLSearchParams(location.search).get('device');
    await axios.get(
      `${process.env.API_URL}/sensor_data?deviceId=${device_id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then((res) => {
        const sensors = res.data;
        resdata = sensors;
        let filter_data = sensors.map(dt => {
          delete dt.device_id
          return dt
        })
        filter_data.sort(function (x, y) {
          return new Date(x.timestamp) - new Date(y.timestamp);
        })
        const allData = calculateDew(filter_data);
        setSensorData(allData);
        // setDropDownjsonData((prev) => {
        //   prev[0].data = sensors;
        //   return prev;
        // });
        // setLoader(false);

      });


  };

  useEffect(() => {
    console.log("---------100-----start and end date-------");
    const device_id = new URLSearchParams(location.search).get('device');
    const accessToken = localStorage.getItem("accessToken");

    const fetchData = async () => {
      // setLoader(true);
      setChartLoader(true);
      const start = moment(containers[editableBox]?.startDate).format(
        "MM-DD-YYYY"
      );
      const end = moment(containers[editableBox]?.endDate).format("MM-DD-YYYY");
      await axios
        .get(
          `${process.env.API_URL}/sensor_data/getFilterSensorData?startDate=${containers[editableBox]?.startDate}&endDate=${containers[editableBox]?.endDate}&deviceId=${device_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
        .then((res) => {
          const sensors = res.data;

          let filter_data = sensors.map(dt => {
            delete dt.device_id
            return dt
          })

          filter_data.sort(function (x, y) {
            return new Date(x.timestamp) - new Date(y.timestamp);
          })

          const allData = calculateDew(filter_data);
          // setSensorData(allData);
          setContainers((prev) =>
            prev.map((dt, idx) => {
              if (editableBox === idx) {
                return {
                  ...dt,
                  data: allData,
                };
              }
              return dt;
            })
          );
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
    const a = 17.625;
    const b = 243.04;
    if (ioData !== "") {
      var dateFormat = 'YYYY-MM-DD HH:mm:ss';
      var testDateUtc = moment.utc(ioData.timestamp);
      var localDate = testDateUtc.local();

      const alpha = Math.log(ioData.humidity / 100) + (a * ioData.temperature) / (b + ioData.temperature);
      const dewPoint = (b * alpha / (a - alpha));

      ioData.timestamp = localDate.format(dateFormat);
      ioData.dew = dewPoint?.toFixed(2);
      const sensorDataCopy = sensorData.concat(ioData);
      sensorDataCopy.sort(function (x, y) {
        return new Date(x.timestamp) - new Date(y.timestamp);
      })
      // const allData = calculateDew(sensorDataCopy);
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

      let socket_data = JSON.parse(data)
      // console.log("------seocket--adta---",socket_data);
      if (socket_data.device_id === device_id) {
        delete socket_data.device_id
        setIoData(socket_data);
      }
    });
  }, []);


  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const containerCopy = cloneDeep(containers);
    const device_id = new URLSearchParams(location.search).get('device');

    if (saveDash !== 0) {
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
    const endDate = moment().format('YYYY-MM-DD');
    const startDate = moment().subtract(1, 'd').format('YYYY-MM-DD');
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
          let dta = res?.data?.data;

          let sens = await fetchData();

          const newArray = dta.map((dt) => {
            //  dt.data.push("new string");

            return {
              ...dt,
              data: sens,
              startDate: startDate,
              endDate: endDate
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
            editableBox={editableBox}
            setEditableBox={setEditableBox}
            setSaveDash={setSaveDash}
            loader={loader}
            setLoader={setLoader}
            setChartLoader={setChartLoader}
            chartLoader={chartLoader}
          />
        </>

      </div>
    </>
  );
}

// const mapStateToProps = (state) => {
//   return {
//     deviceId: state.sensorDeviceReducer.deviceId
//   };
// };
// // export default LineChart;
// export default connect(mapStateToProps, null)(Chart);

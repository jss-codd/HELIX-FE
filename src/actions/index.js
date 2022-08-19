// export const sensorAction = (sensors) => (dispatch) => {
//     dispatch({
//       type: "SENSOR_ACTION",
//       payload: sensors,
//     });
//   };

  export const setSensorDeviceId = (deviceId) => (dispatch) => {
    console.log("in...........")
    dispatch({
      type: "DEVICE_ID",
      payload: deviceId,
    });
  };
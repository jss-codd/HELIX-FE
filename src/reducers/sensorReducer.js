const initialState = {
    sensor: [],
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case "SENSOR_ACTION":
        return {
          sensor: action.payload,
        };
      default:
        return state;
    }
  };
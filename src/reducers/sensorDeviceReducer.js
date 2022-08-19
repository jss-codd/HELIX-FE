const initialState = {
    deviceId: "",
};

export default (state = initialState, action) => {
    console.log(action,"actions")
    switch (action.type) {
        case "DEVICE_ID":
            return {
                deviceId: action.payload,
            };
        default:
            return state;
    }
};
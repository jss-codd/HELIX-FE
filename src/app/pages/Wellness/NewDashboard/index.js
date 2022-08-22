import React, { useEffect, useState, useCallback, useContext } from "react";
import { useHistory, useLocation,useParams } from "react-router-dom";
import moment from "moment";
import {
  Divider,
  Spin,
  Button,
  Select,
  Radio,
  Rate,
  Tooltip,
  message,
  Modal,
} from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import useFetch from "@app/util/useFetch";
import AnalyticIcon from "@images/icons/analytics.svg";
import LocationIcon from "@images/icons/location.svg";
import CalendarIcon from "@images/icons/calendar.svg";
import ComponentGridLayout from "./ComponentGridLayout";
import { AuthContext } from "../../../../app";
// import { setSensorDeviceId } from "../../../../actions/index";
// import Chart from "../Analytics/Chart";
// import { connect } from "react-redux";

const Dashboard = ({ activeIndex, setActiveIndex, application ,match }) => {
  const value = useContext(AuthContext);
  const keycloackValue = value;
  const [sensors, setSensors] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const location = useLocation()
 
  const applicationList = application.map(d=>d.name)

  const history = useHistory();
  const params = useParams()

 

  console.log("--------------type--------- type-----------",params );

  const { loading, fetchData: getSensors } = useFetch({
    url: `${process.env.API_URL}/sensors?applicationType=${params?.type}`,
    method: "GET",
    onSuccess: (data) => {
      setSensors(data);
      if (data.length < 1) 
      {
        // if (keycloackValue?.hasRealmRole("Add Sensor") ) {
        //   history.push(`/${params?.type}/sensor`);
        // }
        // history.push(`/${params?.type}/sensor`);
      } else {
        console.log("--------else------------");
        setSelectedSensor(data[0]);
        // props.setSensorDeviceId(data[0].device_id);
        // localStorage.setItem("device_id", data[0].device_id);
      }
    },
  });

  console.log("----------sensors----", sensors);

  const {
    loading: loadingSensorData,
    data: sensorData,
    fetchData: getSensorData,
  } = useFetch((sensorId) => ({
    url: `${process.env.API_URL}/sensors/${sensorId}`,
    method: "GET",
  }));

  const { fetchData: deleteSensor } = useFetch((sensorId) => ({
    url: `${process.env.API_URL}/sensors/${sensorId}?type=${params?.type}`,
    method: "DELETE",
    onSuccess: () => {
      const ss = sensors.filter((sensor) => sensor._id !== sensorId);
      setSensors([...ss]);
      if (ss.length < 1) {
        history.push(`/${params?.type}/sensor`);
      } else {
        setSelectedSensor(ss[0]);
      }
    },
  }));



  useEffect(() => {
    setSensors([])

    getSensors();
  }, [location?.pathname]);

  useEffect(() => {
    if (selectedSensor) {
      getSensorData(selectedSensor._id);
    }
  }, [selectedSensor]);

  const onSelectSensor = (value) => {
    const sensor = sensors.find((it) => it._id === value);
    setSelectedSensor(sensor);
    // console.log("--sensor------,",sensor,"fksfsifsfjsfsf",value);
    // props.setSensorDeviceId(sensor.device_id);
    // localStorage.setItem("device_id", sensor.device_id);
  };

  const handleEditSensor = () => {
    if (selectedSensor) {
      history.push(`/${params?.type}/sensor/${selectedSensor._id}`);
    } else {
      message.error("No sensor selected!");
    }
  };

  const handleDeleteSensor = () => {
    if (selectedSensor) {
      Modal.confirm({
        title: "Are you sure you want to delete this sensor?",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: () => deleteSensor(selectedSensor._id),
      });
    } else {
      message.error("No sensor selected!");
    }
  };

  const handleDownloadCert = () => {
    if (selectedSensor) {
      const accessToken = localStorage.getItem("accessToken");
      fetch(
        `${process.env.API_URL}/sensors/${selectedSensor._id}/certificates`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
        .then((response) => response.blob())
        .then((blob) => {
          // Create blob link to download
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "certificates.zip");

          // Append to html link element page
          document.body.appendChild(link);

          // Start download
          link.click();

          // Clean up and remove the link
          link.parentNode.removeChild(link);
        });
    } else {
      message.error("No sensor selected!");
    }
  };

  if (loading || loadingSensorData)
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-75">
        <Spin />
        <h5>Fetching data from server ...</h5>
      </div>
    );

  return (
    <div className="p-4" style={{ marginBottom: 150 }}>
      <div className="row position-relative">
        <div className="col-md-6">
          <h2 className="text-mandy font-weight-bold">
            <img
              src={AnalyticIcon}
              width="50"
              height="50"
              className="mr-3"
              style={{ marginTop: -8 }}
            />
            {/* New Dashboard */}
            Sensor Provisioning
          </h2>
        </div>
        {/* <div
          className="d-flex justify-content-end"
          style={{ position: "absolute", top: 0, right: 16 }}
        >
          <Button
            className="border-0"
            size="large"
            ghost
            icon={<ArrowLeftOutlined style={{ color: "#4e5664" }} />}
            disabled={activeIndex < 1}
            onClick={() => setActiveIndex(activeIndex - 1)}
          />
          <Button
            className="border-0"
            size="large"
            ghost
            icon={<ArrowRightOutlined style={{ color: "#4e5664" }} />}
            disabled={activeIndex > 2}
            onClick={() => setActiveIndex(activeIndex + 1)}
          />
        </div> */}
      </div>
      <Divider style={{ border: "1px solid #d84e59", marginTop: 0 }} />
      <div className="row">
        <div className="plotly_button_main_div">
          <div className="col mb-3">
            {/* change md 12 */}
            <div className="mb-2" style={{ fontWeight: 600 }}>
              Sensor
              {keycloackValue?.hasRealmRole("Add Sensor") && (
                <Tooltip title="Add more sensor">
                  <Button
                    size="small"
                    shape="circle"
                    className="ml-3"
                    icon={<i className="fa fa-plus text-primary" />}
                    onClick={() => {
                      history.push(`/${params?.type}/sensor`);
                    }}
                  />
                </Tooltip>
              )}
              {keycloackValue?.hasRealmRole("Edit Sensor") && (
                <Tooltip title="Edit Sensor">
                  <Button
                    size="small"
                    shape="circle"
                    className="ml-3"
                    icon={<i className="fa fa-pencil text-primary" />}
                    onClick={handleEditSensor}
                  />
                </Tooltip>
              )}
              {keycloackValue?.hasRealmRole("Download Certificates") && (
                <Tooltip title="Download certificates">
                  <Button
                    size="small"
                    shape="circle"
                    className="ml-3"
                    icon={<i className="fa fa-download text-primary" />}
                    onClick={handleDownloadCert}
                  />
                </Tooltip>
              )}
              {keycloackValue?.hasRealmRole("Delete Sensor") && (
                <Tooltip title="Delete Sensor">
                  <Button
                    size="small"
                    shape="circle"
                    className="ml-3"
                    icon={<i className="fa fa-trash text-primary" />}
                    onClick={handleDeleteSensor}
                  />
                </Tooltip>
              )}
            </div>
            {console.log("--------sensors--", sensors)}
            <Select
              style={{ width: 360 }}
              placeholder="Select sensor"
              value={selectedSensor?._id}
              onSelect={onSelectSensor}
              options={sensors.map((sensor) => ({
                value: sensor._id,
                label: sensor.device_id,
              }))}
            />
          </div>

          {keycloackValue?.hasRealmRole("View Dashboard") && <div className="plotly_butotn_container">
            <Button
              type="default"
              className="col mb-3"
              block
              onClick={() => {
                history.push(
                  {
                    pathname: `../application/${params?.type}/chart`,
                    search: `?device=${selectedSensor.device_id}`,
                  });
              }}
            >
              Dashboard
            </Button>
          </div>}
        </div>
      </div>
      {/* --------------------------- i have replace that code with plotly------------------------ */}
      <div className="row wellness_details">
        <div className="col-md-4 p-2">
          <div className="mb-2" style={{ fontWeight: 600 }}>
            Wellness
            {/* Washroom i  changed int o wllnessa  */}
          </div>
          <div className="pl-4">
            {sensorData?.washroom?.type?.toUpperCase()}
          </div>
        </div>
        <div className="col-md-4 p-2">
          {/* <div className="mb-2" style={{ fontWeight: 600 }}>
            Level
          </div>
          <Radio.Group
            buttonStyle="solid"
            value={sensorData?.floor._id}
            // disabled
          >
            {sensorData?.infrastructure.floors
              .sort((a, b) => a.index - b.index)
              ?.map((floor) => (
                <Radio.Button
                  key={floor._id}
                  value={floor._id}
                  className="mr-3 border rounded-circle"
                  style={{
                    height: 40,
                    fontSize: 16,
                    lineHeight: "40px",
                  }}
                >
                  {floor.sign}
                </Radio.Button>
              ))}
          </Radio.Group> */}
        </div>
        {/* ------------------------disable-for wellness------------------------------- */}
        <div className="col-md-4 p-2">
          {/* <Radio.Group
            buttonStyle="solid"
            className="d-flex flex-row justify-content-center"
            value={sensorData?.washroom.type}
          >
            {["Male", "Female", "Disabled"].map((wr_type) => (
              <Radio.Button
                key={wr_type}
                value={wr_type.toLowerCase()}
                className="mr-2 border"
                style={{
                  height: 40,
                  fontSize: 16,
                  lineHeight: "40px",
                  borderRadius: 20,
                  fontWeight: "normal",
                }}
              >
                {wr_type}
              </Radio.Button>
            ))}
          </Radio.Group> */}
          {/* <div className="d-flex justify-content-center align-items-center mt-3">
            Rating: <Rate allowHalf value={4.0} className="ml-2" />{" "}
            <span
              className="ml-2 py-1 px-2 text-primary"
              style={{
                backgroundColor: "rgb(234, 106, 71, 0.1)",
                fontWeight: "bolder",
              }}
            >
              4.0
            </span>
          </div> */}
        </div>
        <div className="col-md-4 p-2">
          <div className="rounded p-3 bg-gray">
            <div className="text-primary font-weight-semibold">Infra</div>
            <Divider style={{ marginTop: 12 }} />
            <div style={{ lineHeight: "40px" }}>
              {sensorData?.infrastructure.name}
            </div>
          </div>
        </div>
        <div className="col-md-4 p-2">
          <div className="rounded p-3 bg-gray">
            <div className="text-primary font-weight-semibold">Location</div>
            <Divider style={{ marginTop: 12 }} />
            <div className="media">
              <img
                className="mr-3"
                src={LocationIcon}
                height={40}
                alt="location icon"
              />
              <div className="media-body">
                {sensorData?.infrastructure.location}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 p-2">
          <div className="rounded p-3 bg-gray">
            {/* <div className="text-primary font-weight-semibold">Date & Time</div> */}
            <div className="text-primary font-weight-semibold">Floor</div>
            <Divider style={{ marginTop: 12 }} />
            <div className="media">
              {/* <img
                className="mr-3"
                src={CalendarIcon}
                height={40}
                alt="location icon"
              /> */}

              <div className="media-body">
                {/* -----------------remove for wellness------------------- */}
                {/* {sensorData?.data?.timez
                  ? moment(sensorData.data.timez).format("DD/MM/YYYY HH:mm:ss")
                  : "--/--/---- --:--:--"} */}
                {/* {sensorData?.floor._id} */}
                {/* {console.log("---------floor------",sensorData)} */}
                {<div style={{ lineHeight: "40px" }}>{sensorData?.floor?.sign}</div>}

                {/* {sensorData?.infrastructure.floors
                  .sort((a, b) => a.index - b.index)
                  ?.map((floor) => (
                    // <Radio.Button
                    //   key={floor._id}
                    //   value={floor._id}
                    //   className="mr-3 border rounded-circle"
                    //   style={{
                    //     height: 40,
                    //     fontSize: 16,
                    //     lineHeight: "40px",
                    //   }}
                    // >
                    <div style={{ lineHeight: "40px" }}>{floor.sign}</div>

                    // </Radio.Button>
                  ))} */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="row p-3 mt-4">
        <div className="col border rounded p-3 h-100 bg-gray">
          <ComponentGridLayout
            components={sensorData?.components}
            data={sensorData?.data}
          />
        </div>
      </div> */}
      {/* <Chart /> */}
    </div>
  );
};

// const mapDispatchToProps = (dispatch) => ({
//   setSensorDeviceId: (deviceId) => dispatch(setSensorDeviceId(deviceId)),
// });

// export default Chart ;
// export default connect(null, mapDispatchToProps)(Dashboard);

export default Dashboard;

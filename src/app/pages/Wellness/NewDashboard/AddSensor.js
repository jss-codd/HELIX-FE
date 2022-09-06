import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Divider, Spin, Button, message } from "antd";
import useFetch from "@app/util/useFetch";
import { Form, Select, Input, InputNumber } from "formik-antd";
import { Formik, Field, ErrorMessage, FieldArray } from "formik";
import isEmpty from "lodash/fp/isEmpty";
import washroomIcon from "@images/icons/washroom.svg";
import GatewayForm from "./GatewayForm";
import uploadIcon from "../../../images/icons/upload.png";
import downloadIcon from "../../../images/icons/download.png";
import buildingIcon from "../../../images/icons/buildings.png";
import { ScaleLoader } from "react-spinners";
import { css } from "@emotion/react";
import { AuthContext } from "../../../../app";
import axios from "axios";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ColorLensOutlined } from "@material-ui/icons";
import debounce from 'lodash.debounce';
import { borderTop } from "@mui/system";
const AddSensorPage = (
  {
    // initialValues = {}
  }
) => {
  const [initialValues, setInitialValues] = useState({
    config: {
      conf_data: [],
    },
  });
  const [infrastructures, setInfrastructures] = useState([]);
  const [selectedInfra, setSelectedInfra] = useState(null);
  const [isNewInfra, setIsNewInfra] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [isNewFloor, setIsNewFloor] = useState(false);
  const [currentSensor, setCurrentSensor] = useState(initialValues._id);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [isNewSolution, setIsNewSolution] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [showModelButton, setShowModelButton] = useState(true);
  const fileRef = useRef();
  const keyRef = useRef();
  const [productIdList, setProductIdList] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const value = useContext(AuthContext);
  const keycloackValue = value;
  const history = useHistory();
  const [collapse, setCollapse] = useState(false);
  const [sensorConfig, setSensorConfig] = useState([]);
  const [configData, setConfigData] = useState([{}]);
  const ref = useRef(null);
  const deviceIdRef = useRef(null)
  const [showAccord, setShowAccord] = useState(false);
  const [modal, setModal] = useState(false);
  const [sensorConfigData, setSensorConfigData] = useState({
    config: []
  })
  const [showError, setShowError] = useState(false)
  const [submitLoader, setSubmitLoader] = useState(false)
  const [pubHost, setPubHost] = useState("")
  const [pubPort, setPubPort] = useState("")
  const [pubTopic, setPubTopic] = useState("")
  const [topicError, setTopicError] = useState(false)
  const [gatewayError, setGatewayErorr] = useState(false)
  const [sensorType, setSensorType] = useState("")
  const currentPath = history.location.pathname.split("/");
  const location = useLocation()
  const applicationType = location?.pathname.split('/')[2]
  const [publishDataType, setPublishDataType] = useState("None")
  console.log("----f-----", publishDataType);


  const uploadTopic = async (params) => {

    // setSubmitLoader(true)
    const formData = new FormData();


    // ------------mqtt-------
    formData.append("file", params.publishMqtt?.keyfile);
    formData.append("file", params.publishMqtt?.crtfile);
    formData.append("file", params.publishMqtt?.rootcafile);

    // -----kafka--------------------------------

    formData.append("file", params.publishKafka?.keyfile);
    formData.append("file", params.publishKafka?.crtfile);
    formData.append("file", params.publishKafka?.rootcafile);


    // eslint-disable-next-line no-unused-expressions
    if (params.publishMqtt !== null && params.publishMqtt !== undefined) {
      params.publishMqtt.keyfile = params.publishMqtt?.keyfile?.name
      params.publishMqtt.crtfile = params.publishMqtt?.crtfile?.name
      params.publishMqtt.rootcafile = params.publishMqtt?.rootcafile?.name

    }
    else {
      delete params?.publishMqtt
    }
    if (params.publishKafka !== null && params.publishKafka !== undefined) {
      params.publishKafka.keyfile = params.publishKafka?.keyfile?.name
      params.publishKafka.crtfile = params.publishKafka?.crtfile?.name
      params.publishKafka.rootcafile = params.publishKafka?.rootcafile?.name

    }
    else {
      delete params?.publishKafka
    }



    console.log("------------prarams-----------", params);












    formData.append("gatewayId", JSON.stringify(params));



    // formData.append("topicname", params.publish?.topicname);
    // formData.append("hosturl", params.publish?.hosturl);

    // formData.append("keyFileName", params.publish?.keyfile?.name);

    // formData.append("crtFileName", params.publish?.crtfile?.name);

    // formData.append("rootCAFileName", params.publish?.rootcafile?.name);
    // formData.append("port", params?.publish?.port);
    const accessToken = localStorage.getItem("accessToken");
    const type = currentPath[2];


    try {
      let res = await axios.post(
        `${process.env.API_URL}/sensors/generateTopic?type=${type}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        message.success("Sensor successfully created");
        setCurrentSensor(res.data);
        setSubmitLoader(false)
      }
    } catch (error) {
      setSubmitLoader(false)
      message.error("something went wrong");
    }
  };

  const { loading, fetchData: getInfrastructures } = useFetch({
    url: `${process.env.API_URL}/infrastructures?type=${applicationType}`,
    method: "GET",
    onSuccess: (data) => setInfrastructures(data),
  });

  const { loading: creatingSensor, fetchData: createSensor } = useFetch(
    (params) => ({
      url: `${process.env.API_URL}/sensors`,
      method: "POST",
      body: JSON.stringify(params),
      onSuccess: (data) => {
        uploadTopic(params);
        message.success("Sensor successfully created");
        setCurrentSensor(data);
      },
      onError: (error) => {
        message.error(error);
      },
    })
  );
  const Toggle = () => {
    // this.setState({ collapse: !this.state.collapse });
    setCollapse(!collapse);
  };

  const modalToggle = () => {
    setModal(!modal);
  };
  const handleOnChange = async (e, setFieldValue) => {
    setFieldValue("code", e);
    if (e !== "") {
      const accessToken = localStorage.getItem("accessToken");
      let res = await axios.get(`${process.env.API_URL}/sensor_config/${e}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res?.data) {
        setSensorConfigData({
          config: res?.data?.sensor_config,
        })
        setSensorConfig({ conf_data: res?.data?.sensor_config });
        setInitialValues({
          ...ref.current.values,
          config: { conf_data: res?.data?.sensor_config },
        });
        setSensorType(res?.data?.sensorType)
      }
    }
  };

  const onSubmit = (values) => {

    // createSensor(values);
    uploadTopic(values);
  };


  const onTableSubmit = (values) => {
    setSensorConfigData({ config: values.config })
    setInitialValues({
      ...ref.current.values,
      config: { conf_data: values.config },
    });
    setModal(false)

  }






  const getSensorConfigTypes = async () => {
    const accessToken = localStorage.getItem("accessToken");
    let res = await axios.get(`${process.env.API_URL}/sensor_config`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    setConfigData(res?.data);
  };

  useEffect(() => {
    getInfrastructures();
    getProjectIds();
    getSensorConfigTypes();
  }, []);

  const getProjectIds = () => {
    fetch(`${process.env.REACT_APP_XEOKIT_URL}/getProjectIds`)
      .then((response) => response.json())
      .then((data) => {
        setProductIdList(data);
      });
  };

  const handleSensorInfraChange = (value, setFieldValue) => {
    if (value === "ADDNEW") {
      setFieldValue("infrastructure", {
        _id: "ADDNEW",
      });
      setFieldValue("floor", null);
      setFieldValue("solution", null);
      setSelectedInfra(null);
      setIsNewInfra(true);
      setSelectedFloor(null);
      setIsNewFloor(false);
      setSelectedSolution(null);
      setIsNewSolution(false);
    } else {
      const infra = infrastructures.find((it) => it._id === value);
      setSelectedInfra(infra);
      setFieldValue("infrastructure", infra);
      setIsNewInfra(false);
    }
  };

  const handleSensorFloorChange = (value, setFieldValue) => {
    if (value === "ADDNEW") {
      setFieldValue("floor", {
        _id: "ADDNEW",
      });
      setFieldValue("solution", null);
      setSelectedFloor(null);
      setIsNewFloor(true);
      setSelectedSolution(null);
      setIsNewSolution(false);
    } else {
      console.log("--------selectedInfra-----", selectedInfra);
      const floor = selectedInfra.floors?.find((it) => it._id === value);
      console.log("----------floor----", floor);
      setSelectedFloor(floor);
      setFieldValue("floor", floor);
      setIsNewFloor(false);
    }
  };

  const handleSensorSolutionChange = (value, setFieldValue) => {
    if (value === "ADDNEW") {
      setFieldValue("solution", {
        _id: "ADDNEW",
      });
      setSelectedSolution(null);
      setIsNewSolution(true);
    } else {
      const solution = selectedFloor?.solutions.find((it) => it._id === value);
      setSelectedSolution(solution);
      setFieldValue("solution", solution);
      setIsNewSolution(false);
    }
  };

  const handleDownloadCert = () => {
    const accessToken = localStorage.getItem("accessToken");
    fetch(`${process.env.API_URL}/sensors/${currentSensor._id}/certificates`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
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
  };

  const handleFile = (e) => {
    let extension = e.target.files[0]?.name.split(".").pop();
    let filename = e.target.files[0]?.name;
    if (extension === "ifc") {
      setShowLoader(true);
      const data = new FormData();
      data.append("file", e.target.files[0]);
      // upload ifc to server 8081
      const accessToken = localStorage.getItem("accessToken");
      fetch(`${process.env.API_URL}/sensors/uploadIfc?filename=${filename}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: data,
      })
        .then((res) => console.log("--res cobie--", res))
        .catch((e) => console.log(e));
      // create building model
      fetch(`${process.env.REACT_APP_XEOKIT_URL}/upload`, {
        method: "POST", // or 'PUT'
        body: data,
      })
        .then((response) => response.json())
        .then((data) => {
          fetch(`${process.env.REACT_APP_XEOKIT_URL}/convertIfcToXkt`, {
            method: "POST", // or 'PUT'
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ filename }),
          })
            .then(async (response) => {
              // console.log("---res---", response);
              if (response.status === 200) {
                await getProjectIds();
                setShowLoader(false);
              }
            })
            .then((data) => {
              // console.log("Success:", data);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      alert("please select ifc file");
    }
  };

  const downloadCobie = () => {
    // console.log("--calling download---", selectedProductId);

    if (selectedProductId !== "") {
      let fileHead = selectedProductId.split(".")[0];

      const accessToken = localStorage.getItem("accessToken");
      fetch(
        `${process.env.API_URL}/sensors/downloadCobie?filename=${selectedProductId}`,
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
          link.setAttribute("download", fileHead + "." + "xlsx");

          // Append to html link element page
          document.body.appendChild(link);

          // Start download
          link.click();

          // Clean up and remove the link
          link.parentNode.removeChild(link);
        })
        .catch((e) => console.log(e));
    } else {
      alert("Please select building model");
    }
  };

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  const checkSensorExits = async (e) => {
    let sensorId = e.target.value;

    const accessToken = localStorage.getItem("accessToken");
    let res = await axios.get(`${process.env.API_URL}/sensors/isSensorExist/${sensorId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    setShowError(res?.data)

  }

  const handleTopic = async (topic, host, port) => {
    // console.log("---handle---",e.target.value,"-reffff",deviceIdRef.current.state.value);
    // let topicname = e.target.value
    // let deviceId = deviceIdRef.current.state.value
    const accessToken = localStorage.getItem("accessToken");
    let res = await axios.get(`${process.env.API_URL}/publish_data?topicname=${topic}&host=${host}&port=${port}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    // console.log("------res------", res);
    setTopicError(res.data)

  }

  const debouncedSave = useCallback(
    debounce((topic, host, port) => {
      // handleTopic(topic,host,port)
    }, 1000),
    [], // will be created only once initially
  );





  // const  onChangeTopic =(value)=>{
  //   console.log("----value----",value);
  //   setPubTopic(value)
  //   if(pubPort!="" && pubHost!==""&& value!==""){
  //     // debouncedSave(value,pubHost,pubPort)
  //    }

  // }
  // const onChangeHost = (value) =>{
  //   console.log("-----",value)
  //   setPubHost(value)
  //   if(pubPort!="" && pubTopic!=="" && value!==""){
  //     // debouncedSave(pubTopic,value,pubPort)
  //    }
  // }

  // const onChangePort =(value) =>{
  //   console.log("-----",value)
  //   setPubPort(value)
  //    if(pubHost!="" && pubTopic!==""&& value!==""){
  //     // debouncedSave(pubTopic,pubHost,value)
  //    }
  // }


  return (
    <div className="p-4" style={{ position: "relative" }}>
      {showLoader && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 999999,
            backgroundColor: "rgba(255,255,255,0.3)",
          }}
        >
          <ScaleLoader
            color={"#dc3545"}
            loading={showLoader}
            height={35}
            width={4}
            margin={2}
            radius={2}
          />
        </div>
      )}
      <div
        className="row position-relative"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div className="col-md-5">
          <h2 className="text-mandy font-weight-bold">
            <img
              src={washroomIcon}
              width="50"
              height="50"
              className="mr-3"
              style={{ marginTop: -8 }}
            />
            Add Sensor | {applicationType}
          </h2>
        </div>
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {keycloackValue?.hasRealmRole("Add IFC") && (
            <div
              onClick={() => fileRef.current.click()}
              style={{
                display: "flex",
                flexDirection: "row",
                cursor: "pointer",
              }}
            >
              <div style={{ width: "20px", height: "20px" }}>
                <img
                  src={uploadIcon}
                  style={{ width: "20px", height: "20px" }}
                />
              </div>
              <span>Upload IFC</span>
              <input
                ref={fileRef}
                onChange={(e) => handleFile(e)}
                multiple={false}
                type="file"
                hidden
              // disabled
              />
            </div>
          )}
          {/* {console.log("---",keycloackValue,"--------",selectedProductId )} */}

          { (
            <div
              onClick={() => downloadCobie()}
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: "100px",
                cursor: "pointer",
              }}
            >
              <div style={{ width: "20px", height: "20px" }}>
                <img
                  src={downloadIcon}
                  style={{ width: "20px", height: "20px" }}
                />
              </div>
              <span>Download Cobie</span>
            </div>
          )}

          {keycloackValue?.hasRealmRole("View IFC") && showModelButton && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: "100px",
                cursor: "pointer",
              }}
            >
              <div style={{ width: "20px", height: "20px" }}>
                <img
                  src={buildingIcon}
                  style={{ width: "20px", height: "20px" }}
                />
              </div>
              <span>View Building Model</span>
              <select
                style={{ marginLeft: "10px" }}
                value={selectedProductId}
                name="models"
                id="models"
                onChange={(e) => {
                  setSelectedProductId(e.target.value); setShowIframe(true);
                }}
              >
                <option value="" disabled={true}>
                  Select
                </option>
                {productIdList.map((dta, idx) => (
                  <option key={idx} value={dta}>
                    {dta}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      <Divider style={{ marginTop: 0 }} />
      {showIframe && (
        <div style={{ position: "absolute", zIndex: 999, width: "98%" }}>
          <span
            onClick={() => {
              // console.log("--hello");
              setShowIframe(false);
              setSelectedProductId("")
            }}
            style={{
              position: "absolute",
              right: 0,
              zIndex: 999999,
              padding: "3px 10px",
              backgroundColor: "black",
              color: "#fff",
              marginBottom: "10px",
              cursor: "pointer",
            }}
          >
            X
          </span>
          <div>
            <iframe
              src={`${process.env.REACT_APP_XEOKIT_VIEWER}/?projectId=${selectedProductId}`}
              width="100%"
              height="600px"
            >
              {" "}
            </iframe>
          </div>
        </div>
      )}

      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={onSubmit}
        innerRef={ref}
      >
        {({ isValid, values, setFieldValue }) => (
          <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <div className="row">
              <div className="col-md-6">
                <h4 className="font-weight-bold">Sensor:</h4>
                <Form.Item
                  label="Sensor Device ID"
                  name="device_id"
                  hasFeedback


                >
                  <>
                    <Input ref={deviceIdRef} name="device_id" placeholder="Device ID" onBlur={(e) => checkSensorExits(e)} />
                    {showError && <div style={{ color: "red" }} >This sensor device id exist already.</div>}</>
                </Form.Item>

                <Form.Item
                  label="Sensor Code"
                  name="code"
                  validate={(value) => !value && "Please enter sensor code"}
                  hasFeedback
                >
                  <Select
                    name="code"
                    placeholder="Code"
                    onChange={(value) => handleOnChange(value, setFieldValue)}
                  >
                    {configData &&
                      configData?.map((dt, idx) => (
                        <Select.Option
                          value={dt._id}
                          key={idx}
                        // onChange={(value) => handleOnChange(value)}
                        >
                          {dt.sensorCode}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>

                {/* ----------------------------------------------- */}
                <div>
                  <div style={{ display: "flex", justifyContent: 'center' }}>
                    {sensorConfigData.config.length > 0 && (

                      <div style={{ marginLeft: "15%", marginBottom: "15px" }}>
                        <Button color="danger" onClick={modalToggle}>
                          Add/Edit sensor configuration
                        </Button>

                      </div>

                    )}
                  </div>
                </div>



                {/* ----------------------------------------------------------- */}

                <Form.Item label="Description" name="description" hasFeedback>
                  <Input name="description" placeholder="Description" disabled={true} value={sensorType} />
                </Form.Item>
                <h5 className="font-weight-bold">Sensor Infra:</h5>
                <h6 className="font-weight-bold ml-3">Infra:</h6>
                <Form.Item
                  label="Infrastructure"
                  name="infrastructure._id"
                  hasFeedback
                >
                  <Select
                    name="infrastructure._id"
                    placeholder="Infrastructure"
                    style={{ width: "100%" }}
                    onChange={(value) =>
                      handleSensorInfraChange(value, setFieldValue)
                    }
                  >
                    <Select.Option value="ADDNEW">
                      <i className="fa fa-plus text-primary" /> Add New Infra
                    </Select.Option>
                    {infrastructures.map((infra) => (
                      <Select.Option key={infra._id} value={infra._id}>
                        {infra.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                {isNewInfra && (
                  <>
                    <Form.Item
                      label="Name"
                      name="infrastructure.name"
                      validate={(value) => !value && "Please enter infra name"}
                      hasFeedback
                    >
                      <Input name="infrastructure.name" placeholder="Name" />
                    </Form.Item>
                    <Form.Item
                      label="Type"
                      name="infrastructure.type"
                      validate={(value) => !value && "Please select infra type"}
                      hasFeedback
                    >
                      <Select
                        name="infrastructure.type"
                        placeholder="Infra type"
                        style={{ width: "100%" }}
                        options={["Building", "Apartment", "Mall"].map(
                          (infra) => ({
                            label: infra,
                            value: infra.toLowerCase(),
                          })
                        )}
                      />
                    </Form.Item>
                  </>
                )}
                {selectedInfra || isNewInfra ? (
                  <>
                    {/* <Form.Item
                      label="Description"
                      name="infrastructure.description"
                      validate={(value) =>
                        !value && "Please enter infra description"
                      }
                      hasFeedback
                    >
                      <Input
                        name="infrastructure.description"
                        placeholder="Description"
                        disabled={selectedInfra}
                      />
                    </Form.Item> */}
                    <Form.Item
                      label="Location"
                      name="infrastructure.location"
                      validate={(value) =>
                        !value && "Please enter infra location"
                      }
                      hasFeedback
                    >
                      <Input
                        name="infrastructure.location"
                        placeholder="Location"
                        disabled={selectedInfra}
                      />
                    </Form.Item>
                    <h6 className="font-weight-bold ml-3">Floor:</h6>
                    <Form.Item label="Floor" name="floor._id" hasFeedback>
                      <Select
                        name="floor._id"
                        placeholder="Floor"
                        style={{ width: "100%" }}
                        onChange={(value) =>
                          handleSensorFloorChange(value, setFieldValue)
                        }
                      >
                        <Select.Option value="ADDNEW">
                          <i className="fa fa-plus text-primary" /> Add New
                          Floor
                        </Select.Option>
                        {selectedInfra?.floors.map((floor) => (
                          <Select.Option key={floor._id} value={floor._id}>
                            {floor.sign}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </>
                ) : null}
                {isNewFloor ? (
                  <>
                    <Form.Item
                      label="Description"
                      name="floor.description"
                      validate={(value) =>
                        !value && "Please enter floor description"
                      }
                      hasFeedback
                    >
                      <Input
                        name="floor.description"
                        placeholder="Description"
                      />
                    </Form.Item>
                    <Form.Item
                      label="Sign"
                      name="floor.sign"
                      validate={(value) => {
                        if (!value) return "Please enter floor sign";
                        if (value !== "G" && !/^B?[0-9]+$/i.test(value))
                          return "Floor sign is not valid";
                        return undefined;
                      }}
                      hasFeedback
                    >
                      <Input
                        name="floor.sign"
                        placeholder="Sign - such as G, B1, B2, 1, 2 ..."
                      />
                    </Form.Item>
                  </>
                ) : null}
                {selectedFloor || isNewFloor ? (
                  <>
                    {/* <h6 className="font-weight-bold ml-3">Washroom:</h6> */}
                    <h6 className="font-weight-bold ml-3">{applicationType}:</h6>
                    <Form.Item
                      label={applicationType} // washroom
                      name="solution._id"
                      hasFeedback
                      // validate={(value) => !value && "Please select washroom"}
                      validate={(value) => !value && "Please select " + applicationType}
                    >
                      {console.log("-------selectedFloor-----", selectedFloor)}
                      <Select
                        name="solution._id"
                        // placeholder="Washroom"
                        placeholder={applicationType}
                        style={{ width: "100%" }}
                        onChange={(value) =>
                          handleSensorSolutionChange(value, setFieldValue)
                        }
                      >
                        <Select.Option value="ADDNEW">
                          <i className="fa fa-plus text-primary" /> Add New  {applicationType}
                          {/* Washroom */}
                        </Select.Option>
                        {selectedFloor?.solutions.map((wr) => (
                          <Select.Option key={wr._id} value={wr._id}>
                            {wr?.type?.toUpperCase()}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </>
                ) : null}
                {isNewSolution ? (
                  <>
                    <Form.Item label="Type" name="solution.type" hasFeedback>
                      <Select
                        name="solution.type"
                        placeholder="Type"
                        style={{ width: "100%" }}
                        options={["Male", "Female", "Disabled"].map(
                          (label) => ({
                            label,
                            value: label.toLowerCase(),
                          })
                        )}
                      />
                    </Form.Item>
                  </>
                ) : null}
              </div>
              <div className="col-md-6">
                <GatewayForm
                  infrastructures={infrastructures}
                  setFieldValue={setFieldValue}
                  values={values}
                  setGatewayErorr={setGatewayErorr}
                />
                <h6 className="font-weight-bold ml-3 ">Publish data to: </h6>
                <>

                  <div style={{ display: "flex", justifyContent: 'flex-end', alignItems: 'center', marginBottom: '14px' }}>
                    <div className="form-check" style={{ marginRight: "10%" }}>
                      <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" style={{ cursor: "pointer" }} onChange={(e) => { setPublishDataType("Mqtt"); setFieldValue("publishKafka", null); setFieldValue("publishMqtt", null); }} />
                      <label className="form-check-label" htmlFor="flexRadioDefault1" style={{ cursor: "pointer" }} >
                        Mqtt
                      </label>
                    </div>
                    <div className="form-check" style={{ marginRight: "10%" }} >
                      <input className="form-check-input " type="radio" name="flexRadioDefault" id="flexRadioDefault2" style={{ cursor: "pointer" }} onChange={(e) => { setPublishDataType("Kafka"); setFieldValue("publishMqtt", null); setFieldValue("publishKafka", null); }} />
                      <label className="form-check-label" htmlFor="flexRadioDefault2" style={{ cursor: "pointer" }} >
                        Kafka
                      </label>
                    </div>
                    <div className="form-check" style={{ marginRight: "10%" }}  >
                      <input className="form-check-input " type="radio" name="flexRadioDefault" id="flexRadioDefault3" style={{ cursor: "pointer" }} onChange={(e) => { setPublishDataType("Both"); setFieldValue("publishMqtt", null); setFieldValue("publishKafka", null); }} />
                      <label className="form-check-label" htmlFor="flexRadioDefault3" style={{ cursor: "pointer" }} >
                        Both
                      </label>
                    </div>
                    <div className="form-check" style={{ marginRight: "2%" }} >
                      <input className="form-check-input " type="radio" name="flexRadioDefault" id="flexRadioDefault4" style={{ cursor: "pointer" }} defaultChecked={true} onChange={(e) => { setPublishDataType("None"); setFieldValue("publishMqtt", null); setFieldValue("publishKafka", null); }} />
                      <label className="form-check-label" htmlFor="flexRadioDefault4" style={{ cursor: "pointer" }} >
                        None
                      </label>
                    </div>
                  </div>

                  {(publishDataType === "Mqtt" || publishDataType === "Both" ) && (<div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingLeft: "60px" }} ><hr style={{ width: "100%", borderTop: "1px solid rgba(0,0,0,0.1)" }} ></hr> <p style={{ margin: "15px 15px 15px 15px" }} >Mqtt</p> <hr style={{ width: "100%", borderTop: "1px solid rgba(0,0,0,0.1)" }}    ></hr></div>)}

                  {(publishDataType === "Mqtt" || publishDataType === "Both") && (
                    <>
                      <Form.Item
                        label="Topic Name"
                        name="publishMqtt.topic"
                        // validate={(value) =>
                        //   !value && "Please enter topic name"
                        // }
                        hasFeedback
                      // onChange={(e)=>onChangeTopic(e.target.value)}
                      >
                        <Input
                          name="publishMqtt.topic"
                          placeholder="Topic Name"
                          required={false}

                        />
                        {topicError && <div style={{ color: "red" }} >This topic exist already.</div>}

                      </Form.Item>

                      <Form.Item
                        label="Host Url"
                        name="publishMqtt.host"
                        // validate={(value) =>
                        //   !value && "Please enter hosturl"
                        // }
                        hasFeedback
                      // onChange={(e)=>onChangeHost(e.target.value)}
                      >
                        <Input
                          name="publishMqtt.host"
                          placeholder="Host - such as 3.125.248.157 ..."
                          required={false}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Port"
                        name="publishMqtt.port"
                        // validate={(value) =>
                        //   !value && "Please enter hosturl"
                        // }
                        hasFeedback
                      // onChange={(e)=>onChangePort(e.target.value)}
                      >
                        <Input
                          name="publishMqtt.port"
                          placeholder="Port - such as 1883,8883 ..."
                          required={false}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Username"
                        name="publishMqtt.username"
                        // validate={(value) =>
                        //   !value && "Please enter hosturl"
                        // }
                        hasFeedback
                      // onChange={(e)=>onChangePort(e.target.value)}
                      >
                        <Input
                          name="publishMqtt.username"
                          placeholder="Username"
                          required={false}
                        />
                      </Form.Item>

                      <Form.Item
                        label="password"
                        name="publishMqtt.password"
                        // validate={(value) =>
                        //   !value && "Please enter hosturl"
                        // }
                        hasFeedback
                      // onChange={(e)=>onChangePort(e.target.value)}
                      >
                        <Input
                          name="publishMqtt.password"
                          placeholder="Password"
                          required={false}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Key File"
                        name="publishMqtt.keyfile"
                        // validate={(value) =>
                        //   !value && "Please enter key file"
                        // }
                        hasFeedback
                      >
                        <input
                          id="file"
                          required={false}
                          name="publishMqtt.keyfile"
                          type="file"
                          onChange={(event) => {
                            setFieldValue(
                              "publishMqtt.keyfile",
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Crt File"
                        name="publishMqtt.crtfile"
                        // validate={(value) =>
                        //   !value && "Please enter crt file"
                        // }
                        hasFeedback
                      >
                        <input
                          id="file"
                          required={false}
                          name="publishMqtt.crtfile"
                          type="file"
                          onChange={(event) => {
                            setFieldValue(
                              "publishMqtt.crtfile",
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        label="RootCA File"
                        name="publishMqtt.rootcafile"
                      // validate={(value) =>
                      //   !value && "Please enter rootca file"
                      // }
                      // hasFeedback
                      >
                        <input
                          id="file"
                          required={false}
                          name="publishMqtt.rootcafile"
                          type="file"
                          onChange={(event) => {
                            setFieldValue(
                              "publishMqtt.rootcafile",
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                      </Form.Item>
                    </>
                  )}
                  {(publishDataType === "Kafka" || publishDataType === "Both") && (<div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingLeft: "60px" }} ><hr style={{ width: "100%", borderTop: "1px solid rgba(0,0,0,0.1)" }} ></hr> <p style={{ margin: "15px 15px 15px 15px" }} >Kafka</p> <hr style={{ width: "100%", borderTop: "1px solid rgba(0,0,0,0.1)" }}    ></hr></div>)}





                  {(publishDataType === "Kafka" || publishDataType === "Both") && (
                    <>
                      <Form.Item
                        label="Topic Name"
                        name="publishKafka.topic"
                        // validate={(value) =>
                        //   !value && "Please enter topic name"
                        // }
                        hasFeedback
                      // onChange={(e)=>onChangeTopic(e.target.value)}
                      >
                        <Input
                          name="publishKafka.topic"
                          placeholder="Topic Name"
                          required={false}

                        />
                        {topicError && <div style={{ color: "red" }} >This topic exist already.</div>}

                      </Form.Item>

                      <Form.Item
                        label="Host Url"
                        name="publishKafka.host"
                        // validate={(value) =>
                        //   !value && "Please enter hosturl"
                        // }
                        hasFeedback
                      // onChange={(e)=>onChangeHost(e.target.value)}
                      >
                        <Input
                          name="publishKafka.host"
                          placeholder="Host - such as 3.125.248.157 ..."
                          required={false}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Port"
                        name="publishKafka.port"
                        // validate={(value) =>
                        //   !value && "Please enter hosturl"
                        // }
                        hasFeedback
                      // onChange={(e)=>onChangePort(e.target.value)}
                      >
                        <Input
                          name="publishKafka.port"
                          placeholder="Port - such as 1883,8883 ..."
                          required={false}
                        />
                      </Form.Item>




                      <Form.Item
                        label="Username"
                        name="publishKafka.username"
                        // validate={(value) =>
                        //   !value && "Please enter hosturl"
                        // }
                        hasFeedback
                      // onChange={(e)=>onChangePort(e.target.value)}
                      >
                        <Input
                          name="publishKafka.username"
                          placeholder="Username"
                          required={false}
                        />
                      </Form.Item>

                      <Form.Item
                        label="password"
                        name="publishKafka.password"
                        // validate={(value) =>
                        //   !value && "Please enter hosturl"
                        // }
                        hasFeedback
                      // onChange={(e)=>onChangePort(e.target.value)}
                      >
                        <Input
                          name="publishKafka.password"
                          placeholder="Password"
                          required={false}
                        />
                      </Form.Item>


                      <Form.Item
                        label="Key File"
                        name="publishKafka.keyfile"
                        // validate={(value) =>
                        //   !value && "Please enter key file"
                        // }
                        hasFeedback
                      >
                        <input
                          id="file"
                          required={false}
                          name="publishKafka.keyfile"
                          type="file"
                          onChange={(event) => {
                            setFieldValue(
                              "publishKafka.keyfile",
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        label="Crt File"
                        name="publishKafka.crtfile"
                        // validate={(value) =>
                        //   !value && "Please enter crt file"
                        // }
                        hasFeedback
                      >
                        <input
                          id="file"
                          required={false}
                          name="publishKafka.crtfile"
                          type="file"
                          onChange={(event) => {
                            setFieldValue(
                              "publishKafka.crtfile",
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        label="RootCA File"
                        name="publishKafka.rootcafile"
                      // validate={(value) =>
                      //   !value && "Please enter rootca file"
                      // }
                      // hasFeedback
                      >
                        <input
                          id="file"
                          required={false}
                          name="publishKafka.rootcafile"
                          type="file"
                          onChange={(event) => {
                            setFieldValue(
                              "publishKafka.rootcafile",
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                      </Form.Item>
                    </>
                  )}





                  {!isEmpty(currentSensor) && (
                    <div className="btn-download" >
                      <Button className="bg-success" onClick={handleDownloadCert}>
                        Download certificates
                      </Button>
                    </div>
                  )}
                </>
              </div>
              <div className="col-md-12 mt-3 d-flex justify-content-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  // disabled={!isValid || loading || creatingSensor || submitLoader || showError}
                  // loading={loading || creatingSensor || submitLoader}
                  className="mr-3"
                >
                  Submit
                </Button>
                {/* {!isEmpty(currentSensor) && (
                  <Button className="bg-success" onClick={handleDownloadCert}>
                    Download certificates
                  </Button>
                )} */}
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {/* ------------------- */}


      <Modal isOpen={modal} toggle={modalToggle} centered={true} size={"lg"}  >
        <ModalHeader>
          Sensor ConfigurationLL
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={sensorConfigData}
            onSubmit={onTableSubmit}
            enableReinitialize
          >
            {({ isValid, values, setFieldValue, errors, touched }) => (
              <Form>
                <FieldArray name="config">
                  {({ insert, remove, push }) => (
                    <table
                      className="table"
                      style={{ border: "1px solid black" }}
                    >
                      <thead className="thead-dark">
                        <tr>
                          <th scope="col">SNo.</th>
                          <th scope="col">Config Name</th>
                          <th scope="col">Values</th>
                          <th scope="col">Description</th>
                          <th scope="col">Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {values.config.map(
                          (dt, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td>{dt.label}</td>
                              <td>
                                {/* 
                   <Form.Item
                    label=""
                    name={`config.${index}.selectedValue`}
                    validate={(value) =>
                     `Please enter value in range ${value}`
                    }
                     hasFeedback
                  >
                   

                  </Form.Item> */}
                                <Input
                                  type="number"
                                  id="Number"
                                  name={`config.${index}.selectedValue`}
                                  placeholder="value"
                                  min={dt.startRange}
                                  max={dt.endRange}
                                  defaultValue={
                                    dt.selectedValue ? dt.selectedValue : dt.defaultValue
                                  }
                                  required={true}
                                  // validate={(value) => (value <= dt.endRange) && `Please enter value in range ${value}`}
                                  style={{
                                    width: "100px",
                                    marginRight: "10px",
                                  }}
                                //  hasFeedback

                                />
                                {/* {errors.config[`${index}`].selectedValue && touched.config[`${index}`].selectedValue && <div>{errors.config[`${index}`].selectedValue}</div>} */}




                              </td>
                              <td>
                                {dt.description}
                              </td>
                              <td>
                                {dt.unit}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  )}
                </FieldArray>



                <Button
                  type="primary"
                  htmlType="submit"
                  // disabled={!isValid || loading || creatingSensor}
                  // loading={loading || creatingSensor}
                  className="mr-3"
                >
                  Save
                </Button>
              </Form>


            )}

          </Formik>
        </ModalBody>

      </Modal>

















      {/* ---------------------------------- */}



    </div>
  );
};

export default AddSensorPage;

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Divider, Spin, Button, message } from "antd";
import axios from "axios";
import useFetch from "@app/util/useFetch";
import { Form, Select, Input, InputNumber } from "formik-antd";
import { Formik, FieldArray } from "formik";
import isEmpty from "lodash/fp/isEmpty";
import washroomIcon from "@images/icons/washroom.svg";
import GatewayForm from "./UpdateGatewayForm";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const UpdateSensorPage = ({
  match: {
    params: { sensorId },
  },
}) => {
  const [infrastructures, setInfrastructures] = useState([]);
  const [selectedInfra, setSelectedInfra] = useState(null);
  const [isNewInfra, setIsNewInfra] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [isNewFloor, setIsNewFloor] = useState(false);
  const [sensorType, setSensorType] = useState("")
  const [currentSensor, setCurrentSensor] = useState({
    config: {
      conf_data: [],
    },
  });

  const [prevSensorId, setPrevSensorId] = useState(null)
  const [prevWashroom, setPrevWashroom] = useState(null)


  const [sensorConfigData, setSensorConfigData] = useState({
    config: []
  })


  const [selectedWashroom, setSelectedWashroom] = useState(null);
  const [isNewWashroom, setIsNewWashroom] = useState(false);
  const [initialGateway, setInitialGateway] = useState({});
  const [pubishData, setPublishData] = useState({});
  const [configData, setConfigData] = useState([{}]);
  const ref = useRef(null);
  const [showAccord, setShowAccord] = useState(true);
  const [modal, setModal] = useState(false);

  const { loading, fetchData: getInfrastructures } = useFetch({
    url: `${process.env.API_URL}/infrastructures?type=washroom`,
    method: "GET",
    onSuccess: (data) => {
      setInfrastructures(data)
    }
  });

  const { fetchData: getSensor } = useFetch((sensor_id) => ({
    url: `${process.env.API_URL}/sensors/${sensor_id}?type=washroom`,
    method: "GET",
    onSuccess: (data) => {
      setCurrentSensor(data);
      setIsNewInfra(false);
      setSelectedInfra(data.infrastructure);
      setIsNewFloor(false);
      setSelectedFloor(data.floor);
      setIsNewWashroom(false);
      setSelectedWashroom(data.washroom);

      setPrevWashroom(data.washroom)
      setPrevSensorId(data._id)

      setInitialGateway(data.gateway);
      console.log("-------999---------", data);
      setSensorConfigData({
        config: data.config.conf_data

      })
      handleOnChange(data.code, "");
    },
  }));

  const { loading: updatingSensor, fetchData: updateSensor } = useFetch(
    (params) => ({
      url: `${process.env.API_URL}/sensors/${sensorId}?type=washroom`,
      method: "PUT",
      body: JSON.stringify(params),
      onSuccess: (data) => {
        // history.push("/washroom");

        message.success("Sensor successfully updated");
        setCurrentSensor(data);
        setIsNewInfra(false);
        setSelectedInfra(data.infrastructure);
        setIsNewFloor(false);
        setSelectedFloor(data.floor);
        setIsNewWashroom(false);
        setSelectedWashroom(data.washroom);
        setInitialGateway(data.gateway);
        // setConfigData(data.code)
      },
      onError: (error) => {
        message.error(error);
      },
    })
  );



  const update_Sensor = async (params) => {
    const formData = new FormData();
    let pub_data = {}
    formData.append("gatewayId", JSON.stringify(params));
    formData.append("topicname", params.publish?.topic);
    formData.append("hosturl", params.publish?.host);
    formData.append("file", params.publish?.keyfile);
    formData.append("keyFileName", params.publish?.keyfile?.name);
    formData.append("file", params.publish?.crtfile);
    formData.append("crtFileName", params.publish?.crtfile?.name);
    formData.append("file", params.publish?.rootcafile);
    formData.append("rootCAFileName", params.publish?.rootcafile?.name);

    formData.append("port", params?.publish?.port);

    formData.append("prevSensorId", prevSensorId);
    formData.append("previousWashroom", JSON.stringify(prevWashroom));

    const accessToken = localStorage.getItem("accessToken");

    try {
      let res = await axios.post(
        `${process.env.API_URL}/sensors/updateSensor/${sensorId}?type=washroom`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        message.success("Sensor successfully updated");
        // setCurrentSensor(res.data);
        getSensor(sensorId);
        getInfrastructures();
      }
    } catch (error) {
      message.error("something went wrong");
    }
  };








  const onSubmit = (values) => {
    // console.log("------------values-------", values);
    // updateSensor(values);
    update_Sensor(values)
  };

  const modalToggle = () => {
    setModal(!modal);
  };
  const getSensorConfigTypes = async () => {
    const accessToken = localStorage.getItem("accessToken");
    let res = await axios.get(`${process.env.API_URL}/sensor_config`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    // console.log("------res------", res?.data);
    setConfigData(res?.data);
  };

  useEffect(() => {
    getSensorConfigTypes();
    getSensor(sensorId);
    getInfrastructures();
  }, []);

  const handleSensorInfraChange = (value, setFieldValue) => {
    if (value === "ADDNEW") {
      setFieldValue("infrastructure", {
        _id: "ADDNEW",
      });
      setFieldValue("floor", null);
      setFieldValue("washroom", null);
      setSelectedInfra(null);
      setIsNewInfra(true);
      setSelectedFloor(null);
      setIsNewFloor(false);
      setSelectedWashroom(null);
      setIsNewWashroom(false);
    } else {
      const infra = infrastructures.find((it) => it._id === value);
      setSelectedInfra(infra);
      setFieldValue("infrastructure", infra);
      setIsNewInfra(false);

      setIsNewFloor(false);
      // setSelectedFloor(infra.floors[0]);
      setFieldValue("floor", "");
      // setIsNewWashroom(false);
      // setSelectedWashroom(infra.floors[0].washrooms[0]);
      setFieldValue("washroom", "")
    }
  };

  const handleSensorFloorChange = (value, setFieldValue) => {
    if (value === "ADDNEW") {
      setFieldValue("floor", {
        _id: "ADDNEW",
      });
      setFieldValue("washroom", null);
      setSelectedFloor(null);
      setIsNewFloor(true);
      setSelectedWashroom(null);
      setIsNewWashroom(false);
    } else {
      const floor = selectedInfra.floors?.find((it) => it._id === value);
      setSelectedFloor(floor);
      setFieldValue("floor", floor);
      setIsNewFloor(false);
    }
  };

  const handleSensorWashroomChange = (value, setFieldValue) => {
    if (value === "ADDNEW") {
      setFieldValue("washroom", {
        _id: "ADDNEW",
      });
      setSelectedWashroom(null);
      setIsNewWashroom(true);
    } else {
      const washroom = selectedFloor?.washrooms.find((it) => it._id === value);
      setSelectedWashroom(washroom);
      setFieldValue("washroom", washroom);
      setIsNewWashroom(false);
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
  const handleOnChange = async (e, setFieldValue) => {

    if (setFieldValue) {
      setFieldValue("code", e);
    }

    if (e !== "") {
      const accessToken = localStorage.getItem("accessToken");
      let res = await axios.get(`${process.env.API_URL}/sensor_config/${e}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res?.data) {
        // setSensorConfig({ conf_data: res?.data?.sensor_config });
        setCurrentSensor({
          ...ref.current.values,
          config: { conf_data: res?.data?.sensor_config },
        });
        setSensorConfigData({
          config: res?.data?.sensor_config

        })
        setSensorType(res?.data?.sensorType)
      }
    }
  };


  const onTableSubmit = (values) => {
    setSensorConfigData({ config: values.config })
    setCurrentSensor({
      ...ref.current.values,
      config: { conf_data: values.config },
    });
    setModal(false)

  }


  return (
    <div className="p-4" style={{ marginBottom: 150 }}>
      <div className="row position-relative">
        <div className="col-md-6">
          <h2 className="text-mandy font-weight-bold">
            <img
              src={washroomIcon}
              width="50"
              height="50"
              className="mr-3"
              style={{ marginTop: -8 }}
            />
            Update Sensor
          </h2>
        </div>
      </div>
      <Divider style={{ border: "1px solid #d84e59", marginTop: 0 }} />
      <Formik
        initialValues={currentSensor}
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
                  <Input
                    name="device_id"
                    placeholder="Device ID"
                    disabled={true}
                  />
                </Form.Item>
                {/* <Form.Item
                  label="Sensor Code "
                  name="code"
                  validate={(value) => !value && "Please enter sensor code"}
                  hasFeedback
                >
                  <Input name="code" placeholder="Code" />
                </Form.Item> */}

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
                <div style={{ display: "flex", justifyContent: 'center' }}>

                  {sensorConfigData.config.length > 0 && (

                    <div style={{ marginLeft: "15%", marginBottom: "15px" }}>
                      <Button color="danger" onClick={modalToggle}>
                        Add/Edit sensor configuration
                      </Button>

                    </div>

                  )}
                </div>



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
                    options={["Building", "Apartment", "Mall"].map((infra) => ({
                      label: infra,
                      value: infra.toLowerCase(),
                    }))}
                  />
                </Form.Item>
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
                <Form.Item
                  label="Description"
                  name="floor.description"
                  validate={(value) =>
                    !value && "Please enter floor description"
                  }
                  hasFeedback
                >
                  <Input name="floor.description" placeholder="Description" />
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
                {selectedFloor || isNewFloor ? (
                  <>
                    {/* <h6 className="font-weight-bold ml-3">Washroom:</h6> */}
                    <h6 className="font-weight-bold ml-3">Wellness:</h6>
                    <Form.Item
                      // label="Washroom"
                      label="Wellness"
                      name="washroom._id"
                      hasFeedback
                      // validate={(value) => !value && "Please select washroom"}
                      validate={(value) => !value && "Please select wellness"}
                    >
                      <Select
                        name="washroom._id"
                        // placeholder="Washroom"
                        placeholder="Wellness"
                        style={{ width: "100%" }}
                        onChange={(value) =>
                          handleSensorWashroomChange(value, setFieldValue)
                        }
                      >
                        <Select.Option value="ADDNEW">
                          <i className="fa fa-plus text-primary" /> Add New Wellness
                          {/* Washroom */}
                        </Select.Option>
                        {selectedFloor?.washrooms.map((wr) => (
                          <Select.Option key={wr._id} value={wr._id}>
                            {wr?.type?.toUpperCase()}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </>
                ) : null}
                {isNewWashroom ? (
                  <>
                    <Form.Item label="Type" name="washroom.type" hasFeedback>
                      <Select
                        name="washroom.type"
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
                  initialValues={initialGateway}
                  infrastructures={infrastructures}
                  setFieldValue={setFieldValue}
                  values={values}
                />

                <h6 className="font-weight-bold ml-3 ">Publish data to: </h6>
                <>
                  <Form.Item
                    label="Topic Name"
                    name="publish.topic"
                    // validate={(value) =>
                    //   !value && "Please enter topic name"
                    // }
                    hasFeedback
                  >
                    <Input
                      name="publish.topic"
                      placeholder="topic name"
                      required={false}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Host Url"
                    name="publish.host"
                    // validate={(value) =>
                    //   !value && "Please enter hosturl"
                    // }
                    hasFeedback
                  >
                    <Input
                      name="publish.host"
                      placeholder="a3njal8wrtnp6k-ats.iot.eu-central-1.amazonaws.com"
                      required={false}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Port"
                    name="publish.port"
                    // validate={(value) =>
                    //   !value && "Please enter hosturl"
                    // }
                    hasFeedback
                  >
                    <Input
                      name="publish.port"
                      placeholder="8883"
                      required={false}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Key File"
                    name="publish.keyfile"
                    // validate={(value) =>
                    //   !value && "Please enter key file"
                    // }
                    hasFeedback
                  >
                    <input
                      id="file"
                      required={false}
                      name="publish.keyfile"
                      type="file"
                      onChange={(event) => {
                        setFieldValue(
                          "publish.keyfile",
                          event.currentTarget.files[0]
                        );
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Crt File"
                    name="publish.crtfile"
                    // validate={(value) =>
                    //   !value && "Please enter crt file"
                    // }
                    hasFeedback
                  >
                    <input
                      id="file"
                      required={false}
                      name="publish.crtfile"
                      type="file"
                      onChange={(event) => {
                        setFieldValue(
                          "publish.crtfile",
                          event.currentTarget.files[0]
                        );
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="RootCA File"
                    name="publish.rootcafile"
                  // validate={(value) =>
                  //   !value && "Please enter rootca file"
                  // }
                  // hasFeedback
                  >
                    <input
                      id="file"
                      required={false}
                      name="publish.rootcafile"
                      type="file"
                      onChange={(event) => {
                        setFieldValue(
                          "publish.rootcafile",
                          event.currentTarget.files[0]
                        );
                      }}
                    />
                  </Form.Item>
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
                  disabled={!isValid || loading || updatingSensor}
                  loading={loading || updatingSensor}
                  className="mr-3"
                >
                  Submit
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>


      {/* ------------------- */}


      <Modal isOpen={modal} toggle={modalToggle} centered={true} size={"lg"}  >
        <ModalHeader>
          Sensor Configuration
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









    </div>
  );
};

export default UpdateSensorPage;

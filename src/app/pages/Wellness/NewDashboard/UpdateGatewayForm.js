import React, { useEffect, useState, useCallback,useContext } from "react";
import { Divider, Button } from "antd";
import useFetch from "@app/util/useFetch";
import { Form, Select, Input } from "formik-antd";
import { Formik } from "formik";
import washroomIcon from "@images/icons/washroom.svg";
import axios from "axios";
import { AuthContext } from "../../../../app";
import { useLocation } from "react-router-dom";


const GatewayForm = ({
  initialValues,
  infrastructures,
  setFieldValue,
  values,
}) => {
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [isNewGateway, setIsNewGateway] = useState(false);

  const [selectedInfra, setSelectedInfra] = useState(null);
  const [isNewInfra, setIsNewInfra] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [isNewFloor, setIsNewFloor] = useState(false);

  const [selectedSolution, setSelectedSolution] = useState(null);
  const [isNewSolution, setIsNewSolution] = useState(false);
  const [isNewOtherRoom, setIsNewOtherRoom] = useState(false);
  const [showError,setShowError] = useState(false)
  const [gatewayErrorMessage,setGatewayErrorMessage] = useState("")

  const [isSameInfra,setIsSameInfra ] = useState(false);
  const [isSameFloor,setIsSameFloor] =  useState (false);
  const location = useLocation()
  const applicationType= location.pathname.split('/')[1]

  const [gateways, setGateways] = useState([]);
  const value = useContext(AuthContext);
  const keycloackValue = value;

  const { fetchData: getGateways } = useFetch({
    url: `${process.env.API_URL}/gateways?type=${applicationType}`,
    method: "GET",
    onSuccess: (data) => setGateways(data),
  });

  useEffect(() => {
    getGateways();
  }, [initialValues]);

  useEffect(() => {
    setSelectedGateway(initialValues);
    setIsNewGateway(false);
    setSelectedInfra(initialValues.infrastructure);
    setIsNewInfra(false);
    setSelectedFloor(initialValues.floor);
    setIsNewFloor(false);
    setSelectedSolution(initialValues.solution ? initialValues.solution : initialValues.room);
    setIsNewSolution(false);
    setIsNewOtherRoom(false);
  }, [initialValues]);

  const handleGatewayChange = (value) => {
    if (value === "ADDNEW") {
      setFieldValue("gateway", {
        _id: "ADDNEW",
      });
      setFieldValue("gateway.infrastructure", null);
      setFieldValue("gateway.floor", null);
      setFieldValue("gateway.solution", null);
      setSelectedGateway(null);
      setIsNewGateway(true);
      setSelectedInfra(null);
      setIsNewInfra(false);
      setSelectedFloor(null);
      setIsNewFloor(false);
      setSelectedSolution(null);
      setIsNewSolution(false);
      setIsNewOtherRoom(false);
    } else {
      const gateway = gateways.find((it) => it._id === value);
      setSelectedGateway(gateway);
      setFieldValue("gateway", gateway);
      setIsNewGateway(false);
    }
  };

  const handleInfraChange = (value) => {
    if (value === "ADDNEW") {
      setFieldValue("gateway.infrastructure", {
        _id: value,
      });
      setFieldValue("gateway.floor", null);
      setFieldValue("gateway.solution", null);
      setFieldValue("gateway.room", null);
      setSelectedInfra(null);
      setIsNewInfra(true);
      setSelectedFloor(null);
      setIsNewFloor(false);
      setSelectedSolution(null);
      setIsNewSolution(false);
      setIsNewOtherRoom(false);
      setIsSameInfra(false);
    } else if (value == "SAME_WITH_SENSOR") {
      setSelectedInfra({ ...values.infrastructure, _id: "SAME_WITH_SENSOR" });
      setFieldValue("gateway.infrastructure", {
        ...values.infrastructure,
        _id: "SAME_WITH_SENSOR",
      });
      setIsNewInfra(false);
      setIsSameInfra(true);
      setFieldValue("gateway.floor", null);
      setFieldValue("gateway.solution", null);
      setFieldValue("gateway.room", null);
    } else {
      const infrastructure = infrastructures.find((it) => it._id === value);
      setSelectedInfra(infrastructure);
      setFieldValue("gateway.infrastructure", infrastructure);
      setIsNewInfra(false);

      setIsNewFloor(false);
     
      setIsSameInfra(false);
      setFieldValue("gateway.floor", null);
      setFieldValue("gateway.solution", null);
      setFieldValue("gateway.room", null);
    }
  };

  const handleFloorChange = (value) => {
    if (value === "ADDNEW") {
      setFieldValue("gateway.floor", {
        _id: value,
      });
      setFieldValue("gateway.solution", null);
      setFieldValue("gateway.room", null);
      setSelectedFloor(null);
      setIsNewFloor(true);
      setSelectedSolution(null);
      setIsNewSolution(false);
      setIsNewOtherRoom(false);
      setIsSameFloor(true);
    } else if (value === "SAME_WITH_SENSOR") {
      setSelectedFloor({ ...values.floor, _id: "SAME_WITH_SENSOR" });
      setFieldValue("gateway.floor", {
        ...values.floor,
        _id: "SAME_WITH_SENSOR",
      });
      setIsNewFloor(false);
      setIsSameFloor(false);
      setFieldValue("gateway.solution", null);
      setFieldValue("gateway.room", null);
    } else {
      const floor = selectedInfra.floors?.find((it) => it._id === value);
      setSelectedFloor(floor);
      setFieldValue("gateway.floor", floor);
      setIsNewFloor(false);
      setIsSameFloor(true);
      setFieldValue("gateway.solution", null);
      setFieldValue("gateway.room", null);
    }
  };

  const handleSolutionChange = (value) => {
    if (value === "ADDNEW") {
      setFieldValue("gateway.room", {
        _id: value,
      });
      setSelectedSolution(null);
      setIsNewSolution(true);
      setIsNewOtherRoom(false);
    } else if (value === "ADDNEWROOM") {
      setFieldValue("gateway.room", {
        _id: value,
      });
      setIsNewOtherRoom(true);
    } else if (value === "SAME_WITH_SENSOR") {
      setSelectedSolution({ ...values.solution, _id: "SAME_WITH_SENSOR" });
      setFieldValue("gateway.room", {
        ...values.solution,
        _id: "SAME_WITH_SENSOR",
      });
      setIsNewSolution(false);
    } else {
      const solution = selectedFloor?.solutions.find((it) => it._id === value);
      if (solution) {
        setSelectedSolution(solution);
        setFieldValue("gateway.room", solution);
        setIsNewSolution(false);
        setIsNewOtherRoom(false);
      } else {
        const room = selectedFloor?.rooms?.find((it) => it._id === value);
        setSelectedSolution(room);
        setFieldValue("gateway.room", room);
        setIsNewSolution(false);
        setIsNewOtherRoom(false);
      }
    }
  };
  const handleBlur = async (e) =>{
    // console.log("----gatevayv value---",e.target.value);
    let gatewayName = e.target.value;
    const accessToken = localStorage.getItem("accessToken");
      let res = await axios.get(`${process.env.API_URL}/gateways/isGatewayExistByName?name=${gatewayName}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log("--------res--------",res);
      if(res.data){
       
        setShowError(true)
        setGatewayErrorMessage("Gateway id exists already")
      }
      else{
       
        setShowError(false)
        setGatewayErrorMessage("")
        
      }

  }
  return (
    <>
      <h4 className="font-weight-bold">Gateway:</h4>
      <Form.Item
        label="Gateway"
        name="gateway._id"
        hasFeedback
        validate={(value) => !value && "Please select Gateway"}
      >
        <Select
          name="gateway._id"
          placeholder="Gateway"
          style={{ width: "100%" }}
          onChange={handleGatewayChange}
        >
         {keycloackValue?.hasRealmRole("Add Gateway") && <Select.Option value="ADDNEW">
            <i className="fa fa-plus text-primary" /> Add New gateway
          </Select.Option>}
          {gateways.map((gw) => (
            <Select.Option key={gw._id} value={gw._id}>
              {gw.gateway_id}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {isNewGateway && (
        <Form.Item
          label="Gateway ID"
          name="gateway.gateway_id"
          validate={(value) => !value && "Please enter Gateway ID"}
          hasFeedback
        >
          <Input name="gateway.gateway_id" placeholder="Gateway ID"  onBlur={(e)=>handleBlur(e)} />
          {showError&& <div  style={{color:"red" ,textAlign:"left"}} >{gatewayErrorMessage}</div>}
        </Form.Item>
      )}
      {isNewGateway || selectedGateway ? (
        <>
          <Form.Item label="Region" name="gateway.region" hasFeedback>
            <Select
              name="gateway.region"
              placeholder="Region"
              style={{ width: "100%" }}
              options={[
                { label: "us (usa)", value: "us" },
                { label: "eu (europe)", value: "eu" },
                { label: "ap (asia pacific)", value: "ap" },
                { label: "me (middle east)", value: "me" },
                { label: "sa (south america)", value: "sa" },
                { label: "af (africa)", value: "af" },
              ]}
            />
          </Form.Item>
          <Form.Item label="City" name="gateway.city" hasFeedback>
            <Input name="gateway.city" placeholder="City" />
          </Form.Item>
          <Form.Item label="State" name="gateway.state" hasFeedback>
            <Input name="gateway.state" placeholder="State" />
          </Form.Item>
          <Form.Item label="Company" name="gateway.company" hasFeedback>
            <Input name="gateway.company" placeholder="Company" />
          </Form.Item>
          <Form.Item
            label="Company Unit"
            name="gateway.company_unit"
            hasFeedback
          >
            <Input name="gateway.company_unit" placeholder="Company Unit" />
          </Form.Item>
        </>
      ) : null}
      <h5 className="font-weight-bold">Gateway Infra:</h5>
      <h6 className="font-weight-bold ml-3">Infra:</h6>
      <Form.Item
        label="Infrastructure"
        name="gateway.infrastructure._id"
        hasFeedback
      >
        <Select
          name="gateway.infrastructure._id"
          placeholder="Infrastructure"
          style={{ width: "100%" }}
          onChange={handleInfraChange}
        >
          <Select.Option value="ADDNEW">
            <i className="fa fa-plus text-primary" /> Add New Infra
          </Select.Option>
          {values.infrastructure?._id === "ADDNEW" && (
            <Select.Option value="SAME_WITH_SENSOR">
              {values.infrastructure?.name}
            </Select.Option>
          )}
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
            name="gateway.infrastructure.name"
            validate={(value) => !value && "Please enter infra name"}
            hasFeedback
          >
            <Input name="gateway.infrastructure.name" placeholder="Name" />
          </Form.Item>
          <Form.Item
            label="Type"
            name="gateway.infrastructure.type"
            validate={(value) => !value && "Please select infra type"}
            hasFeedback
          >
            <Select
              name="gateway.infrastructure.type"
              placeholder="Infra type"
              style={{ width: "100%" }}
              options={["Building", "Apartment", "Mall"].map((infra) => ({
                label: infra,
                value: infra.toLowerCase(),
              }))}
            />
          </Form.Item>
        </>
      )}
      {selectedInfra || isNewInfra ? (
        <>
          {/* <Form.Item
            label="Description"
            name="gateway.infrastructure.description"
            validate={(value) => !value && "Please enter infra description"}
            hasFeedback
          >
            <Input
              name="gateway.infrastructure.description"
              placeholder="Description"
            />
          </Form.Item> */}
          <Form.Item
            label="Location"
            name="gateway.infrastructure.location"
            validate={(value) => !value && "Please enter infra location"}
            hasFeedback
          >
            <Input
              name="gateway.infrastructure.location"
              placeholder="Location"
            />
          </Form.Item>
          <h6 className="font-weight-bold ml-3">Floor:</h6>
          <Form.Item label="Floor" name="gateway.floor._id" hasFeedback>
            <Select
              name="gateway.floor._id"
              placeholder="Floor"
              style={{ width: "100%" }}
              onChange={handleFloorChange}
            >
              <Select.Option value="ADDNEW">
                <i className="fa fa-plus text-primary" /> Add New Floor
              </Select.Option>
              {isSameInfra && values.floor?._id === "ADDNEW" && (
                <Select.Option value="SAME_WITH_SENSOR">
                  {values.floor?.sign}
                </Select.Option>
              )}
              {!isSameInfra && selectedInfra?.floors?.map((floor) => (
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
        name="gateway.floor.description"
        validate={(value) => !value && "Please enter floor description"}
        hasFeedback
      >
        <Input name="gateway.floor.description" placeholder="Description" />
      </Form.Item>
      <Form.Item
        label="Sign"
        name="gateway.floor.sign"
        validate={(value) => {
          if (!value) return "Please enter floor sign";
          if (value !== "G" && !/^B?[0-9]+$/i.test(value))
            return "Floor sign is not valid";
          return undefined;
        }}
        hasFeedback
      >
        <Input
          name="gateway.floor.sign"
          placeholder="Sign - such as G, B1, B2, 1, 2 ..."
        />
      </Form.Item>
      {selectedFloor || isNewFloor ? (
        <>
          <h6 className="font-weight-bold ml-3">Room:</h6>
          <Form.Item
            label="Room"
            name={selectedSolution?.label ? "gateway.room._id" : "gateway.solution._id" }
            hasFeedback
            validate={(value) => !value && "Please select room"}
          >
            <Select
              name={selectedSolution?.label ? "gateway.room._id" : "gateway.solution._id" }
              placeholder="Room"
              style={{ width: "100%" }}
              onChange={handleSolutionChange}
            >
              <Select.Option value="ADDNEW">
                <i className="fa fa-plus text-primary" /> Add New Wellness
              </Select.Option>
              <Select.Option value="ADDNEWROOM">
                <i className="fa fa-plus text-primary" /> Other Room
              </Select.Option>
              {! isSameFloor && values.solution?._id === "ADDNEW" && (
                <Select.Option value="SAME_WITH_SENSOR">
                  {values.solution?.type}
                </Select.Option>
              )}
              {selectedFloor?.solutions?.map((wr) => (
                <Select.Option key={wr._id} value={wr._id}>
                  {wr.type}
                </Select.Option>
              ))}
              {selectedFloor?.rooms?.map((room) => (
                <Select.Option key={room._id} value={room._id}>
                  {room.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </>
      ) : null}
      {isNewSolution ? (
        <>
          <Form.Item label="Type" name="gateway.room.type" hasFeedback>
            <Select
              name="gateway.room.type"
              placeholder="Type"
              style={{ width: "100%" }}
              options={["Male", "Female", "Disabled"].map((label) => ({
                label,
                value: label.toLowerCase(),
              }))}
            />
          </Form.Item>
        </>
      ) : null}
      {isNewOtherRoom && (
        <>
          <Form.Item
            label="Label"
            name="gateway.room.label"
            validate={(value) => !value && "Please enter room label"}
            hasFeedback
          >
            <Input name="gateway.room.label" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="gateway.room.description"
            validate={(value) => !value && "Please enter room description"}
            hasFeedback
          >
            <Input name="gateway.room.description" />
          </Form.Item>
        </>
      )}
    </>
  );
};

export default GatewayForm;

import React, { useEffect, useState, useCallback } from "react";
import { Divider, Button } from "antd";
import useFetch from "@app/util/useFetch";
import { Form, Select, Input } from "formik-antd";
import { Formik, Field } from "formik";
import washroomIcon from "@images/icons/washroom.svg";
import axios from "axios";



const GatewayForm = ({ infrastructures, setFieldValue, values ,setGatewayErorr}) => {
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [isNewGateway, setIsNewGateway] = useState(false);
  const [selectedInfra, setSelectedInfra] = useState(null);
  const [isNewInfra, setIsNewInfra] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [isNewFloor, setIsNewFloor] = useState(false);
  const [selectedWashroom, setSelectedWashroom] = useState(null);
  const [isNewWashroom, setIsNewWashroom] = useState(false);
  const [isNewOtherRoom, setIsNewOtherRoom] = useState(false);
  const [showError,setShowError] = useState(false)
  const [gatewayErrorMessage,setGatewayErrorMessage] = useState("")

  const [isSameInfra,setIsSameInfra ] = useState(false);
  const [isSameFloor,setIsSameFloor] =  useState (false);

  const [gateways, setGateways] = useState([]);

  const { fetchData: getGateways } = useFetch({
    url: `${process.env.API_URL}/gateways?type=washroom`,
    method: "GET",
    onSuccess: (data) => setGateways(data),
  });

  useEffect(() => {
    getGateways();
  }, []);

  const handleGatewayChange =  async (value) => {
    setShowError(false)
    setGatewayErorr(false)
    if (value === "ADDNEW") {
      setFieldValue("gateway", {
        _id: "ADDNEW",
      });
      setFieldValue("gateway.infrastructure", null);
      setFieldValue("gateway.floor", null);
      setFieldValue("gateway.washroom", null);
      setSelectedGateway(null);
      setIsNewGateway(true);
      setSelectedInfra(null);
      setIsNewInfra(false);
      setSelectedFloor(null);
      setIsNewFloor(false);
      setSelectedWashroom(null);
      setIsNewWashroom(false);
      setIsNewOtherRoom(false);
     
    } else {
      const gateway = gateways.find((it) => it._id === value);
      setSelectedGateway(gateway);
      setFieldValue("gateway", gateway);
      setIsNewGateway(false);
      // todio  call and api  to check gate is alreday  exist or   not 
      // console.log("--hello-----");
   

    }
    
  };

  const handleInfraChange = (value) => {
    if (value === "ADDNEW") {
      setFieldValue("gateway.infrastructure", {
        _id: value,
      });
      setFieldValue("gateway.floor", null);
      setFieldValue("gateway.washroom", null);
      setSelectedInfra(null);
      setIsNewInfra(true);
      setSelectedFloor(null);
      setIsNewFloor(false);
      setSelectedWashroom(null);
      setIsNewWashroom(false);
      setIsNewOtherRoom(false);
      setFieldValue("gateway.room", null);
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
      setFieldValue("gateway.washroom", null);
      setFieldValue("gateway.room", null);
    } else {
      const infrastructure = infrastructures.find((it) => it._id === value);
      setSelectedInfra(infrastructure);
      setFieldValue("gateway.infrastructure", infrastructure);
      setIsNewInfra(false);
      setIsSameInfra(false);
      setFieldValue("gateway.floor", null);
      setFieldValue("gateway.washroom", null);
      setFieldValue("gateway.room", null);
    }
  };

  const handleFloorChange = (value) => {
    if (value === "ADDNEW") {
      setFieldValue("gateway.floor", {
        _id: value,
      });
      setFieldValue("gateway.washroom", null);
      setSelectedFloor(null);
      setIsNewFloor(true);
      setSelectedWashroom(null);
      setIsNewWashroom(false);
      setIsNewOtherRoom(false);
      setFieldValue("gateway.washroom", null);
      setIsSameFloor(true);
    } else if (value === "SAME_WITH_SENSOR") {
      setSelectedFloor({ ...values.floor, _id: "SAME_WITH_SENSOR" });
      setFieldValue("gateway.floor", {
        ...values.floor,
        _id: "SAME_WITH_SENSOR",
      });
      setIsNewFloor(false);
      setIsSameFloor(false);
      setFieldValue("gateway.washroom", null);
      setFieldValue("gateway.room", null);
    } else {
      const floor = selectedInfra.floors?.find((it) => it._id === value);
      setSelectedFloor(floor);
      setFieldValue("gateway.floor", floor);
      setIsNewFloor(false);
      setIsSameFloor(true);
      setFieldValue("gateway.washroom", null);
      setFieldValue("gateway.room", null);
    }
  };

  const handleWashroomChange = (value) => {
    if (value === "ADDNEW") {
      setFieldValue("gateway.room", {
        _id: value,
      });
      setSelectedWashroom(null);
      setIsNewWashroom(true);
    } else if (value === "ADDNEWROOM") {
      setFieldValue("gateway.room", {
        _id: value,
      });
      setIsNewOtherRoom(true);
    } else if (value === "SAME_WITH_SENSOR") {
      setSelectedWashroom({ ...values.washroom, _id: "SAME_WITH_SENSOR" });
      setFieldValue("gateway.room", {
        ...values.washroom,
        _id: "SAME_WITH_SENSOR",
      });
      setIsNewWashroom(false);
      setIsNewOtherRoom(false);
    } else {
      const washroom = selectedFloor?.washrooms.find((it) => it._id === value);
      if (washroom) {
        setSelectedWashroom(washroom);
        setFieldValue("gateway.room", washroom);
        setIsNewWashroom(false);
        setIsNewOtherRoom(false);
      } else {
        const room = selectedFloor?.rooms?.find((it) => it._id === value);
        setFieldValue("gateway.room", room);
        setIsNewWashroom(false);
        setIsNewOtherRoom(false);
      }
    }
    
    
  };
  const handleBlur = async (e) =>{
    let gatewayName = e.target.value;
    const accessToken = localStorage.getItem("accessToken");
      let res = await axios.get(`${process.env.API_URL}/gateways/isGatewayExistByName?name=${gatewayName}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if(res.data){
        setShowError(res.data)
        setGatewayErorr(res.data)
        setGatewayErrorMessage("Gateway id exists already.")
      }
      else{
       
        setShowError(false)
        setGatewayErorr(false)
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
          <Select.Option value="ADDNEW">
            <i className="fa fa-plus text-primary" /> Add New gateway
          </Select.Option>
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
              disabled={selectedGateway}
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
            <Input
              name="gateway.city"
              placeholder="City"
              disabled={selectedGateway}
            />
          </Form.Item>
          <Form.Item label="State" name="gateway.state" hasFeedback>
            <Input
              name="gateway.state"
              placeholder="State"
              disabled={selectedGateway}
            />
          </Form.Item>
          <Form.Item label="Company" name="gateway.company" hasFeedback>
            <Input
              name="gateway.company"
              placeholder="Company"
              disabled={selectedGateway}
            />
          </Form.Item>
          <Form.Item
            label="Company Unit"
            name="gateway.company_unit"
            hasFeedback
          >
            <Input
              name="gateway.company_unit"
              placeholder="Company Unit"
              disabled={selectedGateway}
            />
          </Form.Item>
        </>
      ) : null}
      {isNewGateway && (
        <>
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
        </>
      )}
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
              disabled={selectedInfra}
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
              disabled={selectedInfra}
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
              {!isSameInfra &&  selectedInfra?.floors?.map((floor) => (
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
        </>
      ) : null}
      {selectedFloor || isNewFloor ? (
        <>
          <h6 className="font-weight-bold ml-3">Room:</h6>
          <Form.Item
            label="Room"
            name="gateway.room._id"
            hasFeedback
            validate={(value) => !value && "Please select room"}
          >
            <Select
              name="gateway.room._id"
              placeholder="Room"
              style={{ width: "100%" }}
              onChange={handleWashroomChange}
            >
              <Select.Option value="ADDNEW">
                <i className="fa fa-plus text-primary" /> Add New Washroom
              </Select.Option>
              <Select.Option value="ADDNEWROOM">
                <i className="fa fa-plus text-primary" /> Other Room
              </Select.Option>
              {! isSameFloor && values.washroom?._id === "ADDNEW" && (
                <Select.Option value="SAME_WITH_SENSOR">
                  {values.washroom?.type}
                </Select.Option>
              )}
              {selectedFloor?.washrooms?.map((wr) => (
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
      {isNewWashroom ? (
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

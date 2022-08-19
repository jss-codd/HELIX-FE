import useFetch from "@app/util/useFetch";
import { Button, message, Modal, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../app";
import keycloakApi from "../../util/axios/apiCall";
import  axios from 'axios';


const DashboardPage = ({ setUserData, userData }) => {
  const value = useContext(AuthContext)
  const history = useHistory();
  const [disabledOptions, setDisableOptions] = useState([])
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [loggedInUserRole, setLoggedInUserRole] = useState(null)
  const [parentUserId, setParentUserId] = useState(null)
  const [applicationList,setApplicationList] = useState([])


  const { fetchData: addSolution } = useFetch((params) => ({
    url: `${process.env.API_URL}/user/solutions`,
    body: JSON.stringify(params),
    method: "POST",
    onSuccess: (data) => {
      setUserData(data);
      history.push(`/${params.solution}`);
    },
    onError: (error) => {
      message.error(error);
    },
  }));

  const { fetchData: removeSolution } = useFetch((params) => ({
    url: `${process.env.API_URL}/user/solutions`,
    body: JSON.stringify(params),
    method: "DELETE",
    onSuccess: (data) => {
      setUserData(data);
    },
    onError: (error) => {
      message.error(error);
    },
  }));

  const handleAddSolution = () => {
    if (selectedSolution) {
      addSolution({ solution: selectedSolution });
    } else {
      message.error("Please select solution first");
    }
  };

  const handleDeleteSolution = () => {
    if (selectedSolution) {
      Modal.confirm({
        title: "Are you sure you want to remove this solution?",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: () => removeSolution({ solution: selectedSolution }),
      });
    } else {
      message.error("Please select solution first");
    }
  };

  const getUserGroup = async () => {
    console.log("---------*******----",applicationList?.data.map(d=>d.name));
    if (value?.subject) {
      const resGroup = await keycloakApi.get(`/users/${value?.subject}/groups`)
      setLoggedInUserRole(resGroup?.data[0]?.name)
      console.log("---------*******----",applicationList?.data.map(d=>d.name));
      if (resGroup?.data[0]?.name === "Sub User") {
        

        setDisableOptions(applicationList?.data.map(d=>d.name))

      }
      else {
        // setDisableOptions([
        //   // "Transformers",
        //   // "HVAC",
        //   // "Compressor",
        //   // "Predictive Maintenance",
        //   // "Energy",
        //   // "AMR"
        // ])
      }


    }


  }
  const getAppplications = async () =>{
  
    const accessToken = localStorage.getItem("accessToken");
    const apps = await axios.get(`${process.env.API_URL}/application`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
     console.log("------------applicatipns=== appications====",apps?.data.map(d=>d.name));
    setApplicationList(apps?.data.map(d=>d.name))
    console.log("-sffsfsfsf-----------sffsfsf----------",apps?.data.filter(d=>!d.active).map(d=>d.name));
    setDisableOptions(apps?.data.filter(d=>!d.active).map(d=>d.name))
    console.log("-------------gg-g-g-gg-g-g--g-g-g-gg-----------",value);
    if(value?.userInfo?.group[0]==="/Sub User"){
      setDisableOptions(apps?.data.map(d=>d.name))

    }
   
  }
 



  useEffect(()=>{
    getAppplications()
 },[])

 





  // useEffect(() => {
  //   if (value?.subject) {
  //     getUserGroup()
  //   }

  // }, [value])






  return (
    <>
      <div className="row px-3 mb-3">
        <div className="col-md-4 mb-3">
          <div className="mb-2" style={{ fontWeight: 600 }}>
            Applications:
          </div>
          <Select
            style={{ width: "100%" }}
            placeholder="Select solution"
            value={selectedSolution}
            onSelect={(value) => setSelectedSolution(value)}

            options={applicationList.map((solution) => ({
              value: solution.replaceAll(" ", "-"),
              // value: solution.toLowerCase().replaceAll(" ", "-"),
              label: solution,
              // disabled:[
              //   "Transformers",
              //   "HVAC",
              //   "Compressor",
              //   "Predictive Maintenance",
              //   "Energy",
              //   "AMR"
              // ].includes(solution)
              disabled: disabledOptions.includes(solution)
            }))}
          />
          <div className="mt-2">

            <Button
              type="primary"
              icon={<i className="fa fa-plus mr-3" />}
              onClick={handleAddSolution}
            >
              ADD
            </Button>
            <Button
              className="ml-3 bg-danger text-white"
              icon={<i className="fa fa-trash mr-3" />}
              onClick={handleDeleteSolution}
            >
              DELETE
            </Button>
          </div>
        </div>
      </div>
      {/* <div className="row px-3">
        <div className="col-md-4">
          <LocationCard />
          <DataPeriodCard />
          <AlarmTable />
        </div>
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-3">
              <AlarmCard title="CRITICAL" count={30} color="red" />
            </div>
            <div className="col-md-3">
              <AlarmCard title="MAJOR" count={35} color="orange" />
            </div>
            <div className="col-md-3">
              <AlarmCard title="MINOR" count={36} color="blueviolet" />
            </div>
            <div className="col-md-3">
              <AlarmCard title="EVENT" count={41} color="deepskyblue" />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <AlarmRecordTable />
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default DashboardPage;

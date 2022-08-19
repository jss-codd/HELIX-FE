import React, { useState, useEffect } from "react";
import "../App.css";
import { Box, Grid } from "material-ui-core";
import moment from "moment";
import TAT from "../charts/TotalAvailabilityTime";
import TEEP from "../charts/TotalEffectiveEquipmentPerformace";
import OverallEquipmentEffectiveness from "../charts/OverallEquipmentEffectiveness";
import MtbfChart from "../charts/MtbfChart";
import TdtChart from "../charts/TdtChart";
import EquipmentCriticality from "../charts/EquipmentCriticality";
import TeepDataTable from "../tables/TeepTable";
import UtilizationTime from "../charts/UtilizationTime";
import TatDataTable from "../tables/TatTable";

function ModalEquipmentCategory(props) {
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [todayChecked, setTodayChecked] = useState(true);

  const [oeeData, setOeeData] = useState([]);
  const [teepData, setTeepData] = useState([]);
  const [teepTableData, setTeepTableData] = useState([]);
  const [tatTableData, setTatTableData] = useState([]);
  const [tdtData, setTdtData] = useState([]);
  const [mtbfMttrData, setMtbfMttrData] = useState([]);
  const [criticalityData, setCreticatiliyData] = useState({});

  const modalResolution = props.modalResolution;

  const dateFilter = (data) => {
    const finalArray = [];
    const equipmentFilter = EquipmentsFilter(data);

    const filterDateData = equipmentFilter[0].filter((dt) => {
      if (startDateFilter === "YYYY-MM-DD" || endDateFilter === "YYYY-MM-DD") {
        return true;
      }
      var startMonth = moment(startDateFilter, "YYYY-MM-DD").format(
        "YYYY-MM-DD"
      );
      var endMonth = moment(endDateFilter, "YYYY-MM-DD").format("YYYY-MM-DD");
      return (
        moment(dt.date).format("YYYY-MM-DD") >= startMonth &&
        moment(dt.date).format("YYYY-MM-DD") <= endMonth
      );
    });
    finalArray[0] = filterDateData;
    return finalArray;
  };

  // const handleFilterData = () => {
  //   const {
  //     tdtData,
  //     teepTableData,
  //     teepData,
  //     oeeData,
  //     mtbfMttrData,
  //     criticalityData,
  //     tatTableData,
  //   } = props;
  //   setTeepTableData(EquipmentsFilter(teepTableData));
  //   setOeeData(EquipmentsFilter(oeeData));
  //   setTeepData(EquipmentsFilter(teepData));
  //   setTatTableData(EquipmentsFilter(tatTableData));
  //   setTdtData(EquipmentsFilter(tdtData));
  //   setMtbfMttrData(EquipmentsFilter(mtbfMttrData));
  //   setCreticatiliyData(EquipmentsFilter(criticalityData));
  //   // setTimeout(() => {
  //   //   handleLoader(false);
  //   // }, 3000);
  // };

  const { equipmentFilter } = props;
  const EquipmentsFilter = (data) => {
    const arrayObj = [];
    arrayObj.push(
      data[0]?.filter((dt) => dt.equipment.trim() === equipmentFilter.trim())
    );
    return arrayObj;
  };

  useEffect(() => {
    const {
      tdtData,
      teepTableData,
      teepData,
      oeeData,
      mtbfMttrData,
      criticalityData,
      tatTableData,
    } = props;

    setTeepTableData(dateFilter(teepTableData));
    setOeeData(dateFilter(oeeData));
    setTeepData(dateFilter(teepData));
    setTatTableData(dateFilter(tatTableData));
    setTdtData(dateFilter(tdtData));
    setMtbfMttrData(dateFilter(mtbfMttrData));
    setCreticatiliyData(dateFilter(criticalityData));
    setTimeout(() => {
      props.handleLoader(false);
    }, 3000);
  }, [startDateFilter, endDateFilter]);

  // useEffect(() => {
  //   if (tdtData && teepData && mtbfMttrData) {
  //     // Check if start date is greater from end date
  //     if (
  //       moment(startDateFilter, "YYYY-MM-DD").format("YYYY-MM-DD") <=
  //       moment(endDateFilter, "YYYY-MM-DD").format("YYYY-MM-DD")
  //     ) {
  //       handleFilterData();
  //     } else {
  //       alert("Please select valid date.");
  //       //handleLoader(false);
  //       resetInitialDate();
  //     }
  //   }
  // }, []);

  useEffect(() => {
    if (todayChecked) {
      var today = moment(new Date()).format("YYYY-MM-DD");
      setStartDateFilter(today);
      setEndDateFilter(today);
    }
  }, [todayChecked]);

  const handleChecked = (e) => {
    if (!e.target.checked) {
      setStartDateFilter("YYYY-MM-DD");
      setEndDateFilter("YYYY-MM-DD");
    }
    setTodayChecked(e.target.checked);
    props.handleLoader(true);
  };

  const resetInitialDate = () => {
    setStartDateFilter("YYYY-MM-DD");
    setEndDateFilter("YYYY-MM-DD");
  };

  return (
    <>
      <Box id="box1">
        <Grid item xs={12} lg={12} md={12} sm={12} className="flex-style">
          <Grid item xs={12} lg={8} md={12} sm={12}>
            <div style={{ height: "100%" }} className="">
              <h3> Equipment Reliability</h3>
            </div>
          </Grid>
          <Grid item xs={12} lg={2} md={12} sm={12}>
            <div className="date-box">
              <p className="date-text">Date</p>
              <div className="flex-style">
                <input
                  onChange={(e) => {
                    props.handleLoader(true);
                    setTodayChecked(false);
                    setStartDateFilter(e.target.value);
                  }}
                  type="date"
                  value={startDateFilter}
                  max={endDateFilter}
                />
                <input
                  onChange={(e) => {
                    props.handleLoader(true);
                    setTodayChecked(false);
                    setEndDateFilter(e.target.value);
                  }}
                  type="date"
                  value={endDateFilter}
                  max={moment(new Date()).format("YYYY-MM-DD")}
                />
              </div>
            </div>
          </Grid>
          <Grid item xs={12} lg={2} md={12} sm={12}>
            <div className="today-box">
              <p className="date-text">Today</p>
              <div className="check-style">
                <span>
                  <input
                    checked={todayChecked}
                    onChange={(e) => handleChecked(e)}
                    type="checkbox"
                  />
                </span>
                <h6 className="today">Today</h6>
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
      <Grid container style={{ height: "100%", flex: "1 0 auto" }}>
        <Grid item xs={12} lg={12} md={12} sm={12} className="box-container">
          <Grid container item xs={12} sm={12} className="box-flex">
            <Grid
              style={{ height: "100%" }}
              item
              xs={12}
              lg={2}
              md={12}
              sm={12}
            >
              <div style={{ height: "100%" }} className="box-chart-one">
                <TdtChart modalResolution={modalResolution} tdtData={tdtData} />
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              lg={4}
              md={12}
              sm={12}
              style={{ maxHeight: "100%" }}
            >
              <div style={{ height: "100%" }} className="box-chart-tat">
                <TAT
                  modalResolution={modalResolution}
                  tatTableData={tatTableData}
                />
                <TatDataTable
                  modalResolution={modalResolution}
                  tatTableData={tatTableData}
                />
              </div>
            </Grid>
            <Grid
              item
              style={{ height: "100%" }}
              xs={12}
              lg={4}
              md={12}
              sm={12}
            >
              <div style={{ height: "100%" }} className="box-chart-one">
                <UtilizationTime
                  modalResolution={modalResolution}
                  utilizationData={tatTableData}
                />
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              style={{ height: "100%" }}
              lg={2}
              md={12}
              sm={12}
            >
              <div
                style={{
                  height: "100%",
                  // boxShadow: "rgb(0 0 0 / 50%) 0px 5px 15px 0px",
                  background: "#fff",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    flexGrow: "1",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <EquipmentCriticality
                    modalResolution={modalResolution}
                    criticalityData={criticalityData}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid container item xs={12} sm={12} className="box-flex">
            <Grid item xs={12} lg={3} md={12} sm={12}>
              <div style={{ height: "100%" }} className="box-chart-one">
                <MtbfChart
                  modalResolution={modalResolution}
                  mtbfMttrData={mtbfMttrData}
                />
              </div>
            </Grid>
            <Grid item xs={12} lg={3} md={12} sm={12}>
              <div style={{ height: "100%" }} className="box-chart-one">
                <div>
                  <OverallEquipmentEffectiveness
                    modalResolution={modalResolution}
                    oeeData={oeeData}
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} lg={6} md={12} sm={12}>
              <div style={{ height: "100%" }} className="box-chart-last">
                <div
                  style={{
                    height: "60%",
                    borderBottom: "1px solid black",
                    position: "relative",
                  }}
                >
                  <TEEP modalResolution={modalResolution} teepData={teepData} />
                </div>
                <div
                  className="teep-table"
                  style={{
                    overflow: "scroll",
                    height: "40%",
                    position: "relative",
                  }}
                >
                  <TeepDataTable teepTableData={teepTableData} />
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default ModalEquipmentCategory;

import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect, useLocation ,useParams } from "react-router-dom";
import Header from "./app/core/header/header";
import Sidenav from "./app/core/sidenav/sidenav";
import NotFoundPage from "./app/pages/NotFoundPage";
import DashboardPage from "./app/pages/DashboardPage";
import AdminDashboardPage from "./app/pages/AdminDashboardPage";
import ComponentsPage from "./app/pages/AdminDashboardPage/ComponentsPage";
import SensorsPage from "./app/pages/AdminDashboardPage/SensorTypePage";
import EnergyManagement from "./app/pages/EnergyManagement";
import Washroom from "./app/pages/Washroom";
import Wellness from "./app/pages/Wellness";
import AddSensorPage from "./app/pages/Washroom/NewDashboard/AddSensor";
import WellnessAddSensorPage from "./app/pages/Wellness/NewDashboard/AddSensor";
import UpdateSensorPage from "./app/pages/Washroom/NewDashboard/UpdateSensor";
import WellneessUpdateSensorPage from "./app/pages/Wellness/NewDashboard/UpdateSensor";
import PreventiveMaintainance from "./app/predictiveMaintenance/predictiveMaintenance";
import useFetch from "@app/util/useFetch";
import { Spin } from "antd";
import Chart from "./app/pages/Washroom/Analytics/Chart";
import WellnessChart from "./app/pages/Wellness/Analytics/Chart";
import Keycloak from "keycloak-js";
import "./app.scss";
import axios from "axios";

export const AuthContext = React.createContext();

const App = (props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [keycloak, setKeycloak] = useState(null);
  const [userData, setUserData] = useState(null);
  const [clickedSolution, setClickedSolution] = useState("");
  const [application, setApplication] = useState([]);
  const location = useLocation();
  const params = useParams()

  const { loading, fetchData: getUserData } = useFetch({
    url: `${process.env.API_URL}/user/info`,
    method: "GET",
    onSuccess: (data) => {
      console.log("----data--------", data);
      console.log("9999999999999999999999999", keycloak);
      if (keycloak?.userInfo?.group[0] === "/Sub User") {
        getSubUserData(data);
      } else {
        setUserData(data);
      }
    },
  });

  const getSubUserData = async (loggedInUserData) => {
    const accessToken = localStorage.getItem("accessToken");
    const parentInfo = await axios.get(
      `${process.env.API_URL}/user/subUserInfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    let updatedUserData = {
      ...loggedInUserData,
      solutions: parentInfo?.data.solutions,
    };

    setUserData(updatedUserData);
  };

  useEffect(() => {
    const kc = Keycloak("/public/keycloak.json");
    kc.init({ onLoad: "login-required" }).then((authenticated) => {
      setAuthenticated(authenticated);
      setKeycloak(kc);
      if (authenticated) localStorage.setItem("accessToken", kc.token);
    });
  }, []);

  useEffect(() => {
    if (keycloak !== null) {
      // getApps();
      getUserData();
    }
    
  }, [keycloak]);

  console.log("----99999---", userData);
  console.log("--------------- use paraams------------teterreree-------",params,"--------------",props?.match);

  useEffect(() => {
    console.log(
      "------- const location = **********************************useLocation();  const location = useLocation(); const location = useLocation(); const location = useLocation();------",
      clickedSolution
    );
  }, [clickedSolution]);

  // const getApps = async () => {
  //   const accessToken = localStorage.getItem("accessToken");
  //   const apps = await axios.get(`${process.env.API_URL}/application`, {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });
  //   setApplication(apps.data);
  // };

  // useEffect(() => {
  //   getApps();
  // }, []);

  return !authenticated || loading ? (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <Spin />
      <h3>Logging you in ...</h3>
    </div>
  ) : (
    <AuthContext.Provider value={keycloak}>
      <div>
        <Header
          keycloak={keycloak}
          userData={userData}
          getUserData={getUserData}
        />
        <div className="m-0 page-actions-header">
          <div className="side-nav-bar p-0">
            <Sidenav
              version={props.version}
              solutions={userData?.solutions || []}
              roles={userData?.roles}
              setClickedSolution={setClickedSolution}
            />
          </div>
          <div className="main-content">
            <Switch>
              <Route
                exact
                path="/config"
                render={(routeProps) => <AdminDashboardPage {...routeProps} />}
              />
              <Route
                exact
                path="/components"
                render={(routeProps) => <ComponentsPage {...routeProps} />}
              />
              <Route
                exact
                path="/sensors"
                render={(routeProps) => <SensorsPage {...routeProps} />}
              />
              <Route
                exact
                path="/dashboards"
                render={(routeProps) => (
                  <DashboardPage
                    setUserData={setUserData}
                    {...routeProps}
                    userData={userData}
                  />
                )}
              />
              <Redirect from="/" to="/dashboards" exact />
              {/* <Route exact path="/notfound" component={NotFoundPage} /> */}



              <>
                    <Route
                      exact
                      path={`/application/:type`}
                      render={(routeProps) => (
                        <Wellness
                          setUserData={setUserData}
                          {...routeProps}
                          application={application}
                        />
                      )}
                    />
                    <Route
                      exact
                      path={`/application/:type/sensor`}
                      component={WellnessAddSensorPage}
                    />
                    <Route
                      exact
                      path={`/application/:type/sensor/:sensorId`}
                      component={WellneessUpdateSensorPage}
                    />
                    <Route
                      exact
                      path={`/application/:type/chart`}
                      component={Chart}
                    />
                  </>






              {/* {console.log(
                "------------solutions--------",
                userData?.solutions
              )}

              {application?.map((sol, idx) => {
                console.log("----sol---", sol.name);
                return (
                  <>
                    <Route
                      exact
                      path={`/${clickedSolution}`}
                      render={(routeProps) => (
                        <Wellness
                          setUserData={setUserData}
                          {...routeProps}
                          application={application}
                        />
                      )}
                    />
                    <Route
                      exact
                      path={`/${clickedSolution}/sensor`}
                      component={WellnessAddSensorPage}
                    />
                    <Route
                      exact
                      path={`/${clickedSolution}/sensor/:sensorId`}
                      component={WellneessUpdateSensorPage}
                    />
                    <Route
                      exact
                      path={`/${clickedSolution}/chart`}
                      component={Chart}
                    />
                  </>
                );
              })} */}

              <Route
                // key={idx}
                exact
                path="/predictive-maintenance"
                component={PreventiveMaintainance}
              />

              <Redirect from="/" to="/dashboards" exact />

              <Route path="*" component={NotFoundPage} />
            </Switch>

            {/* <Route path="*" component={NotFoundPage} /> */}
          </div>
        </div>
      </div>
    </AuthContext.Provider>
  );
};

export default App;

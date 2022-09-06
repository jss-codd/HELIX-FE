/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from "react";
import { Link, useLocation, useHistory,useParams } from "react-router-dom";
import { Nav, NavItem, NavLink, Col } from "reactstrap";
import { Tooltip } from "antd";
import { Menus } from "@app/util/appAccess";
import homeIconBlue from "@images/icons/homeBlue.svg";
import axios from "axios";


const Sidenav = ({ solutions, roles, setClickedSolution, version }) => {
  const location = useLocation();
  const [applicationList, setApplicationList] = useState([])
  

  useEffect(() => {
    setClickedSolution(location?.pathname.split('/')[1])
  }, [location?.pathname])


  useEffect(() => {
    getAppplications()
  }, [])

  const getAppplications = async () => {

    const accessToken = localStorage.getItem("accessToken");
    const apps = await axios.get(`${process.env.API_URL}/application`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    console.log("------------applicatipns=======", apps);
    setApplicationList(apps?.data)

  }

  console.log("----------------locaton--- location----locationlocation----",location);



  return (
    <>
      <Nav vertical className="sidenav">
        {roles?.includes("admin") && (
          <NavItem>
            <NavLink tag={Link} className="text-white text-center" to="/config">
              <Tooltip title="Configurations" placement="right">
                <div
                  className={
                    location.pathname === "/config" ? "highlight" : "rect"
                  }
                >
                  <i className="fa fa-cog" style={{ fontSize: 32 }} />
                </div>
              </Tooltip>
            </NavLink>
            <Col sm="11 pl-4">
              <hr className="white-border border-top-2px mt-1 mb-1" />
            </Col>
          </NavItem>
        )}
        <NavItem>
          <NavLink tag={Link} className="text-white text-center" to="/dashboards">
            <Tooltip title="Dashboards" placement="right">
              <div
                className={
                  location.pathname === "/dashboards" ? "highlight" : "rect"
                }
              >
                <img src={homeIconBlue} width="30" height="30" />
              </div>
            </Tooltip>
          </NavLink>
          <Col sm="11 pl-4">
            <hr className="white-border border-top-2px mt-1 mb-1" />
          </Col>
        </NavItem>
        {solutions?.map((solution) => {
          const menu = applicationList.find((item) => item.name.replaceAll(" ", "-") === `${solution}`);

          console.log("--------------nenu paath name-------", menu, "location path name----", location.pathname.split("/"))
          if (menu)
            return (
              <NavItem key={menu.name.toUpperCase()}>
                {console.log(`---------------34333333---sss---------------/application/:${menu.name}`)}
                <NavLink
                  tag={Link}
                  className="text-white text-center"
                  to={`/application/${menu.name}`}

                >
                  <Tooltip title={menu.name} placement="right">
                    <div
                      className={
                        `/${location.pathname.split("/")[2]}` === `/${menu.name}` ? "highlight" : "rect"
                      }
                    >
                      {<img src={menu?.logo} width="30" height="30" alt="not found" />}
                    </div>
                  </Tooltip>
                </NavLink>
                <Col sm="11 pl-4">
                  <hr className="white-border border-top-2px mt-1 mb-1" />
                </Col>
              </NavItem>
            );
          return null;
        })}
      </Nav>
      <div className="version">V{version}</div>
    </>
  );
};

export default Sidenav;

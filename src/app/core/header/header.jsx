import React, { useCallback, useEffect, useState, useContext } from "react";
import { Navbar, NavbarBrand } from "reactstrap";
import { Avatar, Space, Dropdown, Typography, Menu } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { useLocation, useHistory } from "react-router-dom";
import homelogo from "../../images/helixSenseLogo.svg";
import LogoModal from "./LogoModal";
import { AuthContext } from "../../../../src/app";
import keycloakApi from "../../util/axios/apiCall";
import apiClient from "../../util/axios/index";
import axios from 'axios'


import "./header.scss";
const Header = ({ keycloak, userData, getUserData }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const value = useContext(AuthContext);
  const keycloackValue = value;
  const [loginUserRole, setLoginUserRole] = useState("")
  const [customerLogo, setCustomerLogo] = useState(null)
  const [profileLogo, setProfileLogo] = useState(null)
  const [selectEvent, setSelectEvent] = useState(null)

  const handleLogout = useCallback(() => {
    history.push("/", { from: location.pathname })
    keycloak
      ?.logout()
      .then(() => { history.push("/", { from: location.pathname }) });
  }, [history, location, keycloak]);

  useEffect(() => {
    keycloak?.loadUserInfo().then((userInfo) => { setUserInfo(userInfo); });

  }, [keycloak]);

  useEffect(() => {
    getUserGroup()
  }, [userData])

  const getUserGroup = async () => {
    if (keycloackValue?.subject) {
      const resGroup = await keycloakApi.get(`/users/${keycloackValue?.subject}/groups`)
      console.log("---------resGroup- ---", resGroup);
      setLoginUserRole(resGroup.data[0]?.name)
      let cust_logo = await getCustomerLogo(resGroup.data[0]?.name)
      let profile_logo = await getProfileLogo(resGroup.data[0]?.name)
      console.log(profile_logo, "profile_logo");
      setProfileLogo(profile_logo)
      setCustomerLogo(cust_logo)
    }
  }
  const getProfileLogo = async (Role) => {
    if (Role === "Admin" || Role === "Customer") {
      return ""
    } else if (Role === "Sub Customer") {
      return userData?.profile_logo
    }
    else {
      console.log(userData, "userData--p-0---");
      if (userData?.profile_logo !== undefined) {
        const accessToken = localStorage.getItem("accessToken");
        let imData = await axios.get(`${process.env.API_URL}/user/getCustomerLogo/${userData?.profile_logo}?type=profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,

          },
        })
        console.log("-fdgdfgdfgdfgdfgdfgdfgdfgdfgdfgdf", imData);
        if (imData?.data !== undefined) {
          return imData?.data
        }
        else {
          return ""
        }
      }
      else {
        return ""
      }
    }

  }

  const getCustomerLogo = async (Role) => {
    if (Role === "Admin") {
      return homelogo
    }
    else if (Role === "Customer") {
      return userData?.logo

    }
    else {
      if (userData?.logo !== undefined) {
        const accessToken = localStorage.getItem("accessToken");
        let imData = await axios.get(`${process.env.API_URL}/user/getCustomerLogo/${userData?.logo}?type=logo`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,

          },
        })
        console.log("---------yyyyyyy-imData-----", imData);
        if (imData?.data !== undefined) {
          return imData?.data
        }
        else {
          return homelogo
        }
      }
      else {
        return homelogo
      }
    }
  }



  const handleActionClick = useCallback(
    (e) => {
      switch (e.key) {
        case "details":
          history.push("/user");
          break;
        case "change_logo":
          setSelectEvent(e.key)
          setShowModal(true);
          break;
        case "logout":
          handleLogout();
          break;
        case "change_profile_logo":
          setSelectEvent(e.key)
          setShowModal(true);
        default:
      }
    },
    [handleLogout, history]
  );

  const menu = (
    <Menu onClick={handleActionClick}>
      {/* <Menu.Item key="details">
        <UserOutlined /> Details
      </Menu.Item> */}
      {keycloackValue?.hasRealmRole("Add Logo") && <Menu.Item key="change_logo" icon={<PictureOutlined />}>
        Change logo
      </Menu.Item>}
         {/* TODO manage with keyclock add role of upload profile logo rather then loginuserRole */}
      {loginUserRole === "Sub Customer" && <Menu.Item key="change_profile_logo" icon={<UserOutlined />}>
        Change profile logo
      </Menu.Item>}
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>

    </Menu>
  );

  return (
    <>
      <LogoModal
        visible={showModal}
        event={selectEvent}
        onCloseModal={() => {
          setShowModal(false);
          getUserData();
        }}
      />
      <div className="header">
        <Navbar color="light" expand="md">
          <NavbarBrand className="p-0 mr-auto" href="/">
            <img
              src={customerLogo ? customerLogo : homelogo}
              width="100"
              height="40"
              className="d-inline-block align-top"
              alt="Logo image"
            />
          </NavbarBrand>
          <div>
            <Dropdown overlay={menu}>
              <Space style={{ cursor: "pointer" }}>
                <Avatar icon={<UserOutlined />} src={profileLogo} />
                <Typography.Text>{userInfo?.name}</Typography.Text>
              </Space>
            </Dropdown>
          </div>
        </Navbar>
      </div>
    </>
  );
};

export default Header;


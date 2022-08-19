import React from "react";
import homeIconBlue from "@images/icons/homeBlue.svg";
import pumpIcon from "@images/icons/pump.svg";
import fanIcon from "@images/icons/fan.svg";
import compressorIcon from "@images/icons/compressor.svg";
import washroomIcon from "@images/icons/washroom.svg";
import wellnessIcon from "@images/icons/wellness.svg";
import { DashboardOutlined } from "@ant-design/icons";

export const Menus = [
  {
    title: "Dashboards",  
    name: "DASHBOARDS", 
    displayName: "Dashboards",
    path: "/dashboards",
    icon: <img src={homeIconBlue} width="30" height="30" />,
  },
  {
    title: "Predictive Maintenance",
    name: "PREDICTIVE MAINTENANCE",
    displayName: "Predictive Maintenance",
    path: "/predictive-maintenance",
    icon: <i className="fa fa-calendar-minus-o" style={{ fontSize: 32 }} />,
  },
  {
    title: "Transforms",
    name: "TRANSFORMS",
    displayName: "Transforms",
    path: "/transforms",
    icon: <i className="fa fa-retweet" style={{ fontSize: 32 }} />,
  },
  {
    title: "DG",
    name: "DG",
    displayName: "DG",
    path: "/dg",
    icon: <i className="fa fa-dot-circle-o" style={{ fontSize: 32 }} />,
  },
  {
    title: "Pumps",
    name: "PUMPS",
    displayName: "Pumps",
    path: "/pumps",
    icon: <img src={pumpIcon} width="30" height="30" />,
  },
  {
    title: "Blower",
    name: "BLOWER",
    displayName: "Blower",
    path: "/blower",
    icon: <img src={fanIcon} width="30" height="30" />,
  },
  {
    title: "HVAC",
    name: "HVAC",
    displayName: "HVAC",
    path: "/hvac",
    icon: <img src={fanIcon} width="30" height="30" />,
  },
  {
    title: "Compressor",
    name: "COMPRESSOR",
    displayName: "Compressor",
    path: "/compressor",
    icon: <img src={compressorIcon} width="30" height="30" />,
  },
  {
    title: "Washroom",
    name: "WASHROOM",
    displayName: "washroom", //
    path: "/washroom",
    icon: <img src={washroomIcon} width="30" height="30" />,
  },
  {
    title: "Gateway Management",
    name: "GATEWAY MANAGEMENT",
    displayName: "Gateway Management",
    path: "/gateway-management",
    icon: <i className="fa fa-sign-out" style={{ fontSize: 32 }} />,
  },
  {
    title: "Energy Management",
    name: "ENERGY MANAGEMENT",
    displayName: "Energy Management",
    path: "/energy",
    icon: <i className="fa fa-bolt" style={{ fontSize: 32 }} />,
  },
  {
    title: "Wellness",
    name: "WELLNESS",
    displayName: "Wellness",
    path: "/wellness",
    icon: <img src={wellnessIcon} width="30" height="30" />,
  },
];

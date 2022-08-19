import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const AdminDashboardPage = () => {
  const history = useHistory();

  return (
    <div className="w-100 h-100 text-center position-relative">
      <div className="block-center">
        <div>
          <button className="d-inline align-top admin-config-button mr-3">
            <span style={{ fontSize: 24 }}>
              <i className="fa fa-plus" />
            </span>
            <br />
            Create Solution Type
          </button>
          <button
            className="d-inline align-top admin-config-button"
            onClick={() => history.push("/components")}
          >
            <span style={{ fontSize: 24 }}>
              <i className="fa fa-plus" />
            </span>
            <br />
            Add Components
          </button>
        </div>
        <div className="mt-2">
          <button className="admin-config-button" onClick={() => history.push("/sensors")}>
            <span style={{ fontSize: 24 }}>
              <i className="fa fa-plus" />
            </span>
            <br />
            Create Sensor Type
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

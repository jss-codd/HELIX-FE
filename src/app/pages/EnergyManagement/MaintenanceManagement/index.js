import React, { useEffect, useState } from "react";
import { Divider, Select, Spin, message, Button } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import useFetch from "@app/util/useFetch";
import CorrectiveMaintenanceChart from "./CorrectiveMaintenanceChart";
import PreventiveMaintenanceChart from "./PreventiveMaintenanceChart";
import PMCalendar from "./PMCalendar";
import PurchaseOrder from "./PurchaseOrder";
import EnergyConsumption from "./EnergyConsumption";
import WorkOrderReport from "./WorkOrderReport";

const MaintenanceManagement = ({ activeIndex, setActiveIndex, sites }) => {
  const [selectedSite, setSelectedSite] = useState(sites ? sites[0]._id : null);

  const { data: siteData, fetchData: getSiteData } = useFetch((siteId) => ({
    url: `${process.env.API_URL}/user/sites/${siteId}`,
    method: "GET",
    onError: (error) => {
      message.error(error.message);
    },
  }));

  useEffect(() => {
    selectedSite && getSiteData(selectedSite);
  }, [selectedSite]);

  return (
    <div className="p-3" style={{ marginBottom: 150 }}>
      <div className="row position-relative">
        <div className="col col-md-6">
          <h2 className="text-mandy font-weight-bold">
            <i
              className="fa fa-calendar fa-2x mr-2"
              style={{ color: "#3a4354" }}
            />
            Maintenance Management
          </h2>
        </div>
        <div className="col col-md-4">
          <Select
            showSearch
            style={{ width: 200, marginTop: "2em" }}
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
            options={sites?.map((v) => ({ value: v._id, label: v.name }))}
            value={selectedSite}
            onSelect={(value) => setSelectedSite(value)}
          />
        </div>
        <div
          className="d-flex justify-content-end"
          style={{ position: "absolute", top: 16, right: 16 }}
        >
          <Button
            className="border-0"
            size="large"
            ghost
            icon={<ArrowLeftOutlined style={{ color: "#4e5664" }} />}
            disabled={activeIndex < 1}
            onClick={() => setActiveIndex(activeIndex - 1)}
          />
          <Button
            className="border-0"
            size="large"
            ghost
            icon={<ArrowRightOutlined style={{ color: "#4e5664" }} />}
            disabled={activeIndex > 2}
            onClick={() => setActiveIndex(activeIndex + 1)}
          />
        </div>
      </div>
      <Divider style={{ border: "1px solid #d84e59", marginTop: 0 }} />
      <div className="row">
        <div className="col col-md-4">
          <CorrectiveMaintenanceChart data={siteData} />
        </div>
        <div className="col col-md-4">
          <PreventiveMaintenanceChart data={siteData} />
        </div>
        <div className="col col-md-4">
          <PMCalendar />
        </div>
      </div>
      <div className="row my-3">
        <div className="col col-md-4">
          <PurchaseOrder data={siteData?.purchases} />
        </div>
        <div className="col col-md-8">
          <EnergyConsumption data={siteData?.energy_consumptions} />
          <WorkOrderReport data={siteData?.work_orders} />
        </div>
      </div>
    </div>
  );
};

export default MaintenanceManagement;

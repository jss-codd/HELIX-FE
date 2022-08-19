import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import {
  Divider,
  Button,
  Table,
  message,
  PageHeader,
  Tooltip,
  Modal,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useFetch from "@app/util/useFetch";
import { Form, Select, Input } from "formik-antd";
import { Formik } from "formik";
import isEmpty from "lodash/fp/isEmpty";
import SensorIcon from "@images/icons/sensor.svg";
import ComponentGridLayout from "./ComponentGridLayout";

const SensorTypePage = () => {
  const [sensorTypes, setSensorTypes] = useState([]);
  const [components, setComponents] = useState([]);
  const [componentLayouts, setComponentLayouts] = useState([]);
  const [edittingSensorType, setEdittingSensorType] = useState({});

  const history = useHistory();

  const isUpdating = useMemo(() => !isEmpty(edittingSensorType), [
    edittingSensorType,
  ]);

  const { fetchData: getSensorTypes } = useFetch({
    url: `${process.env.API_URL}/sensor_types`,
    method: "GET",
    onSuccess: (data) => setSensorTypes(data),
  });

  const { fetchData: getComponents } = useFetch({
    url: `${process.env.API_URL}/components`,
    method: "GET",
    onSuccess: (data) => setComponents(data),
  });

  const { creatingSensorType, fetchData: createSensorType } = useFetch(
    (params, resetForm) => ({
      url: `${process.env.API_URL}/sensor_types`,
      method: "POST",
      body: JSON.stringify(params),
      onSuccess: () => {
        message.success("Sensor type created!");
        getSensorTypes();
        resetForm();
      },
    })
  );

  const { updatingSensorType, fetchData: updateSensorType } = useFetch(
    (params, sensorId, resetForm) => ({
      url: `${process.env.API_URL}/sensor_types/${sensorId}`,
      method: "PUT",
      body: JSON.stringify(params),
      onSuccess: () => {
        message.success("Sensor type updated!");
        getSensorTypes();
        resetForm();
      },
    })
  );

  const { fetchData: deleteSensorType } = useFetch((sensorId) => ({
    url: `${process.env.API_URL}/sensor_types/${sensorId}`,
    method: "DELETE",
    onSuccess: () => {
      getSensorTypes();
      message.success("Sensor type deleted!");
    },
  }));

  useEffect(() => {
    getSensorTypes();
    getComponents();
  }, []);

  const onSubmit = useCallback(
    (values, { resetForm }) => {
      const comps = values.components.map((comp) => {
        const layout = componentLayouts.find((item) => item.i === comp);
        return {
          component: comp,
          layout: {
            x: layout.x,
            y: layout.y,
            h: layout.h,
            w: layout.w,
          },
        };
      });

      if (isUpdating) {
        updateSensorType(
          {
            ...values,
            components: comps,
          },
          edittingSensorType._id,
          resetForm
        );
      } else {
        createSensorType(
          {
            ...values,
            components: comps,
          },
          resetForm
        );
      }
    },
    [isUpdating, edittingSensorType, componentLayouts]
  );

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this item?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => deleteSensorType(record._id),
    });
  };

  const columns = [
    {
      title: <div className="font-weight-bold">Sensor Code</div>,
      dataIndex: "code",
      className: "font-weight-normal",
    },
    {
      title: <div className="font-weight-bold">Description</div>,
      dataIndex: "description",
      className: "font-weight-normal",
    },
    {
      title: <div className="font-weight-bold">Action</div>,
      render: (record) => (
        <div>
          <button
            onClick={() => {
              setComponentLayouts(
                record.components.map((comp) => ({
                  i: comp.component,
                  ...comp.layout,
                }))
              );
              setEdittingSensorType({
                ...record,
                components: record.components.map((comp) => comp.component),
              });
            }}
            style={{
              marginRight: 12,
              border: "none",
              backgroundColor: "transparent",
            }}
          >
            <Tooltip title="Edit">
              <EditOutlined style={{ color: "blue" }} />
            </Tooltip>
          </button>
          <button
            style={{ border: "none", backgroundColor: "transparent" }}
            onClick={() => handleDelete(record)}
          >
            <Tooltip title="Delete">
              <DeleteOutlined style={{ color: "red" }} />
            </Tooltip>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4" style={{ marginBottom: 150 }}>
      <div className="row position-relative">
        <div className="col-md-6">
          <h2 className="text-mandy font-weight-bold">
            <img
              src={SensorIcon}
              width="50"
              height="50"
              className="mr-3"
              style={{ marginTop: -8 }}
            />
            Sensor types
          </h2>
        </div>
      </div>
      <Divider style={{ border: "1px solid #d84e59", marginTop: 0 }} />
      <PageHeader
        onBack={() => history.push("/config")}
        title={isUpdating ? "Update sensor type" : "Add sensor type"}
      >
        <div className="row">
          <Formik
            initialValues={edittingSensorType}
            enableReinitialize
            onSubmit={onSubmit}
          >
            {({ isValid, values, resetForm }) => (
              <>
                <div className="col-md-6">
                  <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    <Form.Item
                      label="Sensor Code"
                      name="code"
                      validate={(value) => !value && "Please enter sensor code"}
                      hasFeedback
                    >
                      <Input name="code" placeholder="Sensor Code" />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                      <Input name="description" placeholder="Description" />
                    </Form.Item>

                    <Form.Item
                      label="Components"
                      name="components"
                      validate={(value) => !value && "Please select type"}
                      hasFeedback
                    >
                      <Select
                        name="components"
                        mode="multiple"
                        placeholder="Components"
                        style={{ width: "100%" }}
                        options={components.map((component) => ({
                          label: component.name,
                          value: component._id,
                        }))}
                      />
                    </Form.Item>
                    <div className="mb-3">
                      <h5 className="font-weight-bold">View</h5>
                    </div>
                    <div
                      className="border rounded p-3 h-100 bg-gray"
                      style={{ minHeight: 300 }}
                    >
                      <ComponentGridLayout
                        components={
                          components.filter((com) =>
                            values.components?.includes(com._id)
                          ) || []
                        }
                        componentLayouts={componentLayouts}
                        setComponentLayouts={setComponentLayouts}
                      />
                    </div>
                    <div className="row d-flex justify-content-center">
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={
                          !isValid || creatingSensorType || updatingSensorType
                        }
                        loading={creatingSensorType || updatingSensorType}
                        className="mt-4 align-self-center"
                      >
                        Save
                      </Button>
                      {isUpdating ? (
                        <Button
                          type="primary"
                          className="mt-4 ml-3 align-self-center"
                          onClick={() => {
                            setEdittingSensorType({});
                            setComponentLayouts([]);
                          }}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          className="mt-4 ml-3 align-self-center"
                          onClick={() => {
                            setEdittingSensorType({});
                            setComponentLayouts([]);
                            resetForm();
                          }}
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </Form>
                </div>

                <div className="col-md-6">
                  <Table
                    bordered
                    dataSource={sensorTypes}
                    rowKey="_id"
                    columns={columns}
                    pagination={false}
                  />
                </div>
              </>
            )}
          </Formik>
        </div>
      </PageHeader>
    </div>
  );
};

export default SensorTypePage;

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import {
  Divider,
  Popover,
  Button,
  message,
  Dropdown,
  Menu,
  PageHeader,
} from "antd";
import { EditOutlined, DeleteOutlined, MenuOutlined } from "@ant-design/icons";
import { SketchPicker } from "react-color";
import useFetch from "@app/util/useFetch";
import { Form, Select, Input } from "formik-antd";
import { Formik } from "formik";
import isEmpty from "lodash/fp/isEmpty";
import ImageUploading from "react-images-uploading";
import ComponentIcon from "@images/icons/component.svg";

const DropDownMenu = ({
  setEdittingComponent,
  setTextColor,
  setBackgroundColor,
  component,
  getComponents,
}) => {
  const { fetchData: deleteComponent } = useFetch((componentId) => ({
    url: `${process.env.API_URL}/components/${componentId}`,
    method: "DELETE",
    onSuccess: () => getComponents(),
  }));

  const onMenuClick = ({ key }) => {
    switch (key) {
      case "edit":
        setEdittingComponent(component);
        setTextColor(component.text_color);
        setBackgroundColor(component.background_color);
        break;
      case "delete":
        Modal.confirm({
          title: "Are you sure you want to delete this item?",
          okText: "Yes",
          okType: "danger",
          cancelText: "No",
          onOk: () => deleteComponent(component._id),
        });
        break;
      default:
        break;
    }
  };
  const menu = (
    <Menu onClick={onMenuClick}>
      <Menu.Item icon={<EditOutlined />} key="edit">
        Edit
      </Menu.Item>
      <Menu.Item icon={<DeleteOutlined />} key="delete">
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <MenuOutlined style={{ color: "#7A7A7A", fontSize: 11 }} />
    </Dropdown>
  );
};

const ComponentsPage = ({ initialValues = {} }) => {
  const [components, setComponents] = useState([]);
  const [edittingComponent, setEdittingComponent] = useState({});
  const [image, setImage] = useState(null);
  const [textColor, setTextColor] = useState("black");
  const [backgroundColor, setBackgroundColor] = useState(
    "rgb(234, 106, 71, 0.1)"
  );

  const history = useHistory();

  const isUpdating = useMemo(() => !isEmpty(edittingComponent), [
    edittingComponent,
  ]);

  const { loading, fetchData: getComponents } = useFetch({
    url: `${process.env.API_URL}/components`,
    method: "GET",
    onSuccess: (data) => setComponents(data),
  });

  useEffect(() => {
    getComponents();
  }, []);

  const onSubmit = useCallback(
    (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("file", image?.file);
      formData.append("data_key", values.data_key);
      formData.append("name", values.name);
      formData.append("unit", values.unit || "");
      formData.append("type", values.type);
      formData.append("title", values.title || "");
      formData.append("text_color", textColor);
      formData.append("background_color", backgroundColor);

      const accessToken = localStorage.getItem("accessToken");

      if (isUpdating) {
        fetch(`${process.env.API_URL}/components/${edittingComponent._id}`, {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              message.error(response.text());
            } else {
              message.success("Component updated!");
              setEdittingComponent({});
              getComponents();
              resetForm();
              setImage(null);
              setTextColor("black");
              setBackgroundColor("rgb(234, 106, 71, 0.1)");
            }
          })
          .catch((error) => message.error(error));
      } else {
        fetch(`${process.env.API_URL}/components`, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              message.error(response.text());
            } else {
              message.success("Component added!");
              setEdittingComponent({});
              getComponents();
              resetForm();
              setImage(null);
              setTextColor("black");
              setBackgroundColor("rgb(234, 106, 71, 0.1)");
            }
          })
          .catch((error) => message.error(error.text()));
      }
    },
    [isUpdating, edittingComponent, backgroundColor, textColor, image]
  );

  const onChangeImage = (imageList) => {
    setImage(imageList[0]);
  };

  return (
    <div className="p-4" style={{ marginBottom: 150 }}>
      <div className="row position-relative">
        <div className="col-md-6">
          <h2 className="text-mandy font-weight-bold">
            <img
              src={ComponentIcon}
              width="50"
              height="50"
              className="mr-3"
              style={{ marginTop: -8 }}
            />
            Components
          </h2>
        </div>
      </div>
      <Divider style={{ border: "1px solid #d84e59", marginTop: 0 }} />
      <PageHeader
        onBack={() => history.push("/config")}
        title={isUpdating ? "Update component" : "Add component"}
      >
        <div className="row">
          <Formik
            initialValues={edittingComponent}
            enableReinitialize
            onSubmit={onSubmit}
          >
            {({ isValid, values }) => (
              <>
                <div className="col-md-6">
                  <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    <Form.Item
                      label="Name"
                      name="name"
                      validate={(value) =>
                        !value && "Please enter component name"
                      }
                      hasFeedback
                    >
                      <Input name="name" placeholder="Name" />
                    </Form.Item>
                    <Form.Item
                      label="Data Key"
                      name="data_key"
                      validate={(value) => !value && "Please enter data key"}
                      hasFeedback
                    >
                      <Input name="data_key" placeholder="Data Key" />
                    </Form.Item>
                    <Form.Item label="Unit" name="unit">
                      <Input
                        name="unit"
                        placeholder="Unit, such as %, PPM, m3 ..."
                      />
                    </Form.Item>
                    <Form.Item
                      label="Type"
                      name="type"
                      validate={(value) => !value && "Please select type"}
                      hasFeedback
                    >
                      <Select
                        name="type"
                        placeholder="Type"
                        style={{ width: "100%" }}
                        // defaultValue="image"
                        options={["Text", "Image"].map((typ) => ({
                          label: typ,
                          value: typ.toLowerCase(),
                        }))}
                      />
                    </Form.Item>
                    {values.type === "text" ? (
                      <Form.Item
                        label="Title"
                        name="title"
                        validate={(value) => !value && "Please enter title"}
                        hasFeedback
                      >
                        <Input name="title" />
                      </Form.Item>
                    ) : (
                      <div className="row mb-3">
                        <div className="col-md-3 text-right">Image:</div>
                        <div className="col-md-9 px-2">
                          <ImageUploading
                            value={image ? [image] : []}
                            onChange={onChangeImage}
                            maxNumber={1}
                            dataURLKey="url"
                          >
                            {({
                              imageList,
                              onImageUpload,
                              onImageRemoveAll,
                              onImageUpdate,
                              onImageRemove,
                              isDragging,
                              dragProps,
                            }) => (
                              // write your building UI
                              <div
                                style={{
                                  width: "100%",
                                }}
                              >
                                <button
                                  className="p-2 image-button"
                                  style={isDragging ? { color: "red" } : null}
                                  onClick={() => onImageUpdate(0)}
                                  {...dragProps}
                                >
                                  {imageList.length > 0
                                    ? imageList[0].file.name
                                    : "Click or Drop here"}
                                </button>
                              </div>
                            )}
                          </ImageUploading>
                        </div>
                      </div>
                    )}
                    <div className="row mb-3">
                      <div
                        className="col-md-3 text-right"
                        style={{ lineHeight: "40px" }}
                      >
                        Text color:
                      </div>
                      <div className="col-md-3 px-2">
                        <Popover
                          content={
                            <SketchPicker
                              color={textColor}
                              onChangeComplete={(color) =>
                                setTextColor(color.hex)
                              }
                            />
                          }
                          placement="right"
                          trigger="click"
                        >
                          <div
                            style={{
                              height: 40,
                              width: "100%",
                              backgroundColor: textColor,
                              borderRadius: 8,
                              border: "1px solid gray",
                              cursor: "pointer",
                            }}
                          />
                        </Popover>
                      </div>
                      <div
                        className="col-md-3 text-right"
                        style={{ lineHeight: "40px" }}
                      >
                        Background color:
                      </div>
                      <div className="col-md-3 px-2">
                        <Popover
                          content={
                            <SketchPicker
                              color={backgroundColor}
                              onChangeComplete={(color) =>
                                setBackgroundColor(color.hex)
                              }
                            />
                          }
                          placement="right"
                          trigger="click"
                        >
                          <div
                            style={{
                              height: 40,
                              width: "100%",
                              backgroundColor: backgroundColor,
                              borderRadius: 8,
                              border: "1px solid gray",
                              cursor: "pointer",
                            }}
                          />
                        </Popover>
                      </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={!isValid}
                        className="mt-4 align-self-center"
                      >
                        Save
                      </Button>
                      {isUpdating && (
                        <Button
                          type="primary"
                          className="mt-4 ml-3 align-self-center"
                          onClick={() => setEdittingComponent({})}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </Form>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <h5 className="font-weight-bold">Preview</h5>
                  </div>
                  <div
                    className="rounded ml-3"
                    style={{
                      backgroundColor,
                      width: 300,
                      height: 200,
                      padding: 12,
                    }}
                  >
                    {values.type === "text" ? (
                      <div
                        className="p-3 d-flex flex-column justify-content-center align-items-center"
                        style={{ height: "100%" }}
                      >
                        <div
                          className="font-weight-semibold text-center"
                          style={{ fontSize: 24, color: textColor }}
                        >
                          <strong>{values.title}</strong>
                          <p>12.34 {values.unit}</p>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="p-3 d-flex flex-column justify-content-center align-items-center"
                        style={{ height: "100%" }}
                      >
                        <div
                          className="font-weight-semibold text-center"
                          style={{ fontSize: 20, color: textColor }}
                        >
                          12.34 {values.unit}
                        </div>
                        {image && (
                          <img
                            src={image.url}
                            height="100%"
                            alt="component-preview"
                          />
                        )}
                        {!image && isUpdating && (
                          <img
                            src={`${process.env.SERVER_URL}${edittingComponent.icon_url}`}
                            height="100%"
                            alt="component-preview"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </Formik>
        </div>
        <div className="row mt-4 p-3 border d-flex flex-wrap">
          {components.map((component) => (
            <div
              className="rounded ml-3"
              style={{
                backgroundColor: component.background_color,
                width: 180,
                height: 120,
                padding: 6,
                position: "relative",
              }}
            >
              {component.type === "text" ? (
                <div
                  className="p-3 d-flex flex-column justify-content-center align-items-center"
                  style={{ height: "100%" }}
                >
                  <div
                    className="font-weight-semibold text-center"
                    style={{ fontSize: 20, color: component.text_color }}
                  >
                    <strong>{component.title}</strong>
                    <p>12.34 {component.unit}</p>
                  </div>
                </div>
              ) : (
                <div
                  className="p-3 d-flex flex-column justify-content-center align-items-center"
                  style={{ height: "100%" }}
                >
                  <div
                    className="font-weight-semibold text-center"
                    style={{ fontSize: 16, color: component.text_color }}
                  >
                    12.34 {component.unit}
                  </div>
                  <img
                    src={`${process.env.SERVER_URL}${component.icon_url}`}
                    height="100%"
                    alt={`component-${component.name}`}
                  />
                </div>
              )}
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  left: 16,
                  width: 24,
                  height: 24,
                }}
              >
                <DropDownMenu
                  setEdittingComponent={setEdittingComponent}
                  setTextColor={setTextColor}
                  setBackgroundColor={setBackgroundColor}
                  component={component}
                  getComponents={getComponents}
                />
              </div>
            </div>
          ))}
        </div>
      </PageHeader>
    </div>
  );
};

export default ComponentsPage;

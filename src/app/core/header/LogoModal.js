import React, { useState, useMemo, useCallback } from "react";
import { Modal } from "antd";
import useFetch from "@app/util/useFetch";
import ImageUploading from "react-images-uploading";
import { Button } from "antd";

const LogoModal = ({ visible, onCloseModal,event }) => {
  const [image, setImage] = useState(null);

  const onChangeImage = (imageList) => {
    setImage(imageList[0]);
  };

  const handleUploadImage = () => {
    const formData = new FormData();
    formData.append("file", image.file);
    const accessToken = localStorage.getItem("accessToken");
    if(event==="change_logo"){
      fetch(`${process.env.API_URL}/user/logo`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          onCloseModal();
        })
        .catch((error) => console.log(error));

    }
    else if(event==='change_profile_logo') {
      fetch(`${process.env.API_URL}/user/profilelogo`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          onCloseModal();
        })
        .catch((error) => console.log(error));

    }
   
  };

  return (
    <Modal
      visible={visible}
      title="Change your logo"
      style={{ maxWidth: 1500 }}
      bodyStyle={{ paddingTop: 16 }}
      centered
      onCancel={() => onCloseModal()}
      footer={null}
      maskClosable={false}
    >
      <div className="row px-3">
        <div className="col-md-12">
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
                  {imageList.length > 0 ? (
                    <img
                      src={imageList[0].url}
                      style={{ height: "100%", maxHeight: 150 }}
                      alt=""
                    />
                  ) : (
                    "Click or Drop here"
                  )}
                </button>
              </div>
            )}
          </ImageUploading>
        </div>
        <div className="col-md-12 d-flex justify-content-center mt-3">
          <Button type="primary" onClick={handleUploadImage}>
            Upload
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoModal;

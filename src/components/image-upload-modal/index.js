import React, { useState } from "react";
import ImageUploader from "react-images-upload";
import Modal from "@material-ui/core/Modal";
import { Button } from "@material-ui/core";

import "./styles.scss";

const ImageUploadModal = (props) => {
  const [imageSelected, setImageSelected] = useState(false);

  const onChangeImage = (changeImage) => (img) => {
    setImageSelected(true);
    changeImage(img);
  };

  return (
    <Modal
      className="image-upload-modal"
      open={props.open}
      onClose={props.handleClose}
    >
      <div className="content">
        <ImageUploader
          buttonText={props.buttonText}
          onChange={onChangeImage(props.uploadImage)}
          imageExtension={[".jpg", ".png"]}
          maxFileSize={9999999}
          singleImage={true}
          withIcon={true}
          withLabel={false}
          withPreview={true}
        />
        {imageSelected && (
          <Button
            variant="contained"
            className="save-button"
            onClick={props.saveImage}
          >
            Save Picture
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default ImageUploadModal;

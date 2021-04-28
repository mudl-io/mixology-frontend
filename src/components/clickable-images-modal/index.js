import React, { useState } from "react";
import Modal from "@material-ui/core/Modal";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import CircularProgress from "@material-ui/core/CircularProgress";

import "./styles.scss";

const ClickableImagesModal = (props) => {
  const [isLoading, setLoading] = useState(false);
  const [index, changeIndex] = useState(0);
  const images = props.images;

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForwards, setCanGoForwards] = useState(images);

  const didLoad = () => setLoading(false);

  const nextImage = (value) => (e) => {
    if (index === 0 && value === -1) {
      return;
    } else if (index === images.length - 1 && value === 1) {
      return;
    } else {
      setLoading(true);
      setCanGoBack(index > 0);
      setCanGoForwards(index < images.length);
      changeIndex(index + value);
    }
  };

  return (
    <Modal
      className="clickable-images-modal"
      open={props.open}
      onClose={props.handleClose}
    >
      <div className="content">
        {canGoBack && (
          <ArrowBackIosIcon
            className="back-arrow"
            fontSize="large"
            onClick={nextImage(-1)}
          />
        )}
        {isLoading && <CircularProgress />}
        <img
          className={isLoading ? "visible" : "hide"}
          src={images[index]}
          onLoad={didLoad}
        />
        {canGoForwards && (
          <ArrowForwardIosIcon
            className="forwards-arrow"
            fontSize="large"
            onClick={nextImage(1)}
          />
        )}
      </div>
    </Modal>
  );
};

export default ClickableImagesModal;

import React, { useState, useCallback } from "react";
import Modal from "@material-ui/core/Modal";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import CircularProgress from "@material-ui/core/CircularProgress";

import "./styles.scss";

const ClickableImagesModal = (props) => {
  const [isLoading, setLoading] = useState(false);
  const [imgClass, setImgClass] = useState("visible");
  const [index, changeIndex] = useState(0);
  const images = props.images;

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForwards, setCanGoForwards] = useState(images);

  const didLoad = useCallback(() => {
    setLoading(false);
    setImgClass("visible");
  }, [isLoading]);

  const handleClose = () => {
    changeIndex(0);
    setCanGoBack(false);
    setCanGoForwards(images);
    props.handleClose();
  };

  const nextImage = (value) => (e) => {
    if (index === 0 && value === -1) {
      return;
    } else if (index === images.length - 1 && value === 1) {
      return;
    } else {
      setLoading(true);
      setImgClass("hide");
      setCanGoBack(index + value > 0);
      setCanGoForwards(index + value < images.length - 1);
      changeIndex(index + value);
    }
  };

  return (
    <Modal
      className="clickable-images-modal"
      open={props.open}
      onClose={handleClose}
    >
      <div className="content">
        {canGoBack && (
          <NavigateBeforeIcon
            className="arrow"
            fontSize="large"
            onClick={nextImage(-1)}
          />
        )}
        {isLoading && <CircularProgress />}
        <img className={imgClass} src={images[index]} onLoad={didLoad} alt="" />
        {canGoForwards && (
          <NavigateNextIcon
            className="arrow"
            fontSize="large"
            onClick={nextImage(1)}
          />
        )}
        {props.canUpdate && (
          <div
            className="set-active-text"
            onClick={props.handleUpdate(images[index])}
          >
            {props.updateText}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ClickableImagesModal;

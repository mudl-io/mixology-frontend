import React from "react";
import Modal from "@material-ui/core/Modal";
import { Button } from "@material-ui/core";

import "./styles.scss";

const ConfirmationModal = (props) => {
  return (
    <Modal
      className="confirmation-modal"
      open={props.open}
      onClose={props.handleClose}
    >
      <div className="contents">
        <div className="question-text">{props.question}</div>
        <div>
          <Button
            className="cancel button"
            variant="contained"
            onClick={props.handleClose}
          >
            {props.cancelText}
          </Button>
          <Button
            className={`confirm button ${props.confirmClass}`}
            variant="contained"
            onClick={props.handleConfirm}
          >
            {props.confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(ConfirmationModal);

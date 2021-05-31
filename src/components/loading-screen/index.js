import Modal from "@material-ui/core/Modal";
import CircularProgress from "@material-ui/core/CircularProgress";

import "./styles.scss";

const LoadingScreen = (props) => {
  return (
    <Modal className="loading-screen-modal" open={props.isOpen}>
      <CircularProgress />
    </Modal>
  );
};

export default LoadingScreen;

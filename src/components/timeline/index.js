import React from "react";
import { Button } from "@material-ui/core";
import { motion, AnimatePresence } from "framer-motion";

import "./styles.scss";
import PostCreateForm from "../post-create-form";

class Timeline extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showPostCreateForm: false };
  }

  toggleShowPostCreate = () => {
    this.setState({ showPostCreateForm: !this.state.showPostCreateForm });
  };

  render() {
    return (
      <div className="timeline-container">
        <div className="timeline">
          <Button
            className="create-post-button"
            variant="contained"
            onClick={this.toggleShowPostCreate}
          >
            Create Post
          </Button>

          <AnimatePresence>
            {this.state.showPostCreateForm && (
              <motion.div
                animate={{ x: 25, y: 75 }}
                transition={{
                  x: { type: "spring", stiffness: 50 },
                  default: { duration: 0.4 },
                }}
                exit={{ opacity: 0 }}
              >
                <PostCreateForm onClose={this.toggleShowPostCreate} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
}

export default Timeline;

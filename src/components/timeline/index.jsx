import React from "react";
import { Button } from "@material-ui/core";

import "./styles.scss";
import PostCreateForm from "../post-create-form";

class Timeline extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showPostCreateForm: false };
  }

  toggleShowPostCreate = () => {
    this.setState({ showPostCreateForm: true });
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

          {this.state.showPostCreateForm && <PostCreateForm />}
        </div>
      </div>
    );
  }
}

export default Timeline;

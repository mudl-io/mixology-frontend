import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import _ from "lodash";

import "./styles.scss";
import axiosInstance from "../../axiosApi";

// redux actions
import { didGetLiquors } from "../../features/liquors/liquorsSlice";

class LeftLiquorsSidenav extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    if (this.props.liquors.length === 0) {
      try {
        const res = await axiosInstance.get("/liquors/");
        this.props.dispatch(didGetLiquors(res.data));
      } catch (e) {
        console.log(e);
      }
    }
  }

  render() {
    const liquors = _.filter(this.props.liquors, (liquor) => !liquor.createdBy);

    return (
      <Drawer anchor="left" variant="persistent" open={this.props.open}>
        <div className="liquor-links">
          {liquors.map((liquor) => {
            return (
              <div key={liquor.publicId}>
                <Link className="liquor-type" to={`/${liquor.publicId}`}>
                  {liquor.name}
                </Link>
              </div>
            );
          })}
        </div>
      </Drawer>
    );
  }
}

const mapStateToProps = (state) => {
  const { liquors } = state;
  return { liquors: liquors };
};

export default connect(mapStateToProps)(LeftLiquorsSidenav);

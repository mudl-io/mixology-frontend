import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import { sortBy } from "lodash";

import "./styles.scss";
import { axiosInstance } from "../../axiosApi";

// redux actions
import { didGetDefaultLiquors } from "../../features/liquors/defaultLiquorsSlice";

class LeftLiquorsSidenav extends React.Component {
  async componentDidMount() {
    if (this.props.liquors.length === 0) {
      try {
        const res = await axiosInstance.get("/liquors/", {
          params: { default: true },
        });

        this.props.dispatch(didGetDefaultLiquors(res.data));
      } catch (e) {
        console.log(e);
      }
    }
  }

  render() {
    const liquors = sortBy(this.props.liquors, ["name"]);

    return (
      <Drawer anchor="left" variant="persistent" open={this.props.open}>
        <div className="liquor-links">
          <h3 className="title">Find cocktails by liquor</h3>
          <div>
            {liquors.map((liquor) => {
              return (
                <div key={liquor.publicId}>
                  <Link
                    className="liquor-type"
                    to={`/cocktails/${liquor.publicId}`}
                  >
                    {liquor.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </Drawer>
    );
  }
}

const mapStateToProps = (state) => {
  const { defaultLiquors } = state;
  return { liquors: defaultLiquors };
};

export default connect(mapStateToProps)(LeftLiquorsSidenav);

import React from "react";
import Drawer from "@material-ui/core/Drawer";

import "./styles.scss";
import CocktailDetail from "../cocktail-detail";
import axiosInstance from "../../axiosApi";
import formatIngredientsFilter from "../../helpers/format-ingredients-filters";

class RightCocktailSidenav extends React.Component {
  /**
   *
   * @param {*} props
   * * expects either a list of ingredients or cocktails (or both)
   * * to use to query for a larger list of cocktails containing those ingredients
   * * @property {Array.<Object>} ingredients
   * * @property {Array.<Object>} liquors
   */
  constructor(props) {
    super(props);

    this.state = { additionalCocktails: [] };
  }

  async componentDidMount() {
    try {
      const additionalCocktails = await axiosInstance.get(
        "cocktails/filtered_cocktails/",
        {
          params: {
            liquors_filter: formatIngredientsFilter(this.props.liquors),
            ingredients_filter: formatIngredientsFilter(this.props.ingredients),
          },
        }
      );

      this.setState({ additionalCocktails: additionalCocktails.data });
    } catch (e) {
      console.log(e);
    }
  }

  list = (cocktails) => {
    return (
      <div className="cocktails-list">
        {cocktails.map((cocktail) => {
          return <CocktailDetail cocktail={cocktail} key={cocktail.publicId} />;
        })}
      </div>
    );
  };

  render() {
    return (
      <Drawer
        anchor="right"
        open={true}
        onClose={this.props.toggleShowMoreCocktails}
      >
        {this.list(this.state.additionalCocktails)}
      </Drawer>
    );
  }
}

export default RightCocktailSidenav;

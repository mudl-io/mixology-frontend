import React from "react";
import { connect } from "react-redux";
import _ from "lodash";

import "./styles.scss";
import axiosInstance from "../../axiosApi";
import {
  didGetSavedCocktails,
  didUpdateSavedCocktails,
} from "../../features/saved-cocktails/savedCocktailsSlice";

import CocktailsList from "../cocktails-list";
import InfiniteScroller from "../infinite-scroller";

class SavedCocktailsDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isLoading: false };
  }

  componentDidMount() {
    this.fetchSavedCocktails();
  }

  fetchSavedCocktails = async () => {
    const nextPage = this.props.nextPage;

    this.setState({ isLoading: true });

    const res = await axiosInstance.get("/cocktails/saved_cocktails", {
      params: { page: nextPage },
    });

    const savedCocktails = res.data.results;
    const canLoadMore = !!res.data.next;

    const action =
      nextPage === 1 ? didGetSavedCocktails : didUpdateSavedCocktails;

    this.props.dispatch(
      action({ cocktails: savedCocktails, canLoadMore: canLoadMore })
    );

    this.setState({ isLoading: false });
  };

  render() {
    return (
      <div className="saved-cocktail-display">
        <InfiniteScroller
          canLoadMore={this.props.canLoadMore}
          isLoading={this.state.isLoading}
          fetchData={this.fetchSavedCocktails}
        >
          <CocktailsList
            title={"Saved Cocktails"}
            cocktails={this.props.savedCocktails || []}
          />
        </InfiniteScroller>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const data = state.savedCocktails;
  const { savedCocktails, nextPage } = data;
  let { canLoadMore } = data;

  canLoadMore = nextPage === 1 ? true : canLoadMore;

  return {
    savedCocktails: savedCocktails,
    canLoadMore: canLoadMore,
    nextPage: nextPage ? nextPage : 1,
  };
};

export default connect(mapStateToProps)(SavedCocktailsDisplay);

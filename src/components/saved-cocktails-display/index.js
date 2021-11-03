import React from "react";
import { connect } from "react-redux";

import "./styles.scss";
import { axiosInstance } from "../../axiosApi";
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

    try {
      this.setState({ isLoading: true });

      const res = await axiosInstance.get("/cocktails/", {
        params: {
          action: "saved_cocktails",
          username: this.props.match.params.username,
          page: nextPage,
        },
      });

      const savedCocktails = res.data.results;
      const canLoadMore = !!res.data.next;

      const action =
        nextPage === 1 ? didGetSavedCocktails : didUpdateSavedCocktails;

      this.props.dispatch(
        action({ cocktails: savedCocktails, canLoadMore: canLoadMore })
      );
    } catch (e) {
    } finally {
      this.setState({ isLoading: false });
    }
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
            cocktails={this.props.savedCocktails}
            displayGrid={true}
          />
        </InfiniteScroller>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const data = state.savedCocktails;
  const { savedCocktails, nextPage, canLoadMore } = data;

  return {
    savedCocktails: savedCocktails,
    canLoadMore: canLoadMore,
    nextPage: nextPage,
  };
};

export default connect(mapStateToProps)(SavedCocktailsDisplay);

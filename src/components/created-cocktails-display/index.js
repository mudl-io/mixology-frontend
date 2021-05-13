import React from "react";
import { connect } from "react-redux";
import _ from "lodash";

import "./styles.scss";
import axiosInstance from "../../axiosApi";
import {
  didGetCreatedCocktails,
  didUpdateCreatedCocktails,
} from "../../features/created-cocktails/createdCocktailsSlice";

import CocktailsList from "../cocktails-list";
import InfiniteScroller from "../infinite-scroller";

class CreatedCocktailsDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isLoading: false };
  }

  async componentDidMount() {
    this.fetchCreatedCocktails();
  }

  fetchCreatedCocktails = async () => {
    const nextPage = this.props.nextPage;

    try {
      this.setState({ isLoading: true });

      const res = await axiosInstance.get("/cocktails/created_cocktails", {
        params: { page: nextPage },
      });

      console.log(res);

      const createdCocktails = res.data.results;
      const canLoadMore = !!res.data.next;

      const action =
        nextPage === 1 ? didGetCreatedCocktails : didUpdateCreatedCocktails;

      this.props.dispatch(
        action({ cocktails: createdCocktails, canLoadMore: canLoadMore })
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
          fetchData={this.fetchCreatedCocktails}
        >
          <CocktailsList
            title={"Created Cocktails"}
            cocktails={this.props.createdCocktails}
          />
        </InfiniteScroller>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const data = state.createdCocktails;
  const { createdCocktails, nextPage, canLoadMore } = data;

  return {
    createdCocktails: createdCocktails,
    canLoadMore: canLoadMore,
    nextPage: nextPage,
  };
};

export default connect(mapStateToProps)(CreatedCocktailsDisplay);

import React from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import "./styles.scss";
import CocktailDetail from "../cocktail-detail";

const CocktailsList = (props) => {
  const list = (cocktails) => {
    return (
      <div className="cocktails-list">
        {cocktails.map((cocktail) => {
          return <CocktailDetail cocktail={cocktail} key={cocktail.publicId} />;
        })}
      </div>
    );
  };

  const showToggle = (hasToggle) => {
    if (hasToggle) {
      return (
        <Tabs
          indicatorColor="primary"
          value={props.isToggled ? 1 : 0}
          onChange={props.handleToggle}
        >
          <Tab label="Platform Cocktails" />
          <Tab label="User Created Cocktails" />
        </Tabs>
      );
    }
  };

  return (
    <div className="cocktails-list-container">
      <h1>{props.title}</h1>
      {showToggle(props.hasToggle)}
      {list(props.cocktails)}
    </div>
  );
};

export default React.memo(CocktailsList);

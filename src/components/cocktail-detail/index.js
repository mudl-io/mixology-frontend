import React from "react";
import { Link } from "react-router-dom";

import "./styles.scss";
import defaultImg from "../../assets/defaultimg.png";

/**
 *
 * @param {*} props
 * * @property {Object} cocktail
 * @returns a small <div> containing the essential elements of a cocktail in a small, reusable format
 */

const allIngredientsToString = (ingredients) => {
  const ingredientNames = ingredients.map((ingredient) => ingredient.name);
  return <p className="ingredients">{ingredientNames.join(", ")}</p>;
};

const getImage = (props) => {
  if (props.image) {
    return props.image.image;
  }

  return defaultImg;
};

const CocktailDetail = (props) => {
  return (
    <Link
      className="cocktail-detail"
      to={`/cocktail/${props.cocktail.publicId}/`}
      target="_blank"
    >
      <img src={getImage(props)} />
      <div className="name">{props.cocktail.name}</div>
      <div className="ingredients-list">
        {allIngredientsToString([
          ...props.cocktail.liquors,
          ...props.cocktail.ingredients,
        ])}
      </div>
    </Link>
  );
};

export default React.memo(CocktailDetail);

import { useState } from "react";
import { get } from "lodash";
import { Link } from "react-router-dom";

import "./styles.scss";
import ProfileIcon from "../profile-icon";
import CocktailDisplay from "../cocktail-display";

const PostDisplay = ({
  cocktail = {},
  createdAt = "",
  description = "",
  postedBy = {},
  title = "",
  postId = "",
}) => {
  const [showCocktail, setShowCocktail] = useState(false);
  const profilePicture = get(postedBy, "activeProfilePicture.image");

  const formatCocktailDisplay = (cocktail) => {
    return (
      <CocktailDisplay
        cocktailId={cocktail.id}
        name={cocktail.name}
        description={cocktail.description}
        complexity={cocktail.complexity}
        image={cocktail.image}
        ingredients={cocktail.ingredients}
        liquors={cocktail.liquors}
        instructions={cocktail.instructions}
        createdBy={cocktail.createdBy}
        isSaved={cocktail.isSaved}
        timesSaved={cocktail.timesSaved}
      />
    );
  };

  const formatDate = (date) => {
    const ms = Date.parse(date);
    const readableString = new Date(ms).toDateString();

    return readableString;
  };

  return (
    <div className="post-display">
      {title && <div className="title">{title}</div>}

      <div className="profile-container">
        <Link
          to={`/user/${postedBy.username}/created-cocktails/`}
          className="posted-by"
        >
          <ProfileIcon image={profilePicture} />
          {postedBy.username}
        </Link>
      </div>

      <div className="created-at-container">
        <div className="created-at">{formatDate(createdAt)}</div>
      </div>

      {description && <div className="description">{description}</div>}

      {cocktail && (
        <div className="cocktail-container">
          {!showCocktail && (
            <div
              className="cocktail-clickable-name"
              onClick={() => setShowCocktail(true)}
            >
              {cocktail.name}
            </div>
          )}
          {showCocktail && formatCocktailDisplay(cocktail)}
        </div>
      )}
    </div>
  );
};

export default PostDisplay;

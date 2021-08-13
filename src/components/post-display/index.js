import { useState } from "react";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
          {showCocktail && (
            <div>
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ ease: [0.17, 0.67, 0.83, 0.67] }}
                  exit={{ opacity: 0 }}
                >
                  <div
                    className="hide-text"
                    onClick={() => setShowCocktail(false)}
                  >
                    Hide
                  </div>

                  {formatCocktailDisplay(cocktail)}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostDisplay;

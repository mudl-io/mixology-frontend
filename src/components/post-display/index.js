import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { get } from "lodash";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationManager } from "react-notifications";

import "./styles.scss";
import { axiosInstance } from "../../axiosApi";
import ProfileIcon from "../profile-icon";
import CocktailDisplay from "../cocktail-display";
import { didSaveCocktail } from "../../features/saved-cocktails/savedCocktailsSlice";
import { didUnsaveCocktail } from "../../features/saved-cocktails/savedCocktailsSlice";

const PostDisplay = ({
  cocktail = {},
  createdAt = "",
  description = "",
  postedBy = {},
  title = "",
  postId = "",
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  const [showCocktail, setShowCocktail] = useState(false);
  const [cocktailIsSaved, setCocktailIsSaved] = useState(
    get(cocktail, "isSaved")
  );
  const [cocktailTimesSaved, setCocktailTimesSaved] = useState(
    get(cocktail, "timesSaved")
  );
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
        isSaved={cocktailIsSaved}
        timesSaved={cocktailTimesSaved}
        toggleSaveCocktail={() => toggleSaveCocktail(cocktail)}
      />
    );
  };

  const formatDate = (date) => {
    const ms = Date.parse(date);
    const readableString = new Date(ms).toDateString();

    return readableString;
  };

  const toggleSaveCocktail = async (cocktail) => {
    if (!user) {
      NotificationManager.warning(
        "Please login or create an account in order to save cocktails!",
        "Cannot Save",
        3000
      );

      return;
    }

    try {
      await axiosInstance.post(
        `/cocktails/${cocktail.publicId}/save_cocktail/`
      );
      const amtChange = !cocktailIsSaved ? 1 : -1;
      const action = !cocktailIsSaved ? didSaveCocktail : didUnsaveCocktail;

      setCocktailIsSaved(!cocktailIsSaved);
      setCocktailTimesSaved(cocktailTimesSaved + amtChange);

      dispatch(action(cocktail));
    } catch (e) {
      console.log(e);
    }
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

import { get } from "lodash";
import { Link } from "react-router-dom";

import "./styles.scss";
import ProfileIcon from "../profile-icon";

const PostDisplay = ({
  cocktail = {},
  createdAt = "",
  description = "",
  postedBy = {},
  title = "",
  postId = "",
}) => {
  const profilePicture = get(postedBy, "activeProfilePicture.image");

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

      <div className="cocktail-container">
        {cocktail && <div className="cocktail">{get(cocktail, "name")}</div>}
      </div>
    </div>
  );
};

export default PostDisplay;

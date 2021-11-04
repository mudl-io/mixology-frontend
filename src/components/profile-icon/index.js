import React from "react";
import "./styles.scss";

const ProfileIcon = ({ image = "", classname = "" }) => {
  return (
    <img
      className={`profile-icon ${classname}`}
      src={image || `${process.env.PUBLIC_URL}/defaultimg.png`}
      alt="profile-icon"
    />
  );
};

export default ProfileIcon;

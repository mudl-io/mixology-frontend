import React from "react";
import defaultImg from "../../assets/defaultimg.png";
import "./styles.scss";

const ProfileIcon = ({ image = "", classname = "" }) => {
  return (
    <img
      className={`profile-icon ${classname}`}
      src={image || defaultImg}
      alt="profile-icon"
    />
  );
};

export default ProfileIcon;

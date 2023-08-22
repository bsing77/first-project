// frontend/src/components/Navigation/index.js
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
// import OpenModalButton from "../OpenModalButton";
// import LoginFormModal from "../LoginFormModal";
// import SignupFormModal from "../SignUpFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);



  return (
    <ul className= 'navBar'>
      <li>
        <NavLink exact to="/">
          <img class='logo' src = '../../assets/BB&Blogo.png'/>
        </NavLink>
      </li>
      {isLoaded && (
        <li className = 'profile-button'>
          <ProfileButton user = {sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;


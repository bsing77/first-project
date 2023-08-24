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
        <NavLink exact to="/" style={{color: 'red', fontSize: '24px'}}>
        <i className="fa-brands fa-airbnb fa-rotate-270" ></i>{' '}BBnB
        </NavLink>
      </li>
      {isLoaded && (
        <li className = 'profile-button-container'>
          <ProfileButton user = {sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;


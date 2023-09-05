
import React, { useState, useEffect, useRef , } from "react";
import { useDispatch, } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignUpFormModal';
import { useHistory } from "react-router-dom";
import { login } from "../../store/session";




function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [isUser, setIsUser] =useState(false)
  const ulRef = useRef();
  const history = useHistory();
  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  
  useEffect(() => {
    if (!showMenu) return;
    
    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    
    
    
    document.addEventListener('click', closeMenu);
    
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);
  
  const closeMenu = () => setShowMenu(false);
  
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push('/')
    setIsUser(false)
  };
  
  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  // console.log(login)
  
  const handleClick=() => {
    history.push('/spots/new')
  }
  useEffect(() => {
    if(user){
      setIsUser(true)
      } else {setIsUser(false)}
  },[handleClick,logout])

  const manageClick =() => {
    history.push('/manage-spots')
  }
  return (
    <div className ={`profile-button ${showMenu? 'active' : ''}`}>
      <div className={`new-spot-link ${isUser ? '': 'hidden'}`} onClick={handleClick}>
        Create a New Spot
      </div>
      <button onClick={openMenu} className='profile-button-trigger'>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
          <div className='user-info-div'>
            <div className='user-name-email-div'>
            <li className='user-firstName'>Hello, {user.firstName}</li>
            <li className='user-email'>{user.email}</li>
            </div>
            <div className='manage-user-div'>
              <li className='manage-spots-link'onClick={manageClick}>Mangage Spots</li>
            </div>
            <li>
              <button onClick={logout} className='user-logout'>Log Out</button>
            </li>
          </div>
            
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
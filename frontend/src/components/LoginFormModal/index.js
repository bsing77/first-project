import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoUser = () => {
    setCredential('Demo-lition'); 
    setPassword('password'); 
    return dispatch(sessionActions.login({credential,password}))
  }



  

 const isCredentialsValid = credential.length >=4; 
 const isPasswordValid = password.length >= 6; 
 const isSubmitEnabled =isCredentialsValid && isPasswordValid

  return (
    <>
      <h1 className='login'>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
        
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder="Username or Email"
          />
        </label>
        <label>
         
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button  className="button"type="submit" disabled={!isSubmitEnabled}  >Log In</button>
        <li className="demo-user" onClick={demoUser} > Demo User</li>
      </form>
    </>
  );
}

export default LoginFormModal;



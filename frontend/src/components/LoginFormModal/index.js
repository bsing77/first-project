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
  const [isLoaded,setIsLoaded] = useState(false)
  const[enabled, setEnabled] = useState(false)
  const [isDemoUser, setIsDemoUser] = useState(false)
  
  const { closeModal } = useModal();

  useEffect(() => {
    const logInErrors = {}
    if(!credential){
      logInErrors.credential="Email or username is required"
    };
    if(!password){
      logInErrors.password="Password is"
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (!data.ok) {
          setErrors({credential:'The provided credentials were invalid'});
          // console.log(errors, 'ERRORS')
        }
        
      });
  };


  const demoUser = async() => {
    setCredential('Demo-lition');
    setPassword('password')
    

  }


  
  

 const isCredentialsValid = credential.length >=4 
 const isPasswordValid = password.length >= 6; 
 const isSubmitEnabled =isCredentialsValid && isPasswordValid
 
 useEffect (() => {
  if(isSubmitEnabled === true){
    setEnabled(true)
  } else {
    setEnabled(false)
  }
 },[enabled, isSubmitEnabled])
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
          {/* {errors.username && (<p>{errors.username}</p>)}
          {errors.email && (<p>{errors.email}</p>)} */}
         
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </label>
        {errors.credential && (
          <p className='errors'>{errors.credential}</p>
        )}
        <button  type="submit" disabled={!isSubmitEnabled}  className={`button ${enabled? '': 'grey'}`} >Log In</button>
        <li className="demo-user" onClick={demoUser} > Demo User</li>
      </form>
    </>
  );
}

export default LoginFormModal;



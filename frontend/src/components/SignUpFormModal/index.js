
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disabled, setDisabled] = useState(false)
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    const signUpErrors={}
    if(email && !email.includes("@")){
      signUpErrors.email="Invalid email"
    }
    
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };
//  console.log(errors)
  useEffect(() => {
    if(!email.length || username.length < 4  || firstName.length < 1 || lastName.length < 1 || password.length < 6) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  },[email,username,firstName,lastName,password] )

  return (
    <div className="signUp-div" >
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          
          <input
            type="text"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
         
        </label>
        {errors.email && <p className="errors">{errors.email}</p>}
        <label>
         
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className='errors'>{errors.username}</p>}
        <label>
         
          <input
            type="text"
            value={firstName}
            placeholder="Fist Name"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p className='errors'>{errors.firstName}</p>}
        <label>
         
          <input
            className ="input"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p className='errors'>{errors.lastName}</p>}
        <label>
         
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="errors">{errors.password}</p>}
        <label>
          
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && (
          <p className='errors'>{errors.confirmPassword}</p>
        )}
        <button type="submit" disabled={disabled}className ={`button ${disabled? "grey": " " }`}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
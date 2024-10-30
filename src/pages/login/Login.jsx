import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'

const Login = () => {
  const [currState,setCurrState] = useState("Sign Up");
  return (
    <div className='login'>
      <img src={assets.logo} alt="" />
      <form className="login-form">
        <h2>{currState}</h2>
        {currState === "Sign Up" ?<input type="text" placeholder='username' className="form-input" />: null}
        <input type="email" placeholder='Email address' className="form-input" />
        <input type="password" placeholder='password' className="form-input" />
        <button type='submit'>{currState === "Sign Up"? "Create account":"Login now"}</button>
        <div className="login-term">
          <input type="checkbox" name="" id="" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="login-forgot">
        { currState === "Sign Up" ?<div className="login-toggle">Already have an account <span onClick={()=>setCurrState("Login")}>click here</span></div>:
          <div className="login-toggle">Create an account <span onClick={()=>setCurrState("Sign Up")}>click here</span></div>}
        </div>
      </form>

    </div>
  )
}

export default Login
import "../styles/Login.css";

import React , {useState} from "react";
import { useNavigate } from "react-router-dom";
import { getAuth,signInWithEmailAndPassword
 } from "@firebase/auth";

// import { auth } from "../utils/firebaseConfig";




const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      alert("Sorry, Invalid Username or Password!");
    }
  }

  const toRegister = () => {
    navigate("/register");
  };

  function handleEmailChange(e) {
    setEmail(e.target.value);
  };

  function handlePasswordChange(e) { 
    setPassword(e.target.value);
  };

  return (
    <>
      <div clasName="loginHeader">
        <img className="loginLogo" src="../Logo.png" alt="" srcset="" />
      </div>
      <div className="login">
        <div className="loginVector">
            <img src="../loginVector.png" alt="" srcset="" />
            <p>Organize exams with ease !</p>
          </div>
          <div className="loginDivider"></div>
          <div className="txtb">
            <h3>Login</h3>
            <input type="text" onChange={handleEmailChange} placeholder="Username" />
            <input type="password" onChange={handlePasswordChange} placeholder="Password" />
            <button className="logbtn" onClick={handleLogin}>Login</button>
          </div>
         
      </div>
    </>
  );
};

export default Login;

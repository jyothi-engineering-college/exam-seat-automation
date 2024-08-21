import { Link } from "react-router-dom";
import "../styles/Login.css";
import SignUp from "./SignUp";

const Login = () => {
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
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button className="logbtn">Login</button>
            <p>Create a new account?<Link to='/signup'>Sign Up</Link></p>
          </div>
         
      </div>
    </>
  );
};

export default Login;

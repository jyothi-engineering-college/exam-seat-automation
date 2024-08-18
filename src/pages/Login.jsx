import "../styles/Login.css";

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
          </div>
         
      </div>
    </>
  );
};

export default Login;

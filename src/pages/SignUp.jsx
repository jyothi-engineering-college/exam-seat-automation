import "../styles/Login.css";

const SignUp = () => {
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
            <h3>Sign Up</h3>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button className="logbtn">Sign Up</button>
            <p>Already have an  account?<Link to = "/login">Log In</Link></p>
          </div>
         
      </div>
    </>
  );
};

export default SignUp;

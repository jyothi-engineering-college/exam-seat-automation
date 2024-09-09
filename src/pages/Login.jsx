import LoginForm from "../components/LoginForm";
import LoginVector from "../components/LoginVector";
import "../styles/Login.css";

const Login = () => {
  return (
    <>
      <LoginVector/>
      <div className="login">
        
        <div className="loginVector">
          <img srcSet="../loginVector.png" alt="" />
          <p>Organize exams with ease!</p>
        </div>
        <div className="loginDivider"></div>
        <LoginForm />
      </div>
    </>
  );
};

export default Login;

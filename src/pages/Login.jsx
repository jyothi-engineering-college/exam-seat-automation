import LoginForm from "../components/LoginForm";
import "../styles/Login.css";



const Login = () => {
  return (
    <>
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

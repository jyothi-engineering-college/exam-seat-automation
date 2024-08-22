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
        {/* <FlexContainer>
          <div className="loginVector">
            <img src="../loginVector.png" alt="" srcset="" />
            <p>Organize exams with ease !</p>
          </div>
          <div className="loginDivider"></div>
          <Form
            name="login"
            initialValues={{ remember: true }}
            style={{ maxWidth: 360 }}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                prefix={<img src="../loginPerson.png" alt="" srcset="" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<img src="../loginPassword.png" alt="" srcset="" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Flex justify="space-between" align="center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a href="">Forgot password</a>
              </Flex>
            </Form.Item>

            <Form.Item>
              <Button block type="primary" htmlType="submit">
                Log in
              </Button>
              or <a href="">Register now!</a>
            </Form.Item>
          </Form>
        </FlexContainer> */}
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

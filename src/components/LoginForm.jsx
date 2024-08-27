import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { useAppContext } from "../context/AppContext";
import { useEffect } from "react";


const initialState = {
  username: "",
  email: "",
  password: "",
  isMember: true,
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [values, setValues] = useState(initialState);

  const toggleMember = () => {
    setValues({
      ...values,
      isMember: !values.isMember,
    });
  };
  const {
    user,
    isLoading,
    showAlert,
    displayAlert,
    registerUser,
    loginUser,
    setupUser,
  } = useAppContext();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // const handleLogin = async () => {
  //   try {
  //     await signInWithEmailAndPassword(auth, email, password);
  //     navigate("/");
  //   } catch (error) {
  //     alert("Sorry, Invalid Username or Password!");
  //   }
  // };

  const onFinish = () => {
    const { username, email, password, isMember } = values;

    const currentUser = { username, email, password };
    if (isMember) {
      setupUser({
        currentUser,
        endPoint: "login",
        alertText: "Login Successfull ! 😊",
      });
    } else {
      setupUser({
        currentUser,
        endPoint: "register",
        alertText: "Registration Successfull ! 😊",
      });
    }
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  }, [user, navigate]);

  return (
    <>
      <div className="txtb">
        {values.isMember ? <h3>Login</h3> : <h3>Register</h3>}
        <Form
          form={form}
          name="horizontal_login"
          layout="horizontal"
          onFinish={onFinish}
        >
          <Form.Item
            className="coloroverwrite"
          >
            <Input
              className="coloroverwrite"
              prefix={<MailOutlined />}
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Email"
              required  
            />
          </Form.Item>

          {!values.isMember && (
            <Form.Item
              className="coloroverwrite"
             
            >
              <Input
                className="coloroverwrite"
                prefix={<UserOutlined />}
                type="text"
                name="username"
                value={values.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />
            </Form.Item>
          )}

          <Form.Item
            className="coloroverwrite"
            value={values.password}
          >
            <Input
              className="coloroverwrite"
              prefix={<LockOutlined />}
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </Form.Item>

          <Form.Item>
            <Button
              className="loginbutton"
              disabled={isLoading}
              type="primary"
              htmlType="submit"
            >
              {isLoading
                ? "Please Wait 🌞"
                : values.isMember
                ? "Login"
                :"Register"}
            </Button>
          </Form.Item>

          {showAlert && <p>Wrong password</p>}

          <div>
            {values.isMember ?  "Not a member yet ? ":"Already a member ? "}
            <p type="button" onClick={toggleMember} className="member-btn">
              {values.isMember ?"Register Now!": "Login Here" }
            </p>
          </div>
        </Form>
      </div>
    </>
  );
};

export default LoginForm;

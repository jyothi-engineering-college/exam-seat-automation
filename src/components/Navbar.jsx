import { Space } from "antd";
import { useAppContext } from "../context/AppContext";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import "../styles/Navbar.css"
const Navbar = () => {
  const { user, logoutUser } = useAppContext(); 
  const items = [
    {
      key: "0",
      danger: true,
      label: "Logout",
      icon: <UserOutlined />,
      onClick: () => {
        logoutUser()
      },
    },
  ];
  return (
    <div className="navbar">
      <img className="brandLogo" srcSet="../Logo.png" alt="" />
      <h2 className="appName">Exam Seat Automation</h2>
      <Dropdown
        menu={{
          items,
        }}
      >
        <a
          onClick={(e) => e.preventDefault()}
        >
          <Space>
            <p className="welcomeName">Welcome, {user.username}</p>
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </div>
  );
}

export default Navbar
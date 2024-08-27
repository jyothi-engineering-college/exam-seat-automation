import "../styles/Navbar.css"
const Navbar = () => {
  return (
    <div className="navbar">
      <img className="brandLogo" srcSet="../Logo.png" alt=""  />
        <h2 className="appName">Exam Seat Automation</h2>
      <p className="welcomeName">Welcome, Name</p>
    </div>
  );
}

export default Navbar
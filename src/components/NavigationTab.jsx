import { Segmented } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Navtab.css";

const NavigationTab = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getDefaultValue = () => {
    switch (location.pathname) {
      case "/":
        return "Home";
      case "/slots":
        return "Slots";
      case "/batches":
        return "Batches";
      case "/subjects":
        return "Subjects";
      case "/exam-halls":
        return "Exam Halls";
      default:
        return ""; 
    }
  };

  return (
    <center>
      <Segmented
        className="navigationTab"
        defaultValue={getDefaultValue()}
        options={["Home", "Slots", "Batches", "Subjects", "Exam Halls"]}
        onChange={(value) => {
          switch (value) {
            case "Home":
              navigate("/");
              break;
            case "Slots":
              console.log("Slots");
              navigate("/slots");
              break;
            case "Batches":
              navigate("/batches");
              break;
            case "Subjects":
              navigate("/subjects");
              break;
            case "Exam Halls":
              navigate("/exam-halls");
              break;
          }
        }}
      />
    </center>
  );
};

export default NavigationTab;

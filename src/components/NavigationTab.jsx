import { Segmented } from "antd";
import { useNavigate } from "react-router-dom";
import "../styles/Navtab.css";

const NavigationTab = () => {
  const navigate = useNavigate();

  return (
    <center>
      <Segmented
        className="navigationTab"
        options={["Home", "Slots","Departments","Supply","Dropout/Rejoin","Classes"]}
        onChange={(value) => {
          switch(value){
            case "Home":
              navigate("/");
              break;
            case "Slots":
              navigate("/slots");
              break;
            case "Departments":
              navigate("/departments");
              break;
            case "Supply":
              navigate("/supply");
              break;
            case "Dropout/Rejoin":
              navigate("/drop-rejoin");
              break;
            case "Classes":
              navigate("/classes");
              break;
          }
        }}
      />
    </center>
  );
};
export default NavigationTab;

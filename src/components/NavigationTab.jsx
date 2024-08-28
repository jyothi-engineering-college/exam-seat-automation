import { Segmented } from "antd";
import "../styles/Navtab.css";
import { useNavigate } from "react-router-dom";

const NavigationTab = () => {
  const navigate = useNavigate();

  return (
    <center>
      <Segmented
        className="navigationTab"
        options={["Home", "Slots","Departments","Supply","Dropout/Rejoin","Classes","Notice Board", "Dept View", "Class View",]}
        onChange={(value) => {

          navigate("/dept-exams");
        }}
      />
    </center>
  );
};
export default NavigationTab;

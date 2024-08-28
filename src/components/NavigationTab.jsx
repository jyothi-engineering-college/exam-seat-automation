import { Segmented } from "antd";
import "../styles/Navtab.css";
import { useNavigate } from "react-router-dom";

const NavigationTab = () => {
  const navigate = useNavigate();

  return (
    <center>
      <Segmented
        className="navigationTab"
        options={["Home", "Exam Dept", "Slots", "Classes"]}
        onChange={(value) => {

          navigate("/dept-exams");
        }}
      />
    </center>
  );
};
export default NavigationTab;

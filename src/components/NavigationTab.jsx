import { Segmented } from "antd";
import { useNavigate } from "react-router-dom";
import "../styles/Navtab.css";

const NavigationTab = () => {
  const navigate = useNavigate();

  return (
    <center>
      <Segmented
        className="navigationTab"
        options={[
          "Home",
          "Slots",
          "Batches",
          "Subjects",
          "Dropout/Rejoin",
          "Exam Hall",
        ]}
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
            // case "Supply":
            //   navigate("/supply");
            //   break;
            case "Dropout/Rejoin":
              navigate("/drop-rejoin");
              break;
            case "ExamHalls":
              navigate("/exam-halls");
              break;
          }
        }}
      />
    </center>
  );
};
export default NavigationTab;

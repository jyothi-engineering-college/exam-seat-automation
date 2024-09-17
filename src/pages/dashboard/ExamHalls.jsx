import { PlusCircleOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { useNavigate } from "react-router-dom";
import ExamHallTable from "../../components/ExamHallTable";
import "../../styles/Table.css";

const ExamHalls = () => {
  const navigate = useNavigate();

  const handleFloatButtonClick = () => {
    navigate("/addform?destination=examhallform");
  };

  return (
    <>
      <ExamHallTable />
     
      <FloatButton
        tooltip={<div>Add</div>}
        icon={<PlusCircleOutlined />}
        onClick={handleFloatButtonClick}
      />
    </>
  );
};

export default ExamHalls;

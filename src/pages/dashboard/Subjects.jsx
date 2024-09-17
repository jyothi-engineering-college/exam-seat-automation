import { PlusCircleOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { useNavigate } from "react-router-dom";
import SubjectsTable from "../../components/SubjectsTable";
import "../../styles/Table.css";

const Subjects = () => {
  const navigate = useNavigate();

  const handleFloatButtonClick = () => {
    navigate("/addform?destination=subjectsform");
  };

  return (
    <>
      <SubjectsTable />
      
      <FloatButton
        tooltip={<div>Add</div>}
        icon={<PlusCircleOutlined />}
        onClick={handleFloatButtonClick}
      />
    </>
  );
};

export default Subjects;

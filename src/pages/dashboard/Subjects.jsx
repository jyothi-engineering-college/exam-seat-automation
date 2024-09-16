import "../../styles/Table.css";
import BatchesTable from "../../components/BatchesTable";
import {FloatButton } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import SubjectsTable from "../../components/SubjectsTable";

const Subjects = () => {
  const navigate = useNavigate();

  const printPage = () => {
    navigate("/print");
  };

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

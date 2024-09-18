import "../../styles/Table.css";
import BatchesTable from "../../components/BatchesTable";
import { Button, FloatButton } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Batches = () => {
  const navigate = useNavigate();


  const handleFloatButtonClick = () => {
    navigate("/addform?destination=batchesform");
  };

  return (
    <>
      <BatchesTable />
   
      <FloatButton
        tooltip={<div>Add</div>}
        icon={<PlusCircleOutlined />}
        onClick={handleFloatButtonClick}
      />
    </>
  );
};

export default Batches;

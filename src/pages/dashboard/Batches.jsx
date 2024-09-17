import "../../styles/Table.css";
import BatchesTable from "../../components/BatchesTable";
import { Button, FloatButton } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Batches = () => {
  const navigate = useNavigate();

  const printPage = () => {
    navigate("/print");
  };

  const handleFloatButtonClick = () => {
    navigate("/addform?destination=batchesform");
  };

  return (
    <>
      <BatchesTable />
      <center>
        <Button onClick={printPage} className="printbutton">
          PRINT
        </Button>
      </center>
      <FloatButton
        tooltip={<div>Add</div>}
        icon={<PlusCircleOutlined />}
        onClick={handleFloatButtonClick}
      />
    </>
  );
};

export default Batches;

import { Button } from "antd/es";
import "../styles/Table.css";
import { FloatButton } from "antd/es";
import { QuestionCircleOutlined } from "@ant-design/icons/lib";
import { FileAddFilled } from "@ant-design/icons/lib";
import { PlusCircleFilled } from "@ant-design/icons/lib";
import { PlusCircleOutlined } from "@ant-design/icons/lib";
import { useNavigate } from "react-router-dom/dist";

const TableContainer = () => {
  const navigate = useNavigate();

  const printPage = () => {
    navigate("/print"); 
  };

  return (
    <>
      <div className="table-container">
        <div className="header-container">
          <div className="heading-left">
            <h6 className="tdhd">Table Heading</h6>
            <div className="underline"></div>
          </div>

          <Button className="editbutton">Edit</Button>
        </div>
        <div className="table-wrapper">
          <table className="my-table">
            <thead>
              <tr>
                <th className="column-1">Header 1</th>
                <th className="column-2">Header 2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="column-1">Data 1</td>
                <td className="column-2">Data 2</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
      <center>
        <Button onClick={printPage} className="printbutton">
          PRINT
        </Button>
      </center>
      <FloatButton
        icon={<PlusCircleOutlined />}
        onClick={() => console.log("onClick")}
      />
    </>
  );
};

export default TableContainer;

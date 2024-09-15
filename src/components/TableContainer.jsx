import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons/lib";
import { Button, FloatButton, Input } from "antd/es";
import DataTable, { createTheme } from "react-data-table-component";
import { useState } from "react";
import { useNavigate } from "react-router-dom/dist";
import "../styles/Table.css";

createTheme("custom", {
  text: {
    primary: "#268bd2",
  },
  background: {
    default: "#f0f9ff",
  },

  divider: {
    default: "#636566",
  },
});

const tableCustomStyles = {
  headCells: {
    style: {
      fontSize: "16px",
      fontWeight: "bold",
    },
  },
};

const TableContainer = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); 

  const printPage = () => {
    navigate("/print");
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Age",
      selector: (row) => row.age,
      sortable: true,
      wrap: true,
    },
    {
      name: "City",
      selector: (row) => row.city,
      sortable: true,
      wrap: true,
    },
    {
      name: "Occupation",
      selector: (row) => row.occupation,
      sortable: true,
      wrap: true,
    },
  ];

  const data = [
    
  ];

  const filteredData = data.filter((item) => {
    const concatenatedValues = Object.values(item).join(" ").toLowerCase();
    const searchWords = searchTerm.toLowerCase().split(" ");

    return searchWords.every((searchWord) =>
      concatenatedValues.includes(searchWord)
    );
  });

  return (
    <>
      <div className="table-container">
        <div className="header-container">
          <div className="heading-left">
            <h6 className="tdhd">Table Heading</h6>
            <div className="underline"></div>
          </div>

          {/* Search input */}
          <div className="search-container">
            <Input
              size="large"
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </div>
        </div>
        <div className="table-wrapper">
          <div className="my-table">
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              paginationPerPage={30}
              sort
              theme="custom"
              customStyles={tableCustomStyles}
            />
          </div>
        </div>
      </div>
      <center>
        <Button onClick={printPage} className="printbutton">
          PRINT
        </Button>
      </center>
      <FloatButton
        tooltip={<div>Add</div>}
        icon={<PlusCircleOutlined />}
        onClick={() => navigate("/form")}
      />
    </>
  );
};

export default TableContainer;

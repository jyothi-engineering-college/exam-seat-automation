import { SearchOutlined } from "@ant-design/icons/lib";
import { Input } from "antd";
import { useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { useAppContext } from "../context/AppContext";
import { filteredData } from "../utils/dataSearch";
import { EditOutlined } from "@ant-design/icons";

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
      borderStyle: "double",
      borderColor: "#c7cfd2",
      borderWidth: "2px",
    },
  },
  cells: {
    style: {
      borderStyle: "double",
      borderColor: "#c7cfd2",
      borderWidth: "0.2px",
    },
  },
};

const SubjectsTable = () => {
  const { fetchSubjects } = useAppContext();

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSubjects().then((data) => {
      setData(data);
    });
  }, [fetchSubjects]);

  const filteredResults = filteredData(data, searchTerm);

 
  const columns = [
    {
      name: "Semester",
      selector: (row) => row.SEM,
      sortable: true,
      wrap: true,
    },
    {
      name: "Department",
      selector: (row) => row.DEPT,
      sortable: true,
      wrap: true,
    },
    {
      name: "Course Code",
      selector: (row) => row["COURSE CODE"],
      sortable: true,
      wrap: true,
    },
    {
      name: "Course Name",
      selector: (row) => row["COURSE NAME"],
      sortable: true,
      wrap: true,
    },
    {
      name: "Slot",
      selector: (row) => row.SLOT,
      sortable: true,
      wrap: true,
    },
    {
      name: "Credit",
      selector: (row) => row.CREDIT,
      sortable: true,
      wrap: true,
    },
    {
      name: "Edit",
      selector: (row) => <EditOutlined />,
      sortable: true,
      wrap: true,
    },
  ];

  return (
    <>
      <div className="table-container">
        <div className="header-container">
          <div className="heading-left">
            <center>
              <h6 className="tdhd">Subjects</h6>
            </center>
          </div>

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
              data={filteredResults} 
              defaultSortAsc={true}
              pagination
              paginationPerPage={30}
              theme="custom"
              customStyles={tableCustomStyles}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SubjectsTable;

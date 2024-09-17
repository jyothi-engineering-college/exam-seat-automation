import { SearchOutlined } from "@ant-design/icons/lib";
import { ConfigProvider, DatePicker, Input, Space } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { filteredData } from "../utils/dataSearch";
import { useAppContext } from "../context/AppContext";

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

const BatchesTable = () => {
  const { fetchBatches, fetchAcademicYear, updateAcademicYear } =
    useAppContext();

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [year, setYear] = useState(); // Track year directly

  useEffect(() => {
    fetchBatches().then((data) => {
      setData(data);
    });
  }, [fetchBatches]);

  useEffect(() => {
    fetchAcademicYear().then((year) => {
      setYear(dayjs(`${year}-01-01`));
    });
  }, [fetchAcademicYear]);

  const filteredResults = filteredData(data, searchTerm);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.deptName,
      sortable: true,
      wrap: true,
    },
    {
      name: "Subjects",
      selector: (row) => row.subjects.join(", "),
      sortable: true,
      wrap: true,
    },
  ];

  const disabledDate = (currentDate) => {
    const currentYear = dayjs().year();
    return currentDate.year() < currentYear;
  };

  const yearChanged = async (date) => {
    const prevYear = year;
    setYear(date);
    try {
      await updateAcademicYear(date.year());
    } catch (error) {
      setYear(prevYear);
    }
  };
  return (
    <>
      <div className="table-container">
        <div className="header-container">
          <div className="heading-left">
            <center>
              <h6 className="tdhd">Batches</h6>
            </center>
          </div>

          <ConfigProvider
            theme={{
              token: {
                colorText: "#07314a",
                fontWeightStrong: 800,
                colorPrimary: "#07314a",
                colorBgElevated: "#f0f9ff",
              },
            }}
          >
            <Space>
              <DatePicker
                size="large"
                placeholder="Select Academic Year"
                disabledDate={disabledDate}
                value={year}
                onChange={yearChanged}
                picker="year"
              />
            </Space>
          </ConfigProvider>

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

export default BatchesTable;

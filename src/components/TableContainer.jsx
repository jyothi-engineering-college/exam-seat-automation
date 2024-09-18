import { SearchOutlined } from "@ant-design/icons/lib";
import { Select } from "antd";
import { ConfigProvider, DatePicker, Input, Space } from "antd";
import DataTable, { createTheme } from "react-data-table-component";

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

const TableContainer = ({
  tableName,
  columns,
  filteredResults,
  searchTerm,
  setSearchTerm,
  year,
  yearChanged,
  disabledDate,
}) => {
  return (
    <>
      <div className="table-container">
        <div className="header-container">
          <div className="heading-left">
            <center>
              <h6 className="tdhd">{tableName}</h6>
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
              {year && (
                <DatePicker
                  size="large"
                  placeholder="Select Academic Year"
                  disabledDate={disabledDate}
                  value={year}
                  onChange={yearChanged}
                  picker="year"
                />
              )}
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

export default TableContainer;

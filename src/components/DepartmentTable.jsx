import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { filteredData } from "../utils/dataSearch";
import TableContainer from "./TableContainer";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const DepartmentTable = () => {
  const { deptView } = useAppContext(); // Access deptView from context
   const navigate = useNavigate(); // Use navigate to change routes
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Update the data whenever deptView changes
  useEffect(() => {
    if (deptView.length > 0) {
      console.log(deptView); // Log deptView to console

      setData(deptView); // Set the new data without transformation
    }
  }, [deptView]);

  const formatItems = (items) => {
    // Group the items into pairs and join them with a hyphen and line break
    return items
      .map((item, index) => {
        if (index % 2 === 0 && items[index + 1]) {
          return `${item} - ${items[index + 1]}`; // Join pairs of adjacent items with a hyphen
        }
        return null; // Skip odd indexed items as they are already paired
      })
      .filter(Boolean) // Remove null values
      .join("<br />"); // Join pairs with a line break
  };

  const formatCounts = (counts) => {
    // Join count values with a line break
    return counts.join("<br />");
  };

  const filteredResults = filteredData(data, searchTerm); // Filtered data based on searchTerm

  const columns = [
    {
      name: "Department",
      selector: (row) => row.dept,
      sortable: true,
      wrap: true,
    },
    {
      name: "Room",
      selector: (row) => (
        <div dangerouslySetInnerHTML={{ __html: formatCounts(row.rooms) }} />
      ),
      wrap: true,
    },
    {
      name: "Roll Numbers",
      selector: (row) => (
        <div dangerouslySetInnerHTML={{ __html: formatItems(row.rollNums) }} />
      ),
      wrap: true,
    },
    {
      name: "Count",
      selector: (row) => (
        <div dangerouslySetInnerHTML={{ __html: formatCounts(row.count) }} />
      ),
      wrap: true,
    },
  ];

  let props = {
    tableName: "Department View",
    columns,
    filteredResults,
    searchTerm,
    setSearchTerm,
  };

  return (
    <>
      <TableContainer {...props} />
      <center>
        <Button
          className="printbutton"
          onClick={() => {
            navigate("/print?destination=dept");
          }}
        >
          PRINT
        </Button>
      </center>
    </>
  );
};

export default DepartmentTable;

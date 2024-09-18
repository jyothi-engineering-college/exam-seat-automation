import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { filteredData } from "../utils/dataSearch";
import TableContainer from "./TableContainer";

const DepartmentTable = () => {
  const { deptView } = useAppContext(); // Access deptView from context

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Update the data whenever deptView changes
  useEffect(() => {
    if (deptView.length > 0) {
      // Transform data to repeat the department for each room
      const transformedData = deptView[0].rooms.map((room, index) => ({
        dept: deptView[0].dept,
        room,
        rollNums: deptView[0].rollNums.slice(index * 10, (index + 1) * 10), // Adjust slice as per requirement
        count: deptView[0].count[index] || 0,
      }));
      setData(transformedData); // Set the new data
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
      selector: (row) => row.room,
      sortable: true,
      wrap: true,
    },
    {
      name: "Roll Numbers",
      selector: (row) => (
        <div dangerouslySetInnerHTML={{ __html: formatItems(row.rollNums) }} />
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: "Count",
      selector: (row) => row.count,
      sortable: true,
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
    </>
  );
};

export default DepartmentTable;

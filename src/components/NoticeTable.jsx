import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { filteredData } from "../utils/dataSearch";
import TableContainer from "./TableContainer";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const NoticeTable = () => {
  const { noticeBoardView,dateTime } = useAppContext(); // Access noticeBoardView from context

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  // useEffect to update the data whenever noticeBoardView changes
  useEffect(() => {
    if (noticeBoardView.length > 0) {
      setData(noticeBoardView); // Set the new data from noticeBoardView
    }
  }, [noticeBoardView]); // Dependency array includes noticeBoardView

  const filteredResults = filteredData(data, searchTerm); // Filtered data based on searchTerm

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

  const formatCount = (counts) => {
    return counts ? counts.join("<br />") : "0"; // Join count values with a line break
  };

  const columns = [
    {
      name: "Class",
      selector: (row) => row.class,
      sortable: true,
      wrap: true,
    },
    {
      name: "Register No",
      selector: (row) => (
        <div dangerouslySetInnerHTML={{ __html: formatItems(row.items) }} />
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: "Count",
      selector: (row) => (
        <div dangerouslySetInnerHTML={{ __html: formatCount(row.count) }} />
      ),
      wrap: true,
    },
  ];

  let props = {
    tableName: "Notice Board",
    columns,
    filteredResults,
    searchTerm,
    setSearchTerm,
  };

  return (
    <>
      {dateTime && <h3>{dateTime}</h3>}
      <TableContainer {...props} />
      <center>
        <Button
          className="printbutton"
          onClick={() => {
            navigate("/print?destination=notice");
          }}
        >
          PRINT
        </Button>
      </center>
    </>
  );
};

export default NoticeTable;

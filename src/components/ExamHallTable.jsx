import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { filteredData } from "../utils/dataSearch";
import TableContainer from "./TableContainer";

const ExamHallTable = () => {
  const { fetchExamHalls } = useAppContext();

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchExamHalls().then((data) => {
      setData(data);
    });
  }, [fetchExamHalls]);

  const filteredResults = filteredData(data, searchTerm);

  const columns = [
    {
      name: "Exam Halls",
      selector: (row) => row.Hall,
      sortable: true,
      wrap: true,
    },
    {
      name: "Capacity",
      selector: (row) => row.Capacity,
      sortable: true,
      wrap: true,
    },
   
  ];
  let props = { tableName:"Exam Halls",columns, filteredResults, searchTerm, setSearchTerm };

  return (
    <>
      <TableContainer {...props} />
    </>
  );
};

export default ExamHallTable;

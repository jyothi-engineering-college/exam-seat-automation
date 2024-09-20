import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { filteredData } from "../utils/dataSearch";
import TableContainer from "./TableContainer";

const BatchesTable = () => {
  const { fetchBatches, fetchAcademicYear, updateAcademicYear, academicYear } =
    useAppContext();

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch batch data once on mount
  useEffect(() => {
    fetchBatches().then((data) => {
      setData(data);
    });
  }, [fetchBatches]);

  useEffect(() => {
    fetchAcademicYear();    
  }, []);

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
      selector: (row) => row.exams.join(", "),
      sortable: true,
      wrap: true,
    },
    {
      name: "Regular Strength",
      selector: (row) => row.regStrength || 0,
      sortable: true,
      wrap: true,
    },
    {
      name: "Let Strength",
      selector: (row) => row.letStrength || 0,
      sortable: true,
      wrap: true,
    },
    {
      name: "Dropped Students",
      selector: (row) => row.drop?.join(" , ") || "NIL",
      sortable: true,
      wrap: true,
    },
    {
      name: "Rejoined Students",
      selector: (row) => row.rejoin?.join(" , ") || "NIL",
      sortable: true,
      wrap: true,
    },
  ];

  const disabledDate = (currentDate) => {
    const currentYear = dayjs().year();
    return currentDate.year() < currentYear;
  };

  const yearChanged = async (date) => {
    await updateAcademicYear(date, academicYear);
  };

  let props = {
    tableName: "Batches",
    columns,
    filteredResults,
    searchTerm,
    setSearchTerm,
    academicYear,
    yearChanged,
    disabledDate,
  };

  return (
    <>
      <TableContainer {...props} />
    </>
  );
};

export default BatchesTable;

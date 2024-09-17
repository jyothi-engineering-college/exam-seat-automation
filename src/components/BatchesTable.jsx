import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { filteredData } from "../utils/dataSearch";
import TableContainer from "./TableContainer";


const BatchesTable = () => {
  const { fetchBatches, fetchAcademicYear, updateAcademicYear } =
    useAppContext();

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [year, setYear] = useState(); 

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
  let props={tableName:"Batches",columns,filteredResults,searchTerm,setSearchTerm,year,yearChanged,disabledDate}
  return (
    <>
     <TableContainer {...props} />
    </>
  );
};

export default BatchesTable;

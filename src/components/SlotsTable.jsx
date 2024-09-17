import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { filteredData } from "../utils/dataSearch";
import TableContainer from "./TableContainer";


const SlotsTable = () => {
  const { fetchSlots } = useAppContext();

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSlots().then((data) => {      
      setData(data);
    });
  }, [fetchSlots]);

  const filteredResults = filteredData(data, searchTerm);

  const columns = [
    {
      name: "Slot",
      selector: (row) => row.Slot,
      sortable: true,
      wrap: true,
    },
    {
      name: "Exams",
      selector: (row) => row.Exams.join(" | "),
      sortable: true,
      wrap: true,
    },
    {
      name: "Date",
      selector: (row) => "",
      sortable: true,
      wrap: true,
    },
    {
      name: "Time",
      selector: (row) => "",
      sortable: true,
      wrap: true,
    },
  ];
  let props = {
    tableName: "Slots",
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

export default SlotsTable;

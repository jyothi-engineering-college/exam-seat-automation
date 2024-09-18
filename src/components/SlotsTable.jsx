import { EditOutlined } from "@ant-design/icons";
import { DatePicker, Popconfirm, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { createTheme } from "react-data-table-component";
import { useAppContext } from "../context/AppContext";
import { filteredData } from "../utils/dataSearch";
import TableContainer from "./TableContainer";

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

const { RangePicker } = DatePicker;

const SlotsTable = () => {
  const { fetchSlots, updateSlots } = useAppContext();

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingKey, setEditingKey] = useState("");
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchSlots().then((data) => {
      setData(data);
    });
  }, [fetchSlots]);

  const filteredResults = filteredData(data, searchTerm);

  const handleEdit = (key) => {
    setEditingKey(key);
    const record = data.find((item) => item.Slot === key);
    setEditData({ ...record }); // Ensure you're setting a copy of the record
  };

  const handleSave = async () => {
    const newData = data.map((item) =>
      item.Slot === editingKey ? editData : item
    );

    await updateSlots(newData);
    setData(newData);
    setEditingKey("");
    setEditData({}); // Clear editData
  };

  const handleChange = (value, field) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateRangeChange = (value) => {
    setEditData((prev) => ({
      ...prev,
      Date: value, // Directly save the range picker value
    }));
  };

  const columns = [
    {
      name: "Slot",
      selector: (row) => row.Slot,
      wrap: true,
      sortable: true,
    },
    {
      name: "Exams",
      selector: (row) =>
        editingKey === row.Slot ? (
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder={`Add Exams for ${row.Slot}`}
            value={editData.Exams}
            onChange={(value) => handleChange(value, "Exams")}
            options={editData.Exams.map((exam) => ({
              value: exam,
              label: exam,
            }))}
          />
        ) : (
          row.Exams.join(" | ")
        ),
      wrap: true,
      sortable: true,
    },
    {
      name: "Date & Time",
      selector: (row) =>
        editingKey === row.Slot ? (
          <RangePicker
            size="large"
            showTime={{ format: "hh:mm A" }} // AM/PM format
            value={editData.Date} // Initialize with the selected range
            onChange={handleDateRangeChange} // Update state on change
            format="DD-MM-YYYY hh:mm A" // Include AM/PM in format
            style={{ width: "300px", height: "50px" }} // Adjust width and height as needed
          />
        ) : row.Date ? (
          dayjs(row.Date[0]).format("DD-MM-YYYY hh:mm A") +
          " to " +
          dayjs(row.Date[1]).format("hh:mm A")
        ) : (
          "No Date & Time Allotted"
        ),
      wrap: true,
      sortable: true,
    },
    {
      name: "Edit",
      selector: (row) =>
        editingKey === row.Slot ? (
          <span>
            <a onClick={handleSave}>Save</a>
            <Popconfirm
              title="Cancel editing?"
              onConfirm={() => {
                setEditingKey("");
                setEditData({}); // Clear editData on cancel
              }}
            >
              <a style={{ marginLeft: 8 }}>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <a onClick={() => handleEdit(row.Slot)}>
            <EditOutlined />
          </a>
        ),
      sortable: false,
    },
  ];

  let props = {
    tableName: "Slots",
    columns,
    filteredResults,
    searchTerm,
    setSearchTerm,
  };

  return <TableContainer {...props} />;
};

export default SlotsTable;

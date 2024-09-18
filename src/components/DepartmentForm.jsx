import React, { useState, useEffect, useRef } from "react";
import { Button, Select, Form, message, Popconfirm } from "antd";
import { useAppContext } from "../context/AppContext";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { InputNumber } from "antd";
import { calculateYear } from "../utils/yearCalculator";

const DepartmentForm = () => {
  const navigate = useNavigate();
  const { examForm, fetchExamOptions } = useAppContext();
  
  const initialState = {
    depts: [
      { name: "CE", options: [], initialValues: [], reg: 0, let: 0 },
      { name: "CS", options: [], initialValues: [], reg: 0, let: 0 },
      { name: "ME", options: [], initialValues: [], reg: 0, let: 0 },
      { name: "AD", options: [], initialValues: [], reg: 0, let: 0 },
      { name: "EE", options: [], initialValues: [], reg: 0, let: 0 },
      { name: "EC", options: [], initialValues: [], reg: 0, let: 0 },
      { name: "CC", options: [], initialValues: [], reg: 0, let: 0 },
      { name: "MC", options: [], initialValues: [], reg: 0, let: 0 },
    ],
    year: "first_years",
  };

  const [depts, setDepts] = useState(initialState.depts);
  const [selectedYear, setSelectedYear] = useState(null);
  const hasLoaded = useRef(false);
  const [form] = Form.useForm();

  const years = (value) => {
    const currentYear = 2024 % 100;
    setSelectedYear(value);

    setDepts((prevDepts) =>
      prevDepts.map((dept) => calculateYear(value, dept, currentYear))
    );
  };

  const handleFieldChange = (field, value, deptName) => {
    setDepts((prevDepts) =>
      prevDepts.map((dept) =>
        dept.name === deptName ? { ...dept, [field]: value } : dept
      )
    );
  };

  const submitForm = async () => {
    try {
      await examForm(depts);

      localStorage.removeItem("depts");
      localStorage.removeItem("selectedYear");

      setDepts(initialState.depts);
      setSelectedYear(initialState.year);

      form.resetFields();
      setTimeout(() => navigate("/batches"), 600);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    const storedDepts = localStorage.getItem("depts");
    const storedYear = localStorage.getItem("selectedYear");

    if (storedDepts) {
      setDepts(JSON.parse(storedDepts));
    }

    if (storedYear) {
      setSelectedYear(storedYear);
      years(storedYear);

      // Populate the form with the selected year
      form.setFieldsValue({ Year: storedYear });

      // Ensure form fields are updated based on depts state
      const deptFields = depts.reduce((acc, dept) => {
        acc[dept.name] = dept.initialValues;
        acc[`reg${dept.name}`] = dept.reg;
        acc[`let${dept.name}`] = dept.let;
        return acc;
      }, {});

      form.setFieldsValue(deptFields);
    }
  }, [form]); // Added `depts` to dependencies



useEffect(() => {
  const loadOptions = async () => {
    try {
      // Fetch options from your API or data source
      const options = await fetchExamOptions();

      // Create a mapping of year-attached names to their options
      const optionsMap = Object.entries(options).reduce(
        (map, [deptKey, opts]) => {
          const deptNameWithYear = calculateYear(
            selectedYear,
            { name: deptKey },
            2024
          ).name;
          map[deptNameWithYear] = opts;
          return map;
        },
        {}
      );

      // Update departments with options based on matching names
      const updatedDepts = depts.map((dept) => {
        // Calculate the department name with the current year
        const deptNameWithYear = calculateYear(selectedYear, dept, 2024).name;
        return {
          ...dept,
          options: optionsMap[deptNameWithYear] || [], // Use default empty array if no options found
        };
      });

      // Set the updated depts state
      setDepts((prevDepts) => {
        // Map over previous depts to update their options
        const updatedDeptsMap = updatedDepts.reduce((map, dept) => {
          map[dept.name] = dept;
          return map;
        }, {});

        return prevDepts.map(
          (prevDept) => updatedDeptsMap[prevDept.name] || prevDept
        );
      });
    } catch (error) {
      console.error("Error loading options:", error);
    }
  };

  loadOptions();
}, [selectedYear, fetchExamOptions]);

  
  
  
  useEffect(() => {
    if (hasLoaded.current) {
      localStorage.setItem("depts", JSON.stringify(depts));
      localStorage.setItem("selectedYear", selectedYear);
    } else {
      hasLoaded.current = true;
    }
  }, [depts, selectedYear]);


  
  return (
    <>
      <Form
        form={form}
        name="basic"
        style={{ maxWidth: 600 }}
        autoComplete="on"
      >
        <Form.Item
          label="Select Year"
          name="Year"
          initialValue={selectedYear}
          rules={[{ required: true, message: "Please select the Year!" }]}
        >
          <Select
            style={{ width: 120 }}
            placeholder="Select Year"
            onChange={years}
            options={[
              { value: "first_years", label: "First Year" },
              { value: "second_years", label: "Second Year" },
              { value: "third_years", label: "Third Year" },
              { value: "fourth_years", label: "Fourth Year" },
            ]}
          />
        </Form.Item>

        {depts.map((dept, i) => (
          <div key={i}>
            <h3>{dept.name}</h3>
            <Form.Item name={dept.name} initialValue={dept.initialValues}>
              <Select
                mode="tags"
                style={{ width: "100%" }}
                placeholder={`Add Exams for ${dept.name}`}
                onChange={(value) =>
                  handleFieldChange("initialValues", value, dept.name)
                }
                options={dept.options.map((exam) => ({
                  value: exam,
                  label: exam,
                }))}
              />
            </Form.Item>
            <Form.Item name={`reg${dept.name}`} initialValue={dept.reg}>
              <InputNumber
                size="large"
                min={1}
                max={65}
                placeholder="Regular Strength"
                style={{ width: "200px", marginRight: "40px" }}
                value={dept.reg}
                onChange={(value) => handleFieldChange("reg", value, dept.name)}
              />
            </Form.Item>
            <Form.Item name={`let${dept.name}`} initialValue={dept.let}>
              <InputNumber
                size="large"
                min={1}
                max={40}
                placeholder="LET Strength"
                style={{ width: "200px" }}
                value={dept.let}
                onChange={(value) => handleFieldChange("let", value, dept.name)}
              />
            </Form.Item>
            <br />
          </div>
        ))}

        <Form.Item>
          <Popconfirm
            onConfirm={submitForm}
            title="Current year exams data will be overwritten !"
            description="Are you sure you want to submit?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Popconfirm>
        </Form.Item>
      </Form>
    </>
  );
};

export default DepartmentForm;

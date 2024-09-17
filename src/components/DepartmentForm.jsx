import React, { useState, useEffect, useRef } from "react";
import { Button, Select, Form, message, Popconfirm } from "antd";
import { useAppContext } from "../context/AppContext";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const DepartmentForm = () => {
  const navigate = useNavigate();
  const { examForm, fetchExamOptions } = useAppContext();
  const initialState = {
    depts: [
      { name: "CE", options: [], initialValues: [] },
      { name: "CS", options: [], initialValues: [] },
      { name: "ME", options: [], initialValues: [] },
      { name: "AD", options: [], initialValues: [] },
      { name: "EE", options: [], initialValues: [] },
      { name: "EC", options: [], initialValues: [] },
      { name: "CC", options: [], initialValues: [] },
      { name: "MC", options: [], initialValues: [] },
    ],
    year: "first_years",
  };

  const [depts, setDepts] = useState(initialState.depts);
  const [selectedYear, setSelectedYear] = useState(initialState.year);
  const hasLoaded = useRef(false);
  const [form] = Form.useForm();
  const calculateYear = (value, dept, currentYear) => {
    const hasYearPrefix = dept.name.length > 2;
    const deptWithoutYear = hasYearPrefix ? dept.name.slice(2) : dept.name;
    switch (value) {
      case "first_years":
        return { ...dept, name: `${currentYear}${deptWithoutYear}` };
      case "second_years":
        return { ...dept, name: `${currentYear - 1}${deptWithoutYear}` };
      case "third_years":
        return { ...dept, name: `${currentYear - 2}${deptWithoutYear}` };
      case "fourth_years":
        return { ...dept, name: `${currentYear - 3}${deptWithoutYear}` };
      default:
        return dept;
    }
  };
  const years = (value) => {
    const currentYear = 2024 % 100;
    setSelectedYear(value);

    setDepts((prevDepts) =>
      prevDepts.map((dept) => {
        const hasYearPrefix = dept.name.length > 2;
        const deptWithoutYear = hasYearPrefix ? dept.name.slice(2) : dept.name;

        switch (value) {
          case "first_years":
            return { ...dept, name: `${currentYear}${deptWithoutYear}` };
          case "second_years":
            return { ...dept, name: `${currentYear - 1}${deptWithoutYear}` };
          case "third_years":
            return { ...dept, name: `${currentYear - 2}${deptWithoutYear}` };
          case "fourth_years":
            return { ...dept, name: `${currentYear - 3}${deptWithoutYear}` };
          default:
            return dept;
        }
      })
    );
  };

  const handleChange = (value, deptName) => {
    setDepts((prevDepts) =>
      prevDepts.map((dept) =>
        dept.name === deptName ? { ...dept, initialValues: value } : dept
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
      form.setFieldsValue({ Year: storedYear });
    }
  }, [form]);

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
          // Keep the original name in the state
          const deptNameWithYear = calculateYear(selectedYear, dept, 2024).name;
          return {
            ...dept,
            options: optionsMap[deptNameWithYear] || [],
          };
        });

        // Set the updated depts state
        setDepts((prevDepts) =>
          prevDepts.map((prevDept) => {
            const updatedDept = updatedDepts.find(
              (dept) => dept.name === prevDept.name
            );
            return updatedDept
              ? { ...prevDept, options: updatedDept.options }
              : prevDept;
          })
        );
      } catch (error) {
        console.error("Error loading options:", error);
      }
    };

    loadOptions();
  }, [selectedYear]);
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
            <Form.Item
              label={dept.name}
              name={dept.name}
              initialValue={dept.initialValues}
            >
              <Select
                mode="tags"
                style={{ width: "100%" }}
                placeholder={`Add Exams for ${dept.name}`}
                onChange={(value) => handleChange(value, dept.name)}
                options={dept.options.map((exam) => ({
                  value: exam,
                  label: exam,
                }))}
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

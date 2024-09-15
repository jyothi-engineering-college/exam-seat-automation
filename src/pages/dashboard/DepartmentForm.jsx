import React, { useState, useEffect, useRef } from "react";
import { Button, Select, Form } from "antd";

const DepartmentForm = () => {
  const [depts, setDepts] = useState([
    { name: "CE", options: [] },
    { name: "CS", options: [] },
    { name: "ME", options: [] },
    { name: "AD", options: [] },
    { name: "EE", options: [] },
    { name: "EC", options: [] },
    { name: "CC", options: [] },
    { name: "MC", options: [] },
  ]);

  const [selectedYear, setSelectedYear] = useState("first_years");

  const hasLoaded = useRef(false);
  const [form] = Form.useForm();

  const years = (value) => {
    const currentYear = 2024 % 100; // academic year
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
        dept.name === deptName ? { ...dept, options: value } : dept
      )
    );
  };

  useEffect(() => {
    const storedDepts = localStorage.getItem("depts");
    const storedYear = localStorage.getItem("selectedYear");

    if (storedDepts) {
      setDepts(JSON.parse(storedDepts));
    } else {
      setDepts((prevDepts) =>
        prevDepts.map((dept) => ({
          ...dept,
          options: dept.options || [],
        }))
      );
    }

    if (storedYear) {
      setSelectedYear(storedYear);
      years(storedYear); // Initialize departments based on the stored year
      form.setFieldsValue({ Year: storedYear }); // Set form value
    }
  }, [form]);

  useEffect(() => {
    if (hasLoaded.current) {
      localStorage.setItem("depts", JSON.stringify(depts));
      localStorage.setItem("selectedYear", selectedYear);
    } else {
      hasLoaded.current = true;
    }
  }, [depts, selectedYear]);

  // Check if all department options are not null
  const allOptionsSet = depts.every((dept) => dept.options !== null);

  return (
    <>
      {allOptionsSet ? (
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
                initialValue={dept.options}
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
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <p>Loading departments...</p>
      )}
    </>
  );
};

export default DepartmentForm;


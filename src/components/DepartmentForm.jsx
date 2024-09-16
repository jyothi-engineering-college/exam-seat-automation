import React, { useState, useEffect, useRef } from "react";
import { Button, Select, Form, message, Popconfirm } from "antd";
import { useAppContext } from "../context/AppContext";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const DepartmentForm = () => {
  const navigate = useNavigate();
  const { examForm } = useAppContext();
  const [messageApi, contextHolder] = message.useMessage();
  const initialState = {
    depts: [
      { name: "CE", options: [] },
      { name: "CS", options: [] },
      { name: "ME", options: [] },
      { name: "AD", options: [] },
      { name: "EE", options: [] },
      { name: "EC", options: [] },
      { name: "CC", options: [] },
      { name: "MC", options: [] },
    ],
    year: "first_years",
  };

  const [depts, setDepts] = useState(initialState.depts);
  const [selectedYear, setSelectedYear] = useState(initialState.year);
  const hasLoaded = useRef(false);
  const [form] = Form.useForm();

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
        dept.name === deptName ? { ...dept, options: value } : dept
      )
    );
  };

  const submitForm = async () => {
    const key = "updatable";
    messageApi.open({
      key,
      type: "loading",
      content: "Submitting form...",
    });

    try {
      const status = await examForm(depts);
      messageApi.success({
        key,
        content: status,
        duration: 0.50,
      });
      localStorage.removeItem("depts");
      localStorage.removeItem("selectedYear");
      setDepts(initialState.depts);
      setSelectedYear(initialState.year);
      form.resetFields();
      setTimeout(() => navigate("/batches"), 600);
    } catch (error) {
      messageApi.error({
        key,
        content: error.message, // Use error.message to get the error text
      });
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
    if (hasLoaded.current) {
      localStorage.setItem("depts", JSON.stringify(depts));
      localStorage.setItem("selectedYear", selectedYear);
    } else {
      hasLoaded.current = true;
    }
  }, [depts, selectedYear]);

  return (
    <>
      {contextHolder}
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

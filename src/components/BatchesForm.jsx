import React, { useState, useEffect, useRef } from "react";
import { Button, Select, Form, message, Popconfirm } from "antd";
import { useAppContext } from "../context/AppContext";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { InputNumber } from "antd";
import FlexContainer from "../components/FlexContainer";

const BatchesForm = () => {
  const navigate = useNavigate();
  const { batchesForm, fetchExamOptions } = useAppContext();

  const [depts, setDepts] = useState([]); // Holds the department data
  const [selectedYear, setSelectedYear] = useState(null);
  const hasLoaded = useRef(false);
  const [form] = Form.useForm();

  // Handling year selection
  const handleYearChange = async (value) => {
    setSelectedYear(value);
    try {
      const fetchedDepts = await fetchExamOptions(value); // Fetch new data based on the selected year
      setDepts(fetchedDepts);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
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
      await batchesForm(depts);
      localStorage.removeItem("depts");
      localStorage.removeItem("selectedYear");

      setDepts([]);
      setSelectedYear(null);
      form.resetFields();

      setTimeout(() => navigate("/batches"), 600);
    } catch (error) {
      console.error(error);
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
      form.setFieldsValue({ Year: storedYear });
    }
  }, [form]);

  // Save to localStorage
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
        layout="vertical"
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
            onChange={handleYearChange}
            options={[
              { value: "first_years", label: "First Year" },
              { value: "second_years", label: "Second Year" },
              { value: "third_years", label: "Third Year" },
              { value: "fourth_years", label: "Fourth Year" },
            ]}
          />
        </Form.Item>

        {selectedYear &&
          depts.map((dept, i) => (
            <div key={i}>
              <h3>{dept.name}</h3>
              <Form.Item name={dept.name} initialValue={dept.initialValues}>
                <Select
                  mode="tags"
                  style={{ width: "200%" }}
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

              <FlexContainer>
                <Form.Item
                  label="Regular Strength"
                  name={`reg${dept.name}`}
                  initialValue={dept.reg}
                >
                  <InputNumber
                    size="large"
                    min={1}
                    max={65}
                    placeholder="Regular Strength"
                    style={{ width: "200px", marginRight: "40px" }}
                    value={dept.reg}
                    onChange={(value) =>
                      handleFieldChange("reg", value, dept.name)
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="LET Strength"
                  name={`let${dept.name}`}
                  initialValue={dept.let}
                >
                  <InputNumber
                    size="large"
                    min={1}
                    max={40}
                    placeholder="LET Strength"
                    style={{ width: "200px", marginRight: "40px" }}
                    value={dept.let}
                    onChange={(value) =>
                      handleFieldChange("let", value, dept.name)
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Dropped Students"
                  name={`drop${dept.name}`}
                  initialValue={dept.drop}
                >
                  <Select
                    mode="tags"
                    placeholder="Dropped Students"
                    style={{ width: "400px", marginRight: "40px" }}
                    onChange={(value) =>
                      handleFieldChange("drop", value, dept.name)
                    }
                    options={[]}
                  />
                </Form.Item>

                <Form.Item
                  label="Rejoined Students"
                  name={`rejoin${dept.name}`}
                  initialValue={dept.rejoin}
                >
                  <Select
                    mode="tags"
                    placeholder="Rejoined Students"
                    style={{ width: "400px", marginRight: "40px" }}
                    onChange={(value) =>
                      handleFieldChange("rejoin", value, dept.name)
                    }
                    options={[]}
                  />
                </Form.Item>
              </FlexContainer>
              <br />
            </div>
          ))}

        <Form.Item>
          <Popconfirm
            onConfirm={submitForm}
            title="Current year exams data will be overwritten!"
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

export default BatchesForm;

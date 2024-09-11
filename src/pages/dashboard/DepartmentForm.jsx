import React from "react";
import { Select } from "antd";

const options = [];

for (let i = 10; i < 36; i++) {
  options.push({
    value: "CST" + i,
    label: "CST" + i,
  });
}



const DepartmentForm = () => (
  <>
    <h2>CS</h2>
    <Select
      mode="tags"
      style={{ width: "100%" }}
      placeholder="Add Exams"
      options={options}
    />
    <h2>AD</h2>
    <Select
      mode="tags"
      style={{ width: "100%" }}
      placeholder="Add Exams"
      options={options}
    />
  </>
);

export default DepartmentForm;

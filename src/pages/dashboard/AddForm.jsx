import queryString from "query-string";
import React from "react";
import { useLocation } from "react-router-dom";
import DepartmentForm from "../../components/DepartmentForm";

const AddForm = () => {
  const location = useLocation();
  const { destination } = queryString.parse(location.search);

  switch (destination) {
    case "batchestable":
      return <DepartmentForm />;

    default:
      throw new Error("OOPS ! The page you are looking for is not found");
  }
};

export default AddForm;

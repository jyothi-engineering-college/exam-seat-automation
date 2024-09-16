import queryString from "query-string";
import React from "react";
import { useLocation } from "react-router-dom";
import {DepartmentForm,SubjectForm} from "../../components/index";
const AddForm = () => {
  const location = useLocation();
  const { destination } = queryString.parse(location.search);

  switch (destination) {
    case "batchesform":
      return <DepartmentForm />;
    case "subjectsform":
      return <SubjectForm />;

    default:
      throw new Error("OOPS ! The page you are looking for is not found");
  }
};

export default AddForm;

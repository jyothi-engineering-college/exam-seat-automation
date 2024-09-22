import queryString from "query-string";
import { useLocation } from "react-router-dom";
import FileContainer from "../../components/FileContainer";
import BatchesForm from "../../components/BatchesForm";
import "../../styles/Addform.css";

const AddForm = () => {
  const location = useLocation();
  const { destination } = queryString.parse(location.search);

  switch (destination) {
    case "batchesform":
      return <BatchesForm />;

    case "subjectsform":
    case "examhallform":
      return <FileContainer />;

    default:
      throw new Error("OOPS ! The page you are looking for is not found");
  }
};

export default AddForm;

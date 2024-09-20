import queryString from "query-string";
import { useLocation } from "react-router-dom";
import FileContainer from "../../components/FileContainer";
import BatchesForm from "../../components/BatchesForm";
import { useNavigate } from "react-router-dom";
const AddForm = () => {
  const location = useLocation();
  const navigate =useNavigate();
  const { destination } = queryString.parse(location.search);

  switch (destination) {
    case "batchesform":
      return <BatchesForm />;
    
    case "subjectsform":
    case "examhallform":
      
      return <FileContainer />;
    fdg

    default:
      throw new Error("OOPS ! The page you are looking for is not found");
  }
};

export default AddForm;

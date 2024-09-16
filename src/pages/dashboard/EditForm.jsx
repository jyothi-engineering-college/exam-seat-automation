import queryString from "query-string";
import { useLocation } from "react-router-dom";

const EditForm = () => {
  const location = useLocation();
  const { destination } = queryString.parse(location.search);

  switch (destination) {
    case "query":
      return <div/>;

    default:
      throw new Error("OOPS ! The page you are looking for is not found");
  }
};

export default EditForm;

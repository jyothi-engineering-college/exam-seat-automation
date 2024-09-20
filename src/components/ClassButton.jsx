import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Alert } from "antd";

const ClassButton = () => {
  const { classNames, classroomView, setSingleClassView } = useAppContext();
  const navigate = useNavigate(); // Use navigate to change routes

  const handleClick = (index) => {
    setSingleClassView(classroomView[index]);
    navigate("/print"); // Navigate to /print after setting the view
  };

  return (
    <>
      {classNames && classNames.length > 0 ? (
        classNames.map((className, index) => (
          <Button
            onClick={() => handleClick(index)}
            key={index}
            type="primary"
            style={{ margin: "5px" }}
          >
            {className}
          </Button>
        ))
      ) : (
        <>
          <h3 className="tdhd">Alloted Classes</h3>
          <center>
            <Alert message="No classes available" type="error"></Alert>
            <br />
            <br />
          </center>
        </>
      )}
    </>
  );
};

export default ClassButton;

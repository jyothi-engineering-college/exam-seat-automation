import FlexContainer from "../components/FlexContainer";
import { Button } from "antd";
import "../styles/Error.css";

const Fallback = ({ error, resetErrorBoundary }) => {
  return (
    <>
      <FlexContainer>
        <div>
          <h1>Something went wrong !</h1>
          <p>{error.message}</p>
          <Button className="refreshbutton" type="primary"  onClick={resetErrorBoundary}>
            Refresh</Button>
        </div>
     <img className="error" srcSet="/Error.svg" alt="Error" />
      </FlexContainer>
    </>
  );
};

export default Fallback;

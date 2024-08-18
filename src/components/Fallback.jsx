import "../styles/Error.css";
import FlexContainer from "../components/FlexContainer";
import { Button } from "antd";

const Fallback = ({ error, resetErrorBoundary }) => {
  return (
    <>
      <FlexContainer>
        <div>
          <h1>Evdeyo entho oru thakarar pole !</h1>
          <p>{error.message}</p>
          <Button className="refreshbutton" type="primary"  onClick={resetErrorBoundary}>
            Refresh</Button>
        </div>
     <img className="error" src="/Error.svg" alt="Error" />
      </FlexContainer>
    </>
  );
};

export default Fallback;

import Fallback from "../components/Fallback";
import { ErrorBoundary } from "react-error-boundary";

const errorLogger = (error, errorInfo) => {
  console.error(error, errorInfo);
};

const ErrorHandler = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={Fallback} onError={errorLogger}>
      {children}
    </ErrorBoundary> 
  );
};

export default ErrorHandler;

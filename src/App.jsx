import Fallback from "./components/Fallback";
import Login from "./pages/Login";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute";
import Sharedlayout from "./pages/dashboard/SharedLayout";
import Tablesample from "./pages/dashboard/tableSample";
import Home from "./pages/dashboard/Home";
import SignUp from "./pages/SignUp";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Login/>
            </ProtectedRoute>
          }

        >
          <Route index element={<Home/>} />
          <Route path="dept-exams" element={<Tablesample/>} />
          <Route path="signup" element={<SignUp/>} />
          
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Fallback />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

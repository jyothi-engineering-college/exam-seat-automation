import Fallback from "./components/Fallback";
import Login from "./pages/Login";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute";
import Sharedlayout from "./pages/dashboard/SharedLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Sharedlayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<h1>Home</h1>} />
          <Route path="dept-exams" element={<h1 >dept table</h1>} />
          
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Fallback />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

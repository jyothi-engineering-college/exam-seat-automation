import Fallback from "./components/Fallback";
import Login from "./pages/Login";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute";
import Sharedlayout from "./pages/dashboard/SharedLayout";
import Home from "./pages/dashboard/Home";
import Slots from "./pages/dashboard/Slots";
import Departments from "./pages/dashboard/Departments";
import Supply from "./pages/dashboard/Supply";
import DropRejoin from "./pages/dashboard/DropRejoin";
import Classes from "./pages/dashboard/Classes";
import Printpage from "./components/Printpage";

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
          <Route index element={<Home />} />
          <Route path="/slots" element={<Slots />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/supply" element={<Supply />} />
          <Route path="/drop-rejoin" element={<DropRejoin />} />
          <Route path="/classes" element={<Classes />} />
        </Route>
        <Route path="/print" element={<Printpage />} />

        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Fallback />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

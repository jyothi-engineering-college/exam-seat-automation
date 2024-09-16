import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Fallback from "./components/Fallback";
import Printpage from "./components/Printpage";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import AddForm from "./pages/dashboard/AddForm";
import Batches from "./pages/dashboard/Batches";
import DropRejoin from "./pages/dashboard/DropRejoin";
import ExamHalls from "./pages/dashboard/ExamHalls";
import Home from "./pages/dashboard/Home";
import Sharedlayout from "./pages/dashboard/SharedLayout";
import Slots from "./pages/dashboard/Slots";
import Subjects from "./pages/dashboard/Subjects";
import EditForm from "./pages/dashboard/EditForm";

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
          <Route path="/batches" element={<Batches />} />
          <Route path="/subjects" element={<Subjects />} />

          {/* <Route path="/supply" element={<Supply />} /> */}
          <Route path="/drop-rejoin" element={<DropRejoin />} />
          <Route path="/exam-halls" element={<ExamHalls />} />
          <Route path="/addform" element={<AddForm />} />
          <Route path="/editform" element={<EditForm />} />
        </Route>
        <Route path="/print" element={<Printpage />} />

        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Fallback />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

import { Routes, Route } from "react-router";
import "./App.css";
import PetDetail from "./pages/PetDetail";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pets/:id" element={<PetDetail />} />
        <Route path="/admin/stats" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;

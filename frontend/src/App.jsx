import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Register from "./page/Register";
import Dashboard from "./page/Dashboard";
import GenerateCertificate from "./page/GenerateCertificate";
import VerifyCertificate from "./page/VerifyCertificate";
import BulkUpload from "./page/BulkUpload";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/generate" element={<GenerateCertificate />} />
        <Route path="/verify" element={<VerifyCertificate />} />
        <Route path="/bulk-upload" element={<BulkUpload />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Homepage } from "./Pages/Homepage/Homepage";
import { About } from "./Pages/About";
import { SeminarPage } from "./Pages/SeminarPage";
import { AllSeminar } from "./Pages/AllSeminar";
import { Contact } from "./Pages/Contact";
import { AdminLogin } from "./Pages/Admin/AdminLogin";
import { AdminDashboard } from "./Pages/Admin/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/seminar/:id" element={<SeminarPage />} />
        <Route path="/all-seminar" element={<AllSeminar />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

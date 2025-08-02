// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import OpenSpaceList from "./components/OpenSpaceDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/openspace" element={<OpenSpaceList />} />
      </Routes>
    </Router>
  );
};

export default App;

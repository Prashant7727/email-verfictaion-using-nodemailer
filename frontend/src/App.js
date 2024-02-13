import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./components/signUp";
import Login from "./components/Login";
import Navbar from "./components/Navbar"; // Import Navbar component
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar /> {/* Use the Navbar component here */}
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/signup" element={<SignUp />} />

          {/* Other routes */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;

import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import EmployeeList from "./components/EmployeeList";
import ApprovalRequestList from "./components/ApprovalRequestList";
import LeaveRequestList from "./components/LeaveRequestList";
import ProjectList from "./components/ProjectList";
import Login from "./components/Login";
import { useNavigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/employees"
            element={<EmployeeList Loggeduser={user} />}
          />
          <Route
            path="/requests"
            element={<LeaveRequestList Loggeduser={user} />}
          />
          <Route
            path="/approvalrequests"
            element={<ApprovalRequestList Loggeduser={user} />}
          />
          <Route path="/projects" element={<ProjectList Loggeduser={user} />} />
          <Route path="/" element={<Login setUser={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

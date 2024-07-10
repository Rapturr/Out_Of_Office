import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import EmployeeList from "./components/EmployeeList";



function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/employees" element={<EmployeeList />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;

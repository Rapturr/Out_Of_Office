import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Navigator() {
  const navigate = useNavigate();

  const navto = (dest) => {
    navigate(dest);
  };
  return (
    <div className="navbar">
      <nav className="nav">
        <ul className="navlinks">
          <li>
            <a onClick={() => navto("/")}>Home</a>
          </li>
          <li>
            <a onClick={() => navto("/employees")}>employees</a>
          </li>
          <li>
            <a onClick={() => navto("/requests")}>requests</a>
          </li>
          <li>
            <a onClick={() => navto("/approvalrequests")}>approvalrequests</a>
          </li>
          <li>
            <a onClick={() => navto("/projects")}>projects</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navigator;

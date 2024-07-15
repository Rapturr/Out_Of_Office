import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navigator({ setUser }) {
  const navigate = useNavigate();

  const navto = (dest) => {
    navigate(dest);
  };

  return (
    <div>
      <nav>
        <ul>
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

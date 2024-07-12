import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const [ID, setID] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    //http://localhost:5000/
    try {
      const response = await axios.get(
        `http://localhost:5000/api/employees/${ID}`
      );
      console.log(response.data);
      if (response.data.message === "Login successful") {
        setUser(response.data.id);
        setUser(ID);
        navigate("/employees");
      } else {
        alert("Invalid ID");
      }
    } catch (error) {
      console.error("There was an error logging in!", error);
      alert("Failed to login");
    }
  };

  return (
    <div>
      <h1>Use your ID to Log In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            class="input"
            placeholder="ID"
            type="number"
            value={ID}
            onChange={(e) => setID(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TwitterLogo from "../../assets/images/twitter.svg";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const goToHomepage = () => {
    navigate("/Homepage");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    //"proxy": "http://localhost:5000", --> package.json
    try {
      const response = await axios.post("/login", {
        email,
        password,
      });
      console.log(response.data);
      if (response.data.message === "Login successful") {
        setUser(response.data.user);
        navigate("/dashboard");
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("There was an error logging in!", error);
      alert("Failed to login");
    }
  };

  return (
    <div>
      <h1 class="title" style={{ marginTop: "100px" }}>
        Sign in to Twitter
      </h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            class="input"
            placeholder="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            class="input"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          class="primary_button"
          style={{ marginTop: "50px" }}
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;

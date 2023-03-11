import React, { useContext, useState } from "react";
import "./RegisterPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function RegisterPage() {
  const { getLoggedIn } = useContext(AuthContext);
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:2000/register";
      await axios.post(url, data);
      await getLoggedIn();
      navigate("/");
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };
  return (
    <div className="auth">
      <form className="register" onSubmit={handleSubmit}>
        <h3>Get started</h3>
			<input
          type="text"
          placeholder="Username"
          name="username"
          onChange={handleChange}
          value={data.username}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
          value={data.email}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
          value={data.password}
          required
        />
        {error && <div className="error">{error}</div>}
        <button type="submit">Sing Up</button>
      </form>
    </div>
  );
}

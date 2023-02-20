import { useState } from "react";
import "./RegisterPage.css";
import axios from "axios";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState();
  const Data = {
    username: username,
    email: email,
    age: age,
    password: password,
  };
  const headers = {
    "Content-Type": "application/json",
  };
  const register = async ()=>{
    axios
    .post("http://localhost:8000/register", Data, { headers })
    .then((response) => {
      if (response.status === 200) {
        alert("registration successful");
      } else {
        alert("registration failed");
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
  }
  return (
    <div className="auth">
      <form className="register" onSubmit={register}>
        <h3>Get started</h3>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="number"
          placeholder="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Register</button>
      </form>
    </div>
  );
}

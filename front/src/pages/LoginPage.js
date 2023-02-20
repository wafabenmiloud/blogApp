import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import "./RegisterPage.css";
import axios from "axios";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const Data = {
    username: username,
    password: password,
  };
  const headers = {
    "Content-Type": "application/json",
  };
  async function login(ev) {
    ev.preventDefault();
    axios
    .post("http://localhost:8000/login", Data, { headers })
    .then((response) => {
      if (response.status === 200) {
        alert("welcome home");
        console.log(response.data)
        setUserInfo(response.data);
        sessionStorage.setItem('accessToken', `Bearer ${response.data.accessToken}`);
        sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
        setRedirect (true);
      } else {
        alert("wrong credentials");
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  
  return (
    <div className="auth">
      <form className="login" onSubmit={login}>
        <h3>Welcome back! Please log in</h3>

        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button>Login</button>
      </form>
    </div>
  );
}

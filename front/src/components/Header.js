import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { AiOutlineLogout } from "react-icons/ai";
import "./header.css";
import logo from "../assets/Amanda.png";
export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch("http://localhost:8000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch("http://localhost:8000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        <img src={logo} alt="logo" />
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create">
              <button>
                {" "}
                Make your opinion count
              </button>
            </Link>
            <AiOutlineLogout className="logout" onClick={logout} />
          </>
        )}
        {!username && (
          <>
            <Link className="link" to="/login">Login</Link>
            <Link className="link2"to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

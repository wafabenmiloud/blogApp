import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import { AiOutlineLogout } from "react-icons/ai";
import axios from "axios";

import "./header.css";
import logo from "../assets/Amanda.png";
export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    axios.get('http://localhost:8000/profile')
  .then(response => {
    setUserInfo(response.data);
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
  },[]);

  function logout() {
    axios.post('http://localhost:8000/logout');
    setUserInfo(null);
  }

  const username = userInfo?.username;
  console.log(username)

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

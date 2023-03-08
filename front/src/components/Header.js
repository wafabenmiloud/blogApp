import { AiOutlineLogout } from "react-icons/ai";
import axios from "axios";
import "./header.css";
import logo from "../assets/Amanda.png";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import  AuthContext  from "../context/AuthContext";

export default function Header() {
  const { loggedIn } = useContext(AuthContext);
  const { getLoggedIn } = useContext(AuthContext);

  const navigate = useNavigate();

  async function logout() {
    await axios.get("https://blog-1h1d.onrender.com/logout");

    await getLoggedIn();
    navigate("/");

     
  }

  return (
    <header>
      <Link to="/" className="logo">
        <img src={logo} alt="logo" />
      </Link>
      <nav>
        {!loggedIn && (
          <>
            <Link className="link" to="/login">
              Login
            </Link>
            <Link className="link2" to="/register">
              Register
            </Link>
          </>
        )}
        {loggedIn && (
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
      </nav>
    </header>
  );
}

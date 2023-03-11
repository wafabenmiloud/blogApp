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
  const { userInfo } = useContext(AuthContext);

  function Avatar(props) {
    const name = props.name || "";
    const initials = name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
  
    return (
      <div
        style={{
          display: "inline-block",
          width: props.size || 50,
          height: props.size || 50,
          borderRadius: "50%",
          backgroundColor: props.color || "#ccc",
          textAlign: "center",
          fontSize: 15,
          color: "#fff",
          fontWeight: "bold",
          lineHeight: props.size + "px",
          marginLeft: "2rem",
        }}
      >
        {initials}
      </div>
    );
  }
  
  const navigate = useNavigate();

  async function logout() {
    await axios.get("https://blog-app-c9lm.vercel.app/logout");

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
         <div>
      <Avatar size={45} color="#999" name={userInfo.username} />
    </div>
         <AiOutlineLogout className="logout" onClick={logout} />
       </>
        )}
      </nav>
    </header>
  );
}

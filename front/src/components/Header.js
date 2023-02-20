import { Link } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";

import "./header.css";
import logo from "../assets/Amanda.png";
export default function Header() {
  const user = localStorage.getItem("token");
  const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

  return (
    <header>
      <Link to="/" className="logo">
        <img src={logo} alt="logo" />
      </Link>
      <nav>
        {user && (
          <>
            <Link to="/create">
              <button>
                {" "}
                Make your opinion count
              </button>
            </Link>
            <AiOutlineLogout className="logout" onClick={handleLogout} />
          </>
        )}
        {!user && (
          <>
            <Link className="link" to="/login">Login</Link>
            <Link className="link2"to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

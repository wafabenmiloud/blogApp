import React from "react";
import logo from "../assets/Aman.png";
import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  return (
    <footer>
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>

        {" "}
        <span>
          We'd love to hear from you! Get in touch with us and share your
          thoughts and opinions on our blog. <br />
        </span>
    </footer>
  );
}

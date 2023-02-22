import axios from "axios";
import React from "react";
import "./App.css";
import {AuthContextProvider}   from "./context/AuthContext";
import Router from "./Router";

axios.defaults.withCredentials = true;

function App() {
  return (
    <AuthContextProvider>
    <Router/>
    </AuthContextProvider>
  );
}

export default App;

import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthContextProvider(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({id:"",username:"",email:"",iat:""})

  async function getLoggedIn() {
    const loggedInRes = await axios.get(
      "https://blog-1h1d.onrender.com/loggedIn"
    );

    setLoggedIn(loggedInRes.data.logged);
    setUserInfo(loggedInRes.data.data);
  }

  useEffect(() => {
    getLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, getLoggedIn, userInfo }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };
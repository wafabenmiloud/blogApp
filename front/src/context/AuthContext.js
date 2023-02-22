import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthContextProvider(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({user:"",iat:""})

  async function getLoggedIn() {
    const loggedInRes = await axios.get(
      "http://localhost:2000/loggedIn"
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
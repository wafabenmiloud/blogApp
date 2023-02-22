import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthContext from "./context/AuthContext";
import IndexPage from "./pages/IndexPage";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";

function Router() {
  const { loggedIn } = useContext(AuthContext);
  console.log( loggedIn )
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/post/:id" element={<PostPage />} />

            {!loggedIn && (
              <>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </>
            )}

            {loggedIn && (
              <>
                <Route path="/create" element={<CreatePost />} />
                <Route path="/edit/:id" element={<EditPost />} />
              </>
            )}
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default Router;

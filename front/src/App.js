import "./App.css";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { UserContextProvider } from "./UserContext";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";

function App() {
  const user = localStorage.getItem("token");

  return (
    <UserContextProvider>
      <Routes>
           <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {user &&
            ((<Route path="/create" element={<CreatePost />} />),
            (<Route path="/post/:id" element={<PostPage />} />),
            (<Route path="/edit/:id" element={<EditPost />} />))}
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;

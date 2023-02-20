import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../components/Editor";
import "./createpost.css";
import { ImFilePicture } from "react-icons/im";
import axios from "axios";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  async function createNewPost(ev) {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    ev.preventDefault();
    axios
      .post("http://localhost:8000/post", data)
      .then((response) => {
        if (response.ok) {
          setRedirect(true);
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <form className="createpost" onSubmit={createNewPost}>
      <input
        type="title"
        placeholder={"Title"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="summary"
        placeholder={"Summary"}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <label htmlFor="fileInput">
        <ImFilePicture
          style={{ fontSize: "1.5rem", margin: "1rem", cursor: "pointer" }}
        />
      </label>
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={(ev) => setFiles(ev.target.files)}
      />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: "5px", fontWeight: "bold" }}>
        Create post
      </button>
    </form>
  );
}

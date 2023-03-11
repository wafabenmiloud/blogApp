import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import Editor from "../components/Editor";
import "./createpost.css";
import { ImFilePicture } from "react-icons/im";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TagsInput } from "react-tag-input-component";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [tags, setTags] = useState([]);

  const navigate = useNavigate();

  async function createNewPost(ev) {
    const data = new FormData();
    data.set("title", title);
    data.set("tags", tags)
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    ev.preventDefault();
    await axios
      .post("https://blog-1h1d.onrender.com/post", data)
      .then((response) => {
        if (response.status === 200) {
          navigate('/');
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
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
      <div className="question-option">
              <div className="tags__title">
                <small>
                  Add up to 5 tags to describe what your question is about
                </small>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  data-role="tagsinput"
                  data-tag-trigger="Space"
                  type="text"
                  placeholder="e.g. (asp.net-mvc php react json)"
                />
                <TagsInput
                  value={tags}
                  onChange={setTags}
                  name="tags"
                  placeHolder="press enter to add new tag"
                />
              </div>
            </div>
      
      <button style={{ marginTop: "5px", fontWeight: "bold" }}>
        Create post
      </button>
    </form>
  );
}

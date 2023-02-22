import {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from "../components/Editor";
import "./createpost.css";
import { ImFilePicture } from "react-icons/im";
import axios from "axios";
export default function EditPost() {
  const {id} = useParams();
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [content,setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect,setRedirect] = useState(false);

  useEffect(() => {
    axios.get('https://blog-1h1d.onrender.com/post/'+id)
    .then(response => {
        setTitle(response.data.title);
        setContent(response.data.content);
        setSummary(response.data.summary);
    })
  .catch(error => {
    console.error('An error occurred:', error);
  });
  },[]);

  async function updatePost(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }
    axios.put('https://blog-1h1d.onrender.com/post', data)
  .then(response => {
    if (response.status === 200) {
      setRedirect(true);
    }
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
  }

  if (redirect) {
    return <Navigate to={'/post/'+id} />
  }

  return (
    <form className="createpost" onSubmit={updatePost}>
      <input type="title"
             placeholder={'Title'}
             value={title}
             onChange={ev => setTitle(ev.target.value)} />
      <input type="summary"
             placeholder={'Summary'}
             value={summary}
             onChange={ev => setSummary(ev.target.value)} />
              <label htmlFor="fileInput">
        <ImFilePicture  style={{ fontSize: "1.5rem", margin:"1rem", cursor:"pointer" }} />
      </label>
      <input type="file"
       id="fileInput"
       style={{ display: "none" }}
             onChange={ev => setFiles(ev.target.files)} />
      <Editor onChange={setContent} value={content} />
      <button style={{marginTop:'5px', fontWeight: "bold"}}>Update post</button>
    </form>
  );
}
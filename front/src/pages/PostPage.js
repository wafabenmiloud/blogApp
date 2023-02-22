import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import axios from "axios";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const {userInfo}= useContext(AuthContext);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:2000/post/${id}`)
      .then((response) => {
        setPostInfo(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  if (!postInfo) return "";

  return (
    <div className="post-page">
      <div className="image">
        <img src={`http://localhost:2000/${postInfo.cover}`} alt="" />
      </div>

      <h1>{postInfo.title}</h1>

      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>

      <div className="author">by @{postInfo.author.email}</div>
      {userInfo?.user === postInfo?.author._id && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            <FiEdit />
            Edit this post
          </Link>
        </div>
      )}

      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
}

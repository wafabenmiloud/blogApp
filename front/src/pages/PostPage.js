import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { AiFillDelete, AiFillLike, AiFillDislike } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './PostPage.css'
import {BsFillBookmarkPlusFill} from "react-icons/bs"
export default function PostPage() {
  
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  async function handleDelete(id) {
    try {
      const response = await axios.delete(`http://localhost:2000/post/${id}`);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }
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
  const handleComment = async () => {
    if (comment !== "") {
      const body = {
        post_id: postInfo._id,
        comment: comment,
        author: userInfo.id,
      };
      await axios.post(`http://localhost:2000/comment/${postInfo._id}`, body).then((res) => {
        setComment("");
        setShow(false);
        // getUpdatedAnswer();
        // console.log(res.data);
      });
    }
        // setShow(true)
  };
  return (
    <>
    <div className="post-page">
      
      <div className="image">
        <img src={`http://localhost:2000/${postInfo.cover}`} alt="" />
      </div>

      <h1>{postInfo.title}</h1>

      <div className="rrow">
         
        <div className="rrow">
        <div className="info">
            <p>
              <time className="author1">
                {formatISO9075(new Date(postInfo.createdAt))}
              </time>
            </p>
            <div className="author1">@{postInfo.author?.username}</div>
            
          </div>
          {userInfo?.id === postInfo?.author?._id && (

            <div className="edit-row">
               
              <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                <FiEdit size={25}/>
              </Link>
              <Link className="edit-btn">
                <AiFillDelete size={25}  onClick={() => handleDelete(postInfo._id)} />
              </Link>
            </div>
          )}
        </div>
          <div>
          <AiFillLike size={35} className="edit-btn" />
               <AiFillDislike size={35} className="edit-btn"/>
                <BsFillBookmarkPlusFill size={35} className="edit-btn"/>
          </div>
          
      </div>

             
  <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
    
    <div className="comments">
                <div className="comment">
                  {postInfo?.comments &&
                    postInfo?.comments.map((_qd) => (
                      <p key={_qd?._id}>
                        {_qd.comment}{" "}
                        <span>
                          - {_qd.author}
                        </span>{" "}
                      </p>
                    ))}
                </div>
                <p onClick={() => setShow(!show)}>Add a comment</p>
                {show && (
                  <div className="title">
                    <textarea
                      style={{
                        margin: "5px 0px",
                        padding: "10px",
                        border: "1px solid rgba(0, 0, 0, 0.2)",
                        borderRadius: "3px",
                        outline: "none",
                      }}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      type="text"
                      placeholder="Add your comment..."
                      rows={5}
                      cols={100}
                    />
                    <button className="comment__button"
                      onClick={handleComment}
                    >
                      Add comment
                    </button>
                  </div>
                )}
              </div>
    </>
      
  );
}

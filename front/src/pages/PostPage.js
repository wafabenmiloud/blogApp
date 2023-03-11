import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { AiFillDelete, AiFillLike, AiFillDislike } from "react-icons/ai";
import { BsFillBookmarkPlusFill } from "react-icons/bs";

import AuthContext from "../context/AuthContext";
import "./PostPage.css";
import Editor from "../components/Editor";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [comment, setComment] = useState("");
  const [answer, setAnswer] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  //fetch post info
  useEffect(() => {
    axios
      .get(`https://blog-1h1d.onrender.com/post/${id}`)
      .then((response) => {
        setPostInfo(response.data);
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, [postInfo]);

  //delete post
  async function handleDelete(id) {
    try {
      const response = await axios.delete(`https://blog-1h1d.onrender.com/post/${id}`);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  //add comment
  const handleComment = async () => {
    if (comment !== "") {
      const body = {
        post_id: postInfo._id,
        comment: comment,
        author: userInfo.id,
      };
      await axios
        .post(`https://blog-1h1d.onrender.com/comment/${postInfo._id}`, body)
        .then((res) => {
          setComment("");
          setShow(false);
          // getUpdatedAnswer();
          // console.log(res.data);
        });
    }
    // setShow(true)
  };

  //handle answer
  const handleQuill = (value) => {
    setAnswer(value);
  };

  async function getUpdatedAnswer() {
    await axios
      .get(`/api/post/${id}`)
      .then((res) => setPostInfo(res.data[0]))
      .catch((err) => console.log(err));
  }
  //add answer
  const handleSubmit = async () => {
    const body = {
      post_id: postInfo._id,
      answer: answer,
      user: userInfo.id,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios
      .post('https://blog-1h1d.onrender.com/answer', body, config)
      .then(() => {
        setAnswer("");
        // getUpdatedAnswer();
      })
      .catch((err) => console.log(err));
  };
  if (!postInfo) return "";
  return (
    <>
      <div className="post-page">
        <div className="image">
          <img src={`https://blog-1h1d.onrender.com/${postInfo?.cover}`} alt="" />
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
                  <FiEdit size={25} />
                </Link>
                <Link className="edit-btn">
                  <AiFillDelete
                    size={25}
                    onClick={() => handleDelete(postInfo._id)}
                  />
                </Link>
              </div>
            )}
          </div>
          <div>
            <AiFillLike size={35} className="edit-btn" />
            <AiFillDislike size={35} className="edit-btn" />
            <BsFillBookmarkPlusFill size={35} className="edit-btn" />
          </div>
        </div>

        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: postInfo.content }}
        />
      </div>

      <div className="comments">
        <div className="comment">
          {postInfo.comments &&
            postInfo.comments.map((_qd) => (
              <p key={_qd?._id}>
                {_qd.comment} <span>- {_qd.author.username}</span>{" "}
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
              placeholder="..."
              rows={5}
              cols={100}
            />
            <button className="comment__button" onClick={handleComment}>
              Add comment
            </button>
          </div>
        )}
      </div>



      <div className="all-questions">
        <h2>{postInfo && postInfo.answers.length} Answers</h2>
        {postInfo?.answers.map((_q) => (
          <>
            <div key={_q._id} className="all-questions-container">
              {/* <div className="all-questions-left">
                <div className="all-options">
                  <p className="arrow">▲</p>

                  <p className="arrow">0</p>

                  <p className="arrow">▼</p>

                  <BsFillBookmarkPlusFill />
                </div>
              </div> */}
              <div className="question-answer">
                <div dangerouslySetInnerHTML={{ __html: _q.answer }}></div>

                <div className="author1">
                  <small>
                    {new Date(_q.created_at).toLocaleString()}
                  </small>
                  <div className="auth-details">
                    <small>
                      {_q?.author?.username}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>











      <div>
        <div className="main-answer">
          <h4>Your Answer</h4>
          <Editor value={answer} onChange={handleQuill} />
        </div>

        <button
          onClick={handleSubmit}
          className="comment__button"
          style={{ marginTop: "10px" }} >Post your answer
        </button>
        
      </div>
    </>
  );
}

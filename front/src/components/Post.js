import { formatISO9075 } from "date-fns";
import {
  AiFillDelete,
  AiFillLike,
  AiFillDislike,
  AiFillEye,
} from "react-icons/ai";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./post.css";
import axios from "axios";
import AuthContext from "../context/AuthContext";

export default function Post({
  _id,
  title,
  summary,
  cover,
  content,
  views,
  likes,
  dislikes,
  tags,
  createdAt,
  author,
}) {
  const [postViews, setPostViews] = useState(views);
  const { userInfo } = useContext(AuthContext);
  const [liked, setLiked] = useState(likes.includes(userInfo?.id));
  const [disliked, setDisliked] = useState(dislikes.includes(userInfo?.id));
  const [numLikes, setNumLikes] = useState(likes.length);
  const [numDislikes, setNumDislikes] = useState(dislikes.length);

  const incrementViews = () => {
    axios.get(`https://blog-1h1d.onrender.com/post/${_id}/views`).then((response) => {
      setPostViews(response.data);
    });
  };
  const toggleLike = () => {
    axios.post(`https://blog-1h1d.onrender.com/post/${_id}/like`).then((response) => {
      const { likes, dislikes } = response.data;
      setLiked(likes.includes(userInfo?.id));
      setDisliked(dislikes.includes(userInfo?.id));
      setNumLikes(likes.length);
      setNumDislikes(dislikes.length);
    });
  };

  const toggleDislike = () => {
    axios.post(`https://blog-1h1d.onrender.com/post/${_id}/dislike`).then((response) => {
      const { likes, dislikes } = response.data;
      setLiked(likes.includes(userInfo.id));
      setDisliked(dislikes.includes(userInfo.id));
      setNumLikes(likes.length);
      setNumDislikes(dislikes.length);
    });
  };

  return (
    <div className="home">
      <div className="posts">
        <div className="post">
          <div>
            <Link
              className="title__link"
              to={`/post/${_id}`}
              onClick={incrementViews}
            >
              <h1>{title}</h1>
            </Link>
          </div>

          <div className="content__row">
            <div className="all-questions-left">
              <div className="all-options">
                <div>{numLikes}
                  {liked ? (<AiFillLike onClick={toggleLike} className="like-btn" color="green" />):(<AiFillLike onClick={toggleLike} className="like-btn" />)}
                </div>
                <div>{numDislikes}
                
                {disliked ? ( <AiFillDislike
                    onClick={toggleDislike}
                    className="like-btn"
                    color="red"
                  />): ( <AiFillDislike
                    onClick={toggleDislike}
                    className="like-btn"
                  />)}
                </div>
                {/* <div className="all-option">
                  <p>0 answers</p>
                </div> */}
                <div>
                  {postViews}
                  <AiFillEye style={{fontSize:'1.5rem',color:'#222'}}/>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="content">
                <p className="summary">{summary}</p>

                <ul className="taggs">
                  {tags[0].split(",").map((tag, ind) => (
                    <li className="tagg" key={ind}>
                      {tag.trim()}
                    </li>
                  ))}
                </ul>
              </div>

              {/* <div className="image">
                <img src={"https://blog-1h1d.onrender.com/" + cover} alt="" />
              </div> */}
            </div>
          </div>
        </div>
        <div className="info">
          <h4 className="author">@{author?.username}</h4>
          <time className="author">
            Created at {formatISO9075(new Date(createdAt))}
          </time>
        </div>
      </div>
    </div>
  );
}

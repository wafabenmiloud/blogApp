import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import "./post.css";
export default function Post({
  _id,
  title,
  summary,
  cover,
  content,
  tags,
  createdAt,
  author,
  
}) {
  return (
    <div className="home">
      <div className="posts">
        <div className="post">
          <div>
            <Link className="title__link" to={`/post/${_id}`}>
              <h1>{title}</h1>
            </Link>
          </div>

          <div className="content__row">
          <div className="all-questions-left">
              <div className="all-options">
                <div className="all-option">
                  <p>
                    0 votes
                  </p>
                </div>
                <div className="all-option">
                  <p>
                    0 answers
                  </p>
                </div>
                <div className="all-option">
                  <p>2 views</p>
                </div>
              </div>
            </div>
           <div className="column">
           <div className="content">
              <p className="summary">{summary}</p>
              
                  <ul className="tags">
                    {tags.map((tag, index) => {
                      return (
                        <li className="tag" key={index}>
                          {tag}
                        </li>
                      );
                    })}
                  </ul>
                
            </div>

            <div className="image">
              <img src={"https://blog-1h1d.onrender.com/" + cover} alt="" />
            </div>
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

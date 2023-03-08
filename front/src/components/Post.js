import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import "./post.css";
export default function Post({
  _id,
  title,
  summary,
  cover,
  content,
  createdAt,
  author,
}) {
  return (
    <div className="home">
      <div className="posts">
        <div className="post">
          <div className="image">
            <img src={"http://localhost:2000/" + cover} alt="" />
          </div>

          <div className="content">
            <div>
              <h1>{title}</h1>
              <div className="info">
                <h4 className="author">
                  @{author.email}
                  <br />
                  <time className="author">
                    Created at {formatISO9075(new Date(createdAt))}
                  </time>
                </h4>
              </div>
            </div>

            <p className="summary">{summary}</p>

            <Link to={`/post/${_id}`}>
              <h6>See more...</h6>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

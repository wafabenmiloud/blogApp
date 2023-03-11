import axios from "axios";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import {BsFilter} from "react-icons/bs";
import ScrollToTopButton from "../components/ScrollToTopButton";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [searchedPosts, setSearchedPosts] = useState(null); // initialize with null
  const [currentPage, setCurrentPage] = useState(1);

  //pagination
  const postsPerPage = 5;

  useEffect(() => {
    axios
      .get("http://localhost:2000/post")
      .then((response) => {
        setPosts(response.data);
        setSearchedPosts(response.data); // update searchedPosts after fetching data
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }, []);

  const searchPosts = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm.trim() === "") {
      setSearchedPosts(posts);
    } else {
      setSearchedPosts(
        posts.filter((post) => {
          const postTags = post.tags.map((tag) => tag.toLowerCase());
          return (
            post.title.toLowerCase().includes(searchTerm) ||
            post.summary.toLowerCase().includes(searchTerm) ||
            postTags.some((tag) => tag.includes(searchTerm))
          );
        })
      );
    }
  };
  
  
  // calculate pages count based on searchedPosts
  const pagesCount = searchedPosts ? Math.ceil(searchedPosts.length / postsPerPage) : 0;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const postsToShow = searchedPosts ? searchedPosts.slice(startIndex, endIndex) : [];
  return (
    <div>
      <div className="main-desc">
        <p>{searchedPosts?.length} Posts </p>
        <div className="main-filter">
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => searchPosts(e)}
          />
          {/* <div className="main-filter-item">
            <BsFilter size={20} />
          </div> */}
        </div>
      </div>
      {searchedPosts && searchedPosts.length > 0 ? (
        postsToShow.map((post) => <Post key={post._id} {...post} />)
      ) : (
        <p>{searchedPosts === null ? "Loading..." : "No posts were found."}</p>
      )}

<div className="pagination">
  {Array.from({ length: pagesCount }, (_, i) => (
    <button
      key={i}
      onClick={() => handlePageChange(i + 1)}
      disabled={currentPage === i + 1}
      className={currentPage === i + 1 ? "active" : ""}>{i + 1}</button>
  ))}
</div>
<ScrollToTopButton />


    </div>
  );
}

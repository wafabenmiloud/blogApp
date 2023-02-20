import axios from "axios";
import Post from "../components/Post";
import {useEffect, useState} from "react";

export default function IndexPage() {
  const [posts,setPosts] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:8000/post')
  .then(response => {
      setPosts(response.data);
    })
  .catch(error => {
    console.error('An error occurred:', error);
  });
  }, []);
  return (
    <>
      {posts.length > 0 && posts.map(post => (
        <Post {...post} />
      ))}
    </>
  );
}
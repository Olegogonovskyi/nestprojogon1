import {useEffect, useState} from "react";
import axios from "axios";

const App = () => {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    axios.get('/api/posts?limit=10&offset=0').then(({data})=>console.log(data))
  }, []);
  return (
    <div>
      <h1>posts:</h1>
      {/*{posts.map(post=><div>{JSON.stringify(post)}</div> )}*/}
    </div>
  );
};

export {App};

import React from "react";
import {Route, Routes} from "react-router-dom";
import Info from "./info/Info";
import Blog from "./blog/Blog";

function App() {
  return (
    <Routes>
      <Route path="*" element={<Info/>}/>
      <Route path="/blog" element={<Blog/>}/>
    </Routes>
  );
}

export default App;

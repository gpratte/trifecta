import React from "react";
import {Route, Routes} from "react-router-dom";
import Info from "./info/Info";
import Blog from "./blog/Blog";
import League from "./poker/league/components/League"

function App() {
  return (
    <Routes>
      <Route path="*" element={<Info/>}/>
      <Route path="/blog" element={<Blog/>}/>
      <Route path="/poker/*" element={<League/>}/>
    </Routes>
  );
}

export default App;

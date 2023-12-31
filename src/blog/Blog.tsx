import "./blog.css"
import React from "react";
import ReactHtmlParser from "react-html-parser";
import {blogEntries} from "./blogData";

function Blog() {

  return (
    <>
      <div className="blog-header">
        <h2>Full Stack Software Development Blog</h2>
      </div>
      <div className="blog-message">
        Full Stack Software Development Blog
        The complete lifecycle for a fullstack software development project. Agile user stories. UI mockups. API
        definitions. Mock APIs. TDD/BDD. DevOps. Back end Java Spring Boot. Front end React with Redux.
      </div>
      <div className="blog-main">
        {blogEntries.map(entry => {
          return (
            <>
              <h1 style={{textAlign: "center", marginTop: 30}}>{entry.header}</h1>
              <p style={{textAlign: "center"}}>{entry.createdAt}</p>
              {entry.body.map(body =>
                ReactHtmlParser(body)
              )}
            </>
          )
        })}
      </div>
    </>
  )
}

export default Blog;
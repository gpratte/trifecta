import "./blog.css"
import React, {useState} from "react";
import ReactHtmlParser from "react-html-parser";
import {BlogData, blogEntries} from "./blogData";
import BlogNavigation from "./BlogNavigation";
import Footer from "./BlogFooter";

export enum EntiesPerPage {
  FIVE = 5,
  TEN = 10,
  TWENTY_FIVE = 25,
  FIFTY = 50
}

function Blog() {
  const [page, setPage] = useState(1);
  const [numPerPage, setNumPerPage] = useState(EntiesPerPage.TEN);

  const getEntriesForPage = ():Array<BlogData> => {
    return blogEntries.slice((page - 1) * numPerPage, page * numPerPage);
  }

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
      <BlogNavigation numEntries={blogEntries.length}
                      page={page}
                      setPage={setPage}
                      numPerPage={numPerPage}
                      setNumPerPage={setNumPerPage}/>
      <div className="blog-main">
        {getEntriesForPage().map(entry => {
          return (
            <>
              <h1 style={{textAlign: "center", marginTop: 50}}>{entry.header}</h1>
              <p style={{textAlign: "center"}}>{entry.createdAt}</p>
              {ReactHtmlParser(entry.body)}
              <hr/>
            </>
          )
        })}
      </div>
      <BlogNavigation numEntries={blogEntries.length}
                      page={page}
                      setPage={setPage}
                      numPerPage={numPerPage}
                      setNumPerPage={setNumPerPage}/>
      <Footer />
    </>
  )
}

export default Blog;
import React from "react";
import "./article.scss";
import mock from "../../assets/image/67ba400c9648dd03c33976d6c69dd83d.jpg";

const Article2 = ({ article, articleRef }) => {
  return (
    <article className="article" ref={articleRef}>
      <div className="article-top">
        <h1>{article.title}</h1>
        <span>{new Date(article.date).toLocaleDateString()}</span>
        <span>{article.autor}</span>
        <div className="article-top_image">
          <img src={mock} alt="#" />
        </div>
      </div>

      <p>{article.post - body}</p>
    </article>
  );
};

export default Article2;

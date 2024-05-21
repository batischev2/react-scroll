import React from "react";
import "./article.scss";

const Article = ({ article, articleRef }) => {
  return (
    <div className="article" ref={articleRef}>
      <h2>{article.title}</h2>
      <h5>{new Date(article.publishedAt).toLocaleDateString()}</h5>
      <p>{article.description}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <p>{article.content}</p>
      <div className="article-image">
        <img src={article.urlToImage} alt="#" />
      </div>
    </div>
  );
};

export default Article;

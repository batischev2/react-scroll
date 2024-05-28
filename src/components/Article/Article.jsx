import React from "react";
import "./article.scss";
import mock from "../../assets/image/67ba400c9648dd03c33976d6c69dd83d.jpg";

const Article = ({ article, articleRef }) => {
  return (
    <article className="article" ref={articleRef}>
      <div className="article-top">
        <h1>{article.title}</h1>
        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
        <div className="article-top_image">
          <img src={mock} alt="#" />
        </div>
      </div>

      <p>
        {article.body} Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Aut voluptatum maxime cupiditate asperiores iusto labore, rerum
        eligendi, praesentium iste doloribus modi eos tempore eum ex nobis
        earum, explicabo sapiente mollitia?
      </p>
      <p>
        {article.body} Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Aut voluptatum maxime cupiditate asperiores iusto labore, rerum
        eligendi, praesentium iste doloribus modi eos tempore eum ex nobis
        earum, explicabo sapiente mollitia?
      </p>
      <p>
        {article.body} Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Aut voluptatum maxime cupiditate asperiores iusto labore, rerum
        eligendi, praesentium iste doloribus modi eos tempore eum ex nobis
        earum, explicabo sapiente mollitia?
      </p>
      <p>
        {article.body} Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Aut voluptatum maxime cupiditate asperiores iusto labore, rerum
        eligendi, praesentium iste doloribus modi eos tempore eum ex nobis
        earum, explicabo sapiente mollitia?
      </p>
      <p>
        {article.body} Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Aut voluptatum maxime cupiditate asperiores iusto labore, rerum
        eligendi, praesentium iste doloribus modi eos tempore eum ex nobis
        earum, explicabo sapiente mollitia?
      </p>
      <p>
        {article.body} Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Aut voluptatum maxime cupiditate asperiores iusto labore, rerum
        eligendi, praesentium iste doloribus modi eos tempore eum ex nobis
        earum, explicabo sapiente mollitia?
      </p>
      <p>
        {article.body} Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Aut voluptatum maxime cupiditate asperiores iusto labore, rerum
        eligendi, praesentium iste doloribus modi eos tempore eum ex nobis
        earum, explicabo sapiente mollitia?
      </p>
      <p>
        {article.body} Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Aut voluptatum maxime cupiditate asperiores iusto labore, rerum
        eligendi, praesentium iste doloribus modi eos tempore eum ex nobis
        earum, explicabo sapiente mollitia?
      </p>
      <p>
        {article.body} Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Aut voluptatum maxime cupiditate asperiores iusto labore, rerum
        eligendi, praesentium iste doloribus modi eos tempore eum ex nobis
        earum, explicabo sapiente mollitia?
      </p>
      <p>
        {article.body} Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Aut voluptatum maxime cupiditate asperiores iusto labore, rerum
        eligendi, praesentium iste doloribus modi eos tempore eum ex nobis
        earum, explicabo sapiente mollitia?
      </p>
      <p>
        {article.body} Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Aut voluptatum maxime cupiditate asperiores iusto labore, rerum
        eligendi, praesentium iste doloribus modi eos tempore eum ex nobis
        earum, explicabo sapiente mollitia?
      </p>
      <p>
        {article.body} Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Aut voluptatum maxime cupiditate asperiores iusto labore, rerum
        eligendi, praesentium iste doloribus modi eos tempore eum ex nobis
        earum, explicabo sapiente mollitia?
      </p>
      <p>
        {article.body} Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Aut voluptatum maxime cupiditate asperiores iusto labore, rerum
        eligendi, praesentium iste doloribus modi eos tempore eum ex nobis
        earum, explicabo sapiente mollitia?
      </p>
      <p>
        {article.body} Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Aut voluptatum maxime cupiditate asperiores iusto labore, rerum
        eligendi, praesentium iste doloribus modi eos tempore eum ex nobis
        earum, explicabo sapiente mollitia?
      </p>
      <p>
        {article.body} Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Aut voluptatum maxime cupiditate asperiores iusto labore, rerum
        eligendi, praesentium iste doloribus modi eos tempore eum ex nobis
        earum, explicabo sapiente mollitia?
      </p>
      <p>
        {article.body} Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Aut voluptatum maxime cupiditate asperiores iusto labore, rerum
        eligendi, praesentium iste doloribus modi eos tempore eum ex nobis
        earum, explicabo sapiente mollitia?
      </p>
      <p>
        {article.body} Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        Aut voluptatum maxime cupiditate asperiores iusto labore, rerum
        eligendi, praesentium iste doloribus modi eos tempore eum ex nobis
        earum, explicabo sapiente mollitia?
      </p>
    </article>
  );
};

export default Article;

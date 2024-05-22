import React from "react";
import "./article.scss";
import mock from "../../assets/image/67ba400c9648dd03c33976d6c69dd83d.jpg";

const Article = ({ article, articleRef }) => {
  return (
    <div className="article" ref={articleRef}>
      <h2>{article.title}</h2>
      <h5>{new Date(article.publishedAt).toLocaleDateString()}</h5>
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
      <div className="article-image">
        <img src={mock} alt="#" />
      </div>
    </div>
  );
};

export default Article;

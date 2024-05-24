import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./test.scss";
import Article from "../Article/Article";

const Test7 = () => {
  const [articlesArray, setArticlesArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [articleSelect, setArticleSelect] = useState(null);
  const [idArticleVisible, setIdArticleVisible] = useState(1);
  const itemsRef = useRef([]);

  const updateItemsRef = (index) => (element) => {
    itemsRef.current[index] = element;
  };

  const getIdFromUrl = () => {
    const path = window.location.pathname;
    const pathParts = path.split("/");
    const id = parseInt(pathParts[pathParts.length - 1], 10);
    const savedId = localStorage.getItem("idArticleVisible");
    return savedId ? parseInt(savedId, 10) : isNaN(id) ? 1 : id;
  };

  const fetchArticleById = async (id) => {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
    return response.data;
  };

  const loadInitialArticles = async (initialId) => {
    const initialArticle = await fetchArticleById(initialId);
    setArticlesArray([initialArticle]);
    setCurrentPage(initialId + 1);
  };

  useEffect(() => {
    const initialId = getIdFromUrl();
    setIdArticleVisible(initialId);
    loadInitialArticles(initialId);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const visibleArticles = itemsRef.current.find((item, index) => {
        const rect = item.getBoundingClientRect();
        if (
          rect.top < window.innerHeight &&
          rect.bottom >= window.innerHeight / 2
        ) {
          setArticleSelect(item);
          setIdArticleVisible(index + 1);
          localStorage.setItem("idArticleVisible", index + 1);
          return true;
        }
        return false;
      });
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (idArticleVisible) {
      const newUrl = `/page/test/${idArticleVisible}`;
      window.history.pushState(null, "", newUrl);
    }
  }, [idArticleVisible]);

  useEffect(() => {
    if (articleSelect) {
      const fetchNextArticle = async () => {
        const nextArticle = await fetchArticleById(currentPage);
        setArticlesArray((prevArticles) => [...prevArticles, nextArticle]);
        setCurrentPage((prevPage) => prevPage + 1);
      };
      fetchNextArticle();
    }
  }, [articleSelect]);

  return (
    <div className="test">
      {articlesArray.map((item, key) => (
        <Article article={item} key={key} articleRef={updateItemsRef(key)} />
      ))}
    </div>
  );
};

export default Test7;

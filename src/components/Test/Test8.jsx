import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./test.scss";
import Article from "../Article/Article";

const Test8 = () => {
  const [articlesArray, setArticlesArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [articleSelect, setArticleSelect] = useState(null);
  const [idArticleVisible, setIdArticleVisible] = useState(null);
  const itemsRef = useRef([]);

  const updateItemsRef = (index) => (element) => {
    itemsRef.current[index] = element;
  };

  const getIdFromUrl = () => {
    const path = window.location.pathname;
    const pathParts = path.split("/");
    const id = parseInt(pathParts[pathParts.length - 1], 10);
    return isNaN(id) ? 1 : id;
  };

  const fetchArticleById = (id) => {
    return axios
      .get(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((res) => res.data);
  };

  const loadInitialArticles = async (initialId) => {
    const initialArticles = [];
    for (let i = initialId; i < initialId + 5; i++) {
      const article = await fetchArticleById(i);
      initialArticles.push(article);
    }
    setArticlesArray(initialArticles);
    setCurrentPage(initialId + initialArticles.length);
  };

  useEffect(() => {
    const initialId = getIdFromUrl();
    setIdArticleVisible(initialId);
    loadInitialArticles(initialId);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const visibleArticleIndex = itemsRef.current.findIndex((item) => {
        if (!item) return false;
        const rect = item.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom >= 0;
      });

      if (
        visibleArticleIndex !== -1 &&
        visibleArticleIndex + 1 !== idArticleVisible
      ) {
        setIdArticleVisible(visibleArticleIndex + 1);
        localStorage.setItem("idArticleVisible", visibleArticleIndex + 1);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [idArticleVisible]);

  useEffect(() => {
    if (idArticleVisible) {
      const newUrl = `/page/test/${idArticleVisible}`;
      window.history.pushState(null, "", newUrl);
    }
  }, [idArticleVisible]);

  useEffect(() => {
    if (articleSelect) {
      axios
        .get(`https://jsonplaceholder.typicode.com/posts/${currentPage}`)
        .then((res) => {
          setArticlesArray((prevArticles) => [...prevArticles, res.data]);
          setCurrentPage(currentPage + 1);
        });
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

export default Test8;

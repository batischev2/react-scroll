import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./test.scss";
import Article from "../Article/Article";

const Test9 = () => {
  //массив, куда я записываю все последующие статьи
  const [articlesArray, setArticlesArray] = useState([]);
  // id следующей запрашиваемой статьи
  const [currentPage, setCurrentPage] = useState(1);
  // id текущей видимой статьи для url
  const [idArticleVisible, setIdArticleVisible] = useState(1);
  // ссылки на статьи в DOM дереве
  const itemsRef = useRef([]);

  // Записываем в массив itemsRef ссылку в DOM дереве на каждую статью
  const updateItemsRef = (index) => (element) => {
    itemsRef.current[index] = element;
  };

  // Функция для извлечения id из URL
  const getIdFromUrl = () => {
    const path = window.location.pathname;
    const pathParts = path.split("/");
    const id = parseInt(pathParts[pathParts.length - 1], 10);
    const savedId = localStorage.getItem("idArticleVisible");
    return savedId ? parseInt(savedId, 10) : isNaN(id) ? 1 : id;
  };

  //запрос на получение статьи по id
  const fetchArticleById = async (id) => {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
    return response.data;
  };

  // Загрузка начальной статьи
  const loadInitialArticle = async (initialId) => {
    const article = await fetchArticleById(initialId);
    setArticlesArray([article]);
    setCurrentPage(initialId + 1);
  };

  useEffect(() => {
    const initialId = getIdFromUrl();
    setIdArticleVisible(initialId);
    loadInitialArticle(initialId);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const visibleArticles = itemsRef.current.find((item, index) => {
        const rect = item.getBoundingClientRect();
        if (
          rect.top < window.innerHeight &&
          rect.bottom >= window.innerHeight / 2
        ) {
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
      //первый вариант
      const newUrl = `/page/test/${idArticleVisible}`;
      window.history.pushState(null, "", newUrl);
    }
  }, [idArticleVisible]);

  useEffect(() => {
    if (articlesArray.length && idArticleVisible === articlesArray.length) {
      const fetchNextArticle = async () => {
        const nextArticle = await fetchArticleById(currentPage);
        setArticlesArray((prevArticles) => [...prevArticles, nextArticle]);
        setCurrentPage((prevPage) => prevPage + 1);
      };
      fetchNextArticle();
    }
  }, [idArticleVisible, articlesArray.length]);

  return (
    <div className="test">
      {articlesArray.map((item, key) => (
        <Article article={item} key={key} articleRef={updateItemsRef(key)} />
      ))}
    </div>
  );
};

export default Test9;

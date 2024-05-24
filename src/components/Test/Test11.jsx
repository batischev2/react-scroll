import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./test.scss";
import Article from "../Article/Article";

const Test11 = () => {
  // Массив для хранения загруженных статей
  const [articlesArray, setArticlesArray] = useState([]);
  // ID следующей запрашиваемой статьи
  const [currentPage, setCurrentPage] = useState(1);
  // ID текущей видимой статьи для URL
  const [idArticleVisible, setIdArticleVisible] = useState(null);
  // Количество неудачных попыток запроса
  const [errorCount, setErrorCount] = useState(0);
  //Флаг, чтобы прекратить слать запросы после 100 неудачных попыток
  const [hasMoreArticles, setHasMoreArticles] = useState(true);
  // Ссылки на статьи в DOM дереве
  const itemsRef = useRef([]);

  // Функция для обновления itemsRef, которая сохраняет ссылку на DOM элемент статьи.
  const updateItemsRef = (index) => (element) => {
    itemsRef.current[index] = element;
  };

  //Извлечение ID статьи из URL и, если доступно, возвращение ID из localStorage.
  const getIdFromUrl = () => {
    const path = window.location.pathname;
    const pathParts = path.split("/");
    const id = parseInt(pathParts[pathParts.length - 1], 10);
    const savedId = localStorage.getItem("idArticleVisible");
    return savedId ? parseInt(savedId, 10) : isNaN(id) ? 1 : id;
  };

  //Функция для запроса статьи по ID
  const fetchArticleById = async (id) => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  //Загрузка начальной статьи, и установка текущего состояния.
  const loadInitialArticle = async (initialId) => {
    const article = await fetchArticleById(initialId);
    setArticlesArray([article]);
    setCurrentPage(initialId + 1);
  };

  //Начальная загрузка статьи
  useEffect(() => {
    const initialId = getIdFromUrl();
    setIdArticleVisible(initialId);
    loadInitialArticle(initialId);
  }, []);

  //обработчик прокрутки, который обновляет видимую статью и сохраняет ее ID в localStorage
  useEffect(() => {
    const handleScroll = () => {
      const visibleArticleIndex = itemsRef.current.findIndex((item) => {
        const rect = item.getBoundingClientRect();
        return (
          rect.top < window.innerHeight && rect.bottom >= window.innerHeight / 2
        );
      });
      if (visibleArticleIndex !== -1) {
        setIdArticleVisible(visibleArticleIndex + 1);
        localStorage.setItem("idArticleVisible", visibleArticleIndex + 1);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // изменение URL при изменении видимой статьи
  useEffect(() => {
    if (idArticleVisible) {
      const newUrl = `/page/test/${idArticleVisible}`;
      window.history.replaceState(null, "", newUrl);
    }
  }, [idArticleVisible]);

  //Функция для запроса следующей статьи:
  const fetchNextArticle = async () => {
    // Останавливаем выполнение, если больше нет статей для запроса
    if (!hasMoreArticles) {
      return;
    }
    let success = false;
    let nextArticle = null;
    let nextPage = currentPage;

    while (!success && errorCount < 100) {
      try {
        nextArticle = await fetchArticleById(nextPage);
        success = true;
      } catch (error) {
        nextPage += 1;
      }
    }

    if (success && nextArticle) {
      setArticlesArray((prevArticles) => [...prevArticles, nextArticle]);
      setCurrentPage(nextPage + 1);
      setErrorCount(0);
    } else if (errorCount >= 100) {
      setHasMoreArticles(false);
    }
  };

  //запрос следующей статьи, если видимая статья - последняя в массиве
  useEffect(() => {
    if (
      idArticleVisible !== null &&
      idArticleVisible === articlesArray.length &&
      articlesArray.length > 0
    ) {
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

export default Test11;

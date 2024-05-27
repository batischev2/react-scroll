import axios from "axios";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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

  const [previousVisibleIndex, setPreviousVisibleIndex] = useState(null);

  // Функция для обновления itemsRef, которая сохраняет ссылку на DOM элемент статьи.
  const updateItemsRef = (index) => (element) => {
    itemsRef.current[index] = element;
  };

  //Извлечение ID статьи из URL и, если доступно, возвращение ID из localStorage.
  const getIdFromUrl = () => {
    const path = window.location.pathname;
    const pathParts = path.split("/");
    const id = parseInt(pathParts[pathParts.length - 1], 10);

    if (!isNaN(id)) {
      return id;
    }

    const savedId = localStorage.getItem("idArticleVisible");
    return savedId ? parseInt(savedId, 10) : 1;
  };

  //Функция для запроса статьи по ID
  const fetchArticleById = async (id) => {
    try {
      console.log(`Fetching article with ID: ${id}`);
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
    console.log(`Loading initial article with ID: ${initialId}`);
    const article = await fetchArticleById(initialId);
    setArticlesArray([article]);
    setCurrentPage(initialId + 1);
  };

  //Функция для запроса следующей статьи:
  const fetchNextArticle = async () => {
    // Останавливаем выполнение, если больше нет статей для запроса
    if (!hasMoreArticles) {
      console.log("No more articles to fetch.");
      return;
    }
    let success = false;
    let nextArticle = null;
    let nextPage = currentPage;
    let localErrorCount = errorCount;

    while (!success && errorCount < 100) {
      try {
        nextArticle = await fetchArticleById(nextPage);
        success = true;
      } catch (error) {
        nextPage += 1;
        localErrorCount += 1;
        if (localErrorCount >= 100) {
          console.log(
            "Reached 100 failed attempts, stopping further requests."
          );
          setHasMoreArticles(false);
          setErrorCount(localErrorCount);
          return;
        }
      }
    }

    if (success && nextArticle) {
      setArticlesArray((prevArticles) => [...prevArticles, nextArticle]);
      setCurrentPage(nextPage + 1);
      setErrorCount(0);
    } else {
      setErrorCount(localErrorCount); // Обновляем счетчик ошибок в состоянии
    }
  };

  //Начальная загрузка статьи
  useEffect(() => {
    const initialId = getIdFromUrl();
    console.log("Initial ID from URL or localStorage:", initialId);
    setIdArticleVisible(initialId);
    loadInitialArticle(initialId);
  }, []);

  //обработчик прокрутки, который обновляет видимую статью и сохраняет ее ID в localStorage
  useEffect(() => {
    const handleScroll = () => {
      const visibleArticleIndex = itemsRef.current.findIndex((item, index) => {
        if (item) {
          const rect = item.getBoundingClientRect();
          return (
            rect.top < window.innerHeight &&
            rect.bottom >= window.innerHeight / 2
          );
        }
        return false;
      });

      if (
        visibleArticleIndex !== -1 &&
        visibleArticleIndex !== previousVisibleIndex
      ) {
        console.log(`Visible article index: ${visibleArticleIndex}`);
        setPreviousVisibleIndex(visibleArticleIndex);
        setIdArticleVisible(visibleArticleIndex + 1);
        localStorage.setItem("idArticleVisible", visibleArticleIndex + 1);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [previousVisibleIndex]);

  // изменение URL при изменении видимой статьи
  useEffect(() => {
    console.log(`idArticleVisible changed to: ${idArticleVisible}`);
    if (idArticleVisible) {
      const newUrl = `/page/test/${idArticleVisible}`;
      console.log(`Updating URL to: ${newUrl}`);
      window.history.replaceState(null, "", newUrl);
    }
  }, [idArticleVisible]);

  //запрос следующей статьи, если видимая статья - последняя в массиве
  useEffect(() => {
    if (
      hasMoreArticles &&
      idArticleVisible !== null &&
      idArticleVisible === articlesArray.length &&
      articlesArray.length > 0
    ) {
      console.log("Fetching next article...");
      fetchNextArticle();
    }
  }, [idArticleVisible, articlesArray.length, hasMoreArticles]);

  // изменение URL при изменении видимой статьи
  useLayoutEffect(() => {
    console.log(`idArticleVisible changed to: ${idArticleVisible}`);
    if (idArticleVisible !== null) {
      const newUrl = `/page/test/${idArticleVisible}`;
      console.log(`Updating URL to: ${newUrl}`);
      window.history.replaceState(null, "", newUrl);
    }
  }, [previousVisibleIndex]);

  return (
    <div className="test">
      {articlesArray.map((item, key) => (
        <Article article={item} key={key} articleRef={updateItemsRef(key)} />
      ))}
    </div>
  );
};

export default Test11;

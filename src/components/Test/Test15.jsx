import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./test.scss";
import Article2 from "../Article/Article2";

const Test15 = () => {
  const [articlesArray, setArticlesArray] = useState([]);
  const [buffer, setBuffer] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [idArticleVisible, setIdArticleVisible] = useState(null);
  const [previousVisibleIndex, setPreviousVisibleIndex] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);
  const itemsRef = useRef([]);

  const updateItemsRef = (index) => (element) => {
    itemsRef.current[index] = element;
  };

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

  const fetchArticles = async (page) => {
    try {
      const url =
        page === 1
          ? "https://169f-92-242-112-164.ngrok-free.app/wp-json/api-posts/v1/endlessPosts?permalink=http://pamtest.ru/702-oformlenie-osago-na-a-b-c-d-otkryto-vsem-agenta/"
          : "https://169f-92-242-112-164.ngrok-free.app/wp-json/api-posts/v1/endlessPosts";

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

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

  const loadInitialArticles = async (initialId) => {
    try {
      const articles = await fetchArticles(1);
      setBuffer(articles.slice(1)); // Сохраняем остальные статьи в буфер
      setArticlesArray([articles[0]]); // Устанавливаем первую статью
      setCurrentPage(initialId + 1);
      setIdArticleVisible(initialId);
      window.history.replaceState(
        { id: initialId },
        "",
        `/page/test/${initialId}`
      );
    } catch (error) {
      console.error("Failed to load initial articles:", error);
    }
  };

  const fetchNextArticle = async () => {
    if (!hasMoreArticles) {
      return;
    }

    if (buffer.length === 0) {
      let success = false;
      let localErrorCount = errorCount;

      while (!success && localErrorCount < 100) {
        try {
          const newArticles = await fetchArticles(currentPage);
          if (newArticles.length === 0) {
            setHasMoreArticles(false);
            return;
          }
          setBuffer(newArticles);
          setCurrentPage(currentPage + 1);
          success = true;
        } catch (error) {
          localErrorCount += 1;
          if (localErrorCount >= 100) {
            setHasMoreArticles(false);
            setErrorCount(localErrorCount);
            return;
          }
        }
      }

      setErrorCount(success ? 0 : localErrorCount);
    }

    const nextArticle = buffer.shift(); // Берем первую статью из буфера
    setArticlesArray((prevArticles) => [...prevArticles, nextArticle]);
    setBuffer(buffer); // Обновляем буфер
  };

  useEffect(() => {
    const initialId = getIdFromUrl();
    loadInitialArticles(initialId);
  }, []);

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
        setPreviousVisibleIndex(visibleArticleIndex);
        const newVisibleId = articlesArray[visibleArticleIndex]?.id;

        if (newVisibleId) {
          setIdArticleVisible(newVisibleId);
          localStorage.setItem("idArticleVisible", newVisibleId);
          window.history.pushState(
            { id: newVisibleId },
            "",
            `/page/test/${newVisibleId}`
          );
        }

        if (
          visibleArticleIndex === articlesArray.length - 1 &&
          hasMoreArticles
        ) {
          fetchNextArticle();
        }
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [previousVisibleIndex, articlesArray, hasMoreArticles]);

  useEffect(() => {
    const handlePopstate = async (event) => {
      const newId = event.state?.id || getIdFromUrl();
      setIdArticleVisible(newId);
      if (articlesArray.length < newId) {
        for (let i = articlesArray.length + 1; i <= newId; i++) {
          const article = await fetchArticleById(i);
          setArticlesArray((prevArticles) => [...prevArticles, article]);
        }
      }
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  return (
    <div className="test">
      {articlesArray.map((item, key) => (
        <Article2
          article={item}
          key={item.id}
          articleRef={updateItemsRef(key)}
        />
      ))}
    </div>
  );
};

export default Test15;

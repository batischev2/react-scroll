import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./test.scss";
import Article from "../Article/Article";

const Test14 = () => {
  const [articlesArray, setArticlesArray] = useState([]);
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

  const loadInitialArticle = async (initialId) => {
    const article = await fetchArticleById(initialId);
    setArticlesArray([article]);
    setCurrentPage(initialId + 1);
    setIdArticleVisible(initialId);
    window.history.replaceState(
      { id: initialId },
      "",
      `/page/test/${initialId}`
    );
  };

  const fetchNextArticle = async () => {
    if (!hasMoreArticles) {
      return;
    }
    let success = false;
    let nextArticle = null;
    let nextPage = currentPage;
    let localErrorCount = errorCount;

    while (!success && localErrorCount < 100) {
      try {
        nextArticle = await fetchArticleById(nextPage);
        success = true;
      } catch (error) {
        nextPage += 1;
        localErrorCount += 1;
        if (localErrorCount >= 100) {
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
      setErrorCount(localErrorCount);
    }
  };

  useEffect(() => {
    const initialId = getIdFromUrl();
    loadInitialArticle(initialId);
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
        <Article
          article={item}
          key={item.id}
          articleRef={updateItemsRef(key)}
        />
      ))}
    </div>
  );
};

export default Test14;

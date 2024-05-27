import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./test.scss";
import Article from "../Article/Article";

const Test13 = () => {
  const [articlesArray, setArticlesArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [idArticleVisible, setIdArticleVisible] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);
  const itemsRef = useRef([]);
  const [previousVisibleIndex, setPreviousVisibleIndex] = useState(null);

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
      console.log(`Fetching article with ID: ${id}`);
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const loadInitialArticle = async (initialId) => {
    console.log(`Loading initial article with ID: ${initialId}`);
    const article = await fetchArticleById(initialId);
    setArticlesArray([article]);
    setCurrentPage(initialId + 1);
  };

  const fetchNextArticle = async () => {
    if (!hasMoreArticles) {
      console.log("No more articles to fetch.");
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
      setErrorCount(localErrorCount);
    }
  };

  useEffect(() => {
    const initialId = getIdFromUrl();
    console.log("Initial ID from URL or localStorage:", initialId);
    setIdArticleVisible(initialId);
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
        console.log(`Visible article index: ${visibleArticleIndex}`);
        setPreviousVisibleIndex(visibleArticleIndex);
        const newVisibleId = articlesArray[visibleArticleIndex]?.id;
        if (newVisibleId) {
          setIdArticleVisible(newVisibleId);
          localStorage.setItem("idArticleVisible", newVisibleId);
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
    console.log(`idArticleVisible changed to: ${idArticleVisible}`);
    if (idArticleVisible) {
      const newUrl = `/page/test/${idArticleVisible}`;
      console.log(`Updating URL to: ${newUrl}`);
      window.history.replaceState(null, "", newUrl);
    }
  }, [idArticleVisible]);

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

export default Test13;

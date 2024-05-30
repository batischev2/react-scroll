import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./test.scss";
import Article2 from "../Article/Article2";

const Test17 = () => {
  const [articlesArray, setArticlesArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // start from 0 to match index
  const [idArticleVisible, setIdArticleVisible] = useState(null);
  const [previousVisibleIndex, setPreviousVisibleIndex] = useState(null);
  const [errorCount, setErrorCount] = useState(0);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);
  const itemsRef = useRef([]);
  const [permalinks, setPermalinks] = useState([]);

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

  const fetchArticleByUrl = async (url) => {
    try {
      console.log(`Fetching article by URL: ${url}`);
      const response = await axios.get(url);
      console.log("Article fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching article by URL:", error);
      throw error;
    }
  };

  const loadInitialArticle = async (initialId) => {
    try {
      console.log(`Loading initial article with ID: ${initialId}`);
      const response = await axios.get(
        `https://169f-92-242-112-164.ngrok-free.app/wp-json/api-posts/v1/endlessPosts?permalink=http://pamtest.ru/${initialId}-oformlenie-osago-na-a-b-c-d-otkryto-vsem-agenta/`
      );
      console.log(
        "Initial article and permalinks fetched successfully:",
        response.data
      );

      const initialArticle = response.data[0]["requested-post"];
      const fetchedPermalinks = response.data
        .slice(1)
        .map((item) => ({ id: item.id, permalink: item.permalink }));

      setArticlesArray([initialArticle]);
      setPermalinks(fetchedPermalinks);
      setCurrentPage(0);
      setIdArticleVisible(initialId);
      window.history.replaceState(
        { id: initialId },
        "",
        `/page/test/${initialId}`
      );
    } catch (error) {
      console.error("Error loading initial article:", error);
    }
  };

  const fetchNextArticle = async () => {
    if (!hasMoreArticles || !permalinks[currentPage + 1]) {
      console.log(
        "No more articles to fetch or no permalink available for the current page."
      );
      return;
    }

    let success = false;
    let nextArticle = null;
    let nextPage = currentPage + 1;
    let localErrorCount = errorCount;

    while (!success && localErrorCount < 100) {
      try {
        const apiUrl = `https://169f-92-242-112-164.ngrok-free.app/wp-json/api-posts/v1/endlessPosts?permalink=${permalinks[nextPage].permalink}`;
        console.log(`Fetching next article from API URL: ${apiUrl}`);
        nextArticle = await fetchArticleByUrl(apiUrl);
        success = true;
      } catch (error) {
        console.error(`Error fetching article from API URL: ${error}`);
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
      setArticlesArray((prevArticles) => [
        ...prevArticles,
        nextArticle["requested-post"],
      ]);
      setCurrentPage(nextPage);
      setErrorCount(0);
      console.log("Next article fetched and added to articles array.");
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
  }, [previousVisibleIndex, articlesArray, hasMoreArticles, currentPage]);

  useEffect(() => {
    const handlePopstate = async (event) => {
      const newId = event.state?.id || getIdFromUrl();
      setIdArticleVisible(newId);
      if (articlesArray.length < newId) {
        for (let i = articlesArray.length + 1; i <= newId; i++) {
          const article = await fetchArticleByUrl(permalinks[i - 1].permalink);
          setArticlesArray((prevArticles) => [
            ...prevArticles,
            article["requested-post"],
          ]);
        }
      }
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [permalinks, articlesArray]);

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

export default Test17;

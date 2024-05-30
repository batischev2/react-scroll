import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./test.scss";
import Article2 from "../Article/Article2";

const Test18 = () => {
  const [articlesArray, setArticlesArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [permalinks, setPermalinks] = useState([]);
  const itemsRef = useRef([]);
  const isFetchingRef = useRef(false);

  const updateItemsRef = (index) => (element) => {
    itemsRef.current[index] = element;
  };

  const fetchArticleByPermalink = async (permalink) => {
    const apiUrl = `https://169f-92-242-112-164.ngrok-free.app/wp-json/api-posts/v1/endlessPosts?permalink=${permalink}`;
    console.log(`Fetching article by permalink: ${apiUrl}`);
    const response = await axios.get(apiUrl);
    return response.data;
  };

  const loadInitialArticle = async () => {
    const initialPermalink =
      "http://pamtest.ru/702-oformlenie-osago-na-a-b-c-d-otkryto-vsem-agenta/";
    const apiUrl = `https://169f-92-242-112-164.ngrok-free.app/wp-json/api-posts/v1/endlessPosts?permalink=${initialPermalink}`;
    const response = await axios.get(apiUrl);

    const initialArticle = response.data[0]["requested-post"];
    const fetchedPermalinks = response.data
      .slice(1)
      .map((item) => item.permalink);

    setArticlesArray([initialArticle]);
    setPermalinks(fetchedPermalinks);
    setCurrentPage(0);
  };

  const fetchNextArticle = async () => {
    const nextPage = currentPage + 1;

    if (!permalinks[nextPage] || isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    const nextPermalink = permalinks[nextPage];
    const response = await fetchArticleByPermalink(nextPermalink);
    const nextArticle = response[0]["requested-post"];

    setArticlesArray((prevArticles) => [...prevArticles, nextArticle]);
    setCurrentPage(nextPage);
    isFetchingRef.current = false;
  };

  useEffect(() => {
    loadInitialArticle();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const visibleArticleIndex = itemsRef.current.findIndex((item) => {
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
        visibleArticleIndex === articlesArray.length - 1 &&
        !isFetchingRef.current
      ) {
        fetchNextArticle();
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [articlesArray, permalinks, currentPage]);

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

export default Test18;

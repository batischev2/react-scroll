import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./test.scss";
import Article2 from "../Article/Article2";

const Test19 = () => {
  const [articlesArray, setArticlesArray] = useState([]);
  const [permalinks, setPermalinks] = useState([]);
  const [previousVisibleIndex, setPreviousVisibleIndex] = useState(null);
  const itemsRef = useRef([]);
  const isFetchingRef = useRef(false);
  const currentPageRef = useRef(0);
  const currentPagedRef = useRef(1);
  const lastPermalinkRef = useRef("");
  const stopFetchingRef = useRef(false);

  const updateItemsRef = (index) => (element) => {
    itemsRef.current[index] = element;
  };

  const fetchArticleByPermalink = async (permalink) => {
    const apiUrl = `https://6c21-193-110-75-164.ngrok-free.app/wp-json/api-posts/v1/endlessPosts?permalink=${permalink}`;
    console.log(`Fetching article by permalink: ${apiUrl}`);
    const response = await axios.get(apiUrl);
    return response.data;
  };

  const fetchArticleByPermalinkAndPage = async (permalink, page) => {
    const apiUrl = `https://6c21-193-110-75-164.ngrok-free.app/wp-json/api-posts/v1/endlessPosts?permalink=${permalink}&paged=${page}`;
    console.log(`Fetching article by permalink and page: ${apiUrl}`);
    const response = await axios.get(apiUrl);
    return response.data;
  };

  const loadInitialArticle = async () => {
    const initialPermalink =
      "http://pamtest.ru/702-oformlenie-osago-na-a-b-c-d-otkryto-vsem-agenta/";
    const apiUrl = `https://6c21-193-110-75-164.ngrok-free.app/wp-json/api-posts/v1/endlessPosts?permalink=${initialPermalink}`;
    try {
      const response = await axios.get(apiUrl);
      const initialArticle = response.data[0]["requested-post"];
      const fetchedPermalinks = response.data
        .slice(1)
        .map((item) => item.permalink);

      setArticlesArray([initialArticle]);
      setPermalinks(fetchedPermalinks);
      currentPageRef.current = 0;
      currentPagedRef.current = 1;
      lastPermalinkRef.current =
        fetchedPermalinks[fetchedPermalinks.length - 1];
      stopFetchingRef.current = false;
    } catch (error) {
      console.error("Error loading initial article:", error);
    }
  };

  const fetchNextArticle = async () => {
    if (isFetchingRef.current || stopFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;

    try {
      let nextPermalink;
      if (currentPageRef.current < permalinks.length) {
        nextPermalink = permalinks[currentPageRef.current];
      } else {
        currentPagedRef.current += 1;
        nextPermalink = lastPermalinkRef.current;
      }

      const response = await (currentPageRef.current < permalinks.length
        ? fetchArticleByPermalink(nextPermalink)
        : fetchArticleByPermalinkAndPage(
            nextPermalink,
            currentPagedRef.current
          ));

      const nextArticle = response[0]["requested-post"];
      const newPermalinks = response.slice(1).map((item) => item.permalink);

      setArticlesArray((prevArticles) => [...prevArticles, nextArticle]);

      if (
        newPermalinks.length === 0 ||
        (response.length === 1 && !newPermalinks.length)
      ) {
        stopFetchingRef.current = true;
      } else {
        if (currentPageRef.current < permalinks.length) {
          currentPageRef.current += 1;
        } else {
          setPermalinks(newPermalinks);
          currentPageRef.current = 0;
          lastPermalinkRef.current = newPermalinks[newPermalinks.length - 1];
        }
      }
    } catch (error) {
      console.error(`Error fetching next article:`, error);
    } finally {
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    loadInitialArticle();
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
        const newVisibleArticle = articlesArray[visibleArticleIndex];

        if (newVisibleArticle && newVisibleArticle.post_title) {
          const articleTitle = newVisibleArticle.post_title;
          const encodedTitle = encodeURIComponent(articleTitle);
          window.history.replaceState(null, "", `?article=${encodedTitle}`);
        }

        if (
          visibleArticleIndex === articlesArray.length - 1 &&
          !stopFetchingRef.current
        ) {
          fetchNextArticle();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [previousVisibleIndex, articlesArray]);

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

export default Test19;

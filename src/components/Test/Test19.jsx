import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./test.scss";
import Article2 from "../Article/Article2";

const Test19 = () => {
  const [articlesArray, setArticlesArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsRef = useRef([]);

  const updateItemsRef = (index) => (element) => {
    itemsRef.current[index] = element;
  };

  const fetchArticles = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const permalink =
        currentPage === 1
          ? "http://pamtest.ru/702-oformlenie-osago-na-a-b-c-d-otkryto-vsem-agenta/"
          : articlesArray[articlesArray.length - 1].permalink;

      const response = await axios.get(
        `https://169f-92-242-112-164.ngrok-free.app/wp-json/api-posts/v1/endlessPosts?permalink=${permalink}&paged=${currentPage}`
      );

      const newArticles = response.data.map((item) => item["requested-post"]);

      setArticlesArray((prevArticles) => [...prevArticles, ...newArticles]);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.scrollHeight &&
        !loading
      ) {
        fetchArticles();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  return (
    <div className="test">
      {articlesArray.map((item, key) => (
        <Article2
          article={item}
          key={item.id || key} // Если id не определен, используем индекс массива
          articleRef={updateItemsRef(key)}
        />
      ))}
    </div>
  );
};

export default Test19;

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./test.scss";
import Article from "../Article/Article";

const Test = () => {
  //массив, куда я записываю все последующие статьи
  const [articlesArray, setArticlesArray] = useState([]);
  // id следующей запришиваемой статьи
  const [currentPage, setCurrentPage] = useState(1);
  //текущая видимая статья
  const [articleSelect, setArticleSelect] = useState(null);
  // ссылки на статьи в дом дереве
  const itemsRef = useRef([]);

  // Записываем в массив itemsRef ссылку в дом дереве на каждую статью
  const updateItemsRef = (index) => (element) => {
    itemsRef.current[index] = element;
  };

  //1 запрос на получение следующей статьи: текст
  const fetchNextArticleText = () => {
    axios
      .get(`https://jsonplaceholder.typicode.com/posts/${currentPage}`)
      .then((res) => {
        setArticlesArray((prevArticles) => [...prevArticles, res.data]);
        setCurrentPage(currentPage + 1);
      });
  };

  //2 запрос на получение следующей статьи: изображения
  const fetchNextArticleImage = () => {
    console.log("fetchNextArticleImage");
    // axios
    //   .get(`https://jsonplaceholder.typicode.com/posts/${currentPage}`)
    //   .then((res) => {
    //     setArticlesArray((prevArticles) => [...prevArticles, res.data]);
    //     setCurrentPage(currentPage + 1);
    //   });
  };

  //делаем запрос на получение новой статаьи при изменении состояния fetching
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts/1")
      .then((res) => setArticlesArray([res.data]));
  }, []);

  useEffect(() => {
    function scrollHandler() {
      // Мы должны получать одну статью, которая попадает в область видимости
      const visibleArticles = itemsRef.current.find((item, index) => {
        // getBoundingClientRect() - получение позиции html элемента(нашей статьи) по отношению к странице(растояние до начала и конца страницы)
        const rect = item.getBoundingClientRect();

        if (
          rect.top < window.innerHeight &&
          rect.bottom >= item.clientHeight / 2
        ) {
          setArticleSelect(item);
          return item;
        }

        // if (rect.top < window.innerHeight && rect.bottom >= 0) {
        //   setArticleSelect(item);
        //   return item;
        // }
      });

      if (visibleArticles !== articleSelect) {
        setArticleSelect(visibleArticles);
      } else {
        // fetchNextArticleImage();
      }
    }

    // добавляем и убираем скролл к всему документу

    document.addEventListener("scroll", scrollHandler);

    return function () {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  useEffect(() => {
    fetchNextArticleText();
  }, [articleSelect]);

  return (
    <div className="test">
      {articlesArray.map((item, key) => {
        return (
          <Article article={item} key={key} articleRef={updateItemsRef(key)} />
        );
      })}
    </div>
  );
};

export default Test;

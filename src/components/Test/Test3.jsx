import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./test.scss";
import Article from "../Article/Article";

const Test3 = () => {
  //массив, куда я записываю все последующие статьи
  const [articlesArray, setArticlesArray] = useState([]);
  // id следующей запришиваемой статьи
  const [currentPage, setCurrentPage] = useState(1);
  //текущая видимая статья
  const [articleSelect, setArticleSelect] = useState(null);
  // id текущей видимой статьи для url
  const [idArticleVisible, setIdArticleVisible] = useState(1);
  // ссылки на статьи в дом дереве
  const itemsRef = useRef([]);

  // Записываем в массив itemsRef ссылку в дом дереве на каждую статью
  const updateItemsRef = (index) => (element) => {
    itemsRef.current[index] = element;
  };

  //запрос на получение следующей статьи
  const fetchNextArticle = () => {
    axios
      .get(`https://jsonplaceholder.typicode.com/posts/${currentPage}`)
      .then((res) => {
        setArticlesArray((prevArticles) => [...prevArticles, res.data]);
        setCurrentPage(currentPage + 1);
      });
  };

  //делаем запрос на получение 1 статьи
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts/1")
      .then((res) => setArticlesArray([res.data]));
  }, []);

  //Получаем позицию одной статьи по отношению к экрану, если новая статья достигла нижней границы экрана - переключаемся на неё, записываю её в articleSelect и idArticle
  useEffect(() => {
    function scrollHandler() {
      const visibleArticles = itemsRef.current.find((item, index) => {
        const rect = item.getBoundingClientRect();

        if (
          rect.top < window.innerHeight &&
          rect.bottom >= item.clientHeight / 2
        ) {
          setArticleSelect(item);
          setIdArticleVisible(index + 1);
          return item;
        }
      });

      //переключение на новую видимую стаью
      if (visibleArticles !== articleSelect) {
        setArticleSelect(visibleArticles);
      }
    }

    // добавляем и убираем скролл к всему документу

    document.addEventListener("scroll", scrollHandler);

    return function () {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  //При изменеии значения выбранной статьи делаем запрос на новую
  useEffect(() => {
    fetchNextArticle();
  }, [articleSelect]);

  //При изменении id запрашиваемой статьи меняю url адрес(как только новая статья входит в область видимости меняется url)
  useEffect(() => {
    const newUrl = `/page/test/${idArticleVisible}`;
    window.history.pushState(null, "", newUrl);
  }, [currentPage]);

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

export default Test3;

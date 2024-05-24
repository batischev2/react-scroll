import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./test.scss";
import Article from "../Article/Article";

const Test5 = () => {
  //массив, куда я записываю все последующие статьи
  const [articlesArray, setArticlesArray] = useState([]);
  // id следующей запришиваемой статьи
  const [currentPage, setCurrentPage] = useState(1);
  //текущая видимая статья
  const [articleSelect, setArticleSelect] = useState(null);
  // id текущей видимой статьи для url
  const [idArticleVisible, setIdArticleVisible] = useState(null);
  // ссылки на статьи в дом дереве
  const itemsRef = useRef([]);

  // Записываем в массив itemsRef ссылку в дом дереве на каждую статью
  const updateItemsRef = (index) => (element) => {
    itemsRef.current[index] = element;
  };

  // Функция для извлечения id из URL
  const getIdFromUrl = () => {
    const path = window.location.pathname;
    const pathParts = path.split("/");
    const id = parseInt(pathParts[pathParts.length - 1], 10);

    const savedId = localStorage.getItem("idArticleVisible");
    return savedId ? parseInt(savedId, 10) : isNaN(id) ? 1 : id;
  };

  //запрос на получение следующей статьи
  const fetchNextArticle = () => {
    console.log(currentPage);
    axios
      .get(`https://jsonplaceholder.typicode.com/posts/${currentPage}`)
      .then((res) => {
        setArticlesArray((prevArticles) => [...prevArticles, res.data]);
        setCurrentPage(currentPage + 1);
      });
  };

  useEffect(() => {
    const initialId = getIdFromUrl();
    setCurrentPage(initialId);

    axios
      .get(`https://jsonplaceholder.typicode.com/posts/${initialId}`)
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
          localStorage.setItem("idArticleVisible", index + 1);
          return item;
        }
      });

      //переключение на новую видимую стаью
      if (
        visibleArticles !== articleSelect &&
        visibleArticles + 1 !== idArticleVisible
      ) {
        setArticleSelect(visibleArticles);
        localStorage.setItem("idArticleVisible", visibleArticles + 1);
      }
    }

    // добавляем и убираем скролл к всему документу

    document.addEventListener("scroll", scrollHandler);

    return function () {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, [idArticleVisible]);

  //При изменеии значения выбранной статьи делаем запрос на новую
  useEffect(() => {
    fetchNextArticle();
  }, [idArticleVisible]);

  //При изменении id запрашиваемой статьи меняю url адрес(как только новая статья входит в область видимости меняется url)
  useEffect(() => {
    if (idArticleVisible == null) {
      const newUrl = `/page/test/${1}`;
      window.history.pushState(null, "", newUrl);
    } else {
      const newUrl = `/page/test/${idArticleVisible}`;
      window.history.pushState(null, "", newUrl);
    }
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

export default Test5;

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./test.scss";
import Article from "../Article/Article";

const Test = () => {
  const [articles, setArticles] = useState([]);
  const [fetching, setFetching] = useState(true);

  const itemsRef = useRef([]);
  const [articleHeight, setArticleHeight] = useState(null);

  // Записываем в массив itemsRef ссылку в дом дереве на каждую статью
  const updateItemsRef = (index) => (element) => {
    itemsRef.current[index] = element;
  };

  //делаем запрос на получение новой статаьи при изменении состояния fetching
  useEffect(() => {
    if (fetching) {
      axios
        .get(
          "https://newsapi.org/v2/top-headlines?country=us&apiKey=28622fdae70f4a6891fba38c2d2d43a3"
        )
        .then((res) => setArticles(res.data.articles));
    }
  }, [fetching]);

  useEffect(() => {
    function scrollHandler() {
      // Мы должны получать одну статью, которая попадает в область видимости
      const visibleArticles = itemsRef.current.find((item, index) => {
        // getBoundingClientRect() - получение позиции html элемента(нашей статьи) по отношению к странице(растояние до начала и конца страницы)
        const rect = item.getBoundingClientRect();

        // console.log(" item", item); - видимый item
        // console.log(rect.top); - от начала видимой статьи до начала экрана
        // console.log("Height item", item.clientHeight); - высота всей статьи

        // Первый подход, статья считается видимой, когда её начало совпадает с началом экрана

        // if (rect.top < window.innerHeight && rect.bottom >= 0) {
        //   console.log(rect.top);
        //   console.log(rect.bottom);
        //   console.log(item.clientHeight);
        //   return item;
        // }

        // Второй подход, мы считаем следующую статью видимой когда длина до конца экрана больше или равна половине длины текущей статьи. По факту как только следующая статья попадает чуть-чуть в экран, она считается видимой

        // if (
        //   rect.top < window.innerHeight &&
        //   rect.bottom >= item.clientHeight / 2
        // ) {
        //   console.log(rect.top);
        //   console.log(rect.bottom);
        //   console.log(item.clientHeight);
        //   return item;
        // }
      });

      console.log(visibleArticles);
    }

    // добавляем и убираем скролл к всему документу

    document.addEventListener("scroll", scrollHandler);

    return function () {
      document.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  return (
    <div className="test">
      {articles.map((item, key) => {
        return (
          <Article article={item} key={key} articleRef={updateItemsRef(key)} />
        );
      })}
    </div>
  );
};

export default Test;

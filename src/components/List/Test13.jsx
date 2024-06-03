import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import './test.scss'
import Article from '../Article/Article'

const Test13 = () => {
  //массив статей
  const [articlesArray, setArticlesArray] = useState([])
  //текущая страница
  const [currentPage, setCurrentPage] = useState(1)
  // id теущей видимой статьи
  const [idArticleVisible, setIdArticleVisible] = useState(null)
  //предыдущий индекс видимой статьи
  const [previousVisibleIndex, setPreviousVisibleIndex] = useState(null)
  //количество неудачных запросов
  const [errorCount, setErrorCount] = useState(0)
  // Флаг, чтобы прекратить слать запросы после 100 неудачных попыток
  const [hasMoreArticles, setHasMoreArticles] = useState(true)

  // Ссылки на статьи в DOM дереве
  const itemsRef = useRef([])

  // Функция для обновления itemsRef, которая сохраняет ссылку на DOM элемент статьи.
  const updateItemsRef = (index) => (element) => {
    itemsRef.current[index] = element
  }

  //Извлечение ID статьи из URL и, если доступно, возвращение ID из localStorage.
  const getIdFromUrl = () => {
    const path = window.location.pathname
    const pathParts = path.split('/')
    const id = parseInt(pathParts[pathParts.length - 1], 10)

    if (!isNaN(id)) {
      return id
    }

    const savedId = localStorage.getItem('idArticleVisible')
    return savedId ? parseInt(savedId, 10) : 1
  }

  //Функция для запроса статьи по ID
  const fetchArticleById = async (id) => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  // Загрузка начальной статьи, и установка текущего состояния.
  const loadInitialArticle = async (initialId) => {
    const article = await fetchArticleById(initialId)
    setArticlesArray([article])
    setCurrentPage(initialId + 1)
  }

  // Функция для запроса следующей статьи:
  const fetchNextArticle = async () => {
    if (!hasMoreArticles) {
      return
    }
    let success = false
    let nextArticle = null
    let nextPage = currentPage
    let localErrorCount = errorCount

    // Повторяем попытки запроса, пока не достигнем 100 неудачных попыток или не получим успешный ответ
    while (!success && localErrorCount < 100) {
      try {
        nextArticle = await fetchArticleById(nextPage)
        success = true
      } catch (error) {
        nextPage += 1
        localErrorCount += 1
        if (localErrorCount >= 100) {
          setHasMoreArticles(false)
          setErrorCount(localErrorCount)
          return
        }
      }
    }

    // Если запрос успешен, обновляем состояние с новой статьей
    if (success && nextArticle) {
      setArticlesArray((prevArticles) => [...prevArticles, nextArticle])
      setCurrentPage(nextPage + 1)
      setErrorCount(0)
    } else {
      setErrorCount(localErrorCount)
    }
  }

  //Загрузка начальной статьи
  useEffect(() => {
    const initialId = getIdFromUrl()
    setIdArticleVisible(initialId)
    loadInitialArticle(initialId)
  }, [])

  //Скролл и обновление видимой статьи
  useEffect(() => {
    const handleScroll = () => {
      const visibleArticleIndex = itemsRef.current.findIndex((item, index) => {
        if (item) {
          const rect = item.getBoundingClientRect()
          return (
            rect.top < window.innerHeight &&
            rect.bottom >= window.innerHeight / 2
          )
        }
        return false
      })

      // Если видимая статья изменилась, обновляем состояние и записываем в localStorage
      if (
        visibleArticleIndex !== -1 &&
        visibleArticleIndex !== previousVisibleIndex
      ) {
        setPreviousVisibleIndex(visibleArticleIndex)
        const newVisibleId = articlesArray[visibleArticleIndex]?.id

        if (newVisibleId) {
          setIdArticleVisible(newVisibleId)
          localStorage.setItem('idArticleVisible', newVisibleId)
          window.history.pushState(
            { id: newVisibleId },
            '',
            `/page/test/${newVisibleId}`
          )
        }

        // Если текущая видимая статья последняя в массиве и есть еще статьи для загрузки, делаем запрос на следующую статью
        if (
          visibleArticleIndex === articlesArray.length - 1 &&
          hasMoreArticles
        ) {
          fetchNextArticle()
        }
      }
    }

    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [previousVisibleIndex, articlesArray, hasMoreArticles])

  //обновление url при изменении видимой статьи
  useEffect(() => {
    if (idArticleVisible) {
      const newUrl = `/page/test/${idArticleVisible}`
      window.history.replaceState(null, '', newUrl)
    }
  }, [idArticleVisible])

  // Обработчик для события "popstate"
  useEffect(() => {
    const handlePopstate = async (event) => {
      const newId = event.state?.id || getIdFromUrl()
      setIdArticleVisible(newId)

      const articleExists = articlesArray.find(
        (article) => article.id === newId
      )
      if (!articleExists) {
        const article = await fetchArticleById(newId)
        setArticlesArray((prevArticles) => [...prevArticles, article])
      }
    }

    window.addEventListener('popstate', handlePopstate)

    return () => {
      window.removeEventListener('popstate', handlePopstate)
    }
  }, [articlesArray])

  return (
    <div className='test'>
      {articlesArray.map((item, key) => (
        <Article
          article={item}
          key={item.id}
          articleRef={updateItemsRef(key)}
        />
      ))}
    </div>
  )
}

export default Test13

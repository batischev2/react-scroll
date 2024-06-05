import axios from 'axios'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import './articleList.scss'
import Article from '../Article/Article'

const ArticleList = () => {
  // Состояния для хранения массива статей, их постоянных ссылок,
  // и индекса предыдущей видимой статьи
  const [articlesArray, setArticlesArray] = useState([])
  const [permalinks, setPermalinks] = useState([])
  const [previousVisibleIndex, setPreviousVisibleIndex] = useState(null)

  // Ссылки useRef для отслеживания состояния загрузки и управления пагинацией
  const itemsRef = useRef([])
  const isFetchingRef = useRef(false)
  const currentPageRef = useRef(0)
  const currentPagedRef = useRef(1)
  const lastPermalinkRef = useRef('')
  const stopFetchingRef = useRef(false)

  // useCallback для обновления ссылки на DOM элемент
  const updateItemsRef = useCallback(
    (index) => (element) => {
      itemsRef.current[index] = element
    },
    []
  )

  // Функция для загрузки статьи по ее постоянной ссылке
  const fetchArticleByPermalink = useCallback(async (permalink, page) => {
    if (!permalink) return
    const apiUrl = `${process.env.REACT_APP_BASE_URL}?permalink=${permalink}&paged=${page}`
    try {
      const response = await axios.get(apiUrl)
      return response.data
    } catch (error) {
      console.error(`Error fetching article by permalink: ${error}`)
    }
  }, [])

  // Функция для загрузки первоначального списка статей
  const loadInitialArticle = async (permalink, paged) => {
    try {
      let requestUrl = `${process.env.REACT_APP_BASE_URL}?paged=${paged || 1}`
      const response = await axios.get(requestUrl)
      const fetchedPermalinks = response.data.slice(1).map((item) => item.permalink)
      setPermalinks(fetchedPermalinks)
      if (permalink) {
        // загрузим сразу первую статью из сохраненных
        requestUrl += `&permalink=${permalink}`
        const responseArticle = await axios.get(requestUrl)
        const initialArticle = responseArticle.data[0]['requested-post']
        setArticlesArray([initialArticle])
      }
      currentPageRef.current = 0
      currentPagedRef.current = 1
      lastPermalinkRef.current = fetchedPermalinks[fetchedPermalinks.length - 1]
      stopFetchingRef.current = false
    } catch (error) {
      console.error('Error loading initial article:', error)
    }
  }

  // Функция для загрузки следующей статьи
  const fetchNextArticle = useCallback(async () => {
    if (isFetchingRef.current || stopFetchingRef.current) return

    isFetchingRef.current = true

    try {
      let nextPermalink
      if (currentPageRef.current < permalinks.length) {
        nextPermalink = permalinks[currentPageRef.current]
      } else {
        currentPagedRef.current += 1
        localStorage.setItem('currentPage', currentPagedRef.current)
        nextPermalink = lastPermalinkRef.current
      }

      const response = await fetchArticleByPermalink(nextPermalink, currentPagedRef.current)

      if (!response) return

      const nextArticle = response[0]['requested-post']
      const newPermalinks = response.slice(1).map((item) => item.permalink)

      // Добавление новой статьи в массив
      setArticlesArray((prevArticles) => [...prevArticles, nextArticle])

      // Проверка на окончание списка статей
      if (newPermalinks.length === 0 || (response.length === 1 && !newPermalinks.length)) {
        stopFetchingRef.current = true
      } else {
        if (currentPageRef.current < permalinks.length) {
          currentPageRef.current += 1
        } else {
          setPermalinks(newPermalinks)
          currentPageRef.current = 0
          lastPermalinkRef.current = newPermalinks[newPermalinks.length - 1]
        }
      }
    } catch (error) {
      console.error(`Error fetching next article:`, error)
    } finally {
      isFetchingRef.current = false
    }
  }, [permalinks, fetchArticleByPermalink])

  // Загрузка первоначального списка статей при монтировании компонента
  useEffect(() => {
    const savedPermalink = localStorage.getItem('visibleArticle')
    const currentPage = localStorage.getItem('currentPage')
    loadInitialArticle(savedPermalink, currentPage)
  }, [])

  // Загрузка следующей статьи при изменении постоянных ссылок
  useEffect(() => {
    if (permalinks.length > 0) {
      const savedIndex = localStorage.getItem('visibleArticle')
      if (!savedIndex) fetchNextArticle()
    }
  }, [permalinks, fetchNextArticle])

  // Обработка события прокрутки и обновление видимой статьи
  useEffect(() => {
    const handleScroll = () => {
      const visibleArticleIndex = itemsRef.current.findIndex((item) => {
        if (item) {
          const rect = item.getBoundingClientRect()
          return rect.top < window.innerHeight && rect.bottom >= window.innerHeight / 2
        }
        return false
      })

      if (
        itemsRef.current[itemsRef.current.length - 1]?.getBoundingClientRect().height <
        window.innerHeight
      )
        fetchNextArticle()

      // Обновление состояния и URL при изменении видимой статьи
      if (visibleArticleIndex !== -1 && visibleArticleIndex !== previousVisibleIndex) {
        setPreviousVisibleIndex(visibleArticleIndex)
        const newVisibleArticle = articlesArray[visibleArticleIndex]

        if (newVisibleArticle && newVisibleArticle.post_title) {
          const articleTitle = newVisibleArticle.post_title
          const encodedTitle = encodeURIComponent(articleTitle)
          window.history.replaceState(null, '', `?article=${encodedTitle}`)
          console.log(permalinks[visibleArticleIndex])
          localStorage.setItem('visibleArticle', permalinks[visibleArticleIndex])
        }

        if (visibleArticleIndex === articlesArray.length - 1 && !stopFetchingRef.current)
          fetchNextArticle()
      }

      if (visibleArticleIndex === -1 && previousVisibleIndex === null) fetchNextArticle()
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [previousVisibleIndex, articlesArray, fetchNextArticle])

  return (
    <div className='test'>
      {articlesArray.map((item, key) => (
        <Article article={item} key={item.id} articleRef={updateItemsRef(key)} />
      ))}
    </div>
  )
}

export default ArticleList

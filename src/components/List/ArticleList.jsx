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

  const [stateAction, setStateAction] = useState(0)

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
  const loadInitialArticle = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_BASE_URL)
      const fetchedPermalinks = response.data.slice(1).map((item) => item.permalink)
      setPermalinks(fetchedPermalinks)
      // console.log(savedIndex)
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
    if (isFetchingRef.current || stopFetchingRef.current) {
      return
    }

    isFetchingRef.current = true

    try {
      let nextPermalink
      if (currentPageRef.current < permalinks.length) {
        nextPermalink = permalinks[currentPageRef.current]
      } else {
        currentPagedRef.current += 1
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

  // Функция для загрузки сохраненных статей
  const loadSavedArticles = useCallback(
    async (startIndex) => {
      for (let i = 0; i <= startIndex; i++) {
        await fetchNextArticle()
      }
    },
    [fetchNextArticle]
  )

  // Загрузка первоначального списка статей при монтировании компонента
  useEffect(() => {
    // const savedIndex = localStorage.getItem('visibleArticleIndex')
    loadInitialArticle()
  }, [])

  // Загрузка следующей статьи при изменении постоянных ссылок
  useEffect(() => {
    if (permalinks.length > 0) {
      const savedIndex = localStorage.getItem('visibleArticleIndex')
      if (savedIndex !== null) {
        loadSavedArticles(parseInt(savedIndex, 10))
      } else {
        fetchNextArticle()
      }
    }
  }, [permalinks, fetchNextArticle, loadSavedArticles])

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
      ) {
        fetchNextArticle()
      }

      // Обновление состояния и URL при изменении видимой статьи
      if (visibleArticleIndex !== -1 && visibleArticleIndex !== previousVisibleIndex) {
        setPreviousVisibleIndex(visibleArticleIndex)
        const newVisibleArticle = articlesArray[visibleArticleIndex]

        if (newVisibleArticle && newVisibleArticle.post_title) {
          const articleTitle = newVisibleArticle.post_title
          const encodedTitle = encodeURIComponent(articleTitle)
          window.history.replaceState(null, '', `?article=${encodedTitle}`)
          localStorage.setItem('visibleArticleIndex', visibleArticleIndex)
          const savedIndex = localStorage.getItem('visibleArticleIndex')
          setStateAction(savedIndex)
          // console.log('asdasd')
          //Сохранение в localStorage
        }

        if (visibleArticleIndex === articlesArray.length - 1 && !stopFetchingRef.current) {
          fetchNextArticle()
        }
      }

      if (visibleArticleIndex === -1 && previousVisibleIndex === null) {
        fetchNextArticle()
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [previousVisibleIndex, articlesArray, fetchNextArticle])

  // Прокрутка к сохраненной статье при загрузке страницы
  // useEffect(() => {
  //   const savedIndex = localStorage.getItem('visibleArticleIndex')
  //   if (savedIndex !== null && itemsRef.current[savedIndex]) {
  //     setActionTest(savedIndex)
  //     // console.log(stateAction)
  //     // console.log(stateAction + 1)
  //   }
  // }, [articlesArray])

  // useEffect(() => {
  //   console.log(stateAction)
  // }, [stateAction])

  // Получаем значение 'visibleArticleIndex' из localStorage при загрузке страницы
  useEffect(() => {
    const savedIndex = localStorage.getItem('visibleArticleIndex')

    // Если значение есть в localStorage, устанавливаем его в stateAction
    if (savedIndex !== null) {
      setStateAction(savedIndex)
      localStorage.setItem('visibleArticleIndex', savedIndex)
    }
  }, [])

  return (
    <div className='test'>
      {articlesArray.map((item, key) => (
        <Article article={item} key={item.id} articleRef={updateItemsRef(key)} />
      ))}
    </div>
  )
}

export default ArticleList

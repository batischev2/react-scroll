import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import './test.scss'
import Article2 from '../Article/Article2'

const Test18 = () => {
  const [articlesArray, setArticlesArray] = useState([])
  const [permalinks, setPermalinks] = useState([])
  const itemsRef = useRef([])
  const isFetchingRef = useRef(false)
  const currentPageRef = useRef(0)

  const updateItemsRef = (index) => (element) => {
    itemsRef.current[index] = element
  }

  const fetchArticleByPermalink = async (permalink) => {
    const apiUrl = `https://6c21-193-110-75-164.ngrok-free.app/wp-json/api-posts/v1/endlessPosts?permalink=${permalink}`
    const response = await axios.get(apiUrl)
    return response.data
  }

  const loadInitialArticle = async () => {
    const initialPermalink =
      'http://pamtest.ru/702-oformlenie-osago-na-a-b-c-d-otkryto-vsem-agenta/'
    const apiUrl = `https://6c21-193-110-75-164.ngrok-free.app/wp-json/api-posts/v1/endlessPosts?permalink=${initialPermalink}`
    try {
      const response = await axios.get(apiUrl)
      const initialArticle = response.data[0]['requested-post']
      const fetchedPermalinks = response.data
        .slice(1)
        .map((item) => item.permalink)

      setArticlesArray([initialArticle])
      setPermalinks(fetchedPermalinks)
      currentPageRef.current = 0
    } catch (error) {
      console.error('Error loading initial article:', error)
    }
  }

  const fetchNextArticle = async () => {
    if (isFetchingRef.current || currentPageRef.current >= permalinks.length) {
      return
    }

    isFetchingRef.current = true

    const nextPage = currentPageRef.current
    const nextPermalink = permalinks[nextPage]

    try {
      const response = await fetchArticleByPermalink(nextPermalink)
      const nextArticle = response[0]['requested-post']

      setArticlesArray((prevArticles) => [...prevArticles, nextArticle])
      currentPageRef.current += 1
    } catch (error) {
      console.error(`Error fetching next article:`, error)
    } finally {
      isFetchingRef.current = false
    }
  }

  useEffect(() => {
    loadInitialArticle()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight

      itemsRef.current.forEach((item, index) => {
        if (item) {
          const rect = item.getBoundingClientRect()
          if (rect.top < windowHeight && rect.bottom >= windowHeight / 2) {
            if (index === articlesArray.length - 1) {
              fetchNextArticle()
            }
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [articlesArray])

  return (
    <div className='test'>
      {articlesArray.map((item, key) => (
        <Article2
          article={item}
          key={item.id}
          articleRef={updateItemsRef(key)}
        />
      ))}
    </div>
  )
}

export default Test18

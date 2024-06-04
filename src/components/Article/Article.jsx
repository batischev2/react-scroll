import React from 'react'
import './article.scss'

const Article = ({ article, articleRef }) => {
  return (
    <article className='article' ref={articleRef}>
      <div className='article-top'>
        <h1>{article.post_title}</h1>
        <span>Дата публикации: {new Date(article.post_date).toLocaleDateString()}</span>
        <span>Автор: {article.post_author}</span>
      </div>
      <div className='article-body' dangerouslySetInnerHTML={{ __html: article.post_content }} />
    </article>
  )
}

export default Article

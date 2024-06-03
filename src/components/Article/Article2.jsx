import React from 'react'
import './article.scss'
import mock from '../../assets/image/67ba400c9648dd03c33976d6c69dd83d.jpg'

// const Article2 = ({ article, articleRef }) => {
//   return (
//     <article className="article" ref={articleRef}>
//       <div className="article-top">
//         <h1>{article.post_title}</h1>
//         <span>{new Date(article.post_date).toLocaleDateString()}</span>
//         <span>{article.autor}</span>
//         <div className="article-top_image">
//           <img src={mock} alt="#" />
//         </div>
//       </div>

//       <p>{article.post_content}</p>
//     </article>
//   );
// };

// export default Article2;

const Article2 = ({ article, articleRef }) => {
  return (
    <article className='article' ref={articleRef}>
      <div className='article-top'>
        <h1>{article.post_title}</h1>
        <span>
          Дата публикации:{new Date(article.post_date).toLocaleDateString()}
        </span>
        <span>Автор: {article.post_author}</span>
        {/* <div className="article-top_image">
          <img src={mock} alt="#" />
        </div> */}
      </div>
      <div
        className='article-body'
        dangerouslySetInnerHTML={{ __html: article.post_content }}
      />
    </article>
  )
}

export default Article2

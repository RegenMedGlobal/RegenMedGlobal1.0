import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const StyledArticleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* This will center the content vertically in the viewport */
  margin-top: 5%;
`;

const ArticleContainer = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #f8f8f8;
  width: 43%;
  margin: 20px 0 auto;
  height: 30%;
  display: flex;
  flex-direction: column;
`;

const ArticleDescription = styled.p`
  font-size: 1rem;
  color: #666;
`;

const ArticleMeta = styled.div`
  font-size: 0.8rem;
  color: #888;
`;


  const SUPABASE_URL = 'https://sxjdyfdpdhepsgzhzhak.supabase.co';
 const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4amR5ZmRwZGhlcHNnemh6aGFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODc1MDE2NiwiZXhwIjoyMDA0MzI2MTY2fQ.2_rrSgYe0ncUmBlRZAKiHN_q22RsqqNXsjamTRVujz8';

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

const Articles = () => {
  const [articles, setArticles] = useState([]);

useEffect(() => {
  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase.storage.from('articles').list();

      if (error) {
        console.error('Error fetching articles:', error);
        return;
      }

      // Access and display the author's name from the metadata for each article
      const articlesWithAuthorNames = data.map(article => {
        const authorName = article.metadata?.author || 'Unknown Author'; // Provide a default value if author's name is not available
        return { ...article, authorName };
      });

      console.log('Fetched articles with author names:', articlesWithAuthorNames);

      setArticles(articlesWithAuthorNames);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  fetchArticles();
}, []);


  const extractDescription = (text) => {
    if (text) {
      const sentences = text.split('. ');
      const firstFourSentences = sentences.slice(0, 4).join('. ');
      return firstFourSentences;
    }
    return '';
  };

  const formatDate = (dateString) => {
    if (dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
    return '';
  };

  return (
    <StyledArticleContainer>
      <h2>Articles</h2>
      {articles.map((article, index) => (
        <ArticleContainer key={index}>
          <ArticleDescription>{extractDescription(article.name)}</ArticleDescription>
          <ArticleMeta>
            {/* Replace 'article.name' with the appropriate field for author and published date */}
            By: Author Name | Published on {formatDate(article.created_at)}
          </ArticleMeta>
        <Link to={`/article/${article.name.replace('.docx', '').toLowerCase()}`} state={{ article: article }}>
  Read Article
</Link>


        </ArticleContainer>
      ))}
    </StyledArticleContainer>
  );
};

export default Articles;

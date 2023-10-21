import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

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
  width: 60%; /* Default width for larger screens */
  margin: 20px 0 auto;
  height: 30%;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    /* Adjust the width for screens narrower than 768px */
    width: 95%;
  }
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
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase.from('articles').select('*');

        if (error) {
          console.error('Error fetching articles:', error);
          return;
        }

        // Set the articles to the data fetched from the database
        setArticles(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchArticles();
  }, []);

  console.log('articles:', articles)

const extractDescription = (html) => {
  if (!html) {
    return '';
  }

  // Create a temporary div element to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Extract the text content from the parsed HTML
  const text = tempDiv.textContent;

  // Trim the text and limit it to a certain length
  const maxLength = 200; // You can adjust this to your desired length
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }

  return text;
};


  const formatDate = (dateString) => {
    if (dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
    return '';
  };

  // Define a utility function to make a string URL-friendly
function makeURLFriendly(str) {
  return str.toLowerCase().replace(/ /g, '-').replace(/\.$/, '');
}


return (
  <StyledArticleContainer>
    <h2>Articles</h2>
    {articles.map((article, index) => (
      <ArticleContainer key={index}>
        <h3>{article.title}</h3>
        <ArticleDescription>{extractDescription(article.content)}</ArticleDescription>
        <ArticleMeta>
          By: {article.author} | Published on {formatDate(article.created_at)}
        </ArticleMeta>
          <Link
          to={`/article/${makeURLFriendly(article.title)}-${makeURLFriendly(article.author)}`}
           state={{ article: article }}
         >
  Read Article
</Link>


      </ArticleContainer>
    ))}
  </StyledArticleContainer>
);
};

export default Articles;

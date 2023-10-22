import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Input } from 'antd';

const { Search } = Input;

const StyledAntdInput = styled(Search)`
  width: 40%;
  margin: 0 auto;
`;

const StyledArticleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  margin-top: 5%;

  @media (max-width: 865px) {
    /* Adjust top margin for screens narrower than 768px (mobile) */
    margin-top: 7rem; /* You can adjust this value to control the margin */
  }
`;


const ArticleContainer = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #f8f8f8;
  width: 60%;
  margin: 20px 0 auto;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
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
  const [filterTerm, setFilterTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase.from('articles').select('*');

        if (error) {
          console.error('Error fetching articles:', error);
          return;
        }

        setArticles(data);
        setFilteredArticles(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchArticles();
  }, []);

  const extractDescription = (html) => {
    if (!html) {
      return '';
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const text = tempDiv.textContent;

    const maxLength = 200;
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

  const onSearch = (value) => {
    setFilterTerm(value);
    let filtered;
    if (value.trim() === '') {
      // If the search term is empty, show all articles
      filtered = articles;
    } else {
      // Filter articles based on the search value
      filtered = articles.filter((article) =>
        article.content.toLowerCase().includes(value.toLowerCase())
      );
    }
    setFilteredArticles(filtered);
  };

  return (
    <StyledArticleContainer>
      <h2>Articles</h2>
      <StyledAntdInput
        placeholder="Search articles by content"
        onSearch={onSearch}
        enterButton
      />
      {filteredArticles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        filteredArticles.map((article, index) => (
          <ArticleContainer key={index}>
            <h3>{article.title}</h3>
            <ArticleDescription>{extractDescription(article.content)}</ArticleDescription>
            <ArticleMeta>
              By: {article.author} | Published on {formatDate(article.created_at)}
            </ArticleMeta>
            <Link to={`/article/${article.id}`} state={{ article: article }}>
              Read Article
            </Link>
          </ArticleContainer>
        ))
      )}
    </StyledArticleContainer>
  );
};

export default Articles;
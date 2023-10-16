import React from 'react';
import styled from 'styled-components';

// Define a styled component for the article container with an updated background color
const ArticleContainer = styled.div`
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #f8f8f8; /* Updated background color */
  width: 43%;
  margin: 20px 0 auto;
  height: 30%;
  display: flex;
  flex-direction: column;
`;
// Define a styled component for the article headline
const ArticleHeadline = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
`;

// Define a styled component for the article description
const ArticleDescription = styled.p`
  font-size: 1rem;
  color: #666;
`;

// Define a styled component for the author and published date
const ArticleMeta = styled.div`
  font-size: 0.8rem;
  color: #888;
`;

// Define a styled component for the image container
const ImageContainer = styled.div`
  max-width: 100%;
  max-height: 300px; /* Adjust the max height as needed */
  overflow: hidden;
`;

// Define a styled component for the image
const ArticleImage = styled.img`
  max-width: 100%;
  height: auto;
`;
const StyledArticleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* This will center the content vertically in the viewport */
  margin-top: 5%;
`;

const Articles = () => {
  // Sample data for articles (you can replace this with your actual data)
  const articles = [
    {
      id: 1,
      headline: 'Article 1 Headline',
      description: 'Description of Article 1.',
      imageUrl: 'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      author: 'John Doe',
      publishedDate: 'October 10, 2023',
      link: 'https://example.com/article1',
    },
    {
      id: 2,
      headline: 'Article 2 Headline',
      description: 'Description of Article 2.',
      imageUrl: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      author: 'Jane Smith',
      publishedDate: 'October 15, 2023',
      link: 'https://example.com/article2',
    },
    // Add more articles as needed
  ];

  return (
    <StyledArticleContainer>
      <h2>Articles</h2>
      {articles.map((article) => (
        <ArticleContainer key={article.id}>
          <ArticleHeadline>{article.headline}</ArticleHeadline>
          <ImageContainer>
            <ArticleImage src={article.imageUrl} alt={article.headline} />
          </ImageContainer>
          <ArticleDescription>{article.description}</ArticleDescription>
          <ArticleMeta>
            By: {article.author} | Published on: {article.publishedDate}
          </ArticleMeta>
          <a href={article.link} target="_blank" rel="noopener noreferrer">
            Read Article
          </a>
        </ArticleContainer>
      ))}
    </StyledArticleContainer>
  );
};

export default Articles;

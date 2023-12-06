import { useEffect, useState } from 'react';
import { Button as AntButton, Typography  } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { supabase } from '../SupaBaseClient';

const { Title } = Typography;

const StyledContainer= styled.section`
  background-color: #140437;
`;

const ArticleTitle = styled.h5`
  @media (max-width: 865px) {
    font-size: 1.25rem; /* Responsive font size for mobile */
  }
`;

const StyledButton = styled(AntButton)`
  width: 40px !important;
  height: 40px;
`;

const StyledLeftArrow = styled(LeftOutlined)`
  font-size: 24px !important;
  font-weight: bold;
`;

const StyledRightArrow = styled(RightOutlined)`
  font-size: 24px !important;
  font-weight: bold;
`;

const ArticleBox = styled.div`
  background-color: #201451;
  color: #FFF;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  height: 18rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  }
`;

const ReadMoreLink = styled.a`
  text-decoration: none;
  color: #FFF;
  font-weight: bold;
  margin-bottom: 1rem;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: darkpruple;
  }
`;

const ArticleMainPage = () => {

  const [articles, setArticles] = useState([]);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  // TODO: Add loading spinner and utilize error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articlesPerPage, setArticlesPerPage] = useState(window.innerWidth < 865 ? 1 : 3);

  useEffect(() => {
    const handleResize = () => {
      setArticlesPerPage(window.innerWidth < 865 ? 1 : 3);
    };
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('recordStatus', true)
        .order('created_at', { ascending: false });

      if (error) {
        // TODO: Handle error
        throw error;
      }
      return data || [];
    } catch (error) {
      // TODO: Handle error
      setError(error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadArticles = async () => {
      const fetchedArticles = await fetchArticles();
      setArticles(fetchedArticles);
    };
    loadArticles();
  }, []);

  const handlePreviousArticle = () => {
    setCurrentArticleIndex((prevIndex) => Math.max(prevIndex - articlesPerPage, 0));
  };

  const handleNextArticle = () => {
    setCurrentArticleIndex((prevIndex) => {
      const newIndex = prevIndex + articlesPerPage;
      if (newIndex >= articles.length) {
        // If newIndex exceeds the length of articles, reset to the beginning
        return 0;
      }
      return newIndex;
    });
  };

  const renderArticles = () => {
    if (articles.length === 0) {
      return <div>No articles available</div>;
    }

    return articles.slice(currentArticleIndex, currentArticleIndex + articlesPerPage).map((article) => {
      // Split the article content into sentences
      const sentences = article.content.split('.'); // Split by period to approximate sentences
      const cleanSentences = sentences.map(sentence => sentence.replace(/\s+/g, ' ').trim()); // Clean up each sentence
      const truncatedSentences = cleanSentences.slice(0, 3);
      let truncatedContent = truncatedSentences.join('. ');

      if (truncatedContent.length < article.content.length) {
        truncatedContent += '...'; // Add an ellipsis if the content is truncated
      }

      const articleWidth = articlesPerPage === 1 ? '100%' : '33.33%';

      return (
        <div key={article.id} style={{ width: articleWidth, display: 'inline-block', padding: '10px' }}>
          <ArticleBox>
            <ArticleTitle>{article.title}</ArticleTitle>
            <p>By: {article.author}</p>
            <p> Published on {new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(article.created_at))}</p>
            <ReadMoreLink href={`/article/${article.id}`}>Read More</ReadMoreLink>
          </ArticleBox>
        </div>
      );
    });
  };

  const flexAmount = articlesPerPage === 1 ? '1' : '10';
  const justifyAmount = articlesPerPage === 1 ? 'center' : 'space-between';
  const flexStart = articlesPerPage === 1 ? 'center' : 'flex-start';

  return (
    <StyledContainer>
      <Title level={2} style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Latest News</Title>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
          <div style={{ marginLeft: '40px', display: 'flex', alignItems: 'center' }}>
            <StyledButton
              onClick={handlePreviousArticle}
              icon={<StyledLeftArrow />}
            />
          </div>
          <div style={{ flex: flexAmount, display: 'flex', justifyContent: justifyAmount, alignItems: flexStart }}>
            {renderArticles()}
          </div>
          <div style={{ marginRight: '40px', display: 'flex', alignItems: 'center' }}>
            <StyledButton
              onClick={handleNextArticle}
              icon={<StyledRightArrow />}
            />
          </div>
        </div>
      </div>
    </StyledContainer>
  );
};

export default ArticleMainPage;

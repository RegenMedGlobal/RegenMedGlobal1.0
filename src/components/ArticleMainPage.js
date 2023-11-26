import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_API_KEY, SUPABASE_URL } from '../config';
import { Button as AntButton, Typography  } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

const { Title } = Typography;

const StyledContainer= styled.section`
  background-color: #140437;

`

const StyledButton = styled(AntButton)`
  margin-top: 7rem;

`;

const StyledLeftArrow = styled(LeftOutlined)`
 
`;

const StyledRightArrow = styled(RightOutlined)`
 
`;

const ArticleBox = styled.div`
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 865px) {
    height: 12rem;
    width: 12rem;
  }
`;


const ReadMoreLink = styled.a`
  text-decoration: none;
  color: var(--main-color);
  font-weight: bold;
  margin-bottom: 1rem;
  &:hover {
    color: darkpruple;
  }
`;


const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px; 
`;

const StyledHeader = styled.h3`
 color: white;
`

const StyledArticleContent = styled.div`
  flex-grow: 1;
  line-height: 1.6;
   overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* Limit to 3 lines */
    text-align: justify;

    @media (max-width: 865px) {
      h5 {
        font-size: 12px;
      }
  }
`;

const ArticleMainPage = () => {
  const [articles, setArticles] = useState([]);
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);

const fetchArticles = async () => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('recordStatus', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error:', error);
    return [];
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
    setCurrentArticleIndex((prevIndex) => {
      const newIndex = prevIndex - 3 < 0 ? articles.length - 3 : prevIndex - 3;
      return newIndex;
    });
  };

 const handleNextArticle = () => {
  setCurrentArticleIndex((prevIndex) => {
    const newIndex = prevIndex + 3;
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

     const numArticlesToShow = window.innerWidth < 865 ? 1 : 3;

     return articles.slice(currentArticleIndex, currentArticleIndex + numArticlesToShow).map((article) => {
      // Split the article content into sentences
       const sentences = article.content.split('.'); // Split by period to approximate sentences
    const cleanSentences = sentences.map(sentence => sentence.replace(/\s+/g, ' ').trim()); // Clean up each sentence
    const truncatedSentences = cleanSentences.slice(0, 3);
    let truncatedContent = truncatedSentences.join('. ');

    if (truncatedContent.length < article.content.length) {
      truncatedContent += '...'; // Add an ellipsis if the content is truncated
    }

      return (
        <div key={article.id} style={{ width: '33.33%', display: 'inline-block', padding: '10px' }}>
          <ArticleBox>
            <h5>{article.title}</h5>
            <StyledArticleContent dangerouslySetInnerHTML={{ __html: truncatedContent }} />
            <ReadMoreLink href={`/article/${article.id}`}>Read More</ReadMoreLink>
          </ArticleBox>
        </div>
      );
    });
  };

   return (
     <StyledContainer>
      <Title level={2} style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Latest News</Title>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: '1' }}>
            <StyledButton onClick={handlePreviousArticle} icon={<StyledLeftArrow  />} />
          </div>
          <div style={{ flex: '5', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {renderArticles()}
          </div>
          <div style={{ flex: '1' }}>
           <StyledButton onClick={handleNextArticle} icon={<StyledRightArrow  />} />
          </div>
        </div>
      </div>
    </StyledContainer>
  );
};

export default ArticleMainPage;
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_API_KEY, SUPABASE_URL } from '../config';
import { Button, Typography  } from 'antd';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import styled from 'styled-components';

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

const { Title } = Typography;

const StyledContainer= styled.section`
  background-color: #140437;

`

const ArticleBox = styled.div`
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ReadMoreLink = styled.a`
  text-decoration: none;
  color: blue;
  &:hover {
    color: darkblue;
  }
`;


const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px; /* Adjust margin as needed */
`;

const StyledHeader = styled.h3`
 color: white;
`


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
      const newIndex = (prevIndex + 3) % articles.length;
      return newIndex;
    });
  };
 const renderArticles = () => {
    if (articles.length === 0) {
      return <div>No articles available</div>;
    }

    return articles.slice(currentArticleIndex, currentArticleIndex + 3).map((article) => {
      // Split the article content into sentences
      const sentences = article.content.split('.'); // Split by period to approximate sentences
      const truncatedContent = sentences.slice(0, 3).join('. '); // Take the first three sentences

      return (
        <div key={article.id} style={{ width: '33.33%', display: 'inline-block', padding: '10px' }}>
          <ArticleBox>
            <h3>{article.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: truncatedContent }} />
            <ReadMoreLink href={`/article/${article.id}`}>Read More</ReadMoreLink>
          </ArticleBox>
        </div>
      );
    });
  };

   return (
    <StyledContainer>
        <Title level={2} style={{ color: 'white' }}>Latest News</Title>
        <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

        <div style={{ flex: '1' }}>
         <Button onClick={handlePreviousArticle} startIcon={<ChevronLeft />} sx={{ borderRadius: '50%', backgroundColor: 'blue', color: 'white' }} />
        </div>

        <div style={{ flex: '5', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {renderArticles()}
        </div>

  
        <div style={{ flex: '1' }}>
            <Button onClick={handleNextArticle} endIcon={<ChevronRight />} sx={{ borderRadius: '50%', backgroundColor: 'blue', color: 'white' }} />
        </div>
      </div>

      
    </div>
    </StyledContainer>
  );
};

export default ArticleMainPage;
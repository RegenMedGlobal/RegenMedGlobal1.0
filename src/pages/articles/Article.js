import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import styled from "styled-components";
import ReactHtmlParser from "react-html-parser";
import { Typography, Card } from "antd";

const { Title } = Typography;

const StyledContainer = styled.div`
  margin-top: 8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const StyledContent = styled.div`
  width: 100%;
  max-width: 857; /* Max width on mobile */
  padding: 1rem;
  text-align: center;

  @media (min-width: 768px) {
    max-width: 60%; /* Max width on desktop */
    text-align: justify; /* Justify text */
  }
`;


const Article = () => {
  const location = useLocation();
  const articleId = location.state.article.id;
  const [author, setAuthor] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleTitle, setArticleTitle] = useState("");


   const SUPABASE_URL = 'https://sxjdyfdpdhepsgzhzhak.supabase.co';
 const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4amR5ZmRwZGhlcHNnemh6aGFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODc1MDE2NiwiZXhwIjoyMDA0MzI2MTY2fQ.2_rrSgYe0ncUmBlRZAKiHN_q22RsqqNXsjamTRVujz8';


  const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

useEffect(() => {
  const fetchArticleContent = async () => {
    try {
      const { data: articleData, error } = await supabase
        .from("articles")
        .select("content, author, title")
        .eq("id", articleId)
        .single();

      console.log('article data:', articleData);

      if (error) {
        console.error("Error fetching article content:", error);
      } else {
        setAuthor(articleData.author);
        setArticleTitle(articleData.title);
        setArticleContent(articleData.content);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  fetchArticleContent();
}, [articleId]);


  return (
    <StyledContainer>
      <StyledContent>
        <Card title={`Author: ${author}`}>
          <Title level={3}>{articleTitle}</Title>
          {ReactHtmlParser(articleContent)}
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default Article;

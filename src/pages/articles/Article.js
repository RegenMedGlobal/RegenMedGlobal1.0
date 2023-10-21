import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import styled from "styled-components";
import ReactHtmlParser from "react-html-parser";
import { Typography, Card } from "antd";

const { Title } = Typography;

const StyledContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const StyledContent = styled.div`
  width: 100%;
  max-width: 857; /* Max width on mobile */
  padding: 1rem;

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

  const SUPABASE_URL = 'https://sxjdyfdpdhepsgzhzhak.supabase.co';
  const SUPABASE_API_KEY = 'your-api-key';

  const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

  useEffect(() => {
    const fetchArticleContent = async () => {
      try {
        const { data: articleData, error } = await supabase
          .from("articles")
          .select("content, author")
          .eq("id", articleId)
          .single();

        if (error) {
          console.error("Error fetching article content:", error);
        } else {
          setAuthor(articleData.author);
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
          <Title level={3}>Article Content</Title>
          {ReactHtmlParser(articleContent)}
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default Article;

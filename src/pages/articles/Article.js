import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import styled from "styled-components";
import ReactHtmlParser from "react-html-parser";
import { Typography, Card } from "antd";

const { Title } = Typography;

const StyledContainer = styled.div`
  margin-top: 7rem;
  height: 80vh;
`;

const StyledContent = styled.div`
  width: 60%;
  margin: 0 auto;
`;

const Article = () => {
  const location = useLocation();
  const articleId = location.state.article.id;
  const [author, setAuthor] = useState("");
  const [articleContent, setArticleContent] = useState("");

  console.log("state:", location.state);


  const SUPABASE_URL = 'https://sxjdyfdpdhepsgzhzhak.supabase.co';
 const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4amR5ZmRwZGhlcHNnemh6aGFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODc1MDE2NiwiZXhwIjoyMDA0MzI2MTY2fQ.2_rrSgYe0ncUmBlRZAKiHN_q22RsqqNXsjamTRVujz8';

  const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

 useEffect(() => {
    const fetchArticleContent = async () => {
      try {
        // Fetch the article content using the article ID
        const { data: articleData, error } = await supabase
          .from("articles")
          .select("content, author")
          .eq("id", articleId)
          .single();

        if (error) {
          console.error("Error fetching article content:", error);
        } else {
          // Set the author and article content
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
import  { useEffect, useState } from "react";
import {useParams, Link, useNavigate} from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import styled from "styled-components";
import ReactHtmlParser from "react-html-parser";
import { Typography, Card } from "antd";
import { Helmet } from 'react-helmet-async';

import ReactGA from "react-ga";

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

const StyledAuthor = styled.p`
  font-size: 1.2rem;
`


const Article = () => {
  const navigate = useNavigate(); 
 const { articleId } = useParams(); 
  const [author, setAuthor] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleTitle, setArticleTitle] = useState("");


   const SUPABASE_URL = 'https://sxjdyfdpdhepsgzhzhak.supabase.co';
 const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4amR5ZmRwZGhlcHNnemh6aGFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODc1MDE2NiwiZXhwIjoyMDA0MzI2MTY2fQ.2_rrSgYe0ncUmBlRZAKiHN_q22RsqqNXsjamTRVujz8';


  const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

 useEffect(() => {
    // Track a page view for this article
    ReactGA.pageview(window.location.pathname);

    // Send an event with custom dimension data
    ReactGA.event({
      category: "Article View",
      action: "View",
      label: articleTitle, // Replace with the title of the article
      dimension1: author, // Custom dimension for author
    });
  }, [articleId]);

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
                <Helmet>
          <title>{articleTitle}</title>
  
          <meta property="og:description"  content={articleTitle}  />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:type" content="article" />
        </Helmet>

        <Card>
          <Title level={3}>{articleTitle}</Title>
             <StyledAuthor>
            By{' '}
          <Link
  to={{
    pathname: '/articles',
    state: { filterTerm: author },
    search: `?filterTerm=${encodeURIComponent(author)}`,
  }}
>
  {author}
</Link>

          </StyledAuthor>
          {ReactHtmlParser(articleContent)}
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default Article;

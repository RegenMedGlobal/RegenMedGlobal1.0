import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import styled from 'styled-components';

const StyledContainer = styled.div`
 margin-top: 8%;
 height: 80vh;
`

const Article = () => {
  const location = useLocation();
  const { article } = location.state;
  const [articleText, setArticleText] = useState('');

  // Initialize Supabase client
 const SUPABASE_URL = 'https://sxjdyfdpdhepsgzhzhak.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4amR5ZmRwZGhlcHNnemh6aGFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODc1MDE2NiwiZXhwIjoyMDA0MzI2MTY2fQ.2_rrSgYe0ncUmBlRZAKiHN_q22RsqqNXsjamTRVujz8';

  const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

const fetchArticleText = async () => {
  try {
    const { data, error } = await supabase.storage
      .from('articles')
      .createSignedUrl(article.id, 60); // Assuming you want to create a signed URL to download the article

    if (error) {
      console.error('Error fetching article text:', error);
    } else {
      // Now you can use the data URL to access the article content
      // For example, you can set it in the state or display it directly
      setArticleText(data.signedURL);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};


useEffect(() => {
  console.log('Article state:', article);
  fetchArticleText();
}, [article]);


console.log('location.state:', location.state); 


  return (
    <StyledContainer>
      <h2>Article</h2>
      <p>{articleText}</p>
    </StyledContainer>
  );
};

export default Article;
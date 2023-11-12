import  { useEffect, useState, useContext } from "react";
import {useParams, Link, useNavigate} from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import styled from "styled-components";
import ReactHtmlParser from "react-html-parser";
import { AuthContext } from "../../AuthContext";
import { Typography, Card, Image, Button as AntButton } from "antd";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


import ReactGA from "react-ga";

const { Title } = Typography;

const StyledEditButton = styled(AntButton)`
  background-color: white;
  color: var(--main-color);
  font-weight: bold;

  &:hover {
    background-color: var(--main-color);
    color: white;
  }
`;

const StyledSaveButton = styled(AntButton)`
  background-color: white;
  color: var(--main-color);
  font-weight: bold;
  height: 3rem;
  font-size: 1.5rem;
  width: 45%; /* Keep the button width */
  margin: 1.8rem auto 0 auto; /* Center the button horizontally and maintain the top margin */
  border: 2px solid var(--main-color)  !important;

  &:hover {
    background-color: var(--main-color);
      color: white !important;
    border: 2px solid white;
  }
`;

const StyledButtonContainer = styled.div`
  text-align: center; /* Center the button horizontally */
  margin-top: 2%;
`;


const StyledContainer = styled.div`
  margin-top: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  
`;

const StyledArticleImage = styled(Image)`
  width: 300px; /* Set a specific width */
  height: 200px; /* Set a specific height */

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

const TitleWrapper = styled.div`
  text-align: center; /* Center text */
`;

const StyledAuthor = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--main-color);

   a {
    font-weight: bold;
    color: var(--main-color); /* Apply the color to links within StyledAuthor */
     text-decoration: none; 
  }
`

const editorStyle = {
  height: '400px', // Set the desired height here
};


const Article = () => {
  const navigate = useNavigate(); 
 const { articleId } = useParams(); 
  const [author, setAuthor] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [editedContent, setEditedContent] = useState("")
  const [articleTitle, setArticleTitle] = useState("");
  const [articleAuthorId, setArticleAuthorId] = useState("")
  const [imageUrl, setImageUrl] = useState(''); 
  const [editMode, setEditMode] = useState(false)
  const [editAvailable, setEditAvailable] = useState(false)
   const { authorLoggedIn, currentAuthorUser} = useContext(AuthContext);


   console.log('current auth user id', currentAuthorUser.authorId)
   console.log('aarticle data id:', articleAuthorId)

   useEffect(() => {

  if (authorLoggedIn && currentAuthorUser.authorId === articleAuthorId) {
    setEditAvailable(true);
  } else {
    setEditAvailable(false);
  }
}, [authorLoggedIn, currentAuthorUser.authorId, articleAuthorId]);


  const linkTo = articleAuthorId.startsWith('A')
    ? `/author/${articleAuthorId}`
    : `/profile/${articleAuthorId}`;



   const SUPABASE_URL = 'https://sxjdyfdpdhepsgzhzhak.supabase.co';
 const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4amR5ZmRwZGhlcHNnemh6aGFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODc1MDE2NiwiZXhwIjoyMDA0MzI2MTY2fQ.2_rrSgYe0ncUmBlRZAKiHN_q22RsqqNXsjamTRVujz8';


  const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


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
        .select("*")
        .eq("id", articleId)
        .single();

      console.log('article data:', articleData);

      if (error) {
        console.error("Error fetching article content:", error);
      } else {
        setAuthor(articleData.author);
        setArticleTitle(articleData.title);
        setArticleAuthorId(articleData.authorId)
        setArticleContent(articleData.content);
        setEditedContent(articleData.content)
        setImageUrl(articleData.imageUrl); 
        console.log('imageurl:', imageUrl)
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  fetchArticleContent();
}, [articleId]);

const handleEditClick = () => {
  setEditMode(true)
}

  const handleSaveClick = () => {
    // Update the data in the Supabase table
    console.log('edited content before updating:', editedContent)
    updateArticleContent(articleId, editedContent);

    setEditMode(false);
  };

  // Function to update the article content in the Supabase table
  const updateArticleContent = async (articleId, newContent) => {
    try {
      const { error } = await supabase
        .from("articles")
        .update({ content: editedContent })
        .eq("id", articleId);

      if (error) {
        console.error("Error updating article content:", error);
      } else {
        console.log("Article content updated successfully");
        setArticleContent(newContent)
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };


 let fileName;
let formattedSrc;

if (imageUrl) {
  const imageUrlParts = imageUrl.split("/");
  fileName = imageUrlParts[imageUrlParts.length - 1];
  formattedSrc = `https://sxjdyfdpdhepsgzhzhak.supabase.co/storage/v1/object/public/article_photos/${fileName}`;
}

  return (
    <StyledContainer>
          {formattedSrc && <img src={formattedSrc} alt="Article Preview" />}
      
      <StyledContent>
        <Card>
         <TitleWrapper>
          <Title level={3}>{articleTitle}</Title>
        </TitleWrapper>
          {editAvailable && <StyledEditButton onClick={handleEditClick}>Edit</StyledEditButton>}
             <StyledAuthor>
           <StyledAuthor>
  By{' '}

   <Link to={linkTo}>
    {author}
  </Link>
</StyledAuthor>


          </StyledAuthor>
            
          {editMode ? (
            <>
              <ReactQuill
                value={editedContent}
                onChange={(value) => setEditedContent(value)}
                modules={{ toolbar: true }}
                style={editorStyle}
              />
              <StyledButtonContainer>
                <StyledSaveButton onClick={handleSaveClick}>Save Changes</StyledSaveButton>
              </StyledButtonContainer>
            </>
          ) : (
            <div>{ReactHtmlParser(articleContent)}</div>
          )}
          
        </Card>
      </StyledContent>
    </StyledContainer>
  );
};

export default Article;

import  { useEffect, useState, useContext } from "react";
import {useParams, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_API_KEY, SUPABASE_URL } from "../../config";
import styled from "styled-components";
import ReactHtmlParser from "react-html-parser";
import { AuthContext } from "../../AuthContext";
import { Typography, Card, Button as AntButton } from "antd";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactGA from "react-ga";
import Sidebar from "./Sidebar";

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

const StyledArticleSidebar = styled.div`
  margin-right: 4rem;
  margin-top: 4rem;
  width: 10%;

  @media (max-width: 865px) {
    display: none;
  }
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
`;

const editorStyle = {
  height: '400px', // Set the desired height here
};

const StyledMainContainer = styled.section`
  display: flex;
  flex-direction: row;

  @media (max-width: 869px) {
    width: 95%;
    margin: 0 auto;
  }
`;

const Article = () => {
  const { articleId } = useParams(); 
  const [author, setAuthor] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [editedContent, setEditedContent] = useState("")
  const [articleTitle, setArticleTitle] = useState("");
  const [articleAuthorId, setArticleAuthorId] = useState("")
  const [imageUrl, setImageUrl] = useState(''); 
  const [editMode, setEditMode] = useState(false)
  const [editAvailable, setEditAvailable] = useState(false)
  const { authorLoggedIn, currentAuthorUser, currentUser, loggedIn } = useContext(AuthContext);

  let currentUserString = currentUser;
  let doctorUserId = ''; // Define doctorUserId here

  try {
    // Parse the string into a JavaScript object
    let currentUserObject = JSON.parse(currentUserString);

    // Check if the parsed object has the userId property
    if (currentUserObject && Object.prototype.hasOwnProperty.call(currentUserObject, 'userId')) {
      doctorUserId = currentUserObject.userId; // Assign value to the outer doctorUserId
      console.log('User ID:', doctorUserId); // Access userId
    } else {
      console.log('User is not logged in or currentUser is not defined');
    }
  } catch (error) {
    console.log('Error parsing currentUser:', error);
  }

  console.log('doctoruserid: ', doctorUserId); // Now doctorUserId is accessible here
  console.log('edit available? ', editAvailable)

  useEffect(() => {
    if (authorLoggedIn && currentAuthorUser.authorId === articleAuthorId || loggedIn && doctorUserId === articleAuthorId  ) {
      setEditAvailable(true);
    } else {
      setEditAvailable(false);
    }
  }, [authorLoggedIn, currentAuthorUser.authorId, articleAuthorId, loggedIn, currentUser.id]);

  const linkTo = articleAuthorId.startsWith('A')
    ? `/author/${articleAuthorId}`
    : `/profile/${articleAuthorId}`;

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

        if (error) {
          // TODO: Handle error properly
          console.error("Error fetching article content:", error);
        } else {
          setAuthor(articleData.author);
          setArticleTitle(articleData.title);
          setArticleAuthorId(articleData.authorId)
          setArticleContent(articleData.content);
          setEditedContent(articleData.content)
          setImageUrl(articleData.imageUrl); 
        }
      } catch (error) {
        // TODO: Handle error properly
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
        // TODO: Handle error properly
        console.error("Error updating article content:", error);
      } else {
        setArticleContent(newContent)
      }
    } catch (error) {
      // TODO: Handle error properly
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
    <StyledMainContainer>
    <StyledContainer>
      {/* {formattedSrc && <img src={formattedSrc} alt="Article Preview" />} */}
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
    <StyledArticleSidebar>
      <Sidebar />
    </StyledArticleSidebar>
    </StyledMainContainer>
  );
};

export default Article;

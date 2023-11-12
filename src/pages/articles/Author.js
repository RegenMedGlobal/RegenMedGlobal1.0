import {useParams, Link} from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { createClient } from "@supabase/supabase-js";
import styled from 'styled-components';
import ReactGA from "react-ga"; // Import React Google Analytics
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

import { Typography, Spin, Input, Button } from "antd";

const { Title, Paragraph  } = Typography;

const StyledAuthorContainer = styled.div`
  display: flex;
  margin-top: 8rem;
  padding: 1rem;
`;

const ArticleHeader = styled.h4`
  text-align: center;
  margin-right: 18%;
  margin-top: 4%;
`


const AuthorName = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 20px;
  font-size: 24px;
  margin-bottom: 20px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 2rem;

  width: 30%;
  margin-left: 3rem;
`;

const BioContainer = styled.div`
  flex: 1;

`;

const BioLabel = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
`;

const Bio = styled.p`
  font-size: 16px;
  width: 60%;
  height: 10rem;
  background-color: #f2f2f2; /* Background color */
  border: 1px solid #ccc; /* Border style */
  padding: 10px; /* Padding for the bio content */
  border-radius: 5px; /* Rounded corners */
  margin-left: 10rem;

  margin-top: 4rem;
`;

const EditButton = styled.button`
  background-color: #1890ff;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ArticleContainer = styled.div`
  margin-top: 20px;
  margin-left: 10%;
 width: 60%;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
`;

// Create a styled component for the article title
const ArticleTitle = styled.h3`
  margin-bottom: 10px;
`;

// Create a styled component for the article description
const ArticleDescription = styled.p`
  margin-bottom: 10px;
`;

// Create a styled component for the article metadata
const ArticleMeta = styled.p`
  font-size: 12px;
  color: #777;
  margin-bottom: 10px;
`;

import { Typography, Spin, Input, Button } from "antd";

const { Title, Paragraph  } = Typography;

const StyledAuthorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8rem;
  padding: 1rem;
  text-align: center;
`;

const AuthorName = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 20px;
  font-size: 24px;
  margin-bottom: 20px;
`;

const Bio = styled.p`
  font-size: 16px;
  width: 40%;
  height: 10rem;
  background-color: #f2f2f2; /* Background color */
  border: 1px solid #ccc; /* Border style */
  padding: 10px; /* Padding for the bio content */
  border-radius: 5px; /* Rounded corners */
`;

const EditButton = styled.button`
  background-color: #1890ff;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Author = () => {
   const { authorId } = useParams(); 
   const { authorLoggedIn, currentAuthorUser} = useContext(AuthContext);
   const [authorData, setAuthorData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editAvailable, setEditAvailable] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [editedName, setEditedName] = useState("");
  const [editedBio, setEditedBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
 const [authorArticles, setAuthorArticles] = useState([]);


  useEffect(() => {
    // Initialize React Google Analytics
    ReactGA.initialize("G-7C3YMEXX61");
    // Send a pageview event to Google Analytics when the component mounts
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    // Track a virtual pageview whenever the authorId changes
    ReactGA.pageview(`/author/${authorId}`);
  }, [authorId]);


   
  const SUPABASE_URL = 'https://sxjdyfdpdhepsgzhzhak.supabase.co';
 const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4amR5ZmRwZGhlcHNnemh6aGFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODc1MDE2NiwiZXhwIjoyMDA0MzI2MTY2fQ.2_rrSgYe0ncUmBlRZAKiHN_q22RsqqNXsjamTRVujz8';


  const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

useEffect(() => {
  
  console.log('author logged in:', authorLoggedIn);
  console.log('author id:', authorId);
  //console.log('id from current user:', currentAuthorUser.id);

  // Check if the user is logged in as an author and matches the current author ID
  if (authorLoggedIn && currentAuthorUser && currentAuthorUser.authorId === authorId) {
  //console.log('Setting Edit available to true');
  setEditAvailable(true);
} else {
 // console.log('Setting Edit available to false');
  setEditAvailable(false);
}
}, [authorLoggedIn, currentAuthorUser, authorId]);

useEffect(() => {
  const fetchData = async () => {
    try {
      console.log('Fetching author data...');
      const { data: authorData, error: authorError } = await supabase
        .from('author_data')
        .select('*')
        .eq('authorId', authorId)
        .single();

      if (authorError) {
        console.error('Error fetching author data:', authorError);
        return;
      }

      console.log('Fetched author data:', authorData);
      setAuthorData(authorData);

       // Send a custom event to Google Analytics when author data is fetched
      ReactGA.event({
        category: 'Author',
        action: 'Fetched Author Data',
        label: authorData?.authorName,
      });


      // Fetch articles
      if (authorData && authorData.authorId) {
        console.log('Fetching author articles...');
        const { data: articles, error: articlesError } = await supabase
          .from('articles')
          .select('*')
          .eq('authorId', authorId)
          .eq('recordStatus', true); 

        if (articlesError) {
          console.error('Error fetching author articles:', articlesError);
          return;
        }

        console.log('Fetched author articles:', articles);
        setAuthorArticles(articles || []);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      console.log('Setting isLoading to false.');
      setIsLoading(false);
    }
  };

  fetchData();
}, [authorId]);





const handleRemoveButtonClick = async () => {
  try {
    // Check if the author has an existing profile picture
    if (profilePictureUrl) {
      // Extract the filename from the URL
      const filename = profilePictureUrl.split('/').pop();

      // Delete the file from Supabase Storage
      const { error: deleteError } = await supabase
        .storage
        .from('author_photos')
        .remove([filename]);

      if (deleteError) {
        console.error("Error deleting profile picture:", deleteError);
        return;
      }
    }

    // Remove the profile picture from state
    setProfilePicture(null);
    setProfilePictureUrl(null);
     


    // Update the author data with a null profile picture URL
    setAuthorData((prevData) => ({
      ...prevData,
      profilePictureUrl: null,
    }));
  } catch (error) {
    console.error("An error occurred:", error);
  }
};



   const handleEditButtonClick = () => {
    // Set editedName and editedBio to the current values from authorData
    setEditedName(authorData.authorName);
    setEditedBio(authorData.bio);
    setEditMode(true);
  };

  

const handleSaveButtonClick = async () => {
  try {
    // Upload profile picture if selected
    if (profilePicture) {
      // Define the filename as authorId_filename
      const filename = `author_${authorId}_${profilePicture.name}`;

      // Upload the profile picture to Supabase Storage
      const { data: fileData, error: uploadError } = await supabase
        .storage
        .from('author_photos')
        .upload(filename, profilePicture);

      if (uploadError) {
        console.error("Error uploading profile picture:", uploadError);
        return;
      }

      // Get the public URL of the uploaded file
      const profilePictureUrl = fileData[0].url;

      // Update the author data with the new profile picture URL
      setAuthorData((prevData) => ({
        ...prevData,
        profilePictureUrl,
      }));

      // Set the profile picture URL explicitly for immediate display
      setProfilePictureUrl(profilePictureUrl);

      // Reset the profile picture state
      setProfilePicture(null);
    }

    // Update other data in Supabase
    const { data, error } = await supabase
      .from("author_data")
      .update([
        {
          authorId: authorId,
          authorName: editedName,
          bio: editedBio,
        },
      ])
      .eq("authorId", authorId);

    if (error) {
      console.error("Error updating author data:", error);
    } else {
      console.log("Author data updated successfully");

      // Update the local state with the new values
      setAuthorData((prevData) => ({
        ...prevData,
        authorName: editedName,
        bio: editedBio,
      }));
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // Turn off edit mode after updating data
    setEditMode(false);
  }
};



  const formatDate = (dateString) => {
    if (dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
    return '';
  };


  const handleFileInputChange = (e) => {
  const file = e.target.files[0];
  setProfilePicture(file);
};

useEffect(() => {
  const fetchAuthorImage = async () => {
    try {
      // Fetch all files from storage
      const { data: files, error: storageError } = await supabase
        .storage
        .from('author_photos')
        .list();

      if (storageError) {
        console.error('Error fetching files from storage:', storageError);
        return;
      }

      // Find the filename that contains the authorId
      const authorFilename = files.find(file => file.name.includes(`author_${authorId}_`));

       console.log('Author Filename:', authorFilename);

      if (!authorFilename) {
        console.error('Image not found for authorId:', authorId);
        return;
      }
 // Construct the full image URL based on the format
      const publicURL = `https://sxjdyfdpdhepsgzhzhak.supabase.co/storage/v1/object/public/author_photos/${authorFilename.name}`;
      console.log('Public URL:', publicURL);
      setProfilePictureUrl(publicURL);
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchAuthorImage();
}, [authorId]);


  console.log('author data: ', authorData)
  
  return (
    <StyledAuthorContainer>
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <>
          <Sidebar>
            <AuthorName>
              {editMode ? (
                <>
                  <span>Name:</span>
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                </>
              ) : (
                authorData.authorName
              )}
            </AuthorName>
            {profilePictureUrl && (
              <img
                src={profilePictureUrl}
                alt={`Profile Picture `}
                style={{ width: '150px', height: '150px', borderRadius: '50%' }}
              />
            )}
            {editMode && profilePictureUrl && (
              <Button type="danger" onClick={handleRemoveButtonClick}>
                Remove
              </Button>
            )}
            <SocialLinks>
              {authorData.facebookLink && (
                <a href={authorData.facebookLink}>
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
              )}
              {authorData.twitterLink && (
                <a href={authorData.twitterLink}>
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
              )}
              {authorData.instagramLink && (
                <a href={authorData.instagramLink}>
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
              )}
              {authorData.youtubeLink && (
                <a href={authorData.youtubeLink}>
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
              )}
            </SocialLinks>
           {editAvailable && (
  <p>
    Submit an article{' '}

    <Link to="/submitarticle">here</Link>
  </p>
)}

          </Sidebar>
          <BioContainer>
            <div>About me:</div>
            <Bio>
              {editMode ? (
                <>
                  <BioLabel>Bio:</BioLabel>
                  <Input.TextArea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    style={{ resize: 'both' }}
                  />
                </>
              ) : (
                authorData.bio
              )}
            </Bio>
                {authorArticles && authorArticles.length > 0 ? (
              <div>
                <ArticleHeader>Articles by {authorData.authorName}</ArticleHeader>
                {authorArticles.map((article) => (
                  <ArticleContainer key={article.id}>
                    <ArticleTitle>{article.title}</ArticleTitle>
                    <ArticleDescription>{/* extract description logic here */}</ArticleDescription>
                    <ArticleMeta>
                      By: {article.author} | Published on {formatDate(article.created_at)}
                    </ArticleMeta>
                    <Link to={`/article/${article.id}`} state={{ article: article }}>
                      Details
                    </Link>
                  </ArticleContainer>
                ))}
              </div>
            ) : (
              <p>No articles found.</p>
            )}
            {editAvailable && !editMode && (
              <EditButton onClick={handleEditButtonClick}>
                <FontAwesomeIcon icon={faEdit} />
                Edit
              </EditButton>
            )}
            {editMode && (
              <>
                Upload your profile photo:
                {!profilePictureUrl && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                  />
                )}
                <Button
                  type="primary"
                  onClick={handleSaveButtonClick}
                  style={{
                    backgroundColor: 'var(--main-color)',
                    color: '#fff',
                    border: 'none',
                    marginTop: '2rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Save
                </Button>
              </>
            )}
          </BioContainer>
        </>
      )}
    </StyledAuthorContainer>
  );
};

export default Author;
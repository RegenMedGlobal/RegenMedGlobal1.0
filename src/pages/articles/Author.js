import {useParams, Link} from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { createClient } from "@supabase/supabase-js";
import styled from 'styled-components';
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



   
  const SUPABASE_URL = 'https://sxjdyfdpdhepsgzhzhak.supabase.co';
 const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4amR5ZmRwZGhlcHNnemh6aGFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODc1MDE2NiwiZXhwIjoyMDA0MzI2MTY2fQ.2_rrSgYe0ncUmBlRZAKiHN_q22RsqqNXsjamTRVujz8';


  const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

useEffect(() => {
  
  console.log('author logged in:', authorLoggedIn);
  console.log('author id:', authorId);
  console.log('id from current user:', currentAuthorUser.id);

  // Check if the user is logged in as an author and matches the current author ID
  if (authorLoggedIn && currentAuthorUser && currentAuthorUser.id === parseInt(authorId)) {
  //console.log('Setting Edit available to true');
  setEditAvailable(true);
} else {
 // console.log('Setting Edit available to false');
  setEditAvailable(false);
}
}, [authorLoggedIn, currentAuthorUser, authorId]);


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
          id: authorId,
          authorName: editedName,
          bio: editedBio,
        },
      ])
      .eq("id", authorId);

    if (error) {
      console.error("Error updating author data:", error);
    } else {
      console.log("Author data updated successfully");

      
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // Turn off edit mode after updating data
    setEditMode(false);
  }
};


  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const { data: authorData, error } = await supabase
          .from('author_data')
          .select('*')
          .eq('id', authorId)
          .single();

        if (error) {
          console.error('Error fetching author data:', error);
        } else {
          setAuthorData(authorData);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorData();
  }, [authorId]);

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
     {profilePictureUrl && <img
  src={profilePictureUrl}
  alt={`Profile Picture `}
  style={{ width: '250px', height: '250px', borderRadius: '50%' }}
/>}
{editMode && profilePictureUrl &&  <Button type="danger" onClick={handleRemoveButtonClick}>
                    Remove
                  </Button>}

          <AuthorName>
            {editMode ? (
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            ) : (
              authorData.authorName
            )}
          </AuthorName>
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
          <Bio>
            {editMode ? (
              <Input.TextArea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
              />
            ) : (
              authorData.bio
            )}
          </Bio>
          {editAvailable && !editMode && (
            <EditButton onClick={handleEditButtonClick}>
              <FontAwesomeIcon icon={faEdit} />
              Edit
            </EditButton>
          )}
          {editMode && (
              <>
    <input
      type="file"
      accept="image/*"
      onChange={handleFileInputChange}
    />
    <Button type="primary" onClick={handleSaveButtonClick}>
      Save
    </Button>
  </>
          )}
        </>
      )}
    </StyledAuthorContainer>
  );
};

export default Author;
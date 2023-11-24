import { useState, useRef, useContext, useEffect } from 'react';
import { Upload, Button as AntButton, Input, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import ReactQuill from 'react-quill';
import { AuthContext } from '../../AuthContext';
import getProfile from '../../functions/getProfile';
import 'react-quill/dist/quill.snow.css'; // Import styles



const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  padding: 20px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 7%;
  
`;

const StyledInput = styled.input`
width: 16rem;
margin: 0 auto;

margin-bottom: 2%;
`

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  margin-top: 2rem;
  font-weight: bold;
`;

const Header = styled.h2`
  font-size: 24px;
  margin-bottom: 3%;
`;

const SuccessMessage = styled.p`
  color: green;
   text-align: center;
  margin-top: 2rem;
  font-weight: bold;
`;

const UploadButton = styled.button`
  background-color: #007BFF; // Change to your preferred background color
  color: #fff; // Change to your preferred text color
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3; // Change to the hover color you prefer
  }
`;


const SubmitArticle = () => {
  const [articleContent, setArticleContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null); 
  const fileInputRef = useRef(null);
  const [success, setSuccess] = useState(false);
  const [doctorData, setDoctorData] = useState([])
  const { authorLoggedIn, currentAuthorUser, currentUser, loggedIn} = useContext(AuthContext);

  console.log('current user  in from submit:', currentUser)

  console.log('current author usser: ', currentAuthorUser)

  console.log('current author  from submit article: ', currentAuthorUser.authorName)

  
  const SUPABASE_URL = 'https://sxjdyfdpdhepsgzhzhak.supabase.co';
 const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4amR5ZmRwZGhlcHNnemh6aGFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODc1MDE2NiwiZXhwIjoyMDA0MzI2MTY2fQ.2_rrSgYe0ncUmBlRZAKiHN_q22RsqqNXsjamTRVujz8';

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['bold', 'italic', 'underline'],
      ['link'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'list',
    'bold',
    'italic',
    'underline',
    'link',
  ];

 
  let currentUserID;
  try {
    if(currentUser) {
      const jsonUser = JSON.parse(currentUser);
      console.log("jsonuser", jsonUser);
      currentUserID = jsonUser.userId;
      console.log("current userid from json in profile:", currentUserID);
    }
  } catch (error) {
    console.error("Error parsing or accessing user data:", error);
  }



useEffect(() => {
  getProfile(currentUserID)
    .then((response) => {
      console.log('Fetched profile data-:', response); // Debugging log
      setDoctorData(response)

    })
    .catch((error) => {
      console.error('Error fetching profile data:', error);
    });
}, [currentUser]);

console.log('doctor data from submit: ', doctorData)

  const handleAuthorNameChange = (event) => {
    setAuthorName(event.target.value);
  };

  const handleTitleChange = (event) => {
    setArticleTitle(event.target.value);
  };

  const clearFileInput = () => {
  // Clear the file input by resetting its value
  if (fileInputRef.current) {
    console.log('Clearing file input value');
    fileInputRef.current.value = '';
    console.log('File input value after clearing:', fileInputRef.current.value);
  }
};

const handleFileChange = (info) => {
  if (info.file.status === 'done') {
    message.success(`${info.file.name} file uploaded successfully`);
    setFile(info.file.originFileObj); // Store the uploaded file
    clearFileInput();
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
};




 const handleArticleSubmission = async () => {
    try {
      if (!articleContent  || !articleTitle) {
        setError('Please provide content, the author name, and the article title.');
        return;
      }

      // Generate a unique identifier for the database record
      const recordId = uuidv4();

      let imageUrl = null;

      // Check if a file is selected
      if (file) {
        // Upload the image file to the storage bucket
        const { data: imageStorageData, error: imageStorageError } = await supabase.storage
          .from('article_photos')
          .upload(`${recordId}_${file.name}`, file);

        console.log('Image storage data:', imageStorageData);

        if (imageStorageError) {
          console.error('Error during image upload:', imageStorageError);
          setError('An error occurred while submitting the article.');
          return;
        }

        // Construct the image URL from the path
        imageUrl = `${SUPABASE_URL}/storage/v1/object/${imageStorageData.path}`;
      }

      // Insert a record in your database table with author, id, title, and image URL
      const databaseRecord = {
        id: recordId,
        author: authorLoggedIn ? currentAuthorUser.authorName : doctorData.name,
        title: articleTitle,
        content: articleContent,
        imageUrl: imageUrl, // Store the image URL in the database if available
        recordStatus: true,
        authorId: authorLoggedIn ? currentAuthorUser.authorId : doctorData.id
      };

      const { data: insertedData, error: insertError } = await supabase.from('articles').insert([databaseRecord]);

      if (insertError) {
        console.error('Error inserting record in the database:', insertError);
        setError('An error occurred while submitting the article.');
        return;
      }

      // Reset the relevant input fields, file, and error message after successful submission
      setAuthorName('');
      setArticleTitle('');
      setArticleContent('');
      setFile(null);
      setError(null);
      clearFileInput();
      setSuccess(true);

      console.log('Image uploaded to storage:', imageUrl);
      console.log('Database record inserted successfully:', insertedData);
    } catch (error) {
      console.error('An error occurred:', error);
      setError('An error occurred while submitting the article.');
    }
  };



  // Define custom CSS styles for the ReactQuill editor
  const editorStyles = {
    height: '400px', // Adjust the height as needed
    width: '80%', // Set the width to 100% to make it responsive
  };

    const handleRichTextChange = (content) => {
    // Log the HTML content
    console.log('HTML Content:', content);
    setArticleContent(content);
  };

  console.log()

    // Check if the user is not logged in
  if (!authorLoggedIn && !loggedIn) {
    return (
      <StyledContainer>
        <ErrorMessage>You must be logged in to submit an article.</ErrorMessage>
      </StyledContainer>
    );
  }


return (
 <>
  <StyledContainer>
    <Header>Submit Article</Header>
    <h4>{currentAuthorUser.authorName}</h4>
    <h4>{doctorData.name}</h4>
    <StyledInput
      type="text"
      value={articleTitle}
      onChange={handleTitleChange}
      placeholder="Article Title"
    />

    <Upload
      accept=".jpg, .jpeg, .png, .gif"
      beforeUpload={(file) => {
        fileInputRef.current = file;
        setFile(file);
        return false;
      }}
      onChange={handleFileChange}
    >
      <UploadButton icon={<UploadOutlined />}>Upload Image</UploadButton>
    </Upload>

    <ReactQuill
      value={articleContent}
      modules={modules}
      formats={formats}
      onChange={handleRichTextChange}
      style={editorStyles}
    />

 


  
  </StyledContainer>
  {error && <ErrorMessage>{error}</ErrorMessage>}
    {success && <SuccessMessage>Article submitted successfully!</SuccessMessage>}
    <AntButton style={{marginLeft: '50rem', marginTop: '2rem', marginBottom: '4rem', width: '20%'}} type="primary" size="large" onClick={handleArticleSubmission}>
      Submit Article
    </AntButton></>
);

};

export default SubmitArticle;
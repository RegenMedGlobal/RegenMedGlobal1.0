import { useState } from 'react';
import { Upload, Button as AntButton, Input, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles
import html2pdf from 'html2pdf.js';


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
  margin: 10px 0;
`;

const Header = styled.h2`
  font-size: 24px;
  margin-bottom: 3%;
`;

const SuccessMessage = styled.p`
  color: green;
  margin: 10px 0;
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


const PasswordForm = ({ onSignIn }) => {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    // Clear the password error message when the user starts typing a new password
    setPasswordError('');
  };

  const handleSignIn = () => {
    if (password === 'regenmedarticle') {
      onSignIn();
    } else {
      setPasswordError('Invalid password. Please try again.');
    }
  };



  return (
    <div>
      <Header>Sign In</Header>
      <StyledInput
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Enter your password..."
      />
      <button onClick={handleSignIn}>Sign In</button>
      {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
    </div>
  );
};

const SubmitArticle = () => {
  const [articleContent, setArticleContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

  
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

  const handleAuthorNameChange = (event) => {
    setAuthorName(event.target.value);
  };

  const handleTitleChange = (event) => {
    setArticleTitle(event.target.value);
  };


const handleArticleSubmission = async () => {
  try {
    if (!articleContent || !authorName || !articleTitle) {
      setError('Please provide content, the author name, and the article title.');
      return;
    }

    // Generate a unique identifier for the database record
    const recordId = uuidv4();

    // Construct the filename for the HTML file
    const fileName = `${recordId}_${articleTitle}_${authorName}.html`;

    // Upload the HTML content to the storage bucket
    const { data: storageData, error: storageError } = await supabase.storage
      .from('articles')
      .upload(fileName, articleContent);

    if (storageError) {
      console.error('Error uploading HTML content to storage:', storageError);
      setError('An error occurred while submitting the article.');
      return;
    }

    // Insert a record in your database table with author, id, and title
    const databaseRecord = {
      id: recordId,
      author: authorName,
      title: articleTitle,
      content: articleContent
    };

    const { data: insertedData, error: insertError } = await supabase.from('articles').insert([databaseRecord]);

    if (insertError) {
      console.error('Error inserting record in the database:', insertError);
      setError('An error occurred while submitting the article.');
      return;
    }

    // Reset the relevant input fields and error message after successful submission
    setAuthorName('');
    setArticleTitle('');
    setArticleContent('');
    setError(null);

      setSuccess(true);

    console.log('HTML content uploaded to storage:', storageData);
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

  return (
    <StyledContainer>
      {isSignedIn ? (
        <>
          <Header>Submit Article</Header>
          <StyledInput
            type="text"
            value={articleTitle}
            onChange={handleTitleChange}
            placeholder="Article Title"
          />
          <StyledInput
            type="text"
            value={authorName}
            onChange={handleAuthorNameChange}
            placeholder="Author's Name"
          />

  <ReactQuill
    value={articleContent}
    modules={modules}
    formats={formats}
    onChange={handleRichTextChange}
    style={editorStyles}
  />


         <AntButton
  type="primary" // You can use different types like 'primary', 'default', 'dashed', 'text', etc.
  size="large" // You can use 'small', 'default', or 'large' for different sizes
  onClick={handleArticleSubmission}
>
  Submit Article
</AntButton>

          {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>Article submitted successfully!</SuccessMessage>}
        </>
      ) : (
        <PasswordForm onSignIn={() => setIsSignedIn(true)} />
      )}
    </StyledContainer>
  );
};

export default SubmitArticle;
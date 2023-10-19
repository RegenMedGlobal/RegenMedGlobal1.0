import { useState } from 'react';
import { Upload, Button, Input, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { createClient } from '@supabase/supabase-js';


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
width: 12rem;
margin: 0 auto;
margin-top: 2%;
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
   const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
   const [authorName, setAuthorName] = useState(''); // Stat
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState(null); // New state for error handling

  const SUPABASE_URL = 'https://sxjdyfdpdhepsgzhzhak.supabase.co';
 const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4amR5ZmRwZGhlcHNnemh6aGFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODc1MDE2NiwiZXhwIjoyMDA0MzI2MTY2fQ.2_rrSgYe0ncUmBlRZAKiHN_q22RsqqNXsjamTRVujz8';

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

 const handleAuthorNameChange = (event) => {
    setAuthorName(event.target.value); // Update authorName state with the entered name
  };


const handleFileChange = (event) => {
  if (event.target.files && event.target.files[0]) {
    setSelectedFile(event.target.files[0]);
  }
};



const handleFileUpload = async () => {
  if (!selectedFile || !authorName) {
    setError('Please select a file and provide the author name.');
    return;
  }

  const randomNumber = Math.floor(Math.random() * 1000); // Generate a random number
  const fileName = `${authorName}_${randomNumber}_${selectedFile.name}`; // Combine author name, random number, and original filename

  const metadata = {
    author: authorName,
    // Other metadata fields
  };

  const { data, error } = await supabase.storage
    .from('articles')
    .upload(fileName, selectedFile, { metadata });

  if (error) {
    console.error('Error uploading file:', error.message);
    return;
  }

  console.log('File uploaded successfully:', data);
  setUploadSuccess(true);
};


return (
  <StyledContainer>
    {isSignedIn ? (
      <>
        <Header>Upload Article</Header>
        <input
          type="file"
          accept=".doc,.docx" // Accept DOC and DOCX files
          onChange={handleFileChange}
        />
        <StyledInput
          value={authorName}
          onChange={handleAuthorNameChange}
          placeholder="Author's Name"
        />
       <UploadButton onClick={handleFileUpload}>Upload Article</UploadButton>

        {uploadSuccess && <SuccessMessage>Article successfully uploaded to Supabase!</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </>
    ) : (
      <PasswordForm onSignIn={() => setIsSignedIn(true)} />
    )}
  </StyledContainer>
);
};

export default SubmitArticle;
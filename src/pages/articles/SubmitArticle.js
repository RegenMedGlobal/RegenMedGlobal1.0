import { useState } from 'react';
import addArticleToSupabase from './functions/addArticle'; // Adjust the import path
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

const ErrorMessage = styled.p`
  color: red;
  margin: 10px 0;
`;

const Header = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const SuccessMessage = styled.p`
  color: green;
  margin: 10px 0;
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
      <input
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
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState(null); // New state for error handling

  const SUPABASE_URL = 'https://sxjdyfdpdhepsgzhzhak.supabase.co';
 const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4amR5ZmRwZGhlcHNnemh6aGFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODc1MDE2NiwiZXhwIjoyMDA0MzI2MTY2fQ.2_rrSgYe0ncUmBlRZAKiHN_q22RsqqNXsjamTRVujz8';

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

 const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    try {
      const { data, error } = await supabase.storage.from('articles').upload(selectedFile.name, selectedFile);

      if (error) {
        console.error('Error uploading file:', error.message);
        return;
      }

      console.log('File uploaded successfully:', data);
      setUploadSuccess(true);
    } catch (error) {
      console.error('Error handling file upload:', error);
      setError('An error occurred while uploading the file. Please try again.');
    }
  };

return (
    <StyledContainer>
      {isSignedIn ? (
        <>
          <Header>Upload Article</Header>
          <input
            type="file"
            accept=".doc,.docx"  // Accept DOC and DOCX files
            onChange={handleFileChange}
          />
          <button onClick={handleFileUpload}>Upload Article</button>
          {uploadSuccess && (
            <SuccessMessage>Article successfully uploaded to Supabase!</SuccessMessage>
          )}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </>
      ) : (
        <PasswordForm onSignIn={() => setIsSignedIn(true)} />
      )}
    </StyledContainer>
  );
};

export default SubmitArticle;
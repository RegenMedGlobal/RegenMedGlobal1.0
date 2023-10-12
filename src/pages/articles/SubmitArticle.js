import { useState } from 'react';
import  addArticleToSupabase  from './functions/addArticle'; // Adjust the import path
import styled from 'styled-components';

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

  textarea {
    width: 60%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
  }

  button {
    background-color: #0077cc;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #005299;
    }
  }
`;

const Header = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const SuccessMessage = styled.p`
  color: green;
  margin: 10px 0;
`;

const SubmitArticle = () => {
  const [article, setArticle] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleArticleChange = (event) => {
    setArticle(event.target.value);
  };

 const handleSubmit = async () => {
  if (article.trim() === '') {
    console.log('Article is empty.');
    return;
  }

  const articleData = {
    article_text: article,
    // You can add more fields like title, author, timestamp here
  };

  console.log('Article data:', articleData);

  const result = await addArticleToSupabase(articleData);

  if (result.success) {
    console.log('Article added successfully:', result.message);
    setArticle('');
    setSubmitSuccess(true);
  } else {
    console.log('Error adding article:', result.message);
  }
};

  return (
    <StyledContainer>
      <Header>Add Article</Header>
      <textarea
        value={article}
        onChange={handleArticleChange}
        placeholder="Enter your article..."
      />
      <button onClick={handleSubmit}>Add Article</button>
      {submitSuccess && <SuccessMessage>Article successfully submitted!</SuccessMessage>}
    </StyledContainer>
  );
};

export default SubmitArticle;
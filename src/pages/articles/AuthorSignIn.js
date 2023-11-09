import { useContext} from 'react';
import loginAuthor from './functions/loginAuthor';
import { AuthContext } from '../../AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

const StyledContainer = styled.div`
  margin-top: 10rem;
`;

const StyledForm = styled(Form)`
  width: 25%;
  margin: auto;
  padding: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fff;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const StyledFormItem = styled.div`
  display: flex;
  flex-direction: column; /* Display label, input, and error message vertically */
  margin-bottom: 16px;

  label {
    width: 100px;
    text-align: right;
  }

  .ant-input {
    width: 100%;
  }

  .ant-form-explain {
    color: red; /* Make the error message text red */
  }
`;

const AuthorSignIn = () => {
    const { authorLogin, currentAuthorUser  } = useContext(AuthContext);
      const navigate = useNavigate();

  const handleSubmit = async (email, password) => {
    console.log('email from handlesubmit: ', email)

    try {
      // Make a POST request to the server to verify the login credentials
    const response = await loginAuthor(email, password );

      // Log the response
      console.log('Login response:', response);

      // Handle the response based on the server's authentication logic
      if (response) {
        // Login successful
        console.log('successful login')
        //const id = response.userId;

       authorLogin({ authorUserData: response.authorData });


        console.log('Login successful');
     //   console.log('authordata: ', response);
       //  console.log('auth data from context: ', currentAuthorUser)

             // Redirect to the author's profile page if an ID is available
      if (response.authorData && response.authorData.id) {
        // Use the ID from the response for navigation
        navigate(`/author/${response.authorData.id}`);
      }


        // Redirect to the user's profile page
       // const userData = { ...response, loggedIn: true };
      //  navigate(`/profile/${id}`, { state: userData });
      } else {
        // Login failed with specific error: Invalid email or password
        throw new Error('Invalid email or password. Please check your email and password.');
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error during login:', error);
    //  setError(error.message); // Set the specific error message on the UI
    }

   
  };



  return (
    <StyledContainer>
      <Title level={1}>Author Sign In</Title>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = 'Email is required';
          }
          if (!values.password) {
            errors.password = 'Password is required';
          }
          return errors;
        }}
              onSubmit={(values) => handleSubmit(values.email, values.password)} // Pass email and password as arguments

      >
        <StyledForm>
          <StyledFormItem>
            <label>Email</label>
            <Field
              name="email"
              as={Input}
              type="email"
              placeholder="Email"
            />
          </StyledFormItem>
          <ErrorMessage name="email" component="div" className="ant-form-explain" style={{ color: 'red' }} />

          <StyledFormItem>
            <label>Password</label>
            <Field
              name="password"
              as={Input}
              type="password"
              placeholder="Password"
            />
          </StyledFormItem>
          <ErrorMessage name="password" component="div" className="ant-form-explain" style={{ color: 'red' }} />

          <StyledFormItem>
            <StyledButton type="primary" htmlType="submit">
              Sign In
            </StyledButton>
          </StyledFormItem>
        </StyledForm>
      </Formik>
    </StyledContainer>
  );
};

export default AuthorSignIn;

import { useContext} from 'react';
import loginAuthor from './functions/loginAuthor';
import { AuthContext } from '../../AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

const StyledTextLink = styled(Typography.Link)`
  margin-top: 16px;
  display: block;
`;

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
  const { authorLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (email, password) => {
    try {
      // Make a POST request to the server to verify the login credentials
      const response = await loginAuthor(email, password );

      // Handle the response based on the server's authentication logic
      if (response) {
        authorLogin({ authorUserData: response.authorData });

        if (response.authorData && response.authorData.id) {
          // Use the ID from the response for navigation
          navigate(`/author/${response.authorData.authorId}`);
        }

        // Redirect to the user's profile page
        // const userData = { ...response, loggedIn: true };
        //  navigate(`/profile/${id}`, { state: userData });
      } else {
        // Login failed with specific error: Invalid email or password
        throw new Error('Invalid email or password. Please check your email and password.');
      }
    } catch (error) {
      // todo: Handle any errors that occur during the request properly
      console.error('Error during login:', error);
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
        // Pass email and password as arguments
        onSubmit={(values) => handleSubmit(values.email, values.password)}
      >
        <StyledForm>
          <StyledFormItem>
            <label htmlFor="email">Email</label>
            <Field
              id="email"
              name="email"
              as={Input}
              type="email"
              placeholder="Email"
            />
          </StyledFormItem>
          <ErrorMessage name="email" component="div" className="ant-form-explain" style={{ color: 'red' }} />

          <StyledFormItem>
            <label htmlFor="password">Password</label>
            <Field
              id="password"
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

      <StyledTextLink onClick={() => navigate('/authorsignup')}>
        Don't have an account? Click here to sign up
      </StyledTextLink>

      {/* <StyledTextLink onClick={() => navigate('/resetauthorpassword')}>
        Forgot your password? Click here to reset
      </StyledTextLink> */}
    </StyledContainer>
  );
};

export default AuthorSignIn;

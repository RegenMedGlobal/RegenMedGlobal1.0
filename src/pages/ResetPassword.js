import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { EDGE_URL } from "../config";
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';

const { Paragraph  } = Typography;

const StyledTypography = styled(Paragraph)`
  margin-bottom: 3%;
`

const Container = styled.div`
  width: 80%;
  max-width: 400px;
  margin: 9rem auto;
  padding: 20px;
  border: 1px solid #e8e8e8;
  margin-bottom: 12%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: var(--main-color);
`;


const StyledText = styled(Paragraph)`
  margin-bottom: 2%;
  margin-top: 4%;
`;

const StyledTitle = styled.h3`
  text-align: center;
  margin-bottom: 3rem;
`;

const StyledForm = styled.form`
  margin-top: 3%;
  .input-group {
    margin-bottom: 3rem;
  }

  .btn-login {
    width: 100%;
  }

  .signup-text {
    text-align: center;
    margin-top: 20px;
  }

  .error-message {
    color: red;
    text-align: center;
    margin-top: 10px;
  }
`;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [resetRequested, setResetRequested] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();

  const id = location.pathname.substring(12); // Extract the user ID from the URL

   const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: 'onBlur', // Validate on blur
  });


const claimEmail = async (e) => {
  e.preventDefault();

  const formData = watch(); // Get all form data

  const data = {
    email: formData.email, // Access email from form data
  };

  console.log("Form Data:", formData); // Log the form data

  // Make the POST request to the API
  try {
    console.log("Sending POST request with data:", data); // Log the data being sent
    const response = await axios.post(EDGE_URL + "/sendgrid-emailer", data);
    console.log("Response:", response); // Log the response
    const responseData = response.data;
    console.log("Response Data:", responseData); // Log the response data
    if (responseData.status) {
      console.log("Redirecting");
      navigate("/CodeValidator/" + responseData.id + "?new=true");
    }
  } catch (error) {
    console.error("Error:", error);
    // Handle any errors that may occur during the API request
    setErrorMessage("An error occurred. Please try again later.");
  }
};





 return (
    <Container>
      <StyledTitle>Reset Password</StyledTitle>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <StyledTypography>
        Please enter the email you used when signing up, and a one-time code will be sent to your email.
      </StyledTypography>
      <div className="input-group">
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: 'Enter a valid email address',
            },
          }}
          render={({ field }) => (
            <Input
              type="text"
              placeholder="Email"
              name='email'
              prefix={<UserOutlined />}
              {...field}
            />
          )}
        />
        {errors.email && <p className="error-message">{errors.email.message}</p>}
      </div>

      <Button className="btn-login" type="primary" onClick={claimEmail}>
        Reset Password
      </Button>

      {resetRequested && (
        <StyledText>
          An email has been sent to <strong>{watch('email')}</strong> with instructions on how to reset your password if an account with this email was found.
        </StyledText>
      )}
      <p>
        Go back to <Link to="/DoctorLogin">Login</Link>
      </p>
    </Container>
  );
};

export default ResetPassword;
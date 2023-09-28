import React, { useState } from 'react';
import { useForm, Controller  } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import { Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import updateUserPassword from "../functions/UpdatePassword";

const Container = styled.div`
  width: 80%;
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: var(--main-color);
`;

const Title = styled.h3`
  text-align: center;
  margin-bottom: 20px;
`;

const StyledForm = styled.form`
  .input-group {
    margin-bottom: 15px;
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

  const [resetRequested, setResetRequested] = useState(false);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
   // Now you can access all properties of the location object directly
   console.log('Location:', location);
  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      // Call the updateUserPassword function with the email and password values from the form
      await updateUserPassword(data.email, data.password);
      setResetRequested(true);
      setEmail(data.email); // Store the email in the state variable
      reset();
    } catch (error) {
      console.error('Error updating password:', error);
      // Handle any errors that may occur during password update
      if (error.message === 'User not found') {
        // Set the error message in the state variable
        setErrorMessage('User not found. Please check the email and try again.');
      } else {
        // For other errors, you can handle them accordingly or show a generic error message
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  };
  
  return (
    <Container>
      <Title>Reset Password</Title>
      {errorMessage && <p className='error-message'>{errorMessage}</p>}

      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <div className='input-group'>
          <Controller
            name='email'
            control={control}
            defaultValue=''
            rules={{ required: 'Email is required' }}
            render={({ field }) => (
              <Input
                type='text'
                placeholder='Email'
                prefix={<UserOutlined />}
                {...field}
              />
            )}
          />
          {errors.email && <p className='error-message'>{errors.email.message}</p>}
        </div>
        <div className='input-group'>
          <Controller
            name='password'
            control={control}
            defaultValue=''
            rules={{ required: 'Password is required' }}
            render={({ field }) => (
              <Input.Password
                type='password'
                placeholder='Password'
                prefix={<LockOutlined />}
                {...field}
              />
            )}
          />
          {errors.password && <p className='error-message'>{errors.password.message}</p>}
        </div>
        <div className='input-group'>
          <Controller
            name='confirmPassword'
            control={control}
            defaultValue=''
            rules={{
              required: 'Confirm Password is required',
              validate: (value) =>
                value === getValues('password') || 'Passwords do not match',
            }}
            render={({ field }) => (
              <Input.Password
                type='password'
                placeholder='Confirm Password'
                prefix={<LockOutlined />}
                {...field}
              />
            )}
          />
          {errors.confirmPassword && (
            <p className='error-message'>{errors.confirmPassword.message}</p>
          )}
        </div>
        <Button className='btn-login' type='primary' htmltype='submit'>
          Reset Password
        </Button>
        {resetRequested && (
          <Typography>
            Your password has been reset, please use your new password to log in.
          </Typography>
        )}
        <p>
          Go back to <Link to='/DoctorLogin'>Login</Link>
        </p>
      </StyledForm>
    </Container>
  );
};

export default ResetPassword;

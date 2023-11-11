import React, { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import styled from 'styled-components';
import { createClient } from '@supabase/supabase-js';
import resetAuthorPassword from './functions/resetAuthorPassword';
import zxcvbn from "zxcvbn";

const { Text } = Typography;

const StyledContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  margin-top: 18rem;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h1 {
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  label {
    margin-bottom: 8px;
  }

  input {
    margin-bottom: 16px;
  }

  button {
    align-self: flex-end;
  }

   .success-message {
    font-size: 18px;
    font-weight: bold;
    color: #4811ab;
    margin-top: 16px;
  }
`;

const ResetAuthorPassword = () => {
  const [form] = Form.useForm();
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
   const [successMessage, setSuccessMessage] = useState(null);


  const handleCheck = async () => {
    try {
      const values = await form.validateFields(['email', 'authorName']);
      console.log('values', values)
      const { email, authorName } = values;

     const SUPABASE_URL = 'https://sxjdyfdpdhepsgzhzhak.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4amR5ZmRwZGhlcHNnemh6aGFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4ODc1MDE2NiwiZXhwIjoyMDA0MzI2MTY2fQ.2_rrSgYe0ncUmBlRZAKiHN_q22RsqqNXsjamTRVujz8';



const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
    // Check if the email and author name match the data in the Supabase author_data table
    const { data, error } = await supabase
      .from('author_data')
      .select()
      .eq('email', email)
      .eq('authorName', authorName);

    console.log('Supabase Response:', { data, error });

    if (error) {
      throw error;
    }

    const authorDataMatches = data && data.length > 0;

    if (authorDataMatches) {
      setShowPasswordFields(true);
        setErrorMessage(null);
      // Perform additional actions if needed
    } else {
      setErrorMessage('Invalid author name or email.')
      console.error('Invalid author name or email.');
      // Display an error message or handle it in your preferred way
    }
    console.log('End of handleCheck');
  } catch (error) {
    console.error('Error:', error);
    // Display an error message or handle it in your preferred way
  } finally {
    setIsChecking(false);
  }
};

const handleCancel = () => {
  setShowPasswordFields(false);
  setErrorMessage(null);
  form.resetFields(); // Reset form fields
};

const handleResetPassword = async () => {
  try {
    setIsSubmitting(true);
    console.log('Starting handleResetPassword');

    // Get form values directly without waiting for validation
    const values = form.getFieldsValue(['email', 'authorName', 'password', 'confirmPassword']);
    console.log('values in reset pass:', values);
    const { email, authorName, password, confirmPassword } = values;

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Check password strength using zxcvbn
    const passwordStrength = zxcvbn(password);
    console.log('Password strength:', passwordStrength);

    if (passwordStrength.score < 2) {
      // You can customize the error message based on the strength
      setErrorMessage('Please choose a stronger password.');
      return;
    }

    console.log('Resetting password...'); // Log for debugging

    // Reset the author's password using the resetAuthorPassword function
    await resetAuthorPassword(email, password);

    console.log('Password reset successfully'); // Log for debugging

    message.success('Password reset successfully');
  
    // Display success message
      setSuccessMessage('Password reset successfully');
      setErrorMessage(null);

      // Hide password fields
      setShowPasswordFields(false);

    // Clear form fields
    form.resetFields();
  } catch (error) {
    console.error('Error during password reset validation:', error);
    setErrorMessage('Error resetting password. Please try again.');
  
  } finally {
    setIsSubmitting(false);
    console.log('After finally block');
  }
};




console.log('End of component rendering');

  return (
    <StyledContainer>
      <h1>Password Reset</h1>

      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label="Author Name"
          name="authorName"
          rules={[
            { required: true, message: 'Please input your author name!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email address!' },
          ]}
        >
          <Input type="email" />
        </Form.Item>



        {showPasswordFields && (
          <>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password />
            </Form.Item>

              <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return null; // No error if passwords match
                    }
                    return 'The two passwords do not match!';
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </>
        )}

        {errorMessage && (
          <div className="error-message">{errorMessage}</div>
        )}

           {successMessage && (
        <Text className="success-message">{successMessage}</Text>
      )}

           <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          {!showPasswordFields ? (
            <Button type="primary" onClick={handleCheck} loading={isChecking}>
              Submit
            </Button>
          ) : (
            <><Button type="primary" onClick={handleResetPassword} >
                Reset Password
              </Button><Button onClick={handleCancel} style={{ marginLeft: 8 }}>
                  Cancel
                </Button></>
          )}
        </Form.Item>
      </Form>
    </StyledContainer>
  );
};

export default ResetAuthorPassword;

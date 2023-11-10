import React from 'react';
import { Form, Input, Button, message } from 'antd';
import styled from 'styled-components';

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
`;

const ResetAuthorPassword = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const { email } = values;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Call the Netlify serverless function to send the email
      const response = await fetch('/.netlify/functions/sendAuthorEmail', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        message.success('Password reset email sent. Check your inbox.');
        // Redirect or handle OTP verification as needed
      } else {
        throw new Error('Error sending reset email.');
      }
    } catch (error) {
      console.error('Error sending reset email:', error.message);
      message.error('Error sending reset email. Please try again.');
    }
  };

  const validateConfirmEmail = (_, value) => {
    const { email } = form.getFieldValue('email');
    if (value !== email) {
      return Promise.reject('The two emails do not match!');
    }
    return Promise.resolve();
  };

  return (
    <StyledContainer>
      <h1>Password Reset</h1>

      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
      >
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

        <Form.Item
          label="Confirm Email"
          name="confirmEmail"
          rules={[
            { required: true, message: 'Please confirm your email!' },
            { validator: validateConfirmEmail },
          ]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Send Reset Email
          </Button>
        </Form.Item>
      </Form>
    </StyledContainer>
  );
};

export default ResetAuthorPassword;

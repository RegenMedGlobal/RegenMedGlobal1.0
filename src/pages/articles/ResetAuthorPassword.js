import React from 'react';
import { Form, Input, Button, message } from 'antd';

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
    <div>
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
    </div>
  );
};

export default ResetAuthorPassword;

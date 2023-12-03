
import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import styled from 'styled-components';
import * as Yup from 'yup';
import { supabase } from '../SupaBaseClient';

const StyledModal = styled(Modal)`
`;

const SubscriptionForm = ({ modalOpen }) => {

  const [isOpen, setIsOpen] = useState(modalOpen);
  const [showThankYou, setShowThankYou] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });

  const insertSubscriptionData = async (email, firstName, lastName) => {
    const { data, error } = await supabase
      .from('subscription_data')
      .insert([{ email, firstName, lastName }]);

    if (error) {
      throw error; // Throw the error for handling in the calling function
    }

    return data; // Return the inserted data if needed
  };

  const validateForm = async () => {
    const schema = Yup.object().shape({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
    });

    return schema
      .validate(formData, { abortEarly: false })
      .then(() => {
        setErrors({ email: '', firstName: '', lastName: '' });
        return true; // Return true for valid form
      })
      .catch((err) => {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
        return false; // Return false for invalid form
      });
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validateForm();

    if (isValid) {
      const { email, firstName, lastName } = formData;

      try {
        await insertSubscriptionData(email, firstName, lastName);
        setFormData({ email: '', firstName: '', lastName: '' }); // Reset form after successful insertion
        setShowThankYou(true); // Show the "Thank you" message
        // The modal remains open after submission.
        // No setIsOpen(false) here to ensure it stays open.
      } catch (error) {
        console.error('Error inserting subscription data:', error.message);
        // Handle the error case if needed
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <StyledModal
      open={isOpen}
      onCancel={closeModal}
      footer={null}
      centered
    >
      <h2>Subscribe for the latest news:</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <div>{errors.email}</div>}
        <Input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        {errors.firstName && <div>{errors.firstName}</div>}
        <Input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        {errors.lastName && <div>{errors.lastName}</div>}
        {!showThankYou && (
          <Button type="primary" htmlType="submit">
          Subscribe
        </Button>
        )}
        {showThankYou && <p>Thank you for subscribing!</p>}
      </form>
    </StyledModal>
  );
};

export default SubscriptionForm;
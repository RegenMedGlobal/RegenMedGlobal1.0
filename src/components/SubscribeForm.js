/* eslint-disable no-useless-catch */
import { useState } from 'react';
import { Input, Button } from 'antd';
import styled from 'styled-components';
import { createClient } from '@supabase/supabase-js';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Popup from 'reactjs-popup';

import { SUPABASE_API_KEY, SUPABASE_URL } from '../config';

const StyledSidebar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 3rem;
  width: 20%;
  margin-top: 4rem;
  margin-top: 9rem;
  padding: 0 20px;

  input {
    margin-bottom: 1.6rem;
    
  }

   @media (max-width: 865px) {
     display: none;
  }
`;

const SubscriptionForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 12rem;


`;




const SubscribeForm = ({ isOpen, handleClose }) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
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
  try {
    const { data, error } = await supabase
      .from('subscription_data')
      .insert([{ email, firstName, lastName }]);

    if (error) {
      throw error;
    }

    return data; // Return the inserted data if needed
  } catch (error) {
    throw error; // Throw any caught error for handling in the calling function
  }
};


const validateForm = () => {
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


   const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', formData);

    const isValid = await validateForm();
    console.log('Is form valid?', isValid);

    if (isValid) {
      const { email, firstName, lastName } = formData;
      console.log('Submitting data:', { email, firstName, lastName });

     try {
  await insertSubscriptionData(email, firstName, lastName);
  console.log('Subscription data inserted successfully');
  setFormData({ email: '', firstName: '', lastName: '' }); // Reset form after successful insertion
  setShowThankYou(true);
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
     <Popup open={isOpen} closeOnDocumentClick onClose={handleClose}>
        <StyledSidebar>
      <h3>Subcribe for the latest news</h3>
      <SubscriptionForm>
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
        <Button type="primary" htmlType="submit">
          Subscribe
        </Button>
      </form>
      </SubscriptionForm>
       {showThankYou && <p>Thank you for subscribing!</p>}
    </StyledSidebar>
    </Popup>
  );
};

export default SubscribeForm;
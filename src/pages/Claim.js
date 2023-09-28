import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, Button, Typography } from '@mui/material';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 400px;
  padding: 16px;
  border: 1px solid #000; /* Replace with your desired border color */
  border-radius: 8px; /* Adjust the border radius as desired */
  height: 300px; /* Adjust the height as desired */
`;

const FieldWrapper = styled.div`
  margin-bottom: 16px;
  width: 100%;
`;

const Text = styled(Typography)`
  font-size: 1.2rem;
  margin-bottom: 16px;
`;

const Error = styled.div`
  color: red; /* Replace with your desired error color */
  margin-top: 4px; /* Adjust the margin as desired */
`;

const Claim = () => {
  const handleSubmit = (values, { setSubmitting }) => {
    // Handle form submission and search the database
    console.log(values);
    // You can make a request to your server.js file endpoint for searching the database

    // Set submitting state to false
    setSubmitting(false);
  };

  return (
    <Container>
      <Formik
        initialValues={{ clinicName: '', profileLink: '' }}
        onSubmit={handleSubmit}
        validate={(values) => {
          const errors = {};
          if (!values.clinicName) {
            errors.clinicName = 'Clinic Name is required';
          }
          if (!values.profileLink) {
            errors.profileLink = 'Profile Link is required';
          }
          return errors;
        }}
      >
        {({ isSubmitting, values }) => (
          <StyledForm>
            <Text variant="h6" align="center">
              Enter your clinic name to claim your profile
            </Text>
            <FieldWrapper>
              <Field
                as={TextField}
                type="text"
                id="clinicName"
                name="clinicName"
                label="Clinic Name"
                variant="outlined"
                fullWidth
                required
              />
              <ErrorMessage
                name="clinicName"
                component={Error}
              />
            </FieldWrapper>
            <FieldWrapper>
              <Field
                as={TextField}
                type="text"
                id="profileLink"
                name="profileLink"
                label="Profile Link"
                variant="outlined"
                fullWidth
                required
              />
              <ErrorMessage
                name="profileLink"
                component={Error}
              />
            </FieldWrapper>
            <Button
              type="submit"
              variant="contained"
              color={!values.clinicName || !values.profileLink ? 'default' : 'primary'}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Searching...' : 'Send request'}
            </Button>
          </StyledForm>
        )}
      </Formik>
    </Container>
  );
};

export default Claim;

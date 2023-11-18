import React , { useState } from 'react';
import { Row, Form } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import styled from "styled-components";

const SuccessMessage = styled.div`
    color: white;
`;

const ContactForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    // handle errors
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Log form values for debugging (you can remove this)
    console.log(data);

    // Clear form fields
    reset();

    // Show a success message
    setIsSuccess(true);

    // Reset the success message after a delay (e.g., 5 seconds)
    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  return (
    <>
      {isSuccess && (
        <SuccessMessage>
          <div className="success-message">
            Thank you for contacting us! We will get back to you shortly.
          </div>
        </SuccessMessage>
      )}
      <Form
        name="contact"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Row>
          <div className="col-lg-12">
            <div className="mar-15">
              <p className="Get-p">Get in touch</p>
              <p className="Get-p-1">Our friendly team would love to hear from you.</p>
            </div>
          </div>
        </Row>
        <Row>
          <div className="col-lg-6">
            <div className="mar-15">
              <label htmlFor="first-name" className="label-contact">
                First name
              </label>
              <Controller
                name="first-name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    type="text"
                    className="input-contact"
                    id="first-name"
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mar-15">
              <label htmlFor="last-name" className="label-contact">
                Last name
              </label>
              <Controller
                name="last-name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    type="text"
                    className="input-contact"
                    id="last-name"
                    {...field}
                  />
                )}
              />
            </div>
          </div>
        </Row>
        <Row>
          <div className="col-lg-12">
            <div className="mar-15">
              <label htmlFor="email" className="label-contact">
                Email
              </label>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    type="email"
                    className="input-contact"
                    id="email"
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mar-15">
              <label htmlFor="phone-number" className="label-contact">
                Phone Number
              </label>
              <Controller
                name="phone-number"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    type="text"
                    className="input-contact"
                    id="phone-number"
                    {...field}
                  />
                )}
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mar-15">
              <label htmlFor="message" className="label-contact">
                Message
              </label>
              <Controller
                name="message"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <textarea
                    className="input-contact input-area"
                    id="message"
                    {...field}
                  />
                )}
              />
            </div>
          </div>
        </Row>
        <div className="col-lg-12">
          <div className="mar-no">
            <button type="submit" className="Send-message">
              Send message
            </button>
          </div>
        </div>
        <input type="hidden" name="form-name" value="contact" />
      </Form>
    </>
  );
};

export default ContactForm;

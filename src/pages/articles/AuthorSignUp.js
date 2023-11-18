import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import insertNewAuthor from "./functions/insertNewAuthor";
import zxcvbn from "zxcvbn";
import { Typography } from "antd";

const { Text } = Typography;

const StyledContainer = styled.div`
  margin-top: 10rem;
`;

const StyledForm = styled(Form)`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #d9d9d9;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

const StyledField = styled(Field)`
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledErrorMessage = styled(ErrorMessage)`
  color: red;
`;

const StyledButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
`;

const StyledErrorMessageContainer = styled(Text)`
  color: #f5222d;
  font-size: 16px;
  margin-bottom: 10px;
  display: block;
  font-weight: bold;
`;

const StyledSuccessContainer = styled.div`
  text-align: center;
  padding: 20px;
  width: 40%;
  margin: 0 auto;
  border: 1px solid #d9d9d9;
  background-color: #e6f7ff;
  border-radius: 4px;
`;

const AuthorSignUp = () => {
  const [errors, setErrors] = useState({ message: null });
  const [successfulSignUp, setSuccessfulSignUp] = useState(false);
  
  const validationSchema = Yup.object().shape({
    authorName: Yup.string().required("Please enter your name"),
    email: Yup.string().required("Please enter your email").email("Invalid email format"),
    password: Yup.string()
      .required("Please enter your password")
      .test("password-strength", "Password is too weak", (value) => {
        const result = zxcvbn(value);
        return result.score >= 2; // Adjust the strength threshold as needed
      }),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    bio: Yup.string().required("Please enter your bio"),
    facebookLink: Yup.string().url("Invalid URL format"),
    twitterLink: Yup.string().url("Invalid URL format"),
    instagramLink: Yup.string().url("Invalid URL format"),
    youtubeLink: Yup.string().url("Invalid URL format"),
  });

  const initialValues = {
    authorName: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    facebookLink: "",
    twitterLink: "",
    instagramLink: "",
    youtubeLink: "",
  };

   const handleSubmit = async (values, { resetForm }) => {

    try {
      const response = await insertNewAuthor(values);

      if (response && response.message === "Author data inserted successfully") {
        resetForm();
        setErrors({ message: null });
        setSuccessfulSignUp(true);
      } else {
        setErrors({ message: "An error occurred. Please try again." });
        // todo: Handle errors properly
        console.error("Form submission failed");
      }
    } catch (error) {
      if (error.name === "EmailExistingError") {
        setErrors({ message: "Email already in use. Please choose a different email address." });
      } else {
        setErrors({ message: "An error occurred. Please try again." });
        // todo: Handle errors properly
        console.error("Error submitting form:", error);
      }
    }
  };

  return (
    <StyledContainer>
      <h1>Author Sign-Up</h1>
      {successfulSignUp ? (
        <StyledSuccessContainer>
          <p>Thank You for Signing Up!</p>
        </StyledSuccessContainer>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
        {() => (
          <StyledForm>
            <div>
              <label htmlFor="authorName">Author Name</label>
              <StyledField type="text" id="authorName" name="authorName" />
              <StyledErrorMessage name="authorName" component="div" />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <StyledField type="email" id="email" name="email" />
              <StyledErrorMessage name="email" component="div" />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <StyledField type="password" id="password" name="password" />
              <StyledErrorMessage name="password" component="div" />
            </div>

            <div>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <StyledField type="password" id="confirmPassword" name="confirmPassword" />
              <StyledErrorMessage name="confirmPassword" component="div" />
            </div>

            <div>
              <label htmlFor="bio">Bio</label>
              <StyledField type="text" id="bio" name="bio" style={{ height: "4rem", verticalAlign: "top" }} />
              <StyledErrorMessage name="bio" component="div" />
            </div>

            <div>
              <label htmlFor="facebookLink">Facebook Link</label>
              <StyledField type="url" id="facebookLink" name="facebookLink" />
              <StyledErrorMessage name="facebookLink" component="div" />
            </div>

            <div>
              <label htmlFor="twitterLink">Twitter Link</label>
              <StyledField type="url" id="twitterLink" name="twitterLink" />
              <StyledErrorMessage name="twitterLink" component="div" />
            </div>

            <div>
              <label htmlFor="instagramLink">Instagram Link</label>
              <StyledField type="url" id="instagramLink" name="instagramLink" />
              <StyledErrorMessage name="instagramLink" component="div" />
            </div>

            <div>
              <label htmlFor="youtubeLink">Youtube Link</label>
              <StyledField type="url" id="youtubeLink" name="youtubeLink" />
              <StyledErrorMessage name="youtubeLink" component="div" />
            </div>
             {errors.message && (
              <StyledErrorMessageContainer >
                {errors.message}
              </StyledErrorMessageContainer>
            )}
            <StyledButton type="submit">Submit</StyledButton>
          </StyledForm>
        )}
        </Formik>
      )}
    </StyledContainer>
  );
};

export default AuthorSignUp;

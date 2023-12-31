import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import styled from "styled-components";
import { TextField, MenuItem } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { states, countries, provinces, EDGE_URL, mexicanStates } from "../config";
import { insertNewUser, isEmailAlreadyInDB } from "../functions/insertNewUser";
import { getConditions } from "../functions/getConditions";
import zxcvbn from "zxcvbn";
import { Select } from "antd";
import _ from "lodash"; // Import lodash
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextArea from "antd/es/input/TextArea";
import axios from 'axios';
import Confirmation from "../components/Confirmation";
import ConditionsInput2 from "../components/ConditionsInput2";
import TreatmentInput from "../components/TreatmentInput";
import debounce from 'lodash/debounce';
import emailjs from "emailjs-com";

const StyledErrorMessage = styled.div`
   color: red;
   font-weight: bold;
   font-size: 1.2rem;
`;

const StyledControllerContainerConditions = styled.div`
  /* Other styles */
  /* Added styles for positioning */
  position: relative;
  z-index: 1; /* Set a higher z-index for the ConditionsInput2 dropdown container */
`;

const StyledControllerContainerSelect = styled.div`
  /* Other styles */
  /* Added styles for positioning */
  position: relative;
  z-index: 2; /* Set a higher z-index for the Select dropdown container */
`;

const StyledControllerContainer = styled.div`
  margin-bottom: 1rem;

  /* Added border styles for all input fields */
  input,
  select,
  textarea{
    width: 100%;
    border: 1px solid #ccc; /* Add border styles here */
    border-radius: 4px; /* Add border radius if desired */
    padding: 10px;
  }

  /* Added styles for positioning */
  position: relative;
  z-index: 0;

  /* Added styles for dropdown container */
  .country-dropdown-container {
    position: relative;
    z-index: 9999;
  }

  .dropdown-element {
    width: 100% !important;
    border: 1px solid #ccc !important;
    border-radius: 4px !important;
    padding: 10px !important;
  }

  /* Added styles for dropdown menu */
  .react-dropdown-select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 99999;
    margin-top: 4px;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  text-align: center;

  @media screen and (max-width: 768px) {
    padding: 20px;
    width: 80%;
    margin: 0 auto;
  }
`;

const Title = styled.h3`
  text-align: center;
  margin-bottom: 20px;
`;

const Register = () => {

  const navigate = useNavigate();

  const conditionRef = React.useRef(null);
  const firstErrorFieldRef = useRef(null);
  const [showConditionsDropdown, setShowConditionsDropdown] = useState(false);
  const [isStateDisabled, setIsStateDisabled] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setFocus
  } = useForm({
    defaultValues: {
      treatments: [], // Set initial value as an empty array
      conditions: [], // Set initial value as an empty array
      conditionsSuggestions: [], // Set initial value as an empty array
    },
  });

  const YOUR_EMAILJS_SERVICE_ID  = 'service_2r0se76';
  const YOUR_EMAILJS_TEMPLATE_ID  = 'template_ga5ywph';
  const YOUR_EMAILJS_USER_ID  = 'qVS-rHwiDSnK_KcU9';

  const passwordRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Add state for button disabled

  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isEmailInDB, setisEmailInDB] = useState(false);
  const [fieldsVisibility, setFieldsVisibility] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [filterTerm, setFilterTerm] = useState('');
  const [hasScrolled, setHasScrolled] = useState(false);
  const topElementRef = useRef(); 

  const [conditions, setConditions] = useState([]);

  const inputFieldStyle = {
    width: "25rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const handleInputChange = (newValue) => {
    setFilterTerm(newValue);
  };

  useEffect(() => {
    // Define a debounced version of fetchConditions
    const debouncedFetchConditions = debounce(async () => {
      const conditionsData = await getConditions(filterTerm); // Pass the filterTerm to getConditions
      setConditions(conditionsData);
    }, 300); // Adjust the debounce delay (in milliseconds) as needed

    // Call the debounced function when the component mounts
    debouncedFetchConditions();

    return () => {
      // Cleanup: Clear the debounced function when the component unmounts
      debouncedFetchConditions.cancel();
    };
  }, [filterTerm]); // Include filterTerm in the dependency array

  useEffect(() => {
    const timeout = setTimeout(() => {
      checkEmail()
    }, 300);

    return () => {
      clearTimeout(timeout);
    }
  }, [email])

  const checkEmail = async () => {
    setIsValidEmail(checkEmailValidation(email));

    let emailInDB = await isEmailAlreadyInDB(email);
    setisEmailInDB(emailInDB)
    if (emailInDB) {
      setFieldsVisibility(false)
    }
  }

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setIsStateDisabled(
      selectedCountry !== "United States" &&
      selectedCountry !== "Canada" &&
      selectedCountry !== "Mexico"
    );
    setSelectedCountry(selectedCountry);
  };

  // Create a mapping of states to countries
  const stateToCountryMap = {
    ...states.reduce((acc, state) => {
      // Check if the state exists in the list of states
      if (states.includes(state)) {
        acc[state] = "United States";
      }
      return acc;
    }, {}),
    // You can add default mappings here if needed
    // "Some State": "Some Country",
  };

  const handleStateChange = (selectedState) => {
    // Update the selectedCountry state based on the selected state
    setSelectedCountry(stateToCountryMap[selectedState] || "");
  };

  // Function to set the error message
  const handleSetErrorMessage = (message) => {
    setErrorMessage(message);
  };

  function checkEmailValidation(email) {
    const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (regex.test(email)) {
      return true;
    } else {
      return false;
    }
  }

  const claimEmail = async (e) => {
    e.preventDefault()

    const data = { email };

    // Make the POST request to the API
    const response = await axios.post(EDGE_URL + "/sendgrid-emailer", data);
    const responseData = response.data;
    if (responseData.status) {
      navigate("/CodeValidator/" + responseData.id + "?new=true")
    }
  }

  const goToNext = () => {
    if (email != "" && checkEmailValidation(email)) {
      setIsValidEmail(true)
      setFieldsVisibility(true)
    } else {
      setIsValidEmail(false)
      setFieldsVisibility(false)
      toast.error("Valid Email Required.");
    }
  }

  const handleFocusOnError = () => {
    const errorCount = Object.keys(errors).length;

    if (errorCount > 0) {
      // Scroll to the top of the form
      //  topElementRef.current.scrollIntoView({ behavior: "smooth" });
      // Update the error message with the number of errors
      setErrorMessage(`We aren't able to continue because of the following errors: ${errorCount} field(s) have errors.`);
    }
  };

  const onSubmit = async (data, event) => {
    // Prevent the default form submission
    event.preventDefault();

    // Disable the button after the first click
    setIsButtonDisabled(true);

    try {
      // Extract the 'value' property from each object in the 'data.conditions' array
      const conditionsArray = data.conditions.map((condition) => condition.value);

      const treatments = data.treatments.join(","); // Convert treatments array to string
      // Convert the array to a comma-separated string
      const conditions = conditionsArray.join(",");
      const requestData = {
        ...data,
        treatments,
        conditions,
      };

      // Use omit to remove the "conditionsSelect" field from the request data
      const requestDataWithoutConditionsSelect = _.omit(
        requestData,
        "conditionsSelect"
      );

      const response = await insertNewUser(requestDataWithoutConditionsSelect);

      // Check the response for success or failure
      if (response && response.message === "Data inserted successfully") {
        // Data inserted successfully
        reset(); // Reset the form fields
        toast.success("Registration Successful. Thank you for signing up!");

           // Prepare data for the confirmation email using EmailJS
        const { name, website, email, phone } = requestDataWithoutConditionsSelect;

        const emailData = {
          name,
          website,
          email,
          phone,
        };

        await emailjs.send(
          YOUR_EMAILJS_SERVICE_ID,
          YOUR_EMAILJS_TEMPLATE_ID,
          {
            form_data: emailData,
          },
          YOUR_EMAILJS_USER_ID
        );
        
        setIsSubmitted(true)
      } else {
        // Data insertion failed
        toast.error("Registration Failed. Please try again.");
        handleFocusOnError();
      }
    } catch (catchError) {
      // Handle the specific error types here
      if (catchError.name === "EmailExistingError") {
        setErrorMessage("Email already in use. Please choose a different email address.");
      } else if (catchError.name === "LocationError") {
        setErrorMessage("Invalid location. Please provide a valid city, state, and country.");
        // You can also access the error message from the catchError object if needed:
        const errorMessage = catchError.message;
        console.error("LocationError: " + errorMessage);
      } else {
        setErrorMessage("Registration Failed. Please try again.");
      }
      handleFocusOnError();

    } finally {
      // Re-enable the button after the form submission is complete
      setIsButtonDisabled(false);
    }
  };

  const handleTreatmentSelection = (
    selectedTreatments,
    treatmentType,
    field
  ) => {
    let updatedTreatments = [...selectedTreatments];

    // Check if the treatment type is already selected
    const treatmentIndex = updatedTreatments.indexOf(treatmentType);

    if (treatmentIndex > -1) {
      // Treatment is already selected, remove it
      updatedTreatments.splice(treatmentIndex, 1);
    } else {
      // Treatment is not selected, add it
      updatedTreatments.push(treatmentType);
    }

    // Update the field value
    field.onChange(updatedTreatments);
  };

  const password = watch("password");

  const getPasswordStrength = () => {
    if (!password) {
      return "";
    }

    const { score } = zxcvbn(password);
    const strengthLabels = [
      "Very Weak",
      "Weak",
      "Fair",
      "Strong",
      "Very Strong",
    ];

    return strengthLabels[score];
  };

  const isPasswordStrongEnough = () => {
    const { score } = zxcvbn(password);
    return score >= 2; // Minimum score of 2 corresponds to "Fair" strength
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleConditionSelect = (selectedOption) => {
    const conditionsLoweredCased = watch("conditions").map((option) =>
      option.toLowerCase()
    );

    if (!conditionsLoweredCased.includes(selectedOption.toLowerCase())) {
      setValue("conditions", watch("conditions").concat(selectedOption));
    }
    setValue("conditionsSuggestions", []);
    //setShowConditionsDropdown(false);
  };

  return (
    <>
      <div className="form-custom">
        <img className="bottom-vector" src="images/hero-bg.png" alt="Regen Med Global - Hero Background" />
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="form-all register-form">

                {isSubmitted ? <Confirmation /> : (
                  <FormContainer>
                    <form onSubmit={(e) => handleSubmit(onSubmit)(e)}>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="mar-15">
                            <StyledControllerContainer>
                              {/* TODO: This style creates accessibility issues for tying the label to the input */}
                              <label className="label-contact" htmlFor="clinicName">Clinic Name</label>
                              <Controller
                                id="clinicName"
                                name="clinicName"
                                control={control}
                                defaultValue=""
                                rules={{ required: "Clinic Name is required" }}
                                render={({ field }) => (
                                  <TextField
                                    variant="outlined"
                                    inputRef={firstErrorFieldRef}
                                    style={inputFieldStyle}
                                    error={Boolean(errors.clinicName)}
                                    helperText={
                                      errors.clinicName ? errors.clinicName.message : ""
                                    }
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                    }}
                                  />
                                )}
                              />
                            </StyledControllerContainer>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-12">
                          <div className="mar-15">

                            <StyledControllerContainer>
                              {/* TODO: This style creates accessibility issues for tying the label to the input */}
                              <label className="label-contact" htmlFor="email">Email</label>
                              <Controller
                                id="email"
                                name="email"
                                control={control}
                                defaultValue=""
                                rules={{
                                  required: "Email is required",
                                  pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email format",
                                  },
                                }}
                                render={({ field }) => (
                                  <>
                                    <TextField
                                      value={email}
                                      className="input-text"
                                      variant="outlined"
                                      style={inputFieldStyle}
                                      inputRef={firstErrorFieldRef}
                                      error={Boolean(errors.email)}
                                      helperText={errors.email ? errors.email.message : ""}
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setEmail(e.target.value)
                                      }}
                                      ref={firstErrorFieldRef} 
                                    />
                                  </>
                                )}
                              />
                            </StyledControllerContainer>
                              {!isValidEmail && email.length > 0
                                ? <p className="error-message">Valid email is required!</p>
                                : <></>
                              }

                          </div>
                        </div>
                      </div>

                      {!isEmailInDB && !fieldsVisibility && <button type="button" onClick={goToNext} className="Send-message">Next</button>}

                      {isValidEmail && isEmailInDB &&
                        (<div className="another-div">
                          <p className="claim-p">An account was found with the above email, please click below to claim your profile</p>
                          <button type="button" onClick={claimEmail} className="Send-message">Claim Email</button>
                        </div>)}

                      {fieldsVisibility &&
                        <div className="other-fields" >

                          <div className="row">
                            <div className="col-lg-12">
                              <div className="mar-15">

                                <StyledControllerContainer>
                                  <label className="label-contact" htmlFor="password">Password</label>
                                  <Controller
                                    id="password"
                                    name="password"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                      required: "Password is required",
                                      validate: {
                                        strongEnough: (value) =>
                                          isPasswordStrongEnough(value) ||
                                          'Password must be at least "Fair" strength',
                                      },
                                    }}
                                    render={({ field }) => (
                                      <TextField
                                        variant="outlined"
                                        style={inputFieldStyle}
                                        error={Boolean(errors.password)}
                                        helperText={errors.password ? errors.password.message : ""}
                                        {...field}
                                        type="password"
                                        inputRef={firstErrorFieldRef}
                                        onChange={(e) => {
                                          field.onChange(e);
                                        }}
                                      />
                                    )}
                                  />
                                  <p style={{ marginTop: "20px" }}>Password Strength: {getPasswordStrength()}</p>
                                </StyledControllerContainer>

                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-lg-12">
                              <div className="mar-15">

                                <StyledControllerContainer>
                                  <label className="label-contact">Confirm Password</label>
                                  <Controller
                                    name="confirmPassword"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                      required: "Confirm Password is required",
                                      validate: (value) =>
                                        value === getValues("password") ||
                                        "Password and Confirm Password must match",
                                    }}
                                    render={({ field }) => (
                                      <TextField
                                        variant="outlined"
                                        inputRef={firstErrorFieldRef}
                                        style={inputFieldStyle}
                                        fullWidth
                                        error={Boolean(errors.confirmPassword)}
                                        helperText={
                                          errors.confirmPassword ? errors.confirmPassword.message : ""
                                        }
                                        {...field}
                                        type="password"
                                      />
                                    )}
                                  />
                                </StyledControllerContainer>


                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-lg-12">
                              <div className="mar-15">
                                <StyledControllerContainer>
                                  <label className="label-contact">Address</label>
                                  <Controller
                                    name="address"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: "Address is required" }}
                                    render={({ field }) => (
                                      <TextField
                                        variant="outlined"
                                        style={inputFieldStyle}
                                        error={Boolean(errors.address)}
                                        inputRef={firstErrorFieldRef}
                                        helperText={errors.address ? errors.address.message : ""}
                                        {...field}
                                        onChange={(e) => {
                                          field.onChange(e);
                                        }}
                                      />
                                    )}
                                  />
                                </StyledControllerContainer>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-lg-12">
                              <div className="mar-15">

                                <StyledControllerContainer>
                                  <label className="label-contact">City</label>
                                  <Controller
                                    name="city"

                                    control={control}
                                    defaultValue=""
                                    rules={{ required: "City is required" }}
                                    render={({ field }) => (
                                      <TextField
                                        variant="outlined"
                                        style={inputFieldStyle}
                                        error={Boolean(errors.city)}
                                        inputRef={firstErrorFieldRef}
                                        helperText={errors.city ? errors.city.message : ""}
                                        {...field}
                                      />
                                    )}
                                  />
                                </StyledControllerContainer>


                              </div>

                            </div>
                          </div>

                          <div className="row">
                            <div className="col-lg-12">
                              <div className="mar-15">
                                <StyledControllerContainer>
                                  <label className="label-contact">State</label>
                                  <Controller
                                    name="state"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                      required:
                                        selectedCountry === "United States" ||
                                          selectedCountry === "Mexico" ||
                                          selectedCountry === "Canada"
                                          ? "State is required"
                                          : undefined,
                                    }}
                                    render={({ field }) => (
                                      <TextField
                                        variant="outlined"
                                        style={inputFieldStyle}
                                        error={Boolean(errors.state)}
                                        helperText={errors.state ? errors.state.message : ""}
                                        select
                                        disabled={isStateDisabled}
                                        inputRef={firstErrorFieldRef}
                                        {...field}
                                        onChange={(e) => {
                                          field.onChange(e);
                                          handleStateChange(e.target.value);
                                        }}
                                      >
                                        {selectedCountry === "Canada"
  ? provinces.map((province) => (
      <MenuItem key={province} value={province}>
        {province}
      </MenuItem>
    ))
  : selectedCountry === "Mexico"
  ? mexicanStates.map((state) => (
      <MenuItem key={state} value={state}>
        {state}
      </MenuItem>
    ))
  : states.map((state) => (
      <MenuItem key={state} value={state}>
        {state}
      </MenuItem>
    ))}

                                      </TextField>
                                    )}
                                  />
                                </StyledControllerContainer>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-lg-12">
                              <div className="mar-15">

                                <StyledControllerContainer>
                                  <label className="label-contact">Zip Code</label>
                                  <Controller
                                    name="zip"

                                    control={control}
                                    defaultValue=""
                                     rules={{
                                      required:
                                        selectedCountry === "United States" ||
                                          selectedCountry === "Mexico" ||
                                          selectedCountry === "Canada"
                                          ? "Zip is required"
                                          : undefined,
                                    }}
                                    inputRef={firstErrorFieldRef}
                                    render={({ field }) => (
                                      <TextField
                                        style={inputFieldStyle}
                                        error={Boolean(errors.zip)}
                                        helperText={errors.zip ? errors.zip.message : ""}
                                        {...field}
                                      />
                                    )}
                                  />
                                </StyledControllerContainer>


                              </div>

                            </div>
                          </div>

                          <div className="row">
                            <div className="col-lg-12">
                              <div className="mar-15">
                                <StyledControllerContainer>
                                  <label className="label-contact">Country</label>
                                  <Controller
                                    name="country"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: "Country is required" }}
                                    render={({ field }) => (
                                      <TextField
                                        className="dropdown-element"
                                        variant="outlined"
                                        style={inputFieldStyle}
                                        error={Boolean(errors.country)}
                                        helperText={errors.country ? errors.country.message : ""}
                                        inputRef={firstErrorFieldRef}
                                        select
                                        {...field}
                                        onChange={(e) => {
                                          field.onChange(e);
                                          handleCountryChange(e); // Call the handleCountryChange function
                                        }}
                                        SelectProps={{
                                          MenuProps: {
                                            PaperProps: {
                                              style: {
                                                maxHeight: "30vh",
                                              },
                                            },
                                          },
                                        }}
                                      >
                                        {countries.map((country) => (
                                          <MenuItem key={country} value={country}>
                                            {country}
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                    )}
                                  />
                                </StyledControllerContainer>

                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-lg-12">
                              <div className="mar-15">

                                <StyledControllerContainer>
                                  <label className="label-contact">Phone</label>
                                  <Controller
                                    name="phone"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                      required: "Phone is required",
                                      pattern: {
                                        value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
                                        message: "Invalid phone number format",
                                      },
                                    }}
                                    render={({ field }) => (
                                      <TextField
                                        variant="outlined"
                                        style={inputFieldStyle}
                                        inputRef={firstErrorFieldRef}
                                        error={Boolean(errors.phone)}
                                        helperText={errors.phone ? errors.phone.message : ""}
                                        {...field}
                                      />
                                    )}
                                  />
                                </StyledControllerContainer>

                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-lg-12">
                              <div className="mar-15">
                                <StyledControllerContainer>
                                  <label className="label-contact">Website</label>
                                  <Controller
                                    name="website"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <TextField

                                        variant="outlined"
                                        style={inputFieldStyle}
                                        inputRef={firstErrorFieldRef}
                                        rules={{
                                          pattern: {
                                            value: /^(ftp|http|https):\/\/[^ "]+$/,
                                            message: "Invalid website URL",
                                          },
                                        }}
                                        error={Boolean(errors.website)}
                                        helperText={errors.website ? errors.website.message : ""}
                                        {...field}
                                        onChange={(e) => {
                                          field.onChange(e);
                                        }}
                                      />
                                    )}
                                  />
                                </StyledControllerContainer>
                              </div>
                            </div>
                          </div>



                          <div className="row">
                            <div className="col-lg-12">
                              <div className="mar-15">
                                <StyledControllerContainer>
                                  <label className="label-contact">About Us</label>
                                  <Controller
                                    name="description"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <TextArea
                                        variant="outlined"
                                        style={inputFieldStyle}
                                        inputRef={firstErrorFieldRef}
                                        error={Boolean(errors.description)}
                                        helperText={errors.description ? errors.description.message : ""}
                                        {...field}
                                        onChange={(e) => {
                                          field.onChange(e);
                                        }}
                                      />
                                    )}
                                  />
                                </StyledControllerContainer>
                              </div>
                            </div>
                          </div>

                          <TreatmentInput
                            control={control}
                            errors={errors}
                            field={watch("treatments")} // Pass the value of "treatments" field
                            handleTreatmentSelection={handleTreatmentSelection}
                          />

                          <div className="row">
                            <div className="col-lg-12">
                              <div className="mar-15-0 sero-rad">
                                <StyledControllerContainerConditions>
                                  <ConditionsInput2
                                    control={control}
                                    showConditionsDropdown={showConditionsDropdown}
                                    conditionRef={conditionRef}
                                    handleConditionSelect={handleConditionSelect}
                                    terms={conditions.filter((cond)=> {
                                      let selectedVals = getValues('conditions').map((scond) => {
                                        return scond.value
                                      })
                                      return !selectedVals.includes(cond)
                                    })} // Pass the conditions array
                                    watch={watch}
                                    filterTerm={filterTerm} // Pass the filter term as a prop
                                    handleInputChange={handleInputChange} // Pass the handleInputChange function
                                    options={[]}
                                    //setShowConditionsDropdown={setShowConditionsDropdown} // Pass setShowConditionsDropdown as a prop
                                  />
                                </StyledControllerContainerConditions>



                              </div>
                            </div>
                          </div>


                          <div className="row">
                            <div className="col-lg-12">
                              <div className="mar-15 zer-radi">
                                <StyledControllerContainerSelect>
                                  <Controller
                                    name="conditions"
                                    control={control}
                                    render={({ field }) => (
                                      <div>
                                        <Select
                                          mode="multiple"

                                          open={false}
                                          style={{ width: "25rem", marginTop: "1rem" }}
                                          placeholder="Conditions/Diseases treated"
                                          {...field}
                                          options={[]}
                                        />
                                      </div>
                                    )}
                                  />
                                </StyledControllerContainerSelect>
                              </div>
                            </div>
                          </div>

                         {errorMessage && <StyledErrorMessage>{errorMessage}</StyledErrorMessage>}
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="mar-no">
                                <button type="submit" variant="contained" onClick={handleFocusOnError} className="Send-message">Sign Up</button>
                              </div>
                            </div>
                          </div>

                        </div>
                      }
                    </form>

                  </FormContainer>
                )
                }
              </div>

            </div>
          </div>
        </div>
      </div>



    </>
  );
};

export default Register;

import React, { useState, useCallback, useEffect } from "react";
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from "react-router-dom";
import { Layout, Button, Form, AutoComplete } from "antd";
import insertTopSearch from  "../functions/insertTopSearch";
import axios from "axios";
import { MAPBOX_TOKEN } from "../config";
import imgHeroBG from "../assets/hero-bg.png";
import imgVector from "../assets/Vector.png";
import imgCombined from "../assets/Combined-Shape.png";
// Consider renaming images to be named after their content
import imgPro2 from "../assets/pro-2.png";
import imgPro1 from "../assets/pro-1.png";
import imgPro3 from "../assets/pro-3.png";
import Contact from "./Contact";
import Services from "./Services";
import { getConditions } from  "../functions/getConditions";
// import Autosuggest from 'react-autosuggest';
import './Autosuggest.css'; // Import your custom CSS for styling
import ArticleMainPage from "../components/ArticleMainPage";

const GlobalStyles = createGlobalStyle`
  .downshift-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 9999 !important; /* Increase the z-index value */
    background-color: white;
    max-height: 200px;
    overflow-y: auto;
    border: 2px solid red;
  }

  /* Additional styles for the open dropdown */
  .downshift-dropdown.open {
    /* Add your custom styles here */
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    border: 2px solid red;
    /* Add more styles as needed */
  }
`;

const CustomSuggestion = styled.div`
  /* Add your custom styling here */
  padding: 8px;
  background-color: #f0f0f0;
  cursor: pointer;

  &:hover {
    /* Add styles for hover state here */
    background-color: #ccc;
  }
`;

const StyledErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
`;

const StyledParagraph = styled.p`
  color: #FFF;
  font-size: 54px;
  font-style: normal;
  font-weight: 600;
  line-height: 64px; 
  font-family: 'Poppins', sans-serif;
  margin: 0 0 23px 0;
  text-align: left;

  /* Media query for screens with a maximum width of 600px */
  @media screen and (max-width: 857px) {
    font-size: 26px; /* Decrease the font size for smaller screens */
    line-height: 34px;
    margin-bottom: 2px;
    text-align: center;
  }
`;

const StyledTreatmentSection = styled.p`
  color: #FFF;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin: 0px 0 18px 0;
  text-align: left;
  width: 100%;

  @media screen and (max-width: 857px) {
    height: 10%;
  }
`;

const StyledTreatmentContainer = styled.div`
  border-radius: 0;
  background: rgba(255, 255, 255, 0.16);
  -webkit-backdrop-filter: blur(8.5px);
  backdrop-filter: blur(8.5px);
  margin: 0;
  list-style: none;
  padding: 15px;
  max-width: 460px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 70px;
  position: relative; /* Add this line to create a stacking context */

  /* Add the following CSS to make buttons transparent */
  button {
    background: transparent;
    border: none;
    color: white;
  }

 .downshift-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 9999 !important; /* Increase the z-index value */
    background-color: white;
    border: 1px solid #ccc;
    max-height: 200px;
    overflow-y: auto;
  }
`;


const StyledButton = styled.button`
  border-radius: 12px;
  border: 1px solid #E409E8;
  background: linear-gradient(180deg, #0019FB 0%, #E409E8 100%);
  color: #FFF;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  height: 74px;
  padding: 0 30px;
  width: 80%;
  z-index: 2;

  @media screen and (max-width: 600px) {
  /* Add the styles you want to apply on mobile */
    border: 2px solid purple;
  }
`;

const Main = () => {
  const [address, setAddress] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [conditions, setConditions] = useState([]);
  const [options, setOptions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  // Define separate state variables for address and condition input values
  const [addressInputValue, setAddressInputValue] = useState("");
  const [conditionInputValue, setConditionInputValue] = useState("");

  const handleSearch = useCallback(async (value) => {
    const filterTerm = value.trim();
    setSearchTerm(filterTerm);

    if (filterTerm.length >= 3) {
      try {
        const conditionsData = await getConditions(filterTerm); // Pass the filter term
        const filteredOptions = conditionsData.map((condition) => ({ value: condition }));
        setOptions(filteredOptions);
      } catch (error) {
        // Handle errors properly
        console.error('Error fetching conditions:', error);
      }
    } else {
      // Clear the options when the input length is less than 3 characters
      setOptions([]);
    }
  }, []);

  useEffect(() => {
    const fetchConditions = async () => {
      const conditionsData = await getConditions();
      setConditions(conditionsData);
    };

    fetchConditions();
  }, []);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (!address) {
          setErrorMessage("Please enter a location");
        } else {
          const filterTerm = searchTerm.trim(); // Trim any leading or trailing whitespace

          // Update top searches in the database
          insertTopSearch(filterTerm);

          navigate("/results", {
            state: {
              searchTerm: filterTerm,
              location: address,
              checkedOptions: checkboxOptions,
            },
          });
        }
      })
      .catch((errorInfo) => {
        // Handle errors
        console.log("Validation Failed:", errorInfo);
      });

    return false;
  };

  const handleAddressChange = async (value) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          value
        )}.json?access_token=${MAPBOX_TOKEN}`
      );

      // Filter suggestions for US cities
      const usCities = response.data.features.filter((suggestion) => {
        // Check if the place type is a city
        return suggestion.place_type.includes("place") &&
          suggestion.context &&
          suggestion.context.find(
            (context) => context.id.startsWith("country") && context.short_code === "us"
          );
      });

      // Update suggestions using the state updater function
      setSuggestions(usCities);

      // You can log the updated state inside a useEffect hook
      useEffect(() => {
        console.log("Updated Suggestions:", suggestions);
      }, [suggestions]);
    } catch (error) {
      // Handle errors
      console.error("Error fetching suggestions:", error);
    }
  };

  const [checkboxOptions, setCheckboxOptions] = useState([
    { label: "PRP", value: "PRP", checked: false },
    { label: "Stem Cell Therapy", value: "Stem", checked: false },
    { label: "Prolotherapy", value: "Prolotherapy", checked: false },
  ]);

  const handleButtonClick = (value) => {
    const updatedOptions = checkboxOptions.map((option) =>
      option.value === value ? { ...option, checked: !option.checked } : option
    );
    setCheckboxOptions(updatedOptions);
  };

  const handleButtonStyle = (value) => {
    const option = checkboxOptions.find((option) => option.value === value);
    return option.checked
      ? { color: "white", backgroundColor: "var(--main-color)" }
      : {};
  };

  return (
    <Layout>
      <div className="banner-top">
        <img className="bottom-vector" src={imgHeroBG} alt="background image design" />
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="banner-left">
                <StyledParagraph>Find a Regenerative Medicine Doctor based on your condition</StyledParagraph>
                <div className="banner-bottom">
                  <Form form={form} onFinish={handleSubmit} >
                  {errorMessage && (
                    <StyledErrorMessage>{errorMessage}</StyledErrorMessage>
                  )}
                  <StyledTreatmentContainer>
                    <StyledTreatmentSection>Choose Treatment Type(s):</StyledTreatmentSection>
                      {checkboxOptions.map((option) => (
                        <Button
                          className={option.checked ? "type-button active" : "type-button"}
                          type={option.checked ? "primary" : "default"}
                          onClick={() => handleButtonClick(option.value)}
                          style={handleButtonStyle(option.value)}
                          key={option.value}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </StyledTreatmentContainer>
                    <ul className="banner-ul">
                      <li>
                        <img src={imgCombined} className="vec-1" alt="Magnifying Glass / Search Icon" />
                        <AutoComplete
                          style={{ width: "70vw", maxWidth: "300px", height: "50px", marginLeft: '4rem' }}
                          value={address}
                          onChange={(value) => setAddress(value)} // Use onChange instead of onSelect
                          onSearch={handleAddressChange}
                          placeholder="Enter a location..."
                          options={suggestions.map((suggestion) => ({
                            label: suggestion.place_name,
                            value: suggestion.place_name,
                          }))}
                          filterOption={(inputValue, option) =>
                            option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                          }
                        />
                      </li>
                      <li>
                        <img src={imgVector} className="vec-1" alt="Stethoscope Icon" />
                        <AutoComplete
                          style={{ width: "70vw", maxWidth: "450px", height: "50px" }}
                          options={options}
                          onSelect={(value) => setSearchTerm(value)}
                          onSearch={handleSearch}
                          placeholder="Medical condition (optional)"
                        />
                      </li>
                      <li>
                        <StyledButton className="styled-button" htmltype="submit" >Search</StyledButton>
                      </li>
                    </ul>
                  </Form>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="banner-right">
                <img className="pro-img-3" src={imgPro2} alt="Scientists researching" />
                <img className="pro-img-2" src={imgPro1} alt="Group of medical health professionals" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="Regenerative">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="Regenerative-left">
                <img src={imgPro3} className="reg-img" alt="Hand holding a DNA strand" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="Regenerative-right">
                <p className="Regenerative-p">What is Regenerative Medicine?</p>
                <p className="Regenerative-p1">The process of repairing or regenerating human cells, tissues, or organs as a result of disease, aging, or defects. </p>
                {/* <button className="Regenerative-button">Explore Now</button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ArticleMainPage />
      <Services />
      <Contact />
      <GlobalStyles />
    </Layout>
  );
};

export default Main;

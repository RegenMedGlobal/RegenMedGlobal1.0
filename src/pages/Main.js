import React, { useState, useCallback, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { Layout, Input, Button, Form, AutoComplete } from "antd";
import insertTopSearch from  "../functions/insertTopSearch";
import axios from "axios";
import { terms, MAPBOX_TOKEN } from "../config";
import imgHeroBG from "../assets/hero-bg.png";
import imgVector from "../assets/Vector.png";
import imgCombined from "../assets/Combined-Shape.png";
import imgPro2 from "../assets/pro-2.png";
import imgPro1 from "../assets/pro-1.png";
import imgPro3 from "../assets/pro-3.png";

import Faq from "../components/Faq";
import ContactForm from "../components/ContactForm";
import Contact from "./Contact";
import Services from "./Services";
import { getConditions } from  "../functions/getConditions";
import debounce from 'lodash/debounce';
import Downshift from "downshift";

const CustomAutoComplete = styled(AutoComplete)`
  .custom-dropdown {
    margin-top: 10px; /* Adjust the margin-top as needed to prevent overlap */
    border: 2px solid red;
  }
`;

const StyledErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
`;


const Main = () => {
  const [address, setAddress] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
   const [conditions, setConditions] = useState([]);

  const [options, setOptions] = useState([]);
  // Define suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

// // Create a debounced version of handleSearch
// const debouncedHandleSearch = debounce((value) => {
//   if (value.trim().length >= 3) {
//     handleSearch(value);
//   }
// }, 300);

// useEffect(() => {
//   if (searchTerm.trim().length >= 3) {
//     debouncedHandleSearch(searchTerm);
//   }
// }, [searchTerm]);



const handleSearch = useCallback(async (value) => {
  const filterTerm = value.trim();
  setSearchTerm(filterTerm);

  if (filterTerm.length >= 3) {
    try {
      const conditionsData = await getConditions(filterTerm); // Pass the filter term
      const filteredOptions = conditionsData.map((condition) => ({ value: condition }));
      setOptions(filteredOptions);
    } catch (error) {
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
          console.log("Search term:", filterTerm);

          // Update top searches in the database
          insertTopSearch(filterTerm);

          // Update top searches in the database
          console.log("Before updateTopSearches");
          // updateTopSearches(filterTerm);
          console.log("After updateTopSearches");

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
        console.log("Validation Failed:", errorInfo);
      });

      return false
  };

  const handleAddressChange = async (value) => {
    console.log("value from handleAddressChange: ", value)
    setAddress(value);

    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          value
        )}.json?access_token=${MAPBOX_TOKEN}`
      );

      // Filter suggestions for US cities
      const usCities = response.data.features.filter(
        (suggestion) =>
          suggestion.context &&
          suggestion.context.find(
            (context) => context.id.startsWith("country") && context.short_code === "us"
          )
      );

      setSuggestions(usCities);
      console.log('suggestions: ', suggestions)
    } catch (error) {
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
        <img className="bottom-vector" src={imgHeroBG} alt="" />
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="banner-left">
                <p className="banner-left-p">Find a Regenerative Medicine Doctor based on your condition</p>
                <div className="banner-bottom">
                  <Form form={form} onFinish={handleSubmit} >
                  {errorMessage && (
                    <StyledErrorMessage>{errorMessage}</StyledErrorMessage>
                  )}
                  <div className="more">
                      <p className="more-p">Choose Treatment Type(s):</p>
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
                    </div>
                  <ul className="banner-ul">
                      <li>
                        <img src={imgCombined} className="vec-1" alt="" />
                 <Downshift
  inputValue={address}
  onInputValueChange={(inputValue) => {
    console.log("Input Value:", inputValue);
    handleAddressChange(inputValue);
  }}
  itemToString={(item) => (item ? item.label : "")}
   onSelect={(selectedItem) => {
    setAddress(selectedItem.place_name); // Update the input value
  }}
  onStateChange={(state) => {
    console.log("Downshift State:", state);
  }}
>
  {({
    getInputProps,
    getItemProps,
    getMenuProps,
    isOpen,
    highlightedIndex,
  }) => (
    <div>
      <Input
  {...getInputProps({
    placeholder: "Enter a location...",
    style: {
      width: "80%",
            maxWidth: "450px",
            height: "50px",
            marginLeft: "4rem",
    },
  })}
/>
      {isOpen && (
        <div {...getMenuProps()}>
          {suggestions.map((suggestion, index) => (
            <div
              {...getItemProps({
                key: suggestion.place_name,
                index,
                item: suggestion,
                style: {
                  backgroundColor:
                    highlightedIndex === index ? "#f0f0f0" : "white",
                },
                onClick: () => {
                  // Handle the click event here
                  setAddress(suggestion.place_name); // Update the input value with the full suggestion
                },
              })}
            >
              {suggestion.place_name}
            </div>
          ))}
        </div>
      )}
    </div>
  )}
</Downshift>

                      </li>
                      <li>
                        <img src={imgVector} className="vec-1" alt="" />
<Downshift
  inputValue={searchTerm}
  onInputValueChange={(inputValue) => {
    console.log("Input Value:", inputValue);
    setSearchTerm(inputValue);
     if (!inputValue) {
      // Handle the case when inputValue is empty (backspace pressed)
      setSearchTerm(""); // Clear the search term
    }
    // Call handleSearch here
    handleSearch(inputValue);
  }}
  itemToString={(item) => (item ? item.value : "")}
  onSelect={(selectedItem) => {
    setSearchTerm(selectedItem.value); // Update the input value
  }}
  onStateChange={(state) => {
    console.log("Downshift State:", state);
  }}
>
  {({
    getInputProps,
    getItemProps,
    getMenuProps,
    isOpen,
    highlightedIndex,
  }) => (
    <div>
      <Input
  {...getInputProps({
    placeholder: "Enter a location...",
    style: {
     width: "80%",
            maxWidth: "450px",
            height: "50px",
            marginLeft: "4rem",
    },
  })}
/>
      {isOpen && (
        <div {...getMenuProps()}>
          {options.map((option, index) => (
            <div
              {...getItemProps({
                key: option.value,
                index,
                item: option,
                style: {
                  backgroundColor:
                    highlightedIndex === index ? "#f0f0f0" : "white",
                },
              })}
            >
              {option.value}
            </div>
          ))}
        </div>
      )}
    </div>
  )}
</Downshift>

                      </li>

                      <li>
                        <button className="serch search-button" htmltype="submit" >Search</button>
                      </li>
                    </ul>
                    
                    

                  </Form>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="banner-right">
                <img className="pro-img-3" src={imgPro2} alt="" />
                <img className="pro-img-2" src={imgPro1} alt="" />
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
                <img src={imgPro3} className="reg-img" alt="" />
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


      <Services />
      <Contact />


    </Layout>
  );
};

export default Main;

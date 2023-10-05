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
import imgPro4 from "../assets/pro-4.png";
import imgEli1 from "../assets/eli.png"
import imgEli2 from "../assets/eli-2.png"
import imgEli3 from "../assets/eli-3.png"
import Faq from "../components/Faq";
import ContactForm from "../components/ContactForm";
import Contact from "./Contact";
import Services from "./Services";
import { getConditions } from  "../functions/getConditions";
import debounce from 'lodash/debounce';



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

// Create a debounced version of handleSearch
const debouncedHandleSearch = debounce((value) => {
  if (value.trim().length >= 3) {
    handleSearch(value);
  }
}, 300);

useEffect(() => {
  if (searchTerm.trim().length >= 3) {
    debouncedHandleSearch(searchTerm);
  }
}, [searchTerm]);



const handleSearch = useCallback(async (value) => {
  const filterTerm = value.trim();
  setSearchTerm(filterTerm);

  try {
    const conditionsData = await getConditions(filterTerm); // Pass the filter term
    const filteredOptions = conditionsData.map((condition) => ({ value: condition }));
    setOptions(filteredOptions);
  } catch (error) {
    console.error('Error fetching conditions:', error);
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

  console.log("Render options:", options);

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
                        <AutoComplete
                          style={{ width: "70vw", maxWidth: "300px", height: "50px", marginLeft: '4rem' }}
                          value={address}
                          onSelect={(value) => setAddress(value)}
                          onSearch={handleAddressChange}
                          placeholder="Enter a location..."
                          options={suggestions.map((suggestion) => ({
                            label: suggestion.place_name,
                            value: suggestion.place_name,
                          }))}
                        />
                      </li>
                      <li>
                        <img src={imgVector} className="vec-1" alt="" />
<AutoComplete
  style={{ width: "70vw", maxWidth: "450px", height: "50px" }}
  options={options} // Ensure that it uses the updated options
  onSelect={(value) => setSearchTerm(value)}
  onSearch={debouncedHandleSearch}
  placeholder="Medical condition (optional)"
/>


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
      {/* <div className="faq">
        <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="service-top">

                  <p className="service-2">Frequently asked questions</p>
                  <p className="service-3">Everything you need to know about the product and billing.</p>

                  <Faq questions={questions}/>

                </div>
              </div>
            </div>
        </div>
      </div> */}

    </Layout>
  );
};

export default Main;

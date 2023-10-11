/* eslint-disable no-unused-vars */

import styled from "styled-components";
import { useForm, Controller } from "react-hook-form";
import Select, { components } from 'react-select';
import { useState, useEffect, useRef } from "react";
import CreatableSelect from 'react-select/creatable'; 


const StyledControllerContainer = styled.div`
  margin-bottom: 1rem;

  /* Added styles for positioning */
  position: relative;
  z-index: 0;

  /* Added styles for dropdown container */
  .country-dropdown-container {
    position: relative;
    z-index: 9999;
  }

  /* Added styles for dropdown menu */
  .react-dropdown-select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 99999;
    margin-top: 4px;nnnnn
  }
`;


// Define custom styles for the CreatableSelect component
const customStyles = {
  // Style for the input field
  input: (provided) => ({
    ...provided,
    minHeight: '3rem', // Increase the height as needed
  }),
};


const ConditionsInput = ({
  control,
  conditionRef,
  handleInputChange,
  terms,
  watch,
}) => {
  const selectRef = conditionRef; // Use the conditionRef prop as a ref
  const [inputValue, setInputValue] = useState(""); // Track user input

const handleLocalInputChange = (newValue) => {
    console.log('Input Value in ConditionsInput:', newValue); // Add this line
    setInputValue(newValue);
    handleInputChange(newValue); // Call the parent's handleInputChange function
  };


  // Determine whether the menu should be open based on input value length
  const isMenuOpen = inputValue.length >= 2;

  return (
    <StyledControllerContainer>
      <label className="label-contact">Choose Conditions Specialized at your clinic</label>
      {/* <p className="sublabel">Select up to five</p> */}
      <Controller
        name="conditions"
        control={control}
        render={({ field }) => (
          <div>
            {/* Replace the Select component with CreatableSelect */}
      <CreatableSelect
  isMulti
  // Remove components prop to use default Option component
  options={terms.map((term) => ({ value: term, label: term }))}
  {...field}
  inputValue={inputValue}
  onInputChange={handleLocalInputChange}
  onChange={(selectedOptions, actionMeta) => {
    if (actionMeta.action === 'select-option') {
      // Handle the selection of an option
      console.log("Selected Options:", selectedOptions);
      // Update your state variable with the selected options
      field.onChange(selectedOptions);
    }
  }}
  value={watch('conditionsSuggestions')} // Ensure this reflects your selected options
  mode="tags"
  label="Conditions"
  ref={selectRef}
  menuIsOpen={isMenuOpen} // Set menuIsOpen based on input value length
  style={{ width: '25rem', marginTop: '1rem'}}
  placeholder="Type or select Conditions/Specialities" // Update the placeholder text
  closeMenuOnSelect={false} // Prevent menu from closing on selection
  createOptionPosition="first" // Show newly created options at the top
  formatCreateLabel={(inputValue) => `Create "${inputValue}"`} // Customize the label for creating a new option
  // Apply custom styles to the CreatableSelect component
  styles={customStyles}
/>


          </div>
        )}
      />
    </StyledControllerContainer>
  );
};

export default ConditionsInput;
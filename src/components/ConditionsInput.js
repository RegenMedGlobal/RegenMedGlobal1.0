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

// Custom option component with checkboxes
const OptionWithCheckbox = (props) => (
  <div>
    <components.Option {...props}>
      <input
        type="checkbox"
        checked={props.isSelected}
        onChange={() => props.selectOption(props.data)}
      />
      {props.label}
    </components.Option>
  </div>
);

const ConditionsInput = ({
  control,
  conditionRef,
  handleConditionSelect,
  terms,
  watch,
}) => {
  const selectRef = conditionRef; // Use the conditionRef prop as a ref
  const [inputValue, setInputValue] = useState(""); // Track user input

  // Handle input change and toggle menu visibility
  const handleInputChange = (newValue) => {
    setInputValue(newValue);
  };

  // Determine whether the menu should be open based on input value length
  const isMenuOpen = inputValue.length >= 2;

  return (
    <StyledControllerContainer>
      <label className="label-contact">Conditions/Specialties</label>
      {/* <p className="sublabel">Select up to five</p> */}
      <Controller
        name="conditionsSuggestions"
        control={control}
        render={({ field }) => (
          <div>
            {/* Replace the Select component with CreatableSelect */}
            <CreatableSelect
              isMulti
              components={{ Option: OptionWithCheckbox }}
              options={terms.map((term) => ({ value: term, label: term }))}
              {...field}
              inputValue={inputValue}
              onInputChange={handleInputChange}
              onChange={(selectedOptions) => {
                console.log("Selected Options:", selectedOptions);
                // Update your state variable with the selected options
                field.onChange(selectedOptions);
              }}
              value={watch('conditionsSuggestions')} // Ensure this reflects your selected options
              mode="tags"
              label="Conditions"
              ref={selectRef}
              menuIsOpen={isMenuOpen} // Set menuIsOpen based on input value length
              style={{ width: '25rem', marginTop: '1rem' }}
              placeholder="Type or select Conditions/Specialities" // Update the placeholder text
              onSelect={handleConditionSelect}
              closeMenuOnSelect={false} // Prevent menu from closing on selection
              createOptionPosition="first" // Show newly created options at the top
              formatCreateLabel={(inputValue) => `Create "${inputValue}"`} // Customize the label for creating a new option
            />
          </div>
        )}
      />
    </StyledControllerContainer>
  );
};

export default ConditionsInput;
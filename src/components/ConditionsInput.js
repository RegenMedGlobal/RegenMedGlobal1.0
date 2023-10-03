
import styled from "styled-components";
import { useForm, Controller } from "react-hook-form";
import Select, { components } from 'react-select';
import { useState, useEffect, useRef } from "react";


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
  showConditionsDropdown,
  conditionRef,
  handleConditionSelect,
  terms,
  watch,
}) => {
  const selectRef = conditionRef; // Use the conditionRef prop as a ref
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <StyledControllerContainer>
      <label className="label-contact">Conditions Treated</label>
      <p className="sublabel">Select up to five</p>
      <Controller
        name="conditionsSuggestions"
        control={control}
        render={({ field }) => (
          <div>
            <Select
  isMulti
  components={{ Option: OptionWithCheckbox }}
  options={terms.map((term) => ({ value: term, label: term }))}
  {...field}
  onChange={(selectedOptions) => {
    console.log("Selected Options:", selectedOptions);
    // Update your state variable with the selected options
    field.onChange(selectedOptions);
  }}
  value={watch('conditionsSuggestions')} // Ensure this reflects your selected options
  mode="tags"
  label="Conditions"
  ref={selectRef}
  menuIsOpen={menuIsOpen}
  onMenuOpen={() => setMenuIsOpen(true)}
  onMenuClose={() => setMenuIsOpen(false)}
  style={{ width: '25rem', marginTop: '1rem' }}
  placeholder="Select Your Conditions/Diseases treated"
  onSelect={handleConditionSelect}
/>
          </div>
        )}
      />
    </StyledControllerContainer>
  );
};

export default ConditionsInput;
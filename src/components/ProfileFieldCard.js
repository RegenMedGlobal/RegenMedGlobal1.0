import { useEffect, useState } from "react";
import { Input, Button } from 'antd';
import { EditOutlined, MailOutlined, PhoneOutlined, CheckCircleOutlined } from '@ant-design/icons';
import styled from "styled-components";
import { getConditions } from "../functions/getConditions";
import debounce from 'lodash/debounce';
import { Select } from "antd";
import SelectConditions from "./Condiitons/SelectConditions";
import { states, countries } from "../config";

const CardContainer = styled.div`
  background-color: transparent;
  border: none;
  box-shadow: none;
  padding: 16px;
  margin: 8px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  text-align: left;
  margin-bottom: 0px;

  @media (max-width: 855px) {
    font-size: 14px; /* Adjust font size for smaller screens */
    height: 0%;
    width: 90%;
    margin: 0 auto;
  }

  @media (max-width: 767px) {
    padding: 16px 0;
  }
`;

const StyledTreatmentButton = styled(Button)`
  background-color: ${(props) => (props.active ? "#592CB8" : "white")};
  border: 1px solid ${(props) => (props.active ? "#592CB8" : "black")};
  color: ${(props) => (props.active ? "white" : "black")};
  margin-right: 8px;
  
  /* Add media query for mobile devices */
  @media (max-width: 768px) {
    width: 40%;
    padding: 0 4px; /* Add padding to control button size */
    font-size: 12px; /* Adjust the font size for mobile */
  }

  &:hover {
    background-color: ${(props) => (props.active ? "#592CB8" : "transparent")};
    color: ${(props) => (props.active ? "white" : "inherit")};
  }
`;

const StyledTreatmentButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4%;
`;

const NameValue = styled.div`
  font-size: 3.2rem; /* Adjust the font size as needed */
  font-weight: bold;
  /* Add any other styles you want to make it stand out */
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 4px;
  text-align: left;
  margin-top: 0;

  @media (max-width: 768px) {
    font-size: 1.3rem; /* Adjust font size for smaller screens */
    height: 60%;
  }
`;

const LabelText = styled.span`
  position: relative; /* Make the span a positioned container */
  display: inline-block; /* Display as inline block to fit the text width */
  margin-bottom: 4px; /* Adjust the spacing between the label and the bar */
  font-weight: bold; /* Apply font-weight to the label text */
`;
// &:after {
//   content: ''; /* Create a pseudo-element for the bar */
//   position: absolute; /* Position it absolutely within the span */
//   bottom: 0; /* Position it at the bottom of the span */
//   left: 0; /* Start from the left edge of the span */
//   width: 100%; /* Span the entire width of the span */
//   height: .25rem; /* Set the height of the bar */
//   background-color: var(--main-color);
// }

const WebsiteLabel = styled.div`
  font-weight: bold;
  font-size: 1.1rem; /* Set a smaller font size for the website label */
  margin-bottom: 4px;
  text-align: left; /* Left-align the label */
`;

const EditButton = styled(Button)`
  background-color: transparent;
  color: purple;
  font-weight: bold;
  margin-top: 10px;
  font-size: 12px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  align-self: flex-end; /* Align the edit button to the right */
  position: absolute;
  top: 0;

  &:hover {
    background-color: transparent;
    color: blue;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  .anticon {
    margin-right: 8px;
  }
`;

const LabelBar = styled.div`
`;

const StyledValue = styled.div`
  font-size: 15px;
  font-weight: 400; /* Increase font weight */
`;

const StyledValueWithIcon = styled.div`
  display: flex;
  align-items: center;

  .anticon {
    margin-right: 8px; /* Add a margin to separate the icon and the value */
  }

   @media (max-width: 768px) {
    font-size: 1.3rem; /* Adjust font size for smaller screens */
    height: 50%;
  }
`;

const treatmentOptions = ["PRP", "Stem Cell Therapy", "Prolotherapy"];

const ProfileFieldCard = ({
  fieldName,
  fieldValue,
  editMode,
  onEditField,
  onSaveField,
  onInputChange,
  onCloseField,
  loggedIn,
  currentUserID,
  profileId,
  labelName,
  labelNameOnEdit,
  profileData,
  setAddress,
  //customClass,
}) => {

  const specificFields = ['address', 'city', 'state', 'country', 'zipCode'];
  const keyPairs = {};

  if (profileData) {
    specificFields.forEach(fName => {
      const item = profileData.find(item => item.fieldName === fName);
      if (item) {
        keyPairs[fName] = item.fieldValue;
      }
    });
  }

  const [keyValuePair, setKeyValuePair] = useState(keyPairs);

  const [filteredConditions, setFilteredConditions] = useState([]);
  const [filterTerm, setFilterTerm] = useState('');
  const [selectedConditions, setSelectedConditions] = useState([]);

  const handleAddConditions = () => {
    // Convert selectedConditions to a comma-separated string
    const updatedValue = selectedConditions.map(condition => condition.value).join(', ');
    onInputChange(fieldName, updatedValue);
  };

  const renderFieldValue = () => {
    if (fieldName === "Conditions" && fieldValue && !editMode) {
      return fieldValue.split(",").map((condition, i) => (
        <StyledValueWithIcon key={i}>
          <StyledValue>{condition.trim()}</StyledValue>
        </StyledValueWithIcon>
      ));
    } else if (fieldName === "Website" && fieldValue && !editMode) {
      return (
        <StyledValueWithIcon>
          <a href={fieldValue} target="_blank" rel="noopener noreferrer">
            <StyledValue>{fieldValue}</StyledValue>
          </a>
        </StyledValueWithIcon>
      );
    } else if (fieldValue && !editMode) {
      return (
        <StyledValueWithIcon>
          {/* Phone and email icons are added here */}
          {fieldName === "phone" ? <PhoneOutlined /> : null}
          {fieldName === "email" ? <MailOutlined /> : null}
          <StyledValue>{fieldValue}</StyledValue>
        </StyledValueWithIcon>
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    const debouncedFetchConditions = debounce(async () => {
      const conditionsData = await getConditions(filterTerm);
      setFilteredConditions(conditionsData);
    }, 300);

    debouncedFetchConditions();

    return () => {
      debouncedFetchConditions.cancel();
    };
  }, [filterTerm]);


  const renderTreatmentButtons = () => {
    if (fieldName === "treatments" && editMode) {
      return (
        <StyledTreatmentButtons>
          {treatmentOptions.map((option) => (
            <StyledTreatmentButton
              key={option}
              active={fieldValue && fieldValue.includes(option)}
              onClick={() => handleTreatmentButtonClick(option)}
            >
              {option}
            </StyledTreatmentButton>
          ))}
        </StyledTreatmentButtons>
      );
    }
    return null;
  };

  const handleConditionClick = (option) => {

  }


  const handleTreatmentButtonClick = (option) => {


    if (fieldValue !== undefined) {
      // Check if the option is already included in fieldValue
      if (fieldValue.includes(option)) {
        // If it's included, remove it from fieldValue
        const updatedValue = fieldValue
          .split(",")
          .filter((treatment) => treatment.trim() !== option)
          .join(", ");
        onInputChange(fieldName, updatedValue);
      } else {
        // If it's not included, add it to fieldValue
        const updatedValue = fieldValue ? `${fieldValue}, ${option}` : option;
        onInputChange(fieldName, updatedValue);
      }
    }
  };

  const handleCreateOption = (inputValue) => {
    // Create a new option with the inputValue
    const newOption = { value: inputValue, label: inputValue };
    // Add the new option to the selectedConditions array
    setSelectedConditions([...selectedConditions, newOption]);
    // Trigger the onChange event with the updated selectedConditions
    setSelectedConditions(selectedConditions);
  };


  const shouldDisplayLabel = (fieldName, editMode) => {
    return true;
  };

  return (
    <CardContainer>
      {editMode ? (
        <>
          <Label>
            <LabelText>
              {editMode ? (
                labelNameOnEdit
                  ? labelNameOnEdit + ":"
                  : fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ":"
              ) : (
                labelName
                  ? labelName + ":"
                  : fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ":"
              )}
            </LabelText>
          </Label>
          <LabelBar />


          {(fieldName === "treatments" || fieldName === "conditions") ? (
            <>
              {fieldName === "treatments" && (
                <div>
                  {/* <p>Types offered at your clinic:</p> */}
                  {renderTreatmentButtons()}
                  {/* <Input
            type="text"
            value={fieldValue || ""}
            onChange={(event) => onInputChange(fieldName, event)}
          /> */}
                </div>
              )}
              {fieldName === "conditions" && editMode && (
                <div className="select-box-edit" style={{ "width": "100%" }}>
                  <SelectConditions
                    onInputChange={onInputChange}
                    selectedOptions={fieldValue.trim() != "" ? fieldValue.split(',').map((value) => { return { label: value, value: value } }) : "" }
                    options={filteredConditions.filter((option)=>{
                      return !fieldValue.split(',').includes(option)
                    }).map(condition => ({ value: condition, label: condition }))}
                    filterTerm={filterTerm}
                    setFilterTerm={setFilterTerm}
                    setOptions={setFilteredConditions}
                  />
 
                </div>
              )}
            </>
          ) : (
            ((fieldName === "description" || fieldName === "address") && editMode) ? (

              (fieldName == "address" ? (
                <>
                  <div className="mb-2 custom-control-wrapper">
                    <label>Address</label>
                    <Input
                      type="text"
                      className="custom-control"
                      value={keyValuePair.address || ""}
                      onChange={(event) => {
                        const updatedJsonData = { ...keyValuePair };
                        updatedJsonData.address = event.target.value;
                        setKeyValuePair(updatedJsonData)
                        onInputChange("address", event)
                      }}
                    />
                  </div>

                  <div className="mb-2 custom-control-wrapper">
                    <label>City</label>
                    <Input
                      type="text"
                      className="custom-control"
                      value={keyValuePair.city || ""}
                      onChange={(event) => {
                        const updatedJsonData = { ...keyValuePair };
                        updatedJsonData.city = event.target.value;
                        setKeyValuePair(updatedJsonData)
                        onInputChange("city", event)
                      }}
                    />
                  </div>

                  <div className="mb-2 custom-control-wrapper">
                    <label>State</label>
                    <Select
                      className="custom-control"
                      options={states.map(state => ({ value: state, label: state }))}
                      value={keyValuePair.state}
                      onChange={(value) => {
                        const updatedJsonData = { ...keyValuePair };
                        updatedJsonData.state = value;
                        setKeyValuePair(updatedJsonData)
                        onInputChange("state",  {'target': {"value": value}})
                      }}
                      disabled={!(keyValuePair.country === "United States" || keyValuePair.country === "Mexico" || keyValuePair.country === "Canada" )}
                    />
                    {/* <Input
                      type="text"
                      value={keyValuePair.state || ""}
                      onChange={(event) => onInputChange("state", event)}
                    /> */}
                  </div>

                  <div className="mb-2 custom-control-wrapper">
                    <label>Zipcode</label>
                    <Input
                      type="text"
                      className="custom-control"
                      value={keyValuePair.zipCode || ""}
                      onChange={(event) => {
                        const updatedJsonData = { ...keyValuePair };
                        updatedJsonData.zipCode = event.target.value;
                        setKeyValuePair(updatedJsonData)
                        onInputChange("zipCode", event)
                      }}
                    />
                  </div>

                  <div className="mb-2 custom-control-wrapper">
                    <label>Country</label>

                    <Select
                      className="custom-control"
                      options={countries.map(country => ({ value: country, label: country }))}
                      value={keyValuePair.country}
                      onChange={(value) => {
                        const updatedJsonData = { ...keyValuePair };
                        updatedJsonData.country = value;
                        setKeyValuePair(updatedJsonData)
                        console.log(value)
                        onInputChange("country", {'target': {"value": value}})
                      }}
                      
                    />

                    {/* <Input
                      type="text"
                      value={keyValuePair.country || ""}
                      onChange={(event) => onInputChange("country", event)}
                    /> */}
                  </div>





                </>
              ) :
                <textarea
                  className="area-text input-get"
                  value={fieldValue || ""}
                  onChange={(event) => onInputChange(fieldName, event)}
                >
                  {fieldValue || ""}
                </textarea>
              )

            ) :
              <Input
                type="text"
                value={fieldValue || ""}
                onChange={(event) => onInputChange(fieldName, event)}
              />
          )}
          <div className="button-wrapper">
            <Button onClick={() => onSaveField(fieldName)}>Save</Button>
            <Button onClick={() => onCloseField(fieldName)}>Close</Button>
          </div>
        </>
      ) : (
        <>
          {loggedIn && currentUserID === profileId && (
            <EditButton onClick={() => onEditField(fieldName)}>
              <EditOutlined /> Edit
            </EditButton>
          )}
          <div>
            <div>
              {shouldDisplayLabel(fieldName, editMode) && (
                <>
                  {fieldName === "website" ? (
                    <div>
                      <WebsiteLabel>Website:</WebsiteLabel>
                      <IconContainer>
                        <CheckCircleOutlined />{" "}
                        {/* Add the CheckCircleOutlined icon */}
                        <a href={fieldValue} target="_blank" rel="noopener noreferrer">
                          {fieldValue}
                        </a>
                      </IconContainer>
                    </div>
                  ) : (
                    <>
                      <Label>
                        <LabelText>
                          {labelName
                            ? labelName + ":"
                            : fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ":"}
                        </LabelText>
                      </Label>
                      <LabelBar /> {/* Add the horizontal bar */}
                      <div>
                        {renderFieldValue()}
                      </div>
                    </>
                  )}
                </>
              )}

            </div>

            {!shouldDisplayLabel(fieldName, editMode) && (
              <div>
                {fieldName === "name" ? (
                  <NameValue>{fieldValue}</NameValue>
                ) : (
                  <div>
                    {renderFieldValue()}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </CardContainer>
  );
};

export default ProfileFieldCard;
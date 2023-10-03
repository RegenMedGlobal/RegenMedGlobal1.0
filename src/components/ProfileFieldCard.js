import { useState } from "react";
import { Input, Button } from 'antd';
import { EditOutlined, MailOutlined, PhoneOutlined, CheckCircleOutlined  } from '@ant-design/icons';
import styled from "styled-components";

const CardContainer = styled.div`
  background-color: transparent;
  border: none;
  box-shadow: none;
  padding: 16px;
  margin: 8px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align children to the top of the card */

  margin-bottom: 16px; /* Add margin to create space below the card */
`;


const StyledTreatmentButton = styled(Button)`
  background-color: transparent;
  border: 1px solid ${(props) => (props.active ? "#592CB8" : "inherit")};
  color: ${(props) => (props.active ? "white" : "inherit")}; /* Set text color to white when active */
  margin-right: 8px;

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
  font-size: 2.5rem;
  margin-bottom: 4px;
  text-align: left;
  margin-top: 0; /* Adjust the margin-top to move the label closer to the top */

`;


const LabelText = styled.span`
  position: relative; /* Make the span a positioned container */
  display: inline-block; /* Display as inline block to fit the text width */
  margin-bottom: 4px; /* Adjust the spacing between the label and the bar */
  font-weight: bold; /* Apply font-weight to the label text */

  &:after {
    content: ''; /* Create a pseudo-element for the bar */
    position: absolute; /* Position it absolutely within the span */
    bottom: 0; /* Position it at the bottom of the span */
    left: 0; /* Start from the left edge of the span */
    width: 100%; /* Span the entire width of the span */
    height: .25rem; /* Set the height of the bar */
    background-color: var(--main-color);
  }
`;

const WebsiteLabel = styled.div`
  font-weight: bold;
  font-size: 1em;
  margin-bottom: 4px;
  text-align: left; /* Left-align the label */
`;

const EditButton = styled(Button)`
  background-color: transparent;
  color: purple;
  font-weight: bold;
  margin-top: 12px;
  font-size: 12px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  align-self: flex-end; /* Align the edit button to the right */

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
  width: auto; /* Allow the bar to adjust its width based on content */
  height: .25rem; /* Set the height of the bar */
  background-color: var(--main-color);
  margin-top: 4px; /* Adjust the spacing between the label and the bar */
  display: inline-block; /* Display as inline-block to match the text width */
`;

const StyledValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold; /* Increase font weight */
`;
const StyledValueWithIcon = styled.div`
  display: flex;
  align-items: center;

  .anticon {
    margin-right: 8px; /* Add a margin to separate the icon and the value */
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
  //customClass,
}) => {

  

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


const handleTreatmentButtonClick = (option) => {
  console.log('Option clicked:', option);
  console.log('Current fieldValue:', fieldValue);

  if (fieldValue !== undefined) {
    // Check if the option is already included in fieldValue
    if (fieldValue.includes(option)) {
      // If it's included, remove it from fieldValue
      const updatedValue = fieldValue
        .split(",")
        .filter((treatment) => treatment.trim() !== option)
        .join(", ");
      console.log('Removing option from fieldValue:', option);
      console.log('Checking treatment:', updatedValue);
      onInputChange(fieldName, updatedValue);
    } else {
      // If it's not included, add it to fieldValue
      const updatedValue = fieldValue ? `${fieldValue}, ${option}` : option;
      console.log('Checking treatment:', updatedValue);
      console.log('Updated value:', updatedValue);
      onInputChange(fieldName, updatedValue);
    }
  }
};



  const shouldDisplayLabel = (fieldName) => {
    // Determine whether to display a label based on the field name
    return !["name", "email", "phone"].includes(fieldName);
  };

  return (
    <CardContainer>
      {editMode ? (
        <>
          {fieldName === "treatments" ? (
            <div>
              {/* ... (other treatment-related code) */}
            </div>
          ) : (
            <Input
              type="text"
              value={fieldValue || ""}
              onChange={(event) => onInputChange(fieldName, event)}
            />
          )}

          <Button onClick={() => onSaveField(fieldName)}>Save</Button>
          <Button onClick={() => onCloseField(fieldName)}>Close</Button>
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
              {shouldDisplayLabel(fieldName) && (
                <>
                  {fieldName === "website" ? (
                    <div>
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
                          {fieldName === "description"
                            ? "About Us:"
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

            {!shouldDisplayLabel(fieldName) && (
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
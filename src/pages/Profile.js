import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import Map from "../components/Map";
import styled from "styled-components";
import { AuthContext } from "../AuthContext";
import getProfile from "./getProfile";
import updateData from "./updateData";
import Select from "react-select";
import { terms } from "../config"; // 
import profile from '../assets/pro.png'
import pro from '../assets/rec-3.png'
import social1 from '../assets/social-1.png'
import social2 from '../assets/social-2.png'
import social3 from '../assets/social-3.png'
import social4 from '../assets/img-squre.png'
import social5 from '../assets/youtube.png'


const mainColor = "#4811ab"; // Define the main color variable

const EditButton = styled.button`
  color: ${mainColor};
  font-weight: bold;
  margin-top: 16px;
  padding: 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: white;
    background-color: ${mainColor};
  }
`;

const Container = styled.div`
  min-height: calc(100vh - 64px);
  background-color: #f2f2f2;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: 100px;

  .link {
    text-decoration: none;
    color: ${mainColor};
    font-weight: bold;
    margin-top: 16px;

    &:hover {
      color: white;
    }
  }
`;

const ReturnLink = styled(Typography)`
  && {
    color: ${mainColor};
    font-weight: bold;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-size: 1.8rem;
    cursor: pointer;
    transition: font-size 0.3s;

    &:hover {
      font-size: 1.3rem; /* Increase the font size on hover */
      color: ${mainColor}; /* Set the color to the main color */
    }
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-left: 2rem;
`;

const MapContainer = styled.div`
  flex: 1;
  margin-right: 2rem;
`;

const CardContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 80%;

  .select-dropdown {
    appearance: none;
    background-color: #f2f2f2;
    border: none;
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 4px;
    cursor: pointer;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px #bfbfbf;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Card = styled.section`
  display: flex;
  flex-direction: column;
  background-color: white;
  color: black;
  transition: background-color 0.3s, color 0.3s;
  padding: 12px;
  margin-bottom: 16px;
  width: 60%;
  border-radius: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);

  a {
    color: ${mainColor};
    text-decoration: none;
    font-weight: bold;
    margin-top: 16px;
    transition: color 0.3s;

    &:hover {
      color: white;
    }
  }

  &:hover {
    background-color: ${mainColor};
    color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border: none;

    a {
      color: white;
    }

    button {
      color: white;
    }
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${mainColor};
    font-weight: bold;
    margin-top: 16px;
    padding: 8px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: white;
    }
  }
`;

const Profile = () => {
  const { loggedIn, currentUser } = useContext(AuthContext);
  const [cardStates, setCardStates] = useState([]);
  const [profileId, setProfileId] = useState(``);
  const [loading, setLoading] = useState(false); // Add a loading state variable
  const [error, setError] = useState(null); // Add an error state variable
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {}; // Set an empty object as the default value for state
  const resultRadius = state.resultRadius || 0; // Set a default value for resultRadius
  const fromProfile = state.fromProfile;
  const [conditionsSuggestions, setConditionsSuggestions] = useState([]); // Suggested terms for conditions
  const [editedConditions, setEditedConditions] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]); // Add a new state variable to store the selected conditions
  let fieldAssoc = {
    'name': 0,
    'description': 1,
    'conditions': 2,
    'treatments': 3,
    'website': 4,
    'address': 5,
    'email': 6,
    'phone': 7
  }
  let excludedAttrs = [0, 4, 5, 6, 7];

 // console.log("cardStates", cardStates);
 // console.log("initial search on profile: ", state.initialSearch);

  console.log("current user from profile:", currentUser);
  let currentUserID;
  try {
    const jsonUser = JSON.parse(currentUser);
    console.log("jsonuser", jsonUser);
    currentUserID = jsonUser.userId; // Update the property name to "userId"
    console.log("current userid from json in profile:", currentUserID);
  } catch (error) {
    console.error("Error parsing or accessing user data:", error);
  }

  useEffect(() => {
    const url = window.location.href; // Get the current URL
    const id = url.substring(url.lastIndexOf("/") + 1); // Extract the ID from the URL

    setLoading(true); // Set loading to true when the component mounts

    // Make an API call to fetch the profile data using the ID
    getProfile(id)
      .then((response) => {
        console.log("Profile data:", response);
        const data = response;

        // Update the ID state variable
        setProfileId(data.id);

        const fieldNames = [
          "name",
          "description",
          "treatments",
          "conditions",
          "website",
          "address",
          "email",
          "phone",
        ];
        const cardStates = fieldNames.map((fieldName) => ({
          editMode: false,
          fieldName: fieldName.charAt(0).toUpperCase() + fieldName.slice(1), // Capitalize the field name
          fieldValue: data[fieldName] || "", // Assuming the profile data is in the form of fieldName: value
        }));
        setCardStates(cardStates);

        setLoading(false); // Set loading to false when the data is fetched
      })
      .catch((error) => {
        setLoading(false); // Set loading to false when the data is fetched
        setError(error?.message || "Something went wrong!"); // Set the error state variable
        console.error("Error fetching profile data:", error);
        // Handle the error case here
        // Perform any necessary error handling or display an error message
      });
  }, [currentUser]);

  const handleAddTreatment = (event, index) => {
    const selectedTreatment = event.target.value;
    setCardStates((prevState) => {
      const updatedCardStates = [...prevState];
      const fieldValue = updatedCardStates[index].fieldValue;

      if (fieldValue) {
        updatedCardStates[
          index
        ].fieldValue = `${fieldValue.trim()}, ${selectedTreatment}`;
      } else {
        updatedCardStates[index].fieldValue = selectedTreatment;
      }

      return updatedCardStates;
    });
  };

  const handleEditConditions = (index) => {
    setCardStates((prevCardStates) => {
      const updatedCardStates = [...prevCardStates];
      updatedCardStates[index].editMode = true;
      return updatedCardStates;
    });
  };

  // console.log('terms: ', conditionsSuggestions)
  const setConditionSuggestionsFromTerms = () => {
    setConditionsSuggestions(terms.map((term) => ({ value: term, label: term })));
  };

  // Call the setConditionSuggestionsFromTerms function when the component mounts
  useEffect(() => {
    setConditionSuggestionsFromTerms();
  }, []);

  const handleCloseConditionsEdit = (index) => {
    setCardStates((prevCardStates) => {
      const updatedCardStates = [...prevCardStates];
      updatedCardStates[index].editMode = false;
      return updatedCardStates;
    });
  };


  const handleConditionsChange = (selectedOptions) => {
    // Convert selectedOptions to an array if it's not already
    const optionsArray = Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions];

    // Get the values of the selected options and trim them
    const selectedConditionValues = optionsArray.map((option) => option.value.trim());

    console.log("Selected Conditions:", selectedConditionValues);

    setCardStates((prevCardStates) => {
      const updatedCardStates = [...prevCardStates];

      // Get the existing conditions from the cardStates
      const existingConditions = updatedCardStates[2].fieldValue
        .split(", ")
        .map((condition) => condition.trim());

      // Merge the existing and new conditions while removing duplicates
      const updatedConditions = [
        ...new Set([...existingConditions, ...selectedConditionValues]),
      ];

      console.log("Updated Conditions:", updatedConditions);

      // Update the fieldValue for Conditions with the updated conditions
      updatedCardStates[2].fieldValue = updatedConditions.join(", ");
      return updatedCardStates;
    });
  };

  const handleSaveConditions = async (index) => {
    try {
      const conditionsString = editedConditions.join(",");
      await updateData(profileId, "conditions", conditionsString);

      // Update the "conditions" state with the edited conditions
      setConditions([...editedConditions]);

    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle the error case here
      // Perform any necessary error handling or display an error message
    }

    setCardStates((prevCardStates) => {
      const updatedCardStates = [...prevCardStates];
      updatedCardStates[index].editMode = false;
      return updatedCardStates;
    });
  };


  const handleCloseClick = (index) => {
    setCardStates((prevCardStates) => {
      const updatedCardStates = [...prevCardStates];
      updatedCardStates[index].editMode = false;
      return updatedCardStates;
    });
  };

  const handleEditClick = (index) => {
    console.log("Clicked on Edit for card index:", index);

    setCardStates((prevCardStates) => {
      const updatedCardStates = [...prevCardStates];
      updatedCardStates[index].editMode = true;
      return updatedCardStates;
    });
  };

  const handleSaveClick = async (index) => {
    const url = window.location.href; // Get the current URL
    const id = url.substring(url.lastIndexOf("/") + 1); // Extract the ID from the URL

    console.log("URL:", url); // Log the URL
    console.log("ID:", id); // Log the ID
    console.log("Saving value:", cardStates[index].fieldValue); // Log the value being saved

    setCardStates((prevCardStates) => {
      const updatedCardStates = [...prevCardStates];
      updatedCardStates[index].editMode = false;
      return updatedCardStates;
    });

    // Determine the field name based on the index
    let fieldName;
    switch (index) {
      case 0:
        fieldName = "name";
        break;
      case 1:
        fieldName = "description";
        break;
      case 2:
        fieldName = "conditions";
        break;
      case 3:
        fieldName = "treatments";
        break;
      case 4:
        fieldName = "website";
        break;
      case 5:
        fieldName = "address";
        break;
      case 6:
        fieldName = "email";
        break;
      case 7:
        fieldName = "phone";
        break;
      // Add more cases for other fields if needed
      default:
        break;
    }

    try {
      await updateData(id, fieldName, cardStates[index].fieldValue);
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle the error case here
      // Perform any necessary error handling or display an error message
    }
  };

  const handleInputChange = (event, index) => {
    setCardStates((prevCardStates) => {
      const updatedCardStates = [...prevCardStates];
      updatedCardStates[index].fieldValue = event.target.value;
      console.log("updated card states: ", updatedCardStates); // Move this line before the return statement
      return updatedCardStates;
    });
  };

  const renderFieldValue = (fieldName, fieldValue, editMode, index) => {
    if (fieldName === "Conditions" && !editMode) {
      return fieldValue.split(",").map((condition, i) => (
        <span key={i}>
          {condition.trim()}
          {i !== fieldValue.split(",").length - 1 && ", "}
        </span>
      ));
    } else if (fieldName === "Website" && !editMode) {
      return <a href={fieldValue} target="_blank">{fieldValue}</a>;
    } else if (fieldName === "Email" && !editMode) {
      return <a href={`mailto:${fieldValue}`}>{fieldValue}</a>;
    } else {
      return fieldValue;
    }
  };

  const handleReturnToResults = () => {
    navigate("/results", {
      state: {
        searchTerm: state.initialSearch,
        location: state.resultAddress,
        radius: resultRadius,
      },
    });
  };

  console.log("cardStates:", cardStates);

  if (loading) {
    return (
      <Container>
        <h3>Loading profile data...</h3>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <h3>{error}</h3>
      </Container>
    );
  }

  if (cardStates.length === 0) {
    return (
      <Container>
        <h3>No profile data available.</h3>
      </Container>
    );
  }

  console.log("profileid: ", profileId);
  // console.log("prcardStatesofileid: ", cardStates.flatMap((ele) => { ele }));
  return (
    <Container>
      {loggedIn && currentUser.firstTimeLogin && (
        <Typography variant="h4" component="h4" sx={{ mb: 2 }}>
          Welcome back, {currentUser.name}!
        </Typography>
      )}
      {!loggedIn && fromProfile && (
        <ReturnLink
          variant="body2"
          className="link"
          onClick={handleReturnToResults}
        >
          Return to Results
        </ReturnLink>




      )}

      <div className="outer-div">
        <div className="side-bar">
          <div className="side-top-1">
            <img className="side-profile" src={profile} />
          </div>
          <ul className="side-bar-ul">
            {/* <li><p> <img className="side-profile-same" src={social1} alt="Social Icon" /><> {cardStates[fieldAssoc.phone].fieldValue}  {loggedIn && currentUserID === profileId && (
              <div>
                <EditButton onClick={() => handleEditClick(fieldAssoc.phone)}>
                  Edit
                </EditButton>
              </div>
            )}
            </></p></li> */}

            {cardStates[fieldAssoc.phone].editMode ? <>
              <p > <input
                type="number"
                value={cardStates[fieldAssoc.phone].fieldValue}
                onChange={(event) => handleInputChange(event, fieldAssoc.phone)}
              /></p>
              <p className="dr" onClick={() => handleSaveClick(fieldAssoc.phone)} >Save</p>
              <p className="dr" onClick={() => handleCloseClick(fieldAssoc.phone)}>Close</p>
            </> : <>
            <div className="grid-cus">
              <img className="side-profile-same" src={social1} alt="Social Icon" />
              <p >{cardStates[fieldAssoc.phone].fieldValue}</p>
                </div>
              
              {loggedIn && currentUserID === profileId && (
              <div>
                <EditButton onClick={() => handleEditClick(fieldAssoc.phone)}>
                  Edit
                </EditButton>
              </div>
            )}
            </>}



            {/* <li><p> <img className="side-profile-same" src={social2} alt="Social Icon" />
              <>
                {cardStates[fieldAssoc.email].fieldValue}
                {loggedIn && currentUserID === profileId && (
                  <div>
                    <EditButton onClick={() => handleEditClick(index)}>
                      Edit
                    </EditButton>
                  </div>
                )}

              </>
            </p></li> */}
            {cardStates[fieldAssoc.email].editMode ? <>
              <p > <input
                type="email"
                value={cardStates[fieldAssoc.email].fieldValue}
                onChange={(event) => handleInputChange(event, fieldAssoc.email)}
              /></p>
              <p className="dr" onClick={() => handleSaveClick(fieldAssoc.email)} >Save</p>
              <p className="dr" onClick={() => handleCloseClick(fieldAssoc.email)}>Close</p>
            </> : <>
              <div className="grid-cus">
              <img className="side-profile-same" src={social2} alt="Social Icon" />
              <p >{cardStates[fieldAssoc.email].fieldValue}</p>
                </div>
              {loggedIn && currentUserID === profileId && (
              <div>
                <EditButton onClick={() => handleEditClick(fieldAssoc.email)}>
                  Edit
                </EditButton>
              </div>
            )}
            </>}
            {cardStates[fieldAssoc.website].editMode ? <>
              <p > <input
                type="link"
                value={cardStates[fieldAssoc.website].fieldValue}
                onChange={(event) => handleInputChange(event, fieldAssoc.website)}
              /></p>
              <p className="dr" onClick={() => handleSaveClick(fieldAssoc.website)} >Save</p>
              <p className="dr" onClick={() => handleCloseClick(fieldAssoc.website)}>Close</p>
            </> : <>
            <div className="grid-cus">
              <img className="side-profile-same" src={social3} alt="Social Icon" />
              <p >{cardStates[fieldAssoc.website].fieldValue}</p>
              </div>
              {loggedIn && currentUserID === profileId && (
              <div>
                <EditButton onClick={() => handleEditClick(fieldAssoc.website)}>
                  Edit
                </EditButton>
              </div>
            )}
            </>}




            {/* <li><p> <img className="side-profile-same" src={social3} alt="Social Icon" />
              <>
                {cardStates[fieldAssoc.website].fieldValue}
                {loggedIn && currentUserID === profileId && (
                  <div>
                    <EditButton onClick={() => handleEditClick(index)}>
                      Edit
                    </EditButton>
                  </div>
                )}

              </>
            </p></li> */}
          </ul>
          {/* <div className="side-top-2">
            <p className="YoutubeVideos">Youtube Videos</p>
            <ul>
              <li>
                <img className="side-profile-same-1" src={social4} />
                <img className="side-profile-same-2" src={social5} />
              </li>
              <li>
                <img className="side-profile-same-1" src={social4} />
                <img className="side-profile-same-2" src={social5} />
              </li>
              <li>
                <img className="side-profile-same-1" src={social4} />
                <img className="side-profile-same-2" src={social5} />
              </li>
              <li>
                <img className="side-profile-same-1" src={social4} />
                <img className="side-profile-same-2" src={social5} />
              </li>
              <li>
                <img className="side-profile-same-1" src={social4} />
                <img className="side-profile-same-2" src={social5} />
              </li>
              <li>
                <img className="side-profile-same-1" src={social4} />
                <img className="side-profile-same-2" src={social5} />
              </li>
            </ul>
          </div>
          <div className="side-top-2 last-ul-div">
            <p className="YoutubeVideos">Relevant pictures</p>
            <ul>
              <li>
                <img className="side-profile-same-1" src={social4} />
              </li>
              <li>
                <img className="side-profile-same-1" src={social4} />
              </li>
              <li>
                <img className="side-profile-same-1" src={social4} />
              </li>
              <li>
                <img className="side-profile-same-1" src={social4} />
              </li>
              <li>
                <img className="side-profile-same-1" src={social4} />
              </li>
              <li>
                <img className="side-profile-same-1" src={social4} />
              </li>
              <li>
                <img className="side-profile-same-1" src={social4} />
              </li>
              <li>
                <img className="side-profile-same-1" src={social4} />
              </li>
            </ul>
          </div> */}
        </div>

        <div className="doctor-sec">
          {/* <div className="doctor-sec-left">
          <img className="profile-left" src={profile} />
        </div>  */}
          <div className="doctor-sec-right">
            {cardStates[fieldAssoc.name].editMode ? <>
              <p className="dr-1"> <input
                type="text"
                value={cardStates[fieldAssoc.name].fieldValue}
                onChange={(event) => handleInputChange(event, fieldAssoc.name)}
              /></p>
              <p className="dr" onClick={() => handleSaveClick(fieldAssoc.name)} >Save</p>
              <p className="dr" onClick={() => handleCloseClick(fieldAssoc.name)}>Close</p>
            </> : <>
              <p className="dr-1">{cardStates[fieldAssoc.name].fieldValue}</p>
              {loggedIn && currentUserID === profileId && ( <p className="dr" onClick={() => handleEditClick(fieldAssoc.name)}>edit</p>)}
            </>}

            {cardStates[fieldAssoc.address].editMode ? <>
              <p className="dr-1"> <input
                type="text"
                value={cardStates[fieldAssoc.address].fieldValue}
                onChange={(event) => handleInputChange(event, fieldAssoc.address)}
              /></p>
              <p className="dr" onClick={() => handleSaveClick(fieldAssoc.address)} >Save</p>
              <p className="dr" onClick={() => handleCloseClick(fieldAssoc.address)}>Close</p>
            </> : <>
           <div className="grid-cus"> <img className="proimg" src={pro} alt="Pro" /><p >{cardStates[fieldAssoc.address].fieldValue}</p></div>
           {loggedIn && currentUserID === profileId && (<p className="dr" onClick={() => handleEditClick(fieldAssoc.address)}>edit</p>)}
            </>}

            {/* <p className="dr-2"><img className="proimg" src={pro} alt="Pro" /> {cardStates[fieldAssoc.address].fieldValue}</p>
            <p className="dr"><img className="proimg" src={pro} alt="Pro" /> edit</p> */}
          </div>
        </div>
        <div className="doctor-sec-bottom">
          <ProfileWrapper>
            <CardContainer>
              {cardStates.map((cardState, index) => (
                <Card key={index} className={"card-" + index}>
                  <h3 className="clinic-h">
                    {cardState.fieldName === "Name"
                      ? "Clinic Name/Doctor Name:"
                      : cardState.fieldName}
                  </h3>
                  <div className="outer-inner-div">
                    {cardState.editMode ? (
                      <div>
                        {cardState.fieldName === "Treatments" && (
                          <div className="inner-div">
                            <select
                              className="select-dropdown"
                              onChange={(event) => handleAddTreatment(event, index)}
                            >
                              <option value="">Select a treatment</option>
                              <option value="PRP">PRP</option>
                              <option value="Prolotherapy">Gene Therapy</option>
                              <option value="Stem">Stem Cell Therapy</option>
                            </select>
                          </div>
                        )}
                        {cardState.fieldName === "Conditions" && (
                          <div className="inner-div">
                            <Select
                              mode="multiple"
                              style={{ width: "100%" }}
                              placeholder="Conditions/Diseases treated"
                              value={conditionsSuggestions.filter((option) =>
                                cardStates[2].fieldValue.includes(option.value)
                              )}
                              onChange={handleConditionsChange}
                              options={conditionsSuggestions}
                            />
                            <input
                            style={{marginTop:"15px"}}
                              type="text"
                              value={cardState.fieldValue}
                              onChange={(event) => handleInputChange(event, index)}
                            />
                          </div>
                        )}
                        {!["Treatments", "Conditions"].includes(cardState.fieldName) && (
                          <div className="inner-div">
                            <input
                              type="text"
                              value={cardState.fieldValue}
                              onChange={(event) => handleInputChange(event, index)}
                            />
                          </div>
                        )}
                        <button onClick={() => handleSaveClick(index)}>Save</button>
                        <button onClick={() => handleCloseClick(index)}>Close</button>
                      </div>
                    ) : (
                      <div className="outer-inner-div">
                        {cardState.fieldName === "Treatments" ? (
                          <div className="inner-div">
                            {cardState.fieldValue.split(",").map((treatment, i) => (
                              <p className="clinic-p" key={i}>
                                {treatment.trim()}
                                {i !== cardState.fieldValue.split(",").length - 1 &&
                                  ", "}
                              </p>
                            ))}
                            {loggedIn && currentUserID === profileId && (
                              <div>
                                <EditButton onClick={() => handleEditClick(index)}>
                                  Edit
                                </EditButton>
                              </div>
                            )}
                          </div>
                        ) : cardState.fieldName === "Conditions" ? (
                          <div className="inner-div">
                            {cardState.fieldValue.split(",").map((condition, i) => (
                              <p className="clinic-p" key={i}>
                                {condition.trim()}
                                {i !== cardState.fieldValue.split(",").length - 1 &&
                                  ", "}
                              </p>
                            ))}
                            {loggedIn && currentUserID === profileId && (
                              <EditButton onClick={() => handleEditConditions(index)}>
                                Edit
                              </EditButton>
                            )}
                          </div>
                        ) : (
                          <div className="address-div">
                            {renderFieldValue(
                              cardState.fieldName,
                              cardState.fieldValue,
                              cardState.editMode,
                              index
                            )}
                            {loggedIn && currentUserID === profileId && (
                              <EditButton onClick={() => handleEditClick(index)}>
                                Edit
                              </EditButton>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </CardContainer>
          </ProfileWrapper>
        </div>
        <div className="get-in-touch">

          <div className="get-flex">
            <div className="row">
              <div className="col-lg-12">
                <p className="get-p">Get in touch</p>
              </div>
              <div className="col-lg-6">
                <div className="common-data">
                  <label>First name</label>
                  <input className="input-get" type="text" placeholder="First name" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="common-data">
                  <label>Last name</label>
                  <input className="input-get" type="text" placeholder="Last name" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="common-data">
                  <label>Email</label>
                  <input className="input-get" type="text" placeholder="Email" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="common-data">
                  <label>Phone Number</label>
                  <input className="input-get" type="text" placeholder="Phone Number" />
                </div>
              </div>
              <div className="col-lg-12">
                <div className="common-data">
                  <label>Messages</label>
                  <textarea className="area-text input-get" placeholder="Messages"></textarea>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="common-data mr-0">
                  <button className="Contact-bt">Contact</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="map-bottom">
          <MapContainer>
            <Map address={cardStates[5].fieldValue} />
          </MapContainer>
        </div>
      </div>

    </Container>
  );
};

export default Profile;
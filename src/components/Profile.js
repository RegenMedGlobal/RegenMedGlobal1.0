import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import getProfile from "../functions/getProfile";
import isVerified from "../functions/isVerified";
import updateData from "./updateData";
import { Typography, Button } from 'antd';
import ReactGA from 'react-ga';
import ProfileFieldCard from "../components/ProfileFieldCard";
import DoctorContact from "./DoctorContact";
import { terms } from "../config";
import Map from "../components/Map";
import {
  Container, Sidebar, Content, StyledContactSection, ReturnLink, ProfileWrapper, MapContainer, CardContainer, Card, ContactHeader, NameCard, ConditionsContainer
} from './StyledComponents'; 


const Profile = () => {
  const { loggedIn, currentUser } = useContext(AuthContext);
  const [profileId, setProfileId] = useState(``);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const resultRadius = state.resultRadius || 0;
  const fromProfile = state.fromProfile;
  const [conditionsSuggestions, setConditionsSuggestions] = useState([]);
  const [editedConditions, setEditedConditions] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const [isProfileVerified, setIsProfileVerified] = useState(false);

useEffect(() => {
  const profileIdFromUrl = location.pathname.split('/profile/')[1];
  setProfileId(profileIdFromUrl);
  
  // Track the page view with a unique identifier (e.g., the profile ID)
  ReactGA.pageview(`/profile/${profileIdFromUrl}`);

  // Set a custom page title with the profile's name or any other relevant information
  ReactGA.ga('set', 'title', `Profile - ${profileId}`);
  ReactGA.ga('send', 'pageview');

}, [location.pathname, profileId]);


  // Add console.log statements to check values
  console.log("loggedIn:", loggedIn);
  console.log("current user from profile:", currentUser);
  let currentUserID;
  try {
    const jsonUser = JSON.parse(currentUser);
    console.log("jsonuser", jsonUser);
    currentUserID = jsonUser.userId;
    console.log("current userid from json in profile:", currentUserID);
  } catch (error) {
    console.error("Error parsing or accessing user data:", error);
  }




useEffect(() => {
  setLoading(true);
  const url = window.location.href;
  const id = url.substring(url.lastIndexOf("/") + 1);

  getProfile(id)
    .then((response) => {
      console.log('Fetched profile data:', response); // Debugging log
      // Initialize the editMode property for each field
      const profileDataWithEditModes = Object.keys(response).map((fieldName) => ({
        fieldName,
        fieldValue: response[fieldName],
        editMode: false, // Initialize editMode to false
      }));

      setProfileData(profileDataWithEditModes); // Update state with initialized data
      setProfileId(response.id); // Set profileId based on the API response
      setLoading(false);
    })
    .catch((error) => {
      setLoading(false);
      setError(error?.message || 'Something went wrong!');
      console.error('Error fetching profile data:', error);
    });
}, [currentUser]);

  useEffect(() => {
    // Call the isVerified function with the profileId as a parameter
    isVerified(profileId)
      .then((result) => {
        console.log("verified")
        setIsProfileVerified(result);
      })
      .catch((error) => {
        console.error('Error verifying profile:', error);
      });
  }, [profileId]);


  useEffect(() => {
    console.log('profile data:', profileData);
  }, [profileData]);

  const setConditionSuggestionsFromTerms = () => {
    setConditionsSuggestions(terms.map((term) => ({ value: term, label: term })));
  };

  useEffect(() => {
    setConditionSuggestionsFromTerms();
  }, []);

const handleEditField = (fieldName) => {
  console.log(`Editing field: ${fieldName}`);
  setProfileData((prevData) =>
    prevData.map((field) => {
      if (field.fieldName.toLowerCase() === fieldName.toLowerCase()) {
        return {
          ...field,
          editMode: true,
        };
      }
      return field;
    })
  );
};

const handleCloseField = async (fieldName) => {


    setProfileData((prevData) => prevData.map((field) => {
      if (field.fieldName === fieldName) {
        return {
          ...field,
          editMode: false,
        };
      }
      return field;
    }));
  };

const handleSaveField = async (fieldName) => {
  try {
    //console.log('Updating profile data...');
    await updateData(profileId, fieldName, profileData.find((field) => field.fieldName === fieldName)?.fieldValue || '');
    //console.log('Profile data updated successfully.');
  } catch (error) {
    //console.error('Error updating profile:', error);
  }

  //console.log('Updating profileData state...');
  setProfileData((prevData) => prevData.map((field) => {
    if (field.fieldName === fieldName) {
      console.log('Setting editMode to false for fieldName:', fieldName);
      return {
        ...field,
        editMode: false,
      };
    }
    return field;
  }));
  console.log('ProfileData state updated.');
};

const handleInputChange = (fieldName, event) => {
  console.log(`event: `, event);
  const updatedValue = fieldName === 'treatments' ? event : event.target.value;
  console.log('Field Name:', fieldName);
  console.log('Updated Value:', updatedValue);

  setProfileData((prevData) => prevData.map((field) => {
    if (field.fieldName === fieldName) {
      return {
        ...field,
        fieldValue: updatedValue,
      };
    }
    return field;
  }));
};


const renderFieldValue = (fieldName, fieldValue, editMode, index) => {
  if (fieldName === "Conditions" && fieldValue && !editMode) {
    console.log("Rendering Conditions field value:", fieldValue);
    return fieldValue.split(",").map((condition, i) => (
      <span key={i}>
        {condition.trim()}
        {i !== fieldValue.split(",").length - 1 && ", "}
      </span>
    ));
  } else if (fieldName === "Website" && fieldValue && !editMode) {
    return <a href={fieldValue} target="_blank">{fieldValue}</a>;
  } else if (fieldName === "Email" && fieldValue && !editMode) {
    return <a href={`mailto:${fieldValue}`}>{fieldValue}</a>;
  } else if (fieldValue && !editMode) {
    return fieldValue;
  } else {
    return null;
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

  if (!profileData || profileData.length === 0) {
    return (
      <Container>
        <h3>No profile data available.</h3>
      </Container>
    );
  }return (
    <Container>
      {loggedIn && currentUser.firstTimeLogin && (
        <Typography variant="h4" component="h4" sx={{ mb: 2 }}>
          Welcome back, {currentUser.name}!
        </Typography>
      )}
      {!loggedIn && fromProfile && (
        <ReturnLink variant="body2" className="link" onClick={handleReturnToResults}>
          Return to Results
        </ReturnLink>
      )}
      <ProfileWrapper>
      <Sidebar>
        <NameCard>
            <ProfileFieldCard
    fieldName="name"
    fieldValue={profileData.find((field) => field.fieldName.toLowerCase() === "name")?.fieldValue || ""}
    editMode={profileData.find((field) => field.fieldName.toLowerCase() === "name")?.editMode || false}
    onEditField={handleEditField}
    onSaveField={handleSaveField}
    onCloseField={handleCloseField}
    onInputChange={handleInputChange}
    loggedIn={loggedIn}
    currentUserID={currentUserID}
    profileId={profileId}
    isVerified={isProfileVerified}
  >
    {renderFieldValue("name", profileData.find((field) => field.fieldName.toLowerCase() === "name")?.fieldValue || "", false)}
  </ProfileFieldCard>
        </NameCard>
          
         
    <StyledContactSection>
        <ContactHeader>How to reach us</ContactHeader>
      <ProfileFieldCard
        fieldName="email"
        fieldValue={profileData.find((field) => field.fieldName.toLowerCase() === "email")?.fieldValue || ""}
        editMode={profileData.find((field) => field.fieldName.toLowerCase() === "email")?.editMode || false}
        onEditField={handleEditField}
        onSaveField={handleSaveField}
        onCloseField={handleCloseField}
        onInputChange={handleInputChange}
        loggedIn={loggedIn}
        currentUserID={currentUserID}
        profileId={profileId}
      >
        {renderFieldValue("email", profileData.find((field) => field.fieldName.toLowerCase() === "email")?.fieldValue || "", false)}
      </ProfileFieldCard>

      <ProfileFieldCard
        fieldName="phone"
        fieldValue={profileData.find((field) => field.fieldName.toLowerCase() === "phone")?.fieldValue || ""}
        editMode={profileData.find((field) => field.fieldName.toLowerCase() === "phone")?.editMode || false}
        onEditField={handleEditField}
        onSaveField={handleSaveField}
        onCloseField={handleCloseField}
        onInputChange={handleInputChange}
        loggedIn={loggedIn}
        currentUserID={currentUserID}
        profileId={profileId}
      >
        {renderFieldValue("phone", profileData.find((field) => field.fieldName.toLowerCase() === "phone")?.fieldValue || "", false)}
      </ProfileFieldCard>

      <ProfileFieldCard
        fieldName="website"
        fieldValue={profileData.find((field) => field.fieldName.toLowerCase() === "website")?.fieldValue || ""}
        editMode={profileData.find((field) => field.fieldName.toLowerCase() === "website")?.editMode || false}
        onEditField={handleEditField}
        onSaveField={handleSaveField}
        onCloseField={handleCloseField}
        onInputChange={handleInputChange}
        loggedIn={loggedIn}
        currentUserID={currentUserID}
        profileId={profileId}
      >
        {renderFieldValue("website", profileData.find((field) => field.fieldName.toLowerCase() === "website")?.fieldValue || "", false)}
      </ProfileFieldCard>
    </StyledContactSection>
 
</Sidebar>

        <Content>
          <CardContainer>
            <Card>
              <ProfileFieldCard
                fieldName="description"
                fieldValue={profileData.find((field) => field.fieldName === "description")?.fieldValue || ""}
                editMode={profileData.find((field) => field.fieldName.toLowerCase() === "description")?.editMode || false}
                onEditField={handleEditField}
                onSaveField={handleSaveField}
                 onCloseField={handleCloseField}
                onInputChange={handleInputChange}
                loggedIn={loggedIn}
                currentUserID={currentUserID}
                profileId={profileId}
              />
            </Card>

        
            {/* <ConditionsContainer> */}
              <Card>
              <ProfileFieldCard
                fieldName="conditions"
                fieldValue={profileData.find((field) => field.fieldName === "conditions")?.fieldValue || ""}
                editMode={profileData.find((field) => field.fieldName.toLowerCase() === "conditions")?.editMode || false}
                onEditField={handleEditField}
                onSaveField={handleSaveField}
                 onCloseField={handleCloseField}
                onInputChange={handleInputChange}
                loggedIn={loggedIn}
                currentUserID={currentUserID}
                profileId={profileId}
              />
            </Card>
            <Card>
              <ProfileFieldCard
                fieldName="treatments"
                fieldValue={profileData.find((field) => field.fieldName === "treatments")?.fieldValue || ""}
                editMode={profileData.find((field) => field.fieldName.toLowerCase() === "treatments")?.editMode || false}
                onEditField={handleEditField}
                onSaveField={handleSaveField}
                 onCloseField={handleCloseField}
                onInputChange={handleInputChange}
                loggedIn={loggedIn}
                currentUserID={currentUserID}
                profileId={profileId}
              />
            </Card>
            {/* </ConditionsContainer> */}
         

<Card>
  <ProfileFieldCard
    fieldName="address"
    fieldValue={`
      ${profileData.find((field) => field.fieldName === "address")?.fieldValue || ""}
      ${profileData.find((field) => field.fieldName === "city")?.fieldValue || ""}
      ${profileData.find((field) => field.fieldName === "state")?.fieldValue || ""}
      ${profileData.find((field) => field.fieldName === "country")?.fieldValue || ""}
      ${profileData.find((field) => field.fieldName === "zipCode")?.fieldValue || ""}
    `}
    editMode={profileData.find((field) => field.fieldName.toLowerCase() === "address")?.editMode || false}
    onEditField={handleEditField}
    onSaveField={handleSaveField}
    onCloseField={handleCloseField}
    onInputChange={handleInputChange}
    loggedIn={loggedIn}
    currentUserID={currentUserID}
    profileId={profileId}
  />
</Card>

          </CardContainer>
       <DoctorContact />
          <MapContainer>
            <Map address={profileData.find((field) => field.fieldName === "address")?.fieldValue} />
          </MapContainer>
        </Content>
      </ProfileWrapper>
    </Container>
  );
};


export default Profile;

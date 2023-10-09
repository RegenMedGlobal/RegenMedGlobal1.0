/* eslint-disable no-unused-vars */
import styled from 'styled-components';
import { Typography } from 'antd';

const mainColor = "#4811ab";
const sidebarBackgroundColor = "#ffffff";
const sidebarWidth = "300px";
const sidebarHeight = "80%"; // Adjust the height as needed

const { Text } = Typography;

export const Container = styled.div`
  background-color: #f2f2f2;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5%;

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


export const Sidebar = styled.div`
  flex: 1;
  width: ${sidebarWidth};
  padding: 16px;
  background-color: ${sidebarBackgroundColor};
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  height: ${sidebarHeight};
  position: sticky;

  @media (max-width: 850px) {
    padding: 10px;
    font-size: 14px;
  
    margin: 0 auto;
    margin-top: 2rem;
    height: 30%; /* Adjusted height for mobile */
  }
`;

// StyledContactSection styles
export const StyledContactSection = styled.div`
  padding: 20px;
  margin-bottom: 16px;
  border-radius: 8px;
  flex: 1;
  overflow-wrap: break-word; /* Add this to allow the text to wrap */
  word-wrap: break-word; /* For compatibility with older browsers */
  word-break: break-word; /* Break words when needed */
  hyphens: auto; /* Enable hyphenation */

  @media (max-width: 850px) {
    padding: 10px; /* Adjust padding for smaller screens */
    font-size: 10px; /* Adjust font size for smaller screens */

  }
`;

export const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
 

  @media (min-width: 854px) {
    
    flex-direction: row;
  }

   @media (max-width: 850px) {
   
    height: 30%;
  }
`;


export const Content = styled.div`
  flex: 3;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between; 
  
  @media (min-width: 850px) {
    height: 70%;
 

  }

  @media (max-width: 850px) {
    height: 70%;
   

  }
`;

export const Card = styled.section`
  color: #333;
  border-radius: 8px;
  font-family: 'Arial', sans-serif;
  margin: 2% auto; /* Adjust the margin-top and margin-bottom to move the card */
  width: 100%; /* Cards take full width on smaller screens */
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;


  .profile-header-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-top: 8px;
    text-align: center;
  }
`;

export const ReturnLink = styled(Typography)`
  color: ${mainColor};
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
  cursor: pointer;
  transition: font-size 0.3s;

  &:hover {
    text-decoration: underline;
    color: ${mainColor} !important;
  }
`;

export const MapContainer = styled.div`
  flex: 1;
  margin-right: 2rem;
  margin-bottom: 2rem;
`;

export const CardContainer = styled.div`
  margin-bottom: 16px;
  width: 100%; /* Cards take full width on smaller screens */
`;


export const ContactHeader = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
  width: 100%;
`;

export const NameCard = styled(CardContainer)`
  margin-bottom: 16px;
  width: 100%;

   
`;

export const ConditionsContainer = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap; /* Wrap conditions to new line on smaller screens */
`;

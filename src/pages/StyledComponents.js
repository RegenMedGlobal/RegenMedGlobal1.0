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

export const Sidebar = styled.div`
  flex: 1;
  width: ${sidebarWidth};
  padding: 16px;
  background-color: ${sidebarBackgroundColor};
  display: flex;
  flex-direction: column;
  border-radius: 8px; // Add border-radius for a modern look
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); // Add shadow for depth
  height: 80%;
  position: sticky;

  @media (max-width: 768px) {
    width: ${sidebarWidth}; // Full width on small screens
  }
`;


export const Content = styled.div`
  flex: 3;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

`;

export const Card = styled.section`
  color: #333;
  border-radius: 8px;
  font-family: 'Arial', sans-serif;
  margin: 2% auto; /* Adjust the margin-top and margin-bottom to move the card */
  width: 60%;
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
    font-size: 1.3rem;
    color: ${mainColor};
  }
`;

export const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
    margin-left: 2rem;
  }
`;

export const MapContainer = styled.div`
  flex: 1;
  margin-right: 2rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    margin-right: 0;
    margin-bottom: 0;
  }
`;

export const CardContainer = styled.div`
  margin-bottom: 16px;
`;



export const StyledContactSection = styled.div`
  padding: 20px;
  margin-bottom: 16px;
  border-radius: 8px;
  flex: 1;
`;

export const ContactHeader = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
  width: 100%;

  @media (min-width: 768px) {
    width: 100%;
  }
`;

export const NameCard = styled(CardContainer)`
  margin-bottom: 16px;

  @media (min-width: 768px) {
    width: 100%;
  }
`;

export const ConditionsContainer = styled.section`
  display: flex;
  flex-direction: row;
`;

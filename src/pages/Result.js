import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { HERE_API_KEY} from '../config';
import styled from 'styled-components';
import { getDistance } from 'geolib';
import test from '../assets/rec-1.png'
import rec from '../assets/rec-3.png'
import isVerified from "../functions/isVerified";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const apiKey = HERE_API_KEY; 
const mainColor = '#4811ab'; // Define the main color variable

const StyledLayout = styled(Layout)`
  padding: 10px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 0 0 3px ${mainColor};
    transform: translateY(-2px);
  }

  h4 {
    color: ${mainColor};
    font-weight: bold;
    margin-bottom: 5px;
  }

  p {
    margin: 0;
  }

  .link {
    color: ${mainColor};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: darken(${mainColor}, 10%);
    }
  }

  .map-link {
    color: #1890ff;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #40a9ff;
    }
  }

  &.selected {
    background-color: #f5f5f5; /* Add your desired gray color value */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 0 0 3px ${mainColor};
    transform: translateY(-2px);
  }
`;

const styles = {
  claimedInfo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem', // Apply a smaller font size
  },
  checkmarkIcon: {
    color: 'var(--main-color)',
    marginRight: '8px', // Adjust the margin as needed
    fontSize: '1rem', // Apply a smaller font size
  },
  claimedText: {
    color: 'var(--main-color)',
    fontSize: '1rem', // Apply a smaller font size
  },
};

const Result = ({ result, isSelected, resultAddress, initialSearch, initialTreatments, resultRadius,  }) => {
  console.log('Result component rendered. : ', result);


  const { id, name, city, country, resultState, specialty, placeId, address } = result;
  const [distance, setDistance] = useState(result.distance.toFixed(2));
  const [isProfileVerified, setIsProfileVerified] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  console.log('Result city: ', city);

// const fetchDistance = async () => {
//   if (!resultAddress || !userLocation) {
//     setDistance('');
//     return;
//   }


//   try {
//     const userCoordinates = userLocation;
//     console.log("UserLocation ", userLocation)
//     const addressCoordinates = await getLocationCoordinates(resultAddress);

//     if (!addressCoordinates) {
//       setDistance('');
//       return;
//     }

//     const distanceInMeters = getDistance(userCoordinates, addressCoordinates);
//     const distanceInMiles = distanceInMeters * 0.000621371;

//     setDistance(distanceInMiles.toFixed(2));
//   } catch (error) {
//     console.error('Error fetching distance:', error);
//     setDistance('');
//   }
// };


  // useEffect(() => {
  //   fetchDistance();
  // }, [resultAddress, userLocation]);

  useEffect(() => {
    // Call the isVerified function with the profileId as a parameter
    isVerified(id)
      .then((result) => {
        setIsProfileVerified(result);
      })
      .catch((error) => {
        console.error('Error verifying profile:', error);
      });
  }, []);

// useEffect(() => {
//   // Define a function to retrieve the user's location
//   const fetchUserLocation = async () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({
//             latitude: 25.775080,
//             longitude: -80.194702,
//           });
//         },
//         (error) => {
//           console.error('Error retrieving user location:', error);
//           // If geolocation fails,  get coordinates from resultAddress
//           setUserLocation({
//         latitude: 25.775080,
//         longitude: -80.194702,
//       });
//         }
//       );
//     } else {
//       console.log('Geolocation is not supported by this browser.');
//       // If geolocation is not supported, attempt to get coordinates from resultAddress
//        // If geolocation is not supported, use coordinates from result.latitude and result.longitude
//       setUserLocation({
//         latitude: 25.775080,
//         longitude: -80.194702,
//       });
//     }
//   };

//   // Call the function to fetch user location when the component mounts
//   fetchUserLocation();
// }, []);



//   const getLocationCoordinates = async (location) => {
//   try {
//     const url = `https://geocode.search.hereapi.com/v1/geocode?apiKey=${apiKey}&q=${encodeURIComponent(location)}`;
//     console.log('URL:', url);

//     const response = await fetch(url);
//     console.log('Response:', response);

//     if (response.ok) {
//       console.log('Response Type:', response.type);
//       console.log('Response Headers:', response.headers);
//       const data = await response.json();
//       console.log('Data:', data);

//       if (data && data.items && data.items.length > 0) {
//         const { position } = data.items[0];
//         console.log('Coordinates:', position);
//         return position;
//       } else {
//         throw new Error('No results found for the location.');
//       }
//     } else {
//       throw new Error('Failed to fetch data from the API.');
//     }
//   } catch (error) {
//     console.log('Error retrieving location coordinates:', error);
//     // Handle the error, such as showing a message to the user or setting a specific state variable to indicate the error.
//     return null;
//   }
// };
  
  const navigate = useNavigate();
 

  const handleProfileClick = (result) => {
  //  console.log('Result:', result); // Log the result object
    console.log('initial search: ', initialSearch)
    console.log('result address: ', resultAddress)
   // console.log('initial treatments:', initialTreatments)

    
    navigate(`/profile/${id}`, {
      state: {
        ...result,
        initialSearch: initialSearch,
        resultAddress: resultAddress,
        resultCity: city,
        resultState: resultState,
        resultCountry: country,
        resultRadius: resultRadius,
        initialTreatments: initialTreatments,
        fromProfile: true
      }
    });
  };
  return (
    <StyledLayout className={`result-card ${isSelected ? 'selected' : ''}`} onClick={() => handleProfileClick(result)}>
      <div className='left-flx'>
      <img className='test-img' src={test} />
      </div>
      <div className='flex-right-cus'>
<Link style={{ textDecoration: 'none' }}>
  <div className="claimed-info">
    <h4>{name}</h4>
    {isProfileVerified && <span>
      <FontAwesomeIcon icon={faCheckCircle} className="checkmark-icon" style={styles.checkmarkIcon} />
      <span style={styles.claimedText}>Claimed</span>
    </span>}
  </div>
</Link>


        <p className='add-css'><img className='test-img-1' src={rec} /> {address}</p>
        <p className='add-css-1'>{specialty}</p>
      </div>
     
       {distance && (
        <p>{`Distance: ${distance} miles`}</p>
      )} 
      {placeId && (
        <p>
          <a href={`https://www.google.com/maps/place/?q=place_id:${placeId}`} target="_blank" rel="noopener noreferrer">
            View on Google Maps
          </a>
        </p>
      )}
    </StyledLayout>
  );
};

Result.propTypes = {
  result: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    specialty: PropTypes.string.isRequired,
    placeId: PropTypes.string,
    address: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  resultAddress: PropTypes.string,
};

export default Result;

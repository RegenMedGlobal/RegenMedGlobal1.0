import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from '../config';

const ResultsMap = ({ results }) => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState([0, 0]); // Default center at [0, 0]

  useEffect(() => {
    mapboxgl.accessToken =  MAPBOX_TOKEN; // Replace with your Mapbox access token

    const mapInstance = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11', // Use any default Mapbox style that supports OpenStreetMap data
      center: [0, 0],
      zoom: 4,
    });

    setMap(mapInstance);

    return () => {
      // Clean up the map instance when the component unmounts
      mapInstance.remove();
    };
  }, []);

// ... (other imports and component code) ...

useEffect(() => {
  console.log("Map Changes")
  const fetchCoordinates = async () => {
    const coordinatesPromises = results.map(async (result) => {
      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        result.address
      )}.json?access_token=${MAPBOX_TOKEN}`;

      try {
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          return { ...result, lat, lng };
        }
      } catch (error) {
        console.error('Error geocoding address:', error);
      }

      return null;
    });

    const coordinatesData = await Promise.all(coordinatesPromises);

    const filteredCoordinates = coordinatesData.filter(
      (coordinates) => coordinates !== null
    );

    if (filteredCoordinates.length > 0) {
      const avgLat = filteredCoordinates.reduce(
        (sum, coord) => sum + coord.lat,
        0
      ) / filteredCoordinates.length;
      const avgLng = filteredCoordinates.reduce(
        (sum, coord) => sum + coord.lng,
        0
      ) / filteredCoordinates.length;
      setCenter([avgLng, avgLat]);

      // Calculate the bounds of marker coordinates
      const bounds = new mapboxgl.LngLatBounds();
      filteredCoordinates.forEach((coord) => {
        bounds.extend([coord.lng, coord.lat]);
      });

      // Fit the map to the bounds with an immediate transition
      if (map) {
        map.fitBounds(bounds, {
          padding: 20, // Optional padding around the bounds
          duration: 0, // Set the duration to 0 for an immediate transition
        });
        console.log('Map bounds set:', bounds);
      }

      map.on('load', () => {
        console.log('Map Loaded');
        console.log("Filtered", filteredCoordinates);

        filteredCoordinates.forEach((coordinates) => {
          const marker = new mapboxgl.Marker()
            .setLngLat([coordinates.lng, coordinates.lat])
            .addTo(map);
          console.log('Marker added:', marker);

         // Create a popup for the marker
const popup = new mapboxgl.Popup({
  closeButton: false, // Optionally, you can include a close button
  closeOnClick: false, // Prevent closing when clicking on the map
  anchor: 'bottom', // Set the anchor position to the bottom
})
  .setHTML(
    `<div class="popup-container">
      <h3 class="popup-title">${coordinates.name}</h3>
      ${coordinates.phone ? `<p class="popup-phone">Phone: ${coordinates.phone}</p>` : ''}
      ${coordinates.email ? `<p class="popup-email">Email: ${coordinates.email}</p>` : ''}
      <p class="popup-address">${coordinates.address}</p>
    </div>`
  );

          // Attach the popup to the marker
          marker.setPopup(popup);

          // Show the popup when hovering over the marker
          marker.getElement().addEventListener('mouseenter', () => {
            marker.getPopup().addTo(map);
          });

          // Hide the popup when the mouse leaves the marker
          marker.getElement().addEventListener('mouseleave', () => {
            marker.getPopup().remove();
          });
        });
      });
    }
  };

  fetchCoordinates();
}, [map, results]);

// ... (other component code) ...


  return <div id="map" style={{ height: '400px', width: '100%' }} />;
};

ResultsMap.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ResultsMap;

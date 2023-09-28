import React, { useEffect, useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import mapboxgl from "mapbox-gl"; // This is a dependency of react-map-gl even if you didn't explicitly install it
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;
import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox styles
import { MAPBOX_TOKEN } from '../config'; // Import the Mapbox access token
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const Map = ({ address }) => {
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    width: '100%',
    height: 400,
    zoom: 10,
  });

  useEffect(() => {
    if (address) {
      fetchCoordinates(address);
    }
  }, [address]);

  const fetchCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();

      console.log('Geocoding data:', data);

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        console.log('Fetched coordinates:', longitude, latitude);
        setViewport({
          ...viewport,
          longitude,
          latitude,
        });
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <ReactMapGL
        {...viewport}
        onViewportChange={setViewport}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {viewport.latitude !== 0 && viewport.longitude !== 0 && (
          <Marker latitude={viewport.latitude} longitude={viewport.longitude}>
            <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" color="red" />
          </Marker>
        )}
      </ReactMapGL>
    </div>
  );
};

export default Map;

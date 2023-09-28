import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the data context
export const DataContext = createContext();

// Create a data provider component
export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);

  // Fetch data from the server and update the state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/data');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};

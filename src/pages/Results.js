import React, { useState, useEffect, useCallback, Suspense } from "react";
import {
  Layout as AntLayout,
  Pagination,
  Button,
  Progress as AntProgress,
  AutoComplete,
} from "antd";
import { getDistance } from "geolib";
import axios from "axios";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Result from "./Result";
import ResultsMap from "./ResultsMap";
import Sort from "../components/Sort";
import getData from "../functions/getData";
import geocodeCity from "../functions/geoCodeCity";
import { getConditions } from  "../functions/getConditions";
import debounce from 'lodash.debounce';

const StyledAntLayout = styled(AntLayout)`
 
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 10px;

  button {
    margin: 0 5px 5px 0;
  }
`;

// TODO: Should user be able set this with a dropdown and expand results?
const PAGE_SIZE = 5;
const selectedMarkerIndex = -1;

const Results = () => {

  const [sortOrder, setSortOrder] = useState("distance");
  const { state } = useLocation();
  const [radius, setRadius] = useState(25);
  const [results, setResults] = useState([]);
  const [currentResults, setCurrentResults] = useState([]);
  const [sortedResults, setSortedResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [checkboxOptions, setCheckboxOptions] = useState(
    state?.checkedOptions ?? [
      { label: "PRP", value: "PRP", checked: false },
      { label: "Stem Cell Therapy", value: "Stem", checked: false },
      { label: "Prolotherapy", value: "Prolotherapy", checked: false },
    ]
  );

  const [page, setPage] = useState(1);
  const [filterTerm, setFilterTerm] = useState(state?.searchTerm ?? "");
  const [storedValues, setStoredValues] = useState({
    filterTerm: "",
    address: "",
    checkboxOptions: [],
    radius: "",
  });

  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(state?.location ?? "");
  const [userLocation, setUserLocation] = useState(null);
  const [filterCoordinates, setFilterCoordinates] = useState(null);
  const [percent, setPercent] = useState(0);
  const [conditions, setConditions] = useState([]);

  // Save search parameters when the user leaves the results page
  useEffect(() => {
    window.onbeforeunload = () => {
      // Save individual search parameters
      const searchParams = {
        filterTerm,
        address,
        radius,
        checkboxOptions,
      };
      localStorage.setItem("searchParameters", JSON.stringify(searchParams));
    };

    return () => {
      window.onbeforeunload = null; // Cleanup the event handler
    };
  }, [filterTerm, address, radius, checkboxOptions]);

  const debouncedFetchConditions = debounce(async (term) => {
    const conditionsData = await getConditions(term);
    setConditions(conditionsData);
  }, 300);

  useEffect(() => {
    const fetchConditions = async () => {
      if (filterTerm.trim().length >= 3) {
        debouncedFetchConditions(filterTerm);
      }
    };
    fetchConditions();
  }, [filterTerm]);

  const handleSearch = useCallback((value) => {
    setFilterTerm(value);
  }, []);

  const debouncedHandleAddressChange = debounce(async (value) => {
    setAddress(value);

    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          value
        )}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
      );

      const resultCities = response.data.features.filter((suggestion) => {
        // Check if the place type is a city
        return suggestion.place_type.includes("place") &&
          suggestion.context
      });

      setSuggestions(resultCities);
    } catch (error) {
      // TODO: // Handle Error State properly
      console.error("Error fetching suggestions:", error);
    }
  }); // Adjust the debounce delay as needed


  const handleAddressChange = (value) => {
    debouncedHandleAddressChange(value);
  };

  const handleRadiusChange = (value) => {
    setRadius(value);
  };

  const onSortOrderChange = (value) => {
    setSortOrder(value)
  };

  const handleChangePage = (page) => {
    setPage(page);
  };

  // Does this need to do anything???
  const handleProfileClick = (result) => {
    console.log("Clicked result:", result);
  };

  useEffect(() => {

    const fetchUserLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        
      } catch (error) {
        // TODO: // Handle Error State
        console.log("Error retrieving user location:", error);
        setUserLocation(null); // Set userLocation to null in case of error or denial
        setSortOrder("asc")
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        fetchUserLocation
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      setSortOrder("asc")
    }
  }, []);

  useEffect(() => {
    const storedValuesJSON = localStorage.getItem("storedValues");
    if (storedValuesJSON) {
      const storedValuesData = JSON.parse(storedValuesJSON);
      setStoredValues(storedValuesData);
    }
  }, []);

  // Should this be set everytime a storedValue is changed??
  useEffect(() => {
    localStorage.setItem("storedValues", JSON.stringify(storedValues));
  }, [storedValues]);

  const handleButtonClick = (value) => {
    const updatedOptions = checkboxOptions.map((option) =>
      option.value === value ? { ...option, checked: !option.checked } : option
    );
    setCheckboxOptions(updatedOptions);
    localStorage.setItem("checkboxOptions", JSON.stringify(updatedOptions));
  };

  // TODO: Does this need to be used anywhere
  const handleInputChange = useCallback((e) => {
    const searchTerm = e.target.value;
    setFilterTerm(searchTerm);
  }, []);

  const updateResults = (filteredResults) => {
    if (filteredResults.length === 0) {
      setResults([]);
      setCurrentResults([]);
      setSortedResults([]);
    } else {
      setResults(filteredResults);
      setCurrentResults(filteredResults);
      setSortedResults(filteredResults);
      setPage(1);
    }
  };

  const getFilteredConditions = (value) => {
    const filterTerm = value.trim().toLowerCase();
    return conditions.filter((condition) => condition.toLowerCase().includes(filterTerm));
  };

  useEffect(() => {
    
    const fetchResults = async () => {
      setLoading(true);

      if (!address || address.length === 0) {
        setLoading(false);
        return;
      }

      const [city, state, country] = address.split(",");
      const trimmedCity = city?.trim();
      const trimmedState = state?.trim();
      const trimmedCountry = country?.trim() || "United States";

      if (address.split(",").length < 3) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await getData(
          filterTerm,
          checkboxOptions,
          trimmedCity,
          trimmedState,
          trimmedCountry,
          radius,
          setPercent
        );

        if (error) {
          // TODO: // Handle Error State
          console.log("Error retrieving search results:", error);
          setLoading(false);
          return;
        }
        
        // Include and Calculate Distance
        let baseLocation = {}
        if(!userLocation) {
          const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            address
          )}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`;

          const response = await axios.get(geocodeUrl);
          const features = response.data.features;

          if (features.length > 0) {
            const coordinates = features[0].center;
            baseLocation = {
              latitude: coordinates[1],
              longitude: coordinates[0],
            };
          }

        } else {
          // User Location
          baseLocation = userLocation;
        }

        let dataWithDistance = data.map((obj) => {
            let dis_in_miles = null;
            if(baseLocation) {
              let dis_in_meters = getDistance({ latitude: obj.latitude, longitude: obj.longitude }, baseLocation);
              dis_in_miles = dis_in_meters * 0.00062137;
            }

            return {
              ...obj,
              distance: dis_in_miles
            }
          });
        
        updateResults(dataWithDistance);
      } catch (error) {
        // TODO: // Handle Error State
        console.log("Error retrieving search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [userLocation, filterTerm, checkboxOptions, address, radius]);

  useEffect(() => {
    const locationArray = address.split(",");
    if (locationArray.length >= 3) {
      const city = locationArray[0]?.trim();
      const state = locationArray[1]?.trim();
      const country = locationArray[2]?.trim();

      if (city && state && country) {
        const getGeocodedAddress = async () => {
          const geocodedAddress = await geocodeCity(city, state, country);
          setFilterCoordinates(geocodedAddress);
        };

        getGeocodedAddress();
      } else {
        // TODO: // Handle Error State -> Display warning to user?
        console.log("Invalid address format:", address);
      }
    } else {
      // TODO: // Handle Error State - display error to user?
      console.log("Invalid address:", address);
    }
  }, [address]);

  useEffect(() => {
    if (results.length > 0) {
      setLoading(false);
    }
  }, [results]);

  useEffect(() => {

    // Update currentResults based on sortedResults
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const slicedResults = sortedResults.slice(startIndex, endIndex);
    setCurrentResults(slicedResults);
  }, [sortedResults, page]);


  useEffect(() => {
    const sortResults = () => {
      let sorted = [...results];

      if (sortOrder === "distance") {
        console.log("Sorting by distance...");
        sorted.sort((a, b) => a.distance - b.distance);

        // TODO: // Is this still needed?? If so Would this be a candidate for DRYing out as it looks like its reused...

        //  if (!userLocation) {
        //   console.log(`User location not available. Address: ${address}`);

        //   // Use the Mapbox Geocoding API to convert the address to coordinates
        //   const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        //     address
        //   )}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`;

        //   // Create an array of promises
        //   const geocodingPromises = sorted.map((result) => {
        //     return new Promise(async (resolve) => {
        //       try {
        //         const response = await axios.get(geocodeUrl);
        //         const features = response.data.features;

        //         if (features.length > 0) {
        //           // Extract coordinates from the first feature
        //           const coordinates = features[0].center;
        //           const addressCoordinates = {
        //             latitude: coordinates[1],
        //             longitude: coordinates[0],
        //           };

        //           const distance = getDistance(
        //             { latitude: result.latitude, longitude: result.longitude },
        //             addressCoordinates
        //           );

        //           resolve({ ...result, distance });
        //         } else {
        //           // Handle the case where the geocoding response doesn't contain valid coordinates
        //           console.log('Invalid address:', address);
        //           resolve({ ...result, distance: 0 }); // Set a default distance or handle it as needed
        //         }
        //       } catch (error) {
        //         // Handle any errors from the geocoding request
        //         console.error('Error geocoding address:', error);
        //         resolve({ ...result, distance: 0 }); // Set a default distance or handle it as needed
        //       }
        //     });
        //   });

        //   // Wait for all promises to resolve
        //   Promise.all(geocodingPromises).then((resolvedResults) => {
        //     // Sort the resolved results by distance
        //     resolvedResults.sort((a, b) => a.distance - b.distance);
        //     sorted = resolvedResults;
        //   });
        // }

        //  else {
        //     // Calculate distances based on user location
        //     sorted = results.map((result) => {
        //       const distance = getDistance(
        //         {
        //           latitude: userLocation.latitude,
        //           longitude: userLocation.longitude,
        //         },
        //         { latitude: result.latitude, longitude: result.longitude }
        //       );
        //       console.log(`Distance for ${result.name}: ${distance} miles`);
        //       return { ...result, distance };
        //     });

        //     // Sort the results by distance
        //     sorted.sort((a, b) => a.distance - b.distance);
        //   }
      } else if (sortOrder === "asc") {
        console.log("Sorting in ascending order...");
        sorted.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortOrder === "desc") {
        console.log("Sorting in descending order...");
        sorted.sort((a, b) => b.name.localeCompare(a.name));
      }

      return sorted;

    };

    const sortedResults = sortResults();

    // Update currentResults based on sortedResults
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const slicedResults = sortedResults.slice(startIndex, endIndex);
    setCurrentResults(slicedResults);

    // Update sortedResults state
    setSortedResults(sortedResults);
  }, [results, sortOrder, page, setCurrentResults, setSortedResults, filterCoordinates]);



  return (
    <StyledAntLayout className="results">
      {/* <h1>Results</h1> */}

      <section className="results-section">
        <section className="search">
          <div className="div-1">
            <h1 className="h1-new">Search</h1>
            <h4 className="search-top">Choose Treatment Type(s):</h4>
            <ButtonContainer className="mar-0-top">
              {checkboxOptions.map((option) => (
                <Button className={option.checked ? "test-button active " : "test-button "}
                  key={option.value}
                  type={option.checked ? "primary" : "default"}
                  onClick={() => handleButtonClick(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </ButtonContainer>

            <h4 className="search-top">Location</h4>
            <AutoComplete
              style={{ width: "100vw", maxWidth: "100%" }}
              value={address}
              onSelect={(value) => setAddress(value)}
              onSearch={handleAddressChange}
              placeholder="Enter a location..."
              options={suggestions.map((suggestion) => ({
                label: suggestion.place_name,
                value: suggestion.place_name,
              }))}
            />

            <div className="mar-test"></div>

            <h4 className="search-top">Condition (Optional)</h4>
            <AutoComplete
              style={{ width: "100%", margin: "0 auto" }}
              value={filterTerm}
              options={getFilteredConditions(filterTerm).map((condition) => ({
                value: condition,
              }))}
              onChange={handleSearch}
              placeholder="Search medical conditions"
            />

            <div className="mar-test"></div>
          </div>
          <div className="div-2">
            {window.innerWidth > 500 && (
              <ResultsMap
                style={{ width: "20%" }}
                results={results}
              />
            )}
          </div>
        </section>
        <section className="results-list">
          <Suspense fallback={<div>Loading...</div>}>
            {/* TODO: Refactor nested ternaries */}
            {loading ? (
              <div className="operation-div">
                <AntProgress className="card-data" percent={percent} status="active" strokeColor="#4811ab" trailColor="#ffdb58" style={{ height: "8rem" }} />
                <div>Loading results...</div>
              </div>
            ) : !address ? (
              <h2>No Address Found</h2>
            ) : currentResults.length === 0 ? (
              <>
                <Sort sortOrder={sortOrder} onSortOrderChange={onSortOrderChange} radius={radius} handleRadiusChange={handleRadiusChange} setRadius={setRadius} />
                <h2>No Results Found</h2>
              </>
            ) : (
              <div>
                <Sort sortOrder={sortOrder} resultsLength={results.length} onSortOrderChange={onSortOrderChange} radius={radius} handleRadiusChange={handleRadiusChange} setRadius={setRadius} />
                {currentResults.map((result, index) => (
                  <Result
                    result={result}
                    key={result.id}
                    resultAddress={`${result.address}, ${result.city}, ${result.state}, ${result.country}`}
                    initialSearch={filterTerm}
                    initialTreatments={checkboxOptions}
                    resultRadius={radius}
                    onProfileClick={handleProfileClick}
                    isSelected={selectedMarkerIndex === index}
                  />
                ))}
                <Pagination
                  total={results.length}
                  pageSize={PAGE_SIZE}
                  current={page}
                  onChange={handleChangePage}
                />
              </div>
            )}
            {window.innerWidth < 500 && currentResults.length > 0 && (
              <ResultsMap
                style={{ width: "20%" }}
                results={results}
              />
            )}
          </Suspense>
        </section>
      </section>
    </StyledAntLayout>
  );
};

export default Results;

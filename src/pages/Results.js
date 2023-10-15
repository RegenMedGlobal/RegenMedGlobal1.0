import React, { useState, useEffect, useCallback, Suspense, useMemo} from "react";
import {
  Layout,
  Pagination,
  Input,
  Form,
  Button,
  Select,
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
import {  MAPBOX_TOKEN } from "../config";
import geocodeCity from "../functions/geoCodeCity";
import { getConditions } from  "../functions/getConditions";
import debounce from 'lodash.debounce';



const StyledForm = styled(Form)`
  width: 40%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
`;

const AutocompleteContainer = styled.div`
  position: relative;
  width: 13rem;
  margin-right: 20rem;
  display: flex;
  justify-content: center;
  align-items: center;

  .location-search-input {
    width: 100%;
  }

  .autocomplete-dropdown-container {
    position: absolute;
    top: 100%;
    width: 100%;
    max-height: 10rem;
    overflow-y: auto;
    background-color: #ffffff;
    border: 1px solid #cccccc;
    z-index: 10;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-right: auto;
    margin-left: auto;

    .location-search-input {
      width: 100%;
      min-width: 15rem; /* Adjust the max-width value as needed */
    }
  }
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
const { Option } = Select;
const PAGE_SIZE = 5;

const Results = () => {



  const [sortOrder, setSortOrder] = useState("distance");
  const { state } = useLocation();
  const [radius, setRadius] = useState(25);
  const [results, setResults] = useState([]);
  console.log('state in results:', state)
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(-1);
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
}, [filterTerm, debouncedFetchConditions]);



const handleSearch = useCallback((value) => {
  setFilterTerm(value);
  console.log("Condition Search Term:", value);
}, []);


const debouncedHandleAddressChange = debounce(async (value) => {
  setAddress(value);

  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        value
      )}.json?access_token=${MAPBOX_TOKEN}`
    );

    // Filter suggestions for US cities
    const usCities = response.data.features.filter((suggestion) => {
      // Check if the place type is a city
      return suggestion.place_type.includes("place") &&
        suggestion.context &&
        suggestion.context.find(
          (context) => context.id.startsWith("country") && context.short_code === "us"
        );
    });

    setSuggestions(usCities);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }
}); // Adjust the debounce delay as needed


const handleAddressChange = (value) => {
  debouncedHandleAddressChange(value);
};

  const handleRadiusChange = (value) => {
    setRadius(value);
    console.log(`radius: ${radius}`);
  };

  const onSortOrderChange = (value) => {
    setSortOrder(value)
    console.log("Sort: ", sortOrder)
  }


const handleChangePage = (page) => {
  setPage(page);
};


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


 // Replace the getFilteredOptions function with this simplified version
const getFilteredConditions = (value) => {
  const filterTerm = value.trim().toLowerCase();
  return conditions.filter((condition) =>
    condition.toLowerCase().includes(filterTerm)
  );
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
          console.log("Error retrieving search results:", error);
          setLoading(false);
          return;
        }

        updateResults(data);
      } catch (error) {
        console.log("Error retrieving search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [filterTerm, checkboxOptions, address, radius]);

  useEffect(() => {
    const locationArray = address.split(",");
    if (locationArray.length >= 3) {
      const city = locationArray[0]?.trim();
      const state = locationArray[1]?.trim();
      const country = locationArray[2]?.trim();

      if (city && state && country) {
        const getGeocodedAddress = async () => {
          const geocodedAddress = await geocodeCity(city, state, country);
          console.log("geocodedAddress:", JSON.stringify(geocodedAddress));
          setFilterCoordinates(geocodedAddress);
        };

        getGeocodedAddress();
      } else {
        console.log("Invalid address format:", address);
      }
    } else {
      console.log("Invalid address:", address);
    }
  }, [address]);

  useEffect(() => {
    if (results.length > 0) {
      setLoading(false);
    }
  }, [results]);



  useEffect(() => {
    console.log("Current sorted results:", sortedResults);

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
    sorted = results.map((result) => {
      const distance = getDistance(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
        { latitude: result.latitude, longitude: result.longitude }
      );
      return { ...result, distance };
    });
    sorted.sort((a, b) => a.distance - b.distance);
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

console.log(`current results: ${currentResults}`)


  return (
    <Layout className="results">
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
            {window.innerWidth > 500 && <ResultsMap
              style={{ width: "20%" }}
              results={results}
            />}
          </div>


        </section>

        <section className="results-list">

          <Suspense fallback={<div>Loading...</div>}>
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
              <h2>No Results Found</h2></>
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
            {window.innerWidth < 500 && <ResultsMap
              style={{ width: "20%" }}
              results={results}
            />}

          </Suspense>

        </section>
      </section>
    </Layout>
  );
};

export default Results;



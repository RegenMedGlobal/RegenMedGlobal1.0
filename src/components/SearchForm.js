import React from 'react';
import { Form, Button, Checkbox as Antcheckbox, Input, Select } from 'antd';
import PlacesAutocomplete from 'react-places-autocomplete';

const { Option } = Select;

const SearchForm = ({
  filterTerm,
  handleInputChange,
  useCurrentLocation,
  handleUseCurrentLocationChange,
  address,
  handleAddressChange,
  handleLocationSubmit,
  radius,
  handleRadiusChange,
  checkboxOptions,
  handleCheckChange,
}) => {
  return (
    <section className='search'>
      <h4>Search</h4>
      <Input value={filterTerm} onChange={handleInputChange} />

      <section className='location-search'>
        <h4>Location</h4>
        <Form onFinish={handleLocationSubmit}>
          <Form.Item>
            <Antcheckbox
              checked={useCurrentLocation}
              onChange={handleUseCurrentLocationChange}
            >
              Use Current Location
            </Antcheckbox>
          </Form.Item>
          {!useCurrentLocation && (
            <Form.Item style={{ width: '40%', margin: '0 auto' }}>
              <PlacesAutocomplete
                value={address}
                onChange={handleAddressChange}
                onSelect={handleLocationSubmit}
              >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                  <div>
                    <Input
                      {...getInputProps({
                        placeholder: 'Search Places ...',
                        className: 'location-search-input',
                      })}
                    />
                    <div className='autocomplete-dropdown-container'>
                      {loading && <div>Loading...</div>}
                      {suggestions &&
                        suggestions.map((suggestion) => {
                          const className = suggestion.active
                            ? 'suggestion-item--active'
                            : 'suggestion-item';
                          // inline style for demonstration purpose
                          const style = suggestion.active
                            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                            : { backgroundColor: '#ffffff', cursor: 'pointer' };
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                className,
                                style,
                              })}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
            </Form.Item>
          )}
          <Form.Item>
            <Select value={radius} onChange={handleRadiusChange} style={{ width: '20%' }}>
              <Option value={10}>10 miles</Option>
              <Option value={25}>25 miles</Option>
              <Option value={50}>50 miles</Option>
              <Option value={100}>100 miles</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmltype='submit'>
              Search
            </Button>
          </Form.Item>
        </Form>
      </section>

      {checkboxOptions &&
        checkboxOptions.map((checkbox, index) => (
          <Antcheckbox
            key={index}
            value={checkbox.value}
            className='checkbox'
            type={checkbox.value}
            checked={checkbox.checked}
            onChange={(e) => handleCheckChange(e.target.checked)}
          />
        ))}
    </section>
  );
};

export default SearchForm;

import React from 'react';
import Select from 'react-select';
import states from './states';

const StateSearch = ({ value, onChange }) => {
  const options = states.map((state) => ({ value: state, label: state }));

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Select state..."
    />
  );
};

export default StateSearch;

import React from 'react';
import PropTypes from 'prop-types';
import { Input as Antinput } from 'antd';

const Search = ({ value, onChange }) => {
  return (
    <form>
      <Antinput
        className='search-input'
        type='text'
        placeholder='Filter'
        value={value}
        onChange={onChange}
      />
    </form>
  );
};

Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Search;

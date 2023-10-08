import React, {  } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
// import { useLocation } from 'react-router-dom';

const { Option } = Select;

const Sort = ({ sortOrder, resultsLength, onSortOrderChange, radius, handleRadiusChange }) => {
  // COMMENTED : NOT IN USE
  // const { state } = useLocation();
  // COMMENTED : NOT IN USE
  // const [suggestions, setSuggestions] = useState([]);
  // const [radius, setRadius] = useState(25);
  // COMMENTED : NOT IN USE
  // const [address, setAddress] = useState(state?.location ?? "");
  // const handleChange = (value) => {
  //   console.log("sortOrder",value);
  //   onSortOrderChange(value);
  // };
  console.log("sortOrder",sortOrder);

  return (

    <div className="filter">
      <div className="filter-left">
       {resultsLength && <p className="span-clr"><span>{resultsLength}</span> results found</p>}
      </div>
      <div className="filter-right">
        <div className='parent-sel-1 distance-filter'>
          <span className='fil-1' style={{ marginRight: '8px' }}>Distance:</span>
          <Select className='select-no mor-sele'
            value={radius}
            onChange={handleRadiusChange}
          >
            <Option value={25}>25 miles</Option>
            <Option value={50}>50 miles</Option>
            <Option value={100}>100 miles</Option>
            <Option value={500}>500 miles</Option>
          </Select>
        </div>
        <div className='parent-sel-1'>
          <span className='fil-1' style={{ marginRight: '8px' }}>Sort by:</span>
          <Select value={sortOrder} onChange={onSortOrderChange} className='select-no'>
            <Option value={'distance'}>Distance</Option>
            <Option value={'asc'}>A-Z</Option>
            <Option value={'desc'}>Z-A</Option>
          </Select>
        </div>
      </div>
    </div>

  );
};

Sort.propTypes = {
  sortOrder: PropTypes.string.isRequired,
  onSortOrderChange: PropTypes.func.isRequired,
};

export default Sort;

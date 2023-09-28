import React from 'react';
import { Checkbox as AntCheckbox } from 'antd';

const Checkbox = ({ type, value, checked, handleCheckChange }) => {

  return (
    <AntCheckbox
      className='checkbox'
      value={value}
      checked={checked}
      onChange={handleCheckChange}
    >
      {type}
    </AntCheckbox>
  );
};

export default Checkbox;


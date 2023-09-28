import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ header, body }) => {
  return (
    <div className="w-64 bg-white rounded-lg shadow-md p-4 m-4">
      <h2 className="text-xl font-bold mb-2 text-center">{header}</h2>
      <p className="text-gray-700">{body}</p>
    </div>
  );
};

Card.propTypes = {
  header: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default Card;

// BlobComponent.js
import React from 'react';
import PropTypes from 'prop-types';

const BlobComponent = ({ color, position, animation }) => {
  const blobStyle = {
    backgroundColor: color,
    position: 'absolute',
    ...position,
    animation,
    borderRadius: '100px',
    filter: 'blur(50px)',
  };

  return <div className={`blob ${color.toLowerCase()}`} style={blobStyle}></div>;
};

BlobComponent.propTypes = {
  color: PropTypes.string.isRequired,
  position: PropTypes.object.isRequired,
  animation: PropTypes.string.isRequired,
};

export default BlobComponent;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Confirmation = () => {
  const modalStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background overlay
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  const contentStyle = {
    width: '80%', // Adjust the width for mobile screens
    maxWidth: '400px', // Limit the maximum width for larger screens
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '8px',
    textAlign: 'center',
  };

  // Media query for small screens (mobile)
  const mediaQuery = window.matchMedia('(max-width: 767px)');

  if (mediaQuery.matches) {
    contentStyle.width = '90%'; // Adjust the width for small screens
  }

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/doctorlogin');
  };

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <h2>Confirmation</h2>
        <p>
          Thank you for signing up. You can access or edit your page at anytime by{' '}
          <span style={{ color: 'var(--main-color)', cursor: 'pointer' }} onClick={handleLoginClick}>
            logging in.
          </span>{' '}
         
        </p>
      </div>
    </div>
  );
};

export default Confirmation;

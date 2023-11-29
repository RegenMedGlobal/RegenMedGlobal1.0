import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import img3 from '../assets/logo.png';
import { AppBar } from '@mui/material';
import { AuthContext } from '../AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import SubscriptionForm from './SubscriptionForm';

const NavbarItem = styled(Link)`
  text-decoration: none;
  color: ${props => (props.sidebar ? "#000" : "#fff")};
  margin-left: 16px;
  display: inline-block;
  font-size: 18px;
  font-weight: normal; /* Default font-weight */
  &:hover {
    color: yellow;
    transform: scale(1.2);
  }
  /* Conditional styling for the active page */
  ${props =>
    props.active &&
    css`
      color: yellow;
      font-size: 20px; /* Font size for active item */
      font-weight: bold; /* Font weight for active item */
  `}
`;

const SubscribeContainer = styled.div`
  display: none; /* Hide by default for non-mobile screens */
  
  @media (max-width: 991px) {
    display: block; /* Show for mobile screens */
    text-align: center;
  }

  .subscribe-button {
    cursor: pointer;
    color: white;
  }

  .subscribe-link {
    color: white; 
    text-decoration: none; /* Remove underline */
  }
`;

const Navbar = () => {
  const { loggedIn, logout, currentUser , authorLoggedIn, currentAuthorUser, authorLogout} = useContext(AuthContext);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  let currentUserID;

  if(Object.keys(currentUser).length !== 0) {
    try {
      const jsonUser = JSON.parse(currentUser);
      currentUserID = jsonUser.userId;
    } catch (error) {
      // TODO: handle error
      console.error('Error parsing or accessing user data:', error);
    }
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen); // Toggle the mobile menu state
  };
  const handleLinkClick = (text) => {
    // Close the mobile menu when a link is clicked
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAuthorLogout= () => {
    authorLogout();
    navigate('/');
  }

  const handleSubscribeClick = () => {
    setSubscribeOpen(!subscribeOpen);
  }

  return (

    <AppBar position="fixed">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" onClick={() => handleLinkClick('Home')}>
            <img src={img3} alt="Regenerative Medicine Global Logo" />
          </Link>

          <SubscribeContainer>
            <button
              className="subscribe-button"
              onClick={handleSubscribeClick}
            >
              Subscribe
            </button>
            {subscribeOpen && (
              <SubscriptionForm
                modalOpen={subscribeOpen}
              />
            )}
          </SubscribeContainer>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={handleDrawerToggle} // Toggle mobile menu
          >
            {mobileOpen
              ? <span className={`navbar-cross-icon`}>X</span>
              : <FontAwesomeIcon icon={faBars} />
            }

          </button>
          <div className={`collapse navbar-collapse${mobileOpen ? ' show' : ''}`} id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/" onClick={() => handleLinkClick('Home')}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/services" onClick={() => handleLinkClick('About')}>
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact" onClick={() => handleLinkClick('Contact')}>
                  Contact
                </Link>
              </li>
                 <li className="nav-item">
                <Link className="nav-link" to="/articles" onClick={() => handleLinkClick('Articles')}>
                  Articles
                </Link>
              </li>
              {authorLoggedIn && (
                <>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href={`/author/${currentAuthorUser.authorId}`}
                      onClick={() => handleLinkClick('Author')}
                    >
                      {currentAuthorUser.authorName}
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="#"
                      onClick={handleAuthorLogout} // Assuming handleAuthorLogout is your logout function
                      style={{ color: '#000 !important' }}
                    >
                      Author Logout
                    </a>
                  </li>
                </>
              )}
              {loggedIn && (
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href={`/profile/${currentUserID}`}
                    onClick={() => handleLinkClick('Profile')}
                  >
                    Profile
                  </a>
                </li>
              )}
            </ul>
            <form className="d-flex" role="search">
              <ul className="right-nav">
                {loggedIn ? (
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      onClick={handleLogout}
                      style={{ color: '#000 !important' }}
                    >
                      Logout
                    </a>
                  </li>
                ) : (
                  <>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        href={`/doctorlogin`}
                        onClick={() => handleLinkClick('Doctor Login')}
                      >
                        Sign In
                      </a>
                    </li>
                    <li>
                      <Link className="nav-link doc-login" to="/register" onClick={() => handleLinkClick('Registration')}>
                        Free Registration
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </form>
          </div>
        </div>
      </nav>
    </AppBar>
  );
};

export default Navbar;

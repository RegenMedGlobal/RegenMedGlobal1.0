import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import img3 from '../assets/logo.png';
import {
  AppBar,
  List
} from '@mui/material';
import { AuthContext } from '../AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

// A lot of the styling below is not used, is it still needed?
const bounceAnimation = keyframes`
  0%, 20%, 60%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  80% {
    transform: translateY(-10px);
  }
`;

const NavbarMenu = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
`;

const StyledList = styled(List)`
  &.drawerList {
    color: #000;
    display: flex;
    flex-direction: column; /* Stack items vertically */
  }
`;

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

const MenuIconWrapper = styled.span`
  display: inline-block;
  width: 24px;
  height: 2px;
  background-color: #fff;
  position: relative;
  transition: background-color 0.3s ease-in-out;
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: #fff;
    transition: transform 0.3s ease-in-out;
  }
  &::before {
    top: -6px;
  }
  &::after {
    top: 6px;
  }
  ${props =>
    props.open &&
    css`
      background-color: transparent;
      &::before {
        transform: rotate(45deg);
        top: 0;
      }
      &::after {
        transform: rotate(-45deg);
        top: 0;
      }
    `}
`;

const LogoImage = styled.img`
  height: 4rem;
  width: 10rem;
  margin-right: 1px;
  margin-left: 1rem;
  cursor: pointer;
  padding: 5px;
`;

const Navbar = () => {
  const { loggedIn, logout, currentUser , authorLoggedIn, currentAuthorUser, authorLogout} = useContext(AuthContext);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false); 

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

  // still needed?
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAuthorLogout= () => {
    authorLogout();
    navigate('/');
  }

  return (

   <AppBar position="fixed">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" onClick={() => handleLinkClick('Home')}>
            <img src={img3} alt="Regenerative Medicine Global Logo" />
          </Link>
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
             : <span className="navbar-toggler-icon"></span>
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

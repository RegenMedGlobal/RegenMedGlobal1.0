import React, { useContext, Fragment, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import img3 from '../assets/logo.png'
import {
  AppBar,
  List,
  ListItemText,
  useMediaQuery,
  Drawer,
  Hidden,
} from '@mui/material';
import { AuthContext } from '../AuthContext';
import Logo from '../assets/logo.png';

const DownArrow = styled.div`
  position: relative;
  display: inline-block;
  color: white;
  font-size: 18px;
  margin-left: 4px;
  &:before {
    content: '▼'; /* Add the down arrow character here */
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

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
   
  margin-right: 16px; /* Adjust the margin as needed */
`;

const DropdownContainer = styled.div`
  display: inline-block;
  position: relative;


  .dropdown-menu {
    display: ${props => (props.isArticlesOpen ? 'block' : 'none')};
    position: absolute;
    background-color: transparent;
    min-width: 160px; /* Adjust the minimum width as needed */
    z-index: 1;
    border: none; /* Remove the border */
  }
`;

const DropdownItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background:  var(--main-color);
  border: 1px solid #555; /* Add a border */
  border-radius: 4px; /* Add rounded corners */
  padding: 8px; /* Add some padding */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* Add a subtle box shadow */
  color: white; /* Text color */
`;

const DropdownItem = styled(Link)`
  text-decoration: none;

  color: white;
  padding: 8px 16px;
  display: block;

  width: 9rem;
  transition: 0.3s;

  &:hover {
    background-color: white;
  }
`;

const DropdownItemContainer = styled.div`
 margin-bottom: 2rem; /* Add margin between items */
`;


const NavbarLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-size: 18px;
  margin-left: 16px;
  
  &:hover {
    color: yellow;
    transform: scale(1.2);
  }
`;


const NavbarItem = styled(Link)`
  text-decoration: none;
  color: ${props => (props.sidebar ? "#000" : "#fff")};
  margin-left: 16px;
  display: inline-block;
  font-size: 18px;
  font-weight: normal;

  &:hover {
    color: yellow;
    transform: scale(1.2);
  }

  /* Conditional styling for the active page */
  ${props =>
    props.active &&
    css`
      color: yellow;
      font-size: 20px;
      font-weight: bold;
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
  const { loggedIn, logout, currentUser } = useContext(AuthContext);
  const isMobile = useMediaQuery('(max-width: 856px)');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false); 
    const [isArticlesOpen, setIsArticlesOpen] = useState(false);
  console.log('current user from navbar', currentUser);

  let currentUserID;
  if(Object.keys(currentUser).length !== 0) {
    try {
      const jsonUser = JSON.parse(currentUser);
      currentUserID = jsonUser.userId;
    } catch (error) {
      console.error('Error parsing or accessing user data:', error);
    }
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen); // Toggle the mobile menu state
  };


  const handleLinkClick = (text) => {
    // Close the mobile menu when a link is clicked
    setMobileOpen(false);
    setIsArticlesOpen(false)
    console.log(`Clicked on link: ${text}`);
  };


  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleArticlesDropdown = () => {
  setIsArticlesOpen(!isArticlesOpen); // Toggle the Articles dropdown state
};


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (

     <AppBar position="fixed">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" onClick={() => handleLinkClick('Home')}>
            <img src={img3} alt="Logo" />
          </Link>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
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
<DropdownContainer isArticlesOpen={isArticlesOpen}>
<Link className="nav-link" onClick={() => toggleArticlesDropdown()} style={{ marginBottom: '2px'}}>
  Articles<DownArrow />
</Link>

  <div className="dropdown-menu">
    <DropdownItemWrapper>
      <DropdownItemContainer>
        <DropdownItem
          to="/submitarticle"
          onClick={() => handleLinkClick('Submit Article')}
        >
          Submit Article
        </DropdownItem>
      </DropdownItemContainer>
      <DropdownItemContainer>
        <DropdownItem
          to="/articles"
          onClick={() => handleLinkClick('Read Articles')}
        >
          Read Articles
        </DropdownItem>
      </DropdownItemContainer>
    </DropdownItemWrapper>
  </div>
</DropdownContainer>


</li>
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
              {loggedIn ? (
                <a className="nav-link" onClick={handleLogout}>
                  Logout
                </a>
              ) : (
                <Link className="nav-link doc-login" to="/doctorlogin" onClick={() => handleLinkClick('Doctor Login')}>
                  Free Registration
                </Link>
              )}
            </form>
          </div>
        </div>
      </nav>
    </AppBar>
  );
};

export default Navbar;
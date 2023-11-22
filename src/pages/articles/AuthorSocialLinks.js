// AuthorSocialLinks.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

const AuthorSocialLinks = ({ socialLinks }) => {
  return (
    <div>
      {socialLinks.facebookLink && (
        <a href={socialLinks.facebookLink} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faFacebook} />
        </a>
      )}
      {socialLinks.twitterLink && (
        <a href={socialLinks.twitterLink} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
      )}
      {socialLinks.instagramLink && (
        <a href={socialLinks.instagramLink} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
      )}
      {socialLinks.youtubeLink && (
        <a href={socialLinks.youtubeLink} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faYoutube} />
        </a>
      )}
    </div>
  );
};

export default AuthorSocialLinks;

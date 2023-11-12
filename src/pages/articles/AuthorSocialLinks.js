// AuthorSocialLinks.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

const AuthorSocialLinks = ({ socialLinks }) => {
  return (
    <div>
      {socialLinks.facebookLink && (
        <a href={socialLinks.facebookLink}>
          <FontAwesomeIcon icon={faFacebook} />
        </a>
      )}
      {socialLinks.twitterLink && (
        <a href={socialLinks.twitterLink}>
          <FontAwesomeIcon icon={faTwitter} />
        </a>
      )}
      {socialLinks.instagramLink && (
        <a href={socialLinks.instagramLink}>
          <FontAwesomeIcon icon={faInstagram} />
        </a>
      )}
      {socialLinks.youtubeLink && (
        <a href={socialLinks.youtubeLink}>
          <FontAwesomeIcon icon={faYoutube} />
        </a>
      )}
    </div>
  );
};

export default AuthorSocialLinks;

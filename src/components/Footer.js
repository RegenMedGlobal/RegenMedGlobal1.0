import imgLogo from "../assets/logo.png"
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link } from "react-router-dom";

const Footer = () => {

  const currentYear = new Date().getFullYear();

  return (
    <div className="footer-custom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="center-footer">
              <div className="center-footer-1">
                <img src={imgLogo} className="logo-footer" alt="" />
              </div>
              <div className="center-footer-2">
                <ul>
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/services">About</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                  {/* <li><Link href="/home">FAQ</Link></li> */}
                </ul>
              </div>
              <div className="center-footer-3">
                <ul>
                  <li><a href="https://www.facebook.com/profile.php?id=100088034185909&mibextid=LQQJ4d" target="_blank"><FaFacebook size={24} /></a></li>
                  <li><a href="https://www.instagram.com/regenmedglobal/" target="_blank"><FaInstagram size={24} /></a></li>
                  <li><a href="https://www.youtube.com/@regenmedglobal?si=VthSGwqyHB_1Pv9z" target="_blank"><FaYoutube size={24} /></a></li>
                </ul>
              </div>
            </div>
            <div className="right-copy">
              <p>© Copyright {currentYear}, All Rights Reserved by Regenerative</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer;
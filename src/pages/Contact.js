import React from "react";
import ContactForm from "../components/ContactForm";
import imgPro4 from "../assets/pro-4.png";

const Contact = () => {
  return (
    <div className="contact-custom" style={{ marginTop: "3rem" }}>
      {/* Add a margin-top style here */}
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="service-top">
              <p className="service-2">Contact us</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="left-contact">
              <ContactForm />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="right-contact">
              <img src={imgPro4} className="pro-44" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

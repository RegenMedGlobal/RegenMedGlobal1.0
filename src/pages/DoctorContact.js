import React, { useState } from "react";
import axios from "axios";

const DoctorContact = ({ email }) => {
  const [emailData, setEmailData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  console.log('Email from doctor contact: ', email)

  const sendEmail = async () => {
    const postData = {
      From: "sender@example.com", // Replace with your verified sender email address
      To: "ben.havis1@gmail.com", // Replace with the recipient's email address
      Subject: "Contact Request",
      TextBody: `Name: ${emailData.firstName} ${emailData.lastName}\nEmail: ${emailData.email}\nPhone: ${emailData.phoneNumber}\nMessage: ${emailData.message}`,
    };

    try {
      await axios.post("https://api.postmarkapp.com/email", postData, {
        headers: {
          "Content-Type": "application/json",
          "X-Postmark-Server-Token": "a6972bc2-de00-45d3-acfa-2ea388ca77b2",
        },
      });
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email", error);
    }
  };

  return (
    <div className="get-in-touch">
      <div className="get-flex">
        <div className="row">
          <div className="col-lg-12">
            <p className="get-p">Get in touch</p>
          </div>
          <div className="col-lg-6">
            <div className="common-data">
              <label>First name</label>
              <input
                className="input-get"
                type="text"
                placeholder="First name"
                value={emailData.firstName}
                onChange={(e) =>
                  setEmailData({ ...emailData, firstName: e.target.value })
                }
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="common-data">
              <label>Last name</label>
              <input
                className="input-get"
                type="text"
                placeholder="Last name"
                value={emailData.lastName}
                onChange={(e) =>
                  setEmailData({ ...emailData, lastName: e.target.value })
                }
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="common-data">
              <label>Email</label>
              <input
                className="input-get"
                type="text"
                placeholder="Email"
                value={emailData.email}
                onChange={(e) =>
                  setEmailData({ ...emailData, email: e.target.value })
                }
              />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="common-data">
              <label>Phone Number</label>
              <input
                className="input-get"
                type="text"
                placeholder="Phone Number"
                value={emailData.phoneNumber}
                onChange={(e) =>
                  setEmailData({ ...emailData, phoneNumber: e.target.value })
                }
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="common-data">
              <label>Messages</label>
              <textarea
                className="area-text input-get"
                placeholder="Messages"
                value={emailData.message}
                onChange={(e) =>
                  setEmailData({ ...emailData, message: e.target.value })
                }
              />
            </div>
          </div>
          <div className="col-lg-12">
            <div className="common-data mr-0">
              <button className="Contact-bt" onClick={sendEmail}>
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorContact;

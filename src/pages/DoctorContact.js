import React, { useState } from "react";
import axios from "axios";
import { EDGE_URL } from "../config";

const DoctorContact = ({ email, profileId }) => {
  const [emailData, setEmailData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const [msg, setMsg] = useState(false)
  const [emsg, setEmsg] = useState(false)

  console.log('Email from doctor contact: ', email)

  const sendEmail = async () => {
    setMsg(false)
    setEmsg(false)
    
    if(emailData.firstName == "" || emailData.lastName == "" || emailData.email == "" || emailData.phoneNumber == "" || emailData.message == "") {
      setEmsg(true)
      return false
    }


    let emailinfo = {
      'first_name': emailData.firstName,
      'last_name': emailData.lastName,
      'email': emailData.email,
      'phone_no': emailData.phoneNumber,
      'message': emailData.message,
      'profileId': profileId
    }

    const response = await axios.post(EDGE_URL + "/regen-emailer", emailinfo);
        const responseData = response.data;
        console.log("Response ", responseData)
        if (responseData.success) {
          setMsg(true)
          setEmailData({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            message: "",
          })
          
        } else {
          console.log("ERROR")
          console.log(responseData.message)
        }



  };

  return (
    <div className="get-in-touch">
      <div className="get-flex">
        <div className="row">
          <div className="col-lg-12">
            <p className="get-p">Get in touch</p>
            {(emsg ? (<p className="text-bg-danger">Alert! Please fill all details.</p>) : <></>)}
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
              {(msg ? (<p className="text-bg-success">Thank you! Your message has been sent to the clinic/doctor.</p>) : <></>)}
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

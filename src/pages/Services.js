import React from 'react';
// TODO: Likely rename these icons for easier use in the future
import imgEli1 from "../assets/eli.png";
import imgEli2 from "../assets/eli-2.png";
import imgEli3 from "../assets/eli-3.png";

const Services = () => {
  return (
    <>
      <div className="our-services">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="service-top">
                <p className="service-2">What you can find here</p>
                <p className="service-3">Find a Regenerative Medicine Doctor that offers the types of treatments below:</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <div className="common-service">
                <img src={imgEli3} className="eli-img" alt="Stethoscope icon" />
                <p className="stem-p">Stem Cell Therapy</p>
                <p className="stem-p1">Stem cell therapy is a form of regenerative medicine designed to repair damaged cells within the body by reducing inflammation and modulating the immune system.</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="common-service">
                <img src={imgEli2} className="eli-img" alt="health sign icon" />
                <p className="stem-p">PRP / Platelet Rich Plasma</p>
                <p className="stem-p1">Platelet-rich plasma (PRP) therapy uses injections of a concentration of a patient’s own platelets to accelerate the healing of injured tendons, ligaments, muscles and joints.</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="common-service">
                <img src={imgEli1} className="eli-img" alt="physician icon" />
                <p className="stem-p">Prolotherapy</p>
                <p className="stem-p1">Prolotherapy is a non-surgical injection procedure used to relieve back pain by treating connective tissue injuries (ligaments and tendons) of the musculoskeletal system that have not healed by either rest or conservative therapy in order to relieve back pain.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;

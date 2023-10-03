

const DoctorContact = () => {
  return (
   <>
    <div className="get-in-touch">

          <div className="get-flex">
            <div className="row">
              <div className="col-lg-12">
                <p className="get-p">Get in touch</p>
              </div>
              <div className="col-lg-6">
                <div className="common-data">
                  <label>First name</label>
                  <input className="input-get" type="text" placeholder="First name" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="common-data">
                  <label>Last name</label>
                  <input className="input-get" type="text" placeholder="Last name" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="common-data">
                  <label>Email</label>
                  <input className="input-get" type="text" placeholder="Email" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="common-data">
                  <label>Phone Number</label>
                  <input className="input-get" type="text" placeholder="Phone Number" />
                </div>
              </div>
              <div className="col-lg-12">
                <div className="common-data">
                  <label>Messages</label>
                  <textarea className="area-text input-get" placeholder="Messages"></textarea>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="common-data mr-0">
                  <button className="Contact-bt">Contact</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
  )
}

export default DoctorContact
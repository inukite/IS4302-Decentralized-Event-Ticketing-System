import React from 'react';
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBBtn,
} from 'mdb-react-ui-kit';

const Footer = () => {
  return (
    <MDBFooter
      bgColor="black"
      color="white"
      className="text-center text-lg-start text-muted fixed-bottom"
    >
      <MDBContainer className="p-4">
        <div>
          <section className="justify-content-center justify-content-lg-between p-4 border-bottom">
            <div className="me-5 text-white" style={{ marginBottom: 10 }}>
              <span>Get connected with us on social networks:</span>
            </div>
            <MDBBtn
              outline
              color="light"
              floating
              className="m-1"
              href="#!"
              role="button"
            >
              <MDBIcon fab icon="facebook-f" />
            </MDBBtn>

            <MDBBtn
              outline
              color="light"
              floating
              className="m-1"
              href="#!"
              role="button"
            >
              <MDBIcon fab icon="twitter" />
            </MDBBtn>

            <MDBBtn
              outline
              color="light"
              floating
              className="m-1"
              href="#!"
              role="button"
            >
              <MDBIcon fab icon="google" />
            </MDBBtn>

            <MDBBtn
              outline
              color="light"
              floating
              className="m-1"
              href="#!"
              role="button"
            >
              <MDBIcon fab icon="instagram" />
            </MDBBtn>

            <MDBBtn
              outline
              color="light"
              floating
              className="m-1"
              href="#!"
              role="button"
            >
              <MDBIcon fab icon="linkedin-in" />
            </MDBBtn>

            <MDBBtn
              outline
              color="light"
              floating
              className="m-1"
              href="#!"
              role="button"
            >
              <MDBIcon fab icon="github" />
            </MDBBtn>
          </section>
        </div>
      </MDBContainer>
      <section className="">
        <MDBContainer className="text-center text-md-start mt-5 text-white">
          <MDBRow className="mt-3">
            <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
              <h6 className="fw-bold mb-4 text-white">
                <img
                  alt=""
                  src={require('./OBJECTS.png')}
                  width="25"
                  height="25"
                  className="d-inline-block align-top"
                />
                {' DET Tickets'}
              </h6>
              <p className="text-white">
                Etheruem blockchain ticketing marketplace for fans around the
                world. Rest assured that the tickets you purchase here are
                genuine.
              </p>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Explore</h6>
              <p>
                <a href="/" className="text-white">
                  Home
                </a>
              </p>
              <p>
                <a href="upcomingconcerts" className="text-white">
                  Upcoming Concerts
                </a>
              </p>
              <p>
                <a href="marketplace" className="text-white">
                  Marketplace
                </a>
              </p>
              <p>
                <a href="mytickets" className="text-white">
                  My Tickets
                </a>
              </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Links</h6>
              <p>
                <a href="/" className="text-white">
                  Blog
                </a>
              </p>
              <p>
                <a href="/" className="text-white">
                  Contact
                </a>
              </p>
              <p>
                <a href="/" className="text-white">
                  FAQs
                </a>
              </p>
              <p>
                <a href="/" className="text-white">
                  About Us
                </a>
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </MDBFooter>
  );
};

export default Footer;

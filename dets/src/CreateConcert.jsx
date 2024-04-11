import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import './CreateConcert.css';

const CreateConcert = () => {
  const [formData, setFormData] = useState({
    company: '',
    artistName: '',
    concertName: '',
    concertVenue: '',
    startDate: '',
    endDate: '',
    priceOption: '',
    startingPrice: '',
    additionalInfo: '',
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAlert(true); // Show the alert when the form is submitted
    setTimeout(() => setShowAlert(false), 2000); // Hide the alert after 3 seconds

    console.log('Form Data:', formData); // Here you can do what you want with the form data

    // Clear form data
    setFormData({
      company: '',
      artistName: '',
      concertName: '',
      concertVenue: '',
      startDate: '',
      endDate: '',
      priceOption: '',
      startingPrice: '',
      additionalInfo: '',
    });
  };

  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // You may want to handle multiple files differently
  };

  return (
    <>
      <div style={{ padding: 30 }}>
        <Container
          fluid
          className="d-flex justify-content-center align-items-center h-100 w-50"
        >
          {showAlert && (
            <div className="overlay-alert">
              <Alert
                variant="success"
                onClose={() => setShowAlert(false)}
                dismissible
              >
                Request has been submitted successfully!
              </Alert>
            </div>
          )}
          <div className="border rounded p-4 shadow-sm container">
            <Form className="d-flex flex-column" onSubmit={handleSubmit}>
              <h2 className="mb-4 font-weight-bold">Organize A Concert</h2>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Company</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="XYZ Company"
                  value={formData.company}
                  onChange={handleChange}
                  name="company"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Artist Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Blackpink"
                  value={formData.artistName}
                  onChange={handleChange}
                  name="artistName"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Concert Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Blackpink Born Pink Concert"
                  value={formData.concertName}
                  onChange={handleChange}
                  name="concertName"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Concert Venue</Form.Label>
                <br />
                <select
                  value={formData.concertVenue}
                  onChange={handleChange}
                  name="concertVenue"
                >
                  <option value="">Select an option</option>
                  <option value={1}>National Stadium</option>
                  <option value={1}>Singapore Indoor Stadium</option>
                  <option value={1}>Star Vista</option>
                  <option value={1}>Esplanade</option>
                </select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Concert Start Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter Start Date"
                  value={formData.startDate}
                  onChange={handleChange}
                  name="startDate"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Concert End Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter End Date"
                  value={formData.endDate}
                  onChange={handleChange}
                  name="endDate"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Price Options</Form.Label>
                <br />
                <select
                  value={formData.priceOption}
                  onChange={handleChange}
                  name="priceOption"
                >
                  <option value={1}>Standard</option>
                  <option value={1}>Standard - 10%</option>
                  <option value={1}>Standard - 20%</option>
                  <option value={1}>Standard + 10%</option>
                  <option value={1}>Standard + 20%</option>
                </select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Starting Price</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.startingPrice}
                  onChange={handleChange}
                  name="startingPrice"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Additional Information</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Special Arrangements Needed (if any)"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  name="additionalInfo"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Upload Cover Page</Form.Label>
                <div>
                  <input
                    type="file"
                    accept="application/pdf, image/*"
                    multiple
                    // value={formData.coverPage}
                    onChange={handleFileChange}
                    // name="coverPage"
                  />
                  <br />
                </div>
              </Form.Group>
              <br />
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </div>
        </Container>
      </div>
    </>
  );
};

export default CreateConcert;

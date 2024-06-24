import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RegisterPage = (props) => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    surname: '',
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState(''); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await props.handleRegister(user);
      navigate('/login'); 
    } catch (error) {
      console.error('Failed to register user', error);
      setErrorMessage(error.message);  
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center vh-100 p-0 m-0 position-relative">
      <Row className="w-100 d-flex flex-column justify-content-center align-items-center">
        <Col xs={6} className='containerStyle px-5 py-5 animate__animated animate__pulse'>
          {errorMessage && (
            <Alert variant="danger" onClose={() => setErrorMessage('')}  className='animate__animated animate__headShake' dismissible>
              {errorMessage}
            </Alert>
          )}
          <h1 className="logInName">Register</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label className="logInName">Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={user.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formSurname">
              <Form.Label className="logInName mt-2">Surname</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter surname"
                name="surname"
                value={user.surname}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label className="logInName mt-2">Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label className="logInName mt-2">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={user.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Row className="mt-3">
              <Col>
                <Button variant="success" onClick={() => navigate('../..')}>Home</Button>
                <Button variant="secondary" onClick={() => navigate('/login')} className='ms-2'>Back</Button>
              </Col>
              <Col className="text-end">
                <Button variant="primary" type="submit">Enter</Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;





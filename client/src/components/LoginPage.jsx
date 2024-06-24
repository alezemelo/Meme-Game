import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LoginPage = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };
    props.login(credentials); // Call the login function passed as prop
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center vh-100 p-0 m-0 position-relative">
      <Row className="w-100 d-flex flex-column justify-content-center align-items-center">
      
        <Col xs={6} className='containerStyle px-5 py-5 animate__animated animate__pulse'>
        {props.message && (
            <Alert className='mb-2 animate__animated animate__headShake' variant={props.message.type} onClose={() => props.setMessage(null)} dismissible>
              {props.message.msg}
            </Alert>
          )}
          <h1 className="logInName">Login</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email">
              <Form.Label className="logInName">Email address</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter email" 
                value={username} 
                onChange={ev => setUsername(ev.target.value)} 
                required
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label className="logInName mt-2">Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={ev => setPassword(ev.target.value)} 
                required 
              />
            </Form.Group>
            <Row className="mt-3">
              <Col>
                <Button variant="success" onClick={() => navigate('../')}>Back</Button>
              </Col>
              <Col className="text-end">
                <Button variant="primary" type="submit">Enter</Button>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col xs={6}>
          <Row >
            <Button variant="danger" onClick={() => navigate('../register')} className="btn-register mt-5 btn-lg w-100">Register</Button>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;




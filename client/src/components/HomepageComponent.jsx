// HomepageComponent.jsx
import PropTypes from 'prop-types';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HomepageComponent = (props) => {
  const logoImageUrl = '/images/logo.png';
  const navigate = useNavigate();

  return (
    <Container fluid className="d-flex align-items-center justify-content-center vh-100 p-0 m-0 position-relative">
      <Row className="w-100 m-0 d-flex flex-column justify-content-center align-items-center">
        <Col xs={8} md={6} className="text-center animate__animated animate__backInDown" style={{ maxWidth: '50%' }}>
          <Image src={logoImageUrl} alt="Logo" className="img-fluid mb-2" />
        </Col>
        <Col xs={8} md={6} className="text-center">
          {props.loggedIn 
            ? (<Button variant="danger" onClick={props.handleLogout} className="btn-logout btn-lg w-100"> LogOut </Button> )
            : (<Button variant="primary" onClick={() => navigate('login')} className="btn-login btn-lg w-100">Login</Button>) 
          } 
        </Col>
        <Col xs={8} md={6} className="text-center mt-2">
          {props.loggedIn 
            ? (<Button variant="success" onClick={() => navigate('play')} className="btn-quick-play btn-play btn-lg w-100"> Play </Button> )
            : (<Button variant="success" onClick={() => navigate('play')} className="btn-quick-play btn-lg w-100"> Quick Play </Button>) 
          }        
        </Col>
      </Row>
    </Container>
  );
};

HomepageComponent.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default HomepageComponent;













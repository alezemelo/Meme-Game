import React, {useContext} from 'react';
import { Navbar, Container, Nav} from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { GameContext } from './GameContext';

const NavHeaderHomepage = (props) => {
  const location = useLocation();
  const logoImageUrl = '/images/logo.png?url';
  

  const { 
    gameData,  
    resetTimeLeft, 
    clearGameData, 
    setSelectedCaption, 
    } = useContext(GameContext);
  const game = [...gameData.correctCaptions, ...gameData.wrongCaptions];


  const handleGameStop =() =>{
    clearGameData();
    resetTimeLeft();
    setSelectedCaption({});
    if(location.pathname==='/gameEnd' || gameData.round===3){
      props.createGameHistory(gameData.score,game);
    }
  };

  const renderLogo = () => {

    if (location.pathname === '/') {
      return (
        <>
        </>
      );
    } else {
      return (
            <Navbar.Brand className='animate__animated animate__bounceIn'>
              <img src={logoImageUrl} width="100" height="50" alt="Logo"/>
            </Navbar.Brand>
      );
    }
  };

  return (
    <Navbar className="custom-navbar sticky-top">
      <Container fluid>
        {renderLogo()}
        <Nav className="ms-auto">
          {props.loggedIn ? ( 
            <Nav.Link as={Link} to="/user" className="link-light text-decoration-none" onClick={handleGameStop}>
              <h1 className="user-icon"><i className="bi bi-person-circle"></i></h1>
            </Nav.Link>
          ) : (
            <span className="link-light text-decoration-none">
              <h1 className="user-icon"><i className="bi bi-person-circle"></i></h1>
            </span>
            
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavHeaderHomepage;


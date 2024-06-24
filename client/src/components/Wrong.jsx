import React from 'react';
import { Row,Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { GameContext } from './GameContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';


const Wrong = (props) => {

  const { gameData, 
          updateRound, 
          resetTimeLeft, 
          changeSubmitted, 
          clearGameData, 
          setSelectedCaption} = useContext(GameContext);
  const game = [...gameData.correctCaptions, ...gameData.wrongCaptions];

  const navigate = useNavigate();

  const handleNextRound = () => {
    updateRound();
    changeSubmitted(); // Reset the isSubmitted state in GamePage
    resetTimeLeft();
    setSelectedCaption({});
    navigate('/play');
  };

  const handleHome =() =>{
    if(gameData.round===3 && props.loggedIn)
      props.createGameHistory(gameData.score, game);
    clearGameData();
    resetTimeLeft();
    setSelectedCaption({})
    navigate('/');
  };

    return (
      <>
        <Row className="containerStyle mx-1 my-5 d-flex align-items-center justify-content-center flex-grow-1 animate__animated animate__headShake">
          <Col md={12} className="mb-0 d-flex flex-column align-items-center justify-content-center">
              <h1 className='text-wrong w-100 text-center'>Wrong choice</h1>
              <h2 className='text-white w-100 text-center'>End of round : {gameData.round}</h2>
          </Col>
          <Col className="d-flex justify-content-between w-100 mx-2 mb-3 px-2 ">
              <Link to="/" className="w-50 me-1">
              <Button variant="success" className="w-100" onClick={handleHome}>Home</Button>
              </Link>
              {props.loggedIn ? 
                (
                  <>               
                    {gameData.round < 3 ? 
                      (<Button variant="primary" className="w-50 ms-1" onClick={handleNextRound}>Next Round</Button>) 
                      : (<Button variant="primary" className="w-50 ms-1" onClick={() => navigate('/gameEnd')}>End Game</Button>)}
                  </>
                ) : (
                  <Button variant="primary" className="w-50 ms-1" onClick={() => navigate('/gameEnd')}>End Game</Button>
                )
              }
          </Col>
        </Row >
      </>
    );
};

export default Wrong;
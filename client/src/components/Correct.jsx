import { Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { GameContext } from './GameContext';
import { useContext } from 'react';

const Correct = (props) => {
  const navigate = useNavigate();
  const { gameData, 
          updateRound, 
          changeSubmitted,
          resetTimeLeft, 
          clearGameData, 
          setSelectedCaption} = useContext(GameContext);
  const game = [...gameData.correctCaptions, ...gameData.wrongCaptions];


  const handleNextRound = () => {
    updateRound();
    changeSubmitted(); 
    resetTimeLeft();
    setSelectedCaption({})
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
      <Row className="containerStyle mx-1 my-5 d-flex align-items-center justify-content-center flex-grow-1 animate__animated animate__bounceIn">
        <Col md={12} className="mb-0 d-flex flex-column align-items-center justify-content-center">
          <h1 className='text-correct w-100 text-center'>Correct choice</h1>
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
      </Row>
    </>
  );
};

Correct.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  createGameHistory: PropTypes.func.isRequired,
};

export default Correct;

import { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Table, Button, Image, Form } from 'react-bootstrap';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { GameContext } from './GameContext';

const GamePage = (props) => {
  const { 
    recordCorrectCaption, 
    clearGameData, 
    recordWrongCaption, 
    gameData, 
    recordScore, 
    fetchNewRoundData, 
    changeSubmitted, 
    handleTimeLeft, 
    resetTimeLeft, 
    selectedCaption, 
    setSelectedCaption
  } = useContext(GameContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (gameData.timeLeft > 0) {
      const timerId = setTimeout(() => handleTimeLeft(gameData.timeLeft - 1), 1000);
      return () => clearTimeout(timerId); // clear timeout if the component unmounts or timeLeft changes
    } else {
      if (!gameData.isSubmitted) {
        changeSubmitted();
        recordWrongCaption(gameData.memes[gameData.round - 1], selectedCaption.text, gameData.round, gameData.score);
        navigate('/play/timeExpires'); 
      }
    }
  }, [
    gameData.timeLeft,
    gameData.isSubmitted,
    gameData.memes,
    gameData.round,
    gameData.score,
    selectedCaption.text,
    navigate,
    handleTimeLeft,
    changeSubmitted,
    recordWrongCaption,
  ]);

  const handleRowClick = (index) => {
    if (gameData.captions[gameData.round - 1]) {
      setSelectedCaption(gameData.captions[gameData.round - 1][index]);
    }
  };

  const handleCaptionChange = (e) => {
    setSelectedCaption({
      ...selectedCaption,
      text: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isCorrect = isCorrectCaption();
    if (isCorrect) {
      recordCorrectCaption(gameData.memes[gameData.round - 1], selectedCaption.text, gameData.round, gameData.score);
      recordScore();
      navigate('/play/correct');
    } else {
      recordWrongCaption(gameData.memes[gameData.round - 1], selectedCaption.text, gameData.round, gameData.score);
      navigate('/play/wrong');
    }
    changeSubmitted(); 
  };

  const isCorrectCaption = () => {
    if (selectedCaption.text.trim().length > 0) {
      return selectedCaption.meme_id === gameData.meme_ids[gameData.round - 1];
    }
    console.error('Failed to fetch meme_id from caption_id');
    return false;
  };

  const handleNextRound = () => {
    changeSubmitted();
    resetTimeLeft();
    setSelectedCaption({});
    fetchNewRoundData();
  };

  const handleHome = () => {
    clearGameData();
    resetTimeLeft();
    setSelectedCaption({});
    navigate('/');
  };

  return (
    <Container fluid className="px-3 py-0 vh-100">
      <Row className="h-90">
        <Col md={7} style={{ backgroundColor: 'transparent' }} className='d-flex align-items-center justify-content-center px-0'>
          <Col md={10} className="px-4 py-4 containerStyle h-70 me-0 d-flex flex-column align-items-center justify-content-center">
            <Row className='w-100 d-flex flex-grow-2 align-items-center justify-content-center'>
              <h2 className='text-white w-100 text-center'>Select the right caption for this Meme!</h2>
            </Row>
            <Row className='w-100 d-flex flex-grow-2 align-items-center justify-content-center'>
              <Col xs={10} md={8} className="align-items-center animate__animated animate__backInDown">
                {gameData.memes[gameData.round - 1] ? (
                  <Image src={gameData.memes[gameData.round - 1]} alt="Meme" className="img-fluid mb-2" />
                ) : (
                  <div className="text-white">Loading meme...</div>
                )}
              </Col>
            </Row>
            <Row className='w-100 d-flex flex-grow-2 align-items-center justify-content-center'>
              <Form onSubmit={handleSubmit} className='w-100'>
                <Form.Group className="mb-3" controlId="formCaption">
                  <Form.Control
                    type="text"
                    placeholder="Select your caption"
                    value={selectedCaption.text || ''}
                    readOnly
                    onChange={handleCaptionChange}
                    className='mb-2 text-center input-caption'
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className='w-100' disabled={gameData.isSubmitted || !selectedCaption.text}>
                  Submit
                </Button>
              </Form>
            </Row>
          </Col>
        </Col>

        <Col className="w-50 pt-5 pe-5 d-flex flex-column">
          <Row className="d-flex align-items-center justify-content-center flex-grow-1">
            <Col className='px-0 py-4 containerStyle'>
              {location.pathname === '/play/timeExpires' || location.pathname === '/play/wrong' ? (
                <>
                  <h2 className='text-white w-100 text-center'>Correct captions</h2>
                  <Table striped bordered hover variant="dark" className='custom-table'>
                    <tbody>
                      {gameData.bestMatches && gameData.bestMatches[gameData.round - 1] ? (
                        gameData.bestMatches[gameData.round - 1].map((caption, index) => (
                          <tr key={index}>
                            <td>{caption.text}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td>Loading correct captions...</td>
                        </tr>
                      )}
                     <tr>
                        <td className='text-center'> - </td>
                     </tr>
                     <tr>
                        <td className='text-center'> - </td>
                     </tr>
                     <tr>
                        <td className='text-center'> - </td>
                     </tr>
                     <tr>
                        <td className='text-center'> - </td>
                     </tr>
                     <tr>
                        <td className='text-center'> - </td>
                     </tr>

                    </tbody>
                  </Table>
                </>
              ) : (
                <>
                  <h2 className='text-white w-100 text-center'>Captions</h2>
                  <Table striped bordered hover variant="dark" className='custom-table'>
                    <tbody>
                      {gameData.captions[gameData.round - 1] ? (
                        gameData.captions[gameData.round - 1].map((caption, index) => (
                          <tr key={index} onClick={() => handleRowClick(index)}>
                            <td>{caption.text}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td>Loading captions...</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </>
              )}
            </Col>
          </Row>

          {gameData.timeLeft <= 0 || gameData.isSubmitted ? (
            <Outlet />
          ) : (
            <>
              <Row className="containerStyle mx-1 my-5 d-flex align-items-center justify-content-center flex-grow-1">
              {props.loggedIn ? 
                (
                  <Col md={12} className="mb-0 d-flex flex-column align-items-center justify-content-center">
                    <h1 className='text-white w-100 text-center'>Total score: {gameData.score}</h1>
                    <h2 className='text-white w-100 text-center'>{`Time left: ${gameData.timeLeft}s`}</h2>
                  </Col>
                ) 
                :(
                  <Col md={12} className="my-3 d-flex flex-column align-items-center justify-content-center">
                    <h1 className='text-white w-100 text-center'>{`Time left: ${gameData.timeLeft}s`}</h1>
                  </Col>
                )
              }
                <Col className="d-flex justify-content-between w-100 mx-2 mb-3 px-2">
                  <Col className="w-50 me-1">
                    <Button variant="success" className="w-100" onClick={handleHome}>Home</Button>
                  </Col>
                  <Button variant="primary" className="w-50 ms-1" disabled={gameData.timeLeft > 0} onClick={handleNextRound}>
                    Next Round
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

GamePage.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};

export default GamePage;

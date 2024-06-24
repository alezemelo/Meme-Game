import React, { useContext } from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { GameContext } from './GameContext';

const renderItem = (items) => {
    const numRows = items.length;

    return items.map((item, index) => (
        <Row key={index} className="d-flex" style={{ height: `calc(70vh / ${numRows})` }}>
            <Col xs={7} className="d-flex justify-content-center align-items-center p-0">
                <Col md={4} xs={6} className="d-flex justify-content-center align-items-center">
                    <Image src={item.meme} className="w-100 animate__animated animate__zoomIn" />
                </Col>
            </Col>
            <Col xs={5} className="d-flex justify-content-start align-items-center">
                <h3 className='text-white w-100 text-center'>{item.caption}</h3>
            </Col>
        </Row>
    ));
};

const GameEnd = (props) => {
    const gameEndImg='/images/meme23.jpg?url'
    const { gameData, clearGameData, setSelectedCaption } = useContext(GameContext);
    const navigate = useNavigate();
    
    const game = [...gameData.correctCaptions, ...gameData.wrongCaptions];

    const handleRetry = () => {
        if (props.loggedIn) props.createGameHistory(gameData.score, game);
        setSelectedCaption({});
        clearGameData();
        navigate('/play');
    };

    const handleHome = () => {
        if (props.loggedIn) props.createGameHistory(gameData.score, game);
        setSelectedCaption({});
        clearGameData();
        navigate('/');
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center">
            <Col xs={8} className="d-flex flex-column mt-4" style={{ backgroundColor: 'transparent' }}>
                <Row className='containerStyle pt-3 mt-5'>
                <h1 className='text-white w-100 text-center'>Total Score: {gameData.score}</h1>
                {gameData.correctCaptions.length === 0 ? (
                    <>
                    <h4 className='text-white w-100 text-center'>Try again, you will be luckier</h4>
                    <Row className="d-flex justify-content-center align-items-center h-100">
                        <Col xs={4} className="d-flex justify-content-center align-items-center p-0 m-5">
                        <Image src={gameEndImg} className="w-100 animate__animated animate__zoomIn" />
                        </Col>
                    </Row>
                    </>
                ) : (
                    renderItem([...gameData.correctCaptions])
                )}
                <Col className="d-flex justify-content-between w-100 mx-3 mb-4 px-2">
                    <Button variant="success" className="w-50" onClick={handleHome}>Home</Button>
                    <Button variant="primary" className="w-50 ms-1" onClick={handleRetry}>Try Again</Button>
                </Col>
                </Row>
            </Col>
        </Container>

    );
};

export default GameEnd;



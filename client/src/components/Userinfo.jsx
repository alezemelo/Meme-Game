import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button, Alert, Nav, Image } from 'react-bootstrap';
import API from '../API.mjs';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const UserProfile = (props) => {
  const userImageUrl = '/images/userNoLogged.jpg?url';
  const navigate = useNavigate();

  const [user, setUser] = useState({
    user_id: props.user.user_id,
    name: props.user.name,
    surname: props.user.surname,
    email: props.user.email,
  });
  const [gameHistory, setGameHistory] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null); 
  const [sortDateOrder, setSortDateOrder] = useState('none');
  const [sortScoreOrder, setSortScoreOrder] = useState('none');
  const [selectedGames, setSelectedGames] = useState([]);
  const [detailButton, setDetailButton] = useState(false);
  const [totalScore, setTotalScore] = useState(null);


  useEffect(() => {
    const getGamesHistory = async () => {
      try {
        const history = await API.getGamesHistory();
        setGameHistory(history);

        let vectScore = 0; 
        history.forEach((game) => {
          vectScore += game.score;
        });
        setTotalScore(vectScore);
      } catch (error) {
        console.error('Failed to fetch game history', error);
      }
    };
    getGamesHistory();
  }, []);


 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await props.handleUpdate(user);
      setStatusMessage({ type: 'success', text: 'User information saved successfully!' });
    } catch (error) {
      setStatusMessage({ type: 'danger', text: 'Failed to save user information.' });
    }
  };

  const sortByDate = () => {
    setSortDateOrder((oldOrder) => oldOrder === 'asc' ? 'desc' : 'asc');
    setSortScoreOrder('none'); 
  };

  const sortByScore = () => {
    setSortScoreOrder((oldOrder) => oldOrder === 'asc' ? 'desc' : 'asc');
    setSortDateOrder('none'); 
  };

  const handleGameRowClick = async (gh_id) => {
    try {
      const game = await API.getGamesByGhId(gh_id);
      setSelectedGames(game);
      setDetailButton(true);
    } catch (error) {
      console.error('Failed to fetch game history', error);
    }
    
  };

  const sortedGameHistory = [...gameHistory];

  if (sortDateOrder === 'asc') {
    sortedGameHistory.sort((a, b) => dayjs(a.game_date) - dayjs(b.game_date));
  } else if (sortDateOrder === 'desc') {
    sortedGameHistory.sort((a, b) => dayjs(b.game_date) - dayjs(a.game_date));
  } else if (sortScoreOrder === 'asc') {
    sortedGameHistory.sort((a, b) => a.score - b.score);
  } else if (sortScoreOrder === 'desc') {
    sortedGameHistory.sort((a, b) => b.score - a.score);
  }

  return (
    <Container fluid className="p-0 d-flex justify-content-center align-items-center">
      <Col xs={8} className="d-flex flex-column mt-5" style={{ backgroundColor: 'transparent' }}>
        {statusMessage && (
          <Alert variant={statusMessage.type} onClose={() => setStatusMessage(null)} dismissible>
            {statusMessage.text}
          </Alert>
        )}
        <Row className="mb-4 justify-content-center align-items-center">
          <Col md={3} xs={6} className="d-flex justify-content-center align-items-center">
            <img src={userImageUrl} alt="User" className="user-image-and-form img-fluid rounded-circle wh-100 d-md-block d-none" />
          </Col>
          <Col md={9}>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label className="text-white">Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className='user-image-and-form'
                  required
                />
              </Form.Group>
              <Form.Group controlId="formSurname" className="mt-3">
                <Form.Label className="text-white">Surname</Form.Label>
                <Form.Control
                  type="text"
                  name="surname"
                  value={user.surname}
                  onChange={handleChange}
                  className='user-image-and-form'
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEmail" className="mt-3">
                <Form.Label className="text-white">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className='user-image-and-form'
                  required
                />
              </Form.Group>
              <Col className='text-end'>
                <Button variant="success" onClick={() => navigate('../')} className="mt-3 me-2"> Home </Button>
                <Button variant="primary" type="submit" className="mt-3"> Save </Button>
              </Col>
            </Form>
          </Col>
        </Row>

        <Row className="d-flex align-items-center justify-content-center flex-grow-1">
          {!detailButton ? 
          (
          <>
          <Col  className='px-0 py-4 containerStyle me-4' style={{ maxHeight: '40vh', overflowY: 'auto' }}>
            <Container className="d-flex justify-content-between align-items-center mb-3">
                <h2 className='text-white ms-2 mb-0'>Games history</h2>  
                <h2 className="text-white mb-0 me-3">Total Score: {totalScore}</h2>
            </Container>
            <Table striped bordered hover variant="dark" >
              <thead>
                <tr>
                  <td>
                    <Nav.Link className="link-light text-decoration-none d-flex justify-content-between align-items-center" onClick={sortByDate}>
                      <span>Date</span>
                      {sortDateOrder === 'none' ? 
                        (<i className="bi bi-filter"></i>)
                        : (
                          <>
                            {sortDateOrder === 'desc' ? (<i className="bi bi-sort-down"></i>)
                              : (<i className="bi bi-sort-up"></i>)}
                          </>
                        )
                      }
                    </Nav.Link>
                  </td>
                  <td className='text-center'>Time</td>
                  <td>
                    <Nav.Link className="link-light text-decoration-none d-flex justify-content-between align-items-center" onClick={sortByScore}>
                      <span>Points</span>
                      {sortScoreOrder === 'none' ? 
                        (<i className="bi bi-filter"></i>)
                        : (
                          <>
                            {sortScoreOrder === 'desc' ? (<i className="bi bi-sort-down"></i>)
                              : (<i className="bi bi-sort-up"></i>)}
                          </>
                        )
                      }
                    </Nav.Link>
                  </td>
                  <td className='text-center' >Game Info</td>
                </tr>
              </thead>
              <tbody>
                {sortedGameHistory.map((game, index) => (
                  <tr key={index}>
                    <td>{dayjs(game.game_date).format('YYYY-MM-DD')}</td>
                    <td className='text-center'>{dayjs(game.game_date).format('HH:mm')}</td>
                    <td>{game.score}</td>
                    <td className='text-center'>
                      <Button variant="primary" onClick={() => handleGameRowClick(game.gh_id)}>Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          </>
          ) 
          :(
            <>
          <Col xs={7} className='px-0 py-4 containerStyle me-4' style={{ maxHeight: '40vh', overflowY: 'auto' }}>
            <Container className="d-flex justify-content-between align-items-center mb-3">
              <h2 className='text-white ms-2 mb-0'>Games history</h2>  
              <h2 className="text-white mb-0 me-3">Total Score: {totalScore}</h2>
            </Container>
            <Table striped bordered hover variant="dark" >
              <thead>
                <tr>
                  <td>
                    <Nav.Link className="link-light text-decoration-none d-flex justify-content-between align-items-center" onClick={sortByDate}>
                      <span>Date</span>
                      {sortDateOrder === 'none' ? 
                        (<i className="bi bi-filter"></i>)
                        : (
                          <>
                            {sortDateOrder === 'desc' ? (<i className="bi bi-sort-down"></i>)
                              : (<i className="bi bi-sort-up"></i>)}
                          </>
                        )
                      }
                    </Nav.Link>
                  </td>
                  <td className='text-center'>Time</td>
                  <td>
                    <Nav.Link className="link-light text-decoration-none d-flex justify-content-between align-items-center" onClick={sortByScore}>
                      <span>Points</span>
                      {sortScoreOrder === 'none' ? 
                        (<i className="bi bi-filter"></i>)
                        : (
                          <>
                            {sortScoreOrder === 'desc' ? (<i className="bi bi-sort-down"></i>)
                              : (<i className="bi bi-sort-up"></i>)}
                          </>
                        )
                      }
                    </Nav.Link>
                  </td>
                  <td className='text-center'>Game Info</td>
                </tr>
              </thead>
              <tbody>
                {sortedGameHistory.map((game, index) => (
                  <tr key={index}>
                    <td>{dayjs(game.game_date).format('YYYY-MM-DD')}</td>
                    <td className='text-center'>{dayjs(game.game_date).format('HH:mm')}</td>
                    <td>{game.score}</td>
                    <td className='text-center'>
                      <Button variant="primary" onClick={() => handleGameRowClick(game.gh_id)}>Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          <Col xs={4} className="px-0  py-4 containerStyle" style={{ maxHeight: '40vh', overflowY: 'auto' }}>
          <Container className="d-flex justify-content-between align-items-center mb-3">
                <h2 className='text-white ms-2 mb-0'>Games Details</h2>  
                <Nav.Link className="link-light text-decoration-none" onClick={() => setDetailButton(false)}>
                  <i className="bi bi-x-circle-fill"></i>
                </Nav.Link>
            </Container>
                <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <td className='text-center'>Round</td>
                    <td className='text-center'>Meme</td>
                    <td className='text-center'>Points</td>
                  </tr>
                </thead>
                <tbody>
                {selectedGames.map((game, index) => (
                  <tr key={index}>
                    <td className='text-center'>{game.round}</td>
                    <td>     
                      <Image src={game.meme_url} className="w-100 animate__animated animate__zoomIn" fluid />
                    </td>
                    <td className='text-center'>{game.score}</td>
                  </tr>
                ))}
              </tbody>

                </Table>
          </Col>
          </>
          )}     
        </Row>
      </Col>
    </Container>
  );
};

export default UserProfile;








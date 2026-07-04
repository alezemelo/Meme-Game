import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'animate.css/animate.min.css';
import { useEffect, useState } from 'react';
import './App.css';
import NavHeaderHomepage from "./components/NavHeaderHomepage";
import HomepageComponent from "./components/HomepageComponent";
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import GamePage from './components/GamePage';
import RegisterPage from './components/RegisterPage';
import Correct from './components/Correct';
import TimeExpires from './components/TimeExpires';
import Wrong from './components/Wrong';
import GameEnd from './components/GameEnd';
import UserProfile from './components/Userinfo';
import { GameProvider } from './components/GameContext'; 
import API from './API.mjs';


function App() {
  const [loggedIn, setLoggedIn] = useState(false); 
  const [message, setMessage] = useState(null); 
  const [user, setUser] = useState(null); 
  const videoUrl = '/videos/background.mp4';


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo(); 
        setLoggedIn(true);
        setUser(user);
      } catch {
        setLoggedIn(false);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  // NEW
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUser(user);
    }catch(err) {
      setMessage({ msg: 'Invalid credentials. Please try again.', type: 'danger' });
      
    }
  };

  const handleUpdate = async (user) => {
    try {
      const userUp= await API.updateUserInfo(user); 
      setUser({ user_id: userUp.user_id, name: userUp.name, surname: userUp.surname, email: userUp.email }); 
    } catch (error) {
      console.error('Failed to update user information', error);
    }
  };

  const handleRegister = async (user) => {
    try {
      await API.register(user); 
    } catch (error) {
      console.error('Failed to register user', error);
      throw error; 
    }
  };
  

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setMessage(null);
  };

  const createGameHistory = async (score,game) => {
    try {
        await API.createGameHistory(score, game);
    } catch (error) {
        console.error('Failed to fetch game history', error);
    }
};

 

  return (
      <GameProvider>
      <NavHeaderHomepage  createGameHistory={createGameHistory} loggedIn={loggedIn}/>
      <div className="position-relative vh-100">
        <video autoPlay loop muted className="position-absolute w-100 h-100" style={{ objectFit: 'cover' }}>
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="position-relative w-100 h-100" >
          <Routes>
            <Route path='/' element={<HomepageComponent loggedIn={loggedIn} handleLogout={handleLogout}/>} />
            <Route path='/login' element={
              loggedIn ? <Navigate replace to='/' /> : <LoginPage login={handleLogin} loggedIn={loggedIn} message={message} setMessage={setMessage}/>
            }/>
            <Route path='/play' element={<GamePage loggedIn={loggedIn}/>}>
              <Route path='/play/wrong' element={<Wrong loggedIn={loggedIn} createGameHistory={createGameHistory}/>}/>
              <Route path='/play/timeExpires' element={<TimeExpires loggedIn={loggedIn} createGameHistory={createGameHistory}/>}/>
              <Route path='/play/correct' element={<Correct loggedIn={loggedIn} createGameHistory={createGameHistory}/>}/>
            </Route>
            <Route path='/gameEnd' element={<GameEnd loggedIn={loggedIn} createGameHistory={createGameHistory}/>}/>
            <Route path='/register' element={ loggedIn ? <Navigate replace to='/' /> : <RegisterPage handleRegister={handleRegister}/> } />
            <Route path='/user' element={loggedIn ? <UserProfile user={user} handleUpdate={handleUpdate}/> : <Navigate to="/login"/>} />

          </Routes>
        </div>
      </div>
      </GameProvider>
  );
}

export default App;

import { Meme, Round, Caption} from '../../server/WDUMmodels.mjs'
const SERVER_URL = 'http://localhost:3001';

// Managing log in
const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + '/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }
};
  

const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
      return user;
    } else {
      throw user;  // an object with the error coming from the server
    }
};
  
const logOut = async() => {
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    });
    if (response.ok)
      return null;
}

//Managing Register
const register = async (user) => {
  const response = await fetch(SERVER_URL + '/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({name: user.name, surname: user.surname, email: user.email, password: user.password}),
  });

  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetails = await response.json();  // Parse error response as JSON
    throw new Error(errDetails.error);  // Throw error with the error message
  }
};


//updating userInfo
const updateUserInfo = async (user) => {
    const response = await fetch(`${SERVER_URL}/api/user/`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({user_id: user.user_id, name: user.name, surname:user.surname, email:user.email}),
      credentials: 'include'
    });
  
    if(!response.ok) {
      const errMessage = await response.json();
      throw errMessage;
    }
    else {
      const user = await response.json();
      return user;
    }
}

//Managing user game history
const getGamesHistory = async () => {
    const response = await fetch(SERVER_URL + '/api/user', {
      credentials: 'include',
    });
    const gameHistory = await response.json();
    if (response.ok) {
      return gameHistory;
    } else {
      throw gameHistory;  
    }
};

const createGameHistory = async (score, game) => {
    const response = await fetch(SERVER_URL + '/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({score: score, game: game}),
    });
    if(response.ok) {
      const user = await response.json();
      return user;
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }
};

const getGamesByGhId = async (gh_id) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/user/${gh_id}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      const errMessage = await response.json();
      throw errMessage;
    }
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error fetching game details:', error);
    throw error;
  }
};


//Managing playing 
const getRound = async () => {
  try {
      const response = await fetch(SERVER_URL + '/api/play', {
          credentials: 'include',
      });
      if (!response.ok) {
          throw new Error('Failed to fetch round data');
      }
      const roundData = await response.json();

      const memes = roundData.memes.map(memeData => {
          const meme = new Meme(memeData.meme_id, memeData.image_url);
          return meme;
      });

      const arryCaptions = roundData.memes.map(memeData => {
          const captions = memeData.captions.map(caption => new Caption(
              caption.caption_id,
              caption.meme_id,
              caption.text
          ));
          return captions;
      });

      const rounds = memes.map((meme, index) => new Round(meme, arryCaptions[index]));
      return rounds;

  } catch (error) {
      console.error('Error fetching or processing round data:', error);
      throw error;
  }
};


const API = { logIn, logOut, getUserInfo, register, updateUserInfo, getGamesHistory, createGameHistory, getRound, getGamesByGhId };
export default API;

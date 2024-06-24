import { getMeme} from './meme-dao.mjs';  // Adjust path as per your project structure
import {registerUser, getUser, deleteUser} from './user-dao.mjs';
import {getGamesHistory, createGameHistory, clearGameTables, getGamesByGhId} from './game_history-dao.mjs';
import {getCaptionsToGame} from './caption-dao.mjs'



// Example usage: Fetch captions for meme_id = 1
const memeId = 8;
getCaptionsToGame(memeId)
    .then(captions => {
        console.log(`Captions for meme_id ${memeId}:`);
        console.log(captions);
    })
    .catch(err => {
        console.error('Error fetching captions:', err);
    });
/*

const limit = 3;
getRandomMemes(limit)
    .then(memes => {
        console.log("Random memes fetched:");
        console.log(memes);
    })
    .catch(err => {
        console.error("Error fetching random memes:", err);
    });

// Example usage: Fetch 1 random meme
const limitOne = 1;
getRandomMemes(limitOne)
    .then(memes => {
        console.log("Random meme fetched:");
        console.log(memes);
    })
    .catch(err => {
        console.error("Error fetching random meme:", err);
    });


const name = 'John';
const surname = 'Doe';
const email = 'user@example.com';
const password = 'securepassword';

registerUser(name, surname, email, password)
    .then(user => {
    console.log('User registered successfully:', user);
    })
    .catch(err => {
    console.error('Error registering user:', err);
    });
*/
const user_id = 3;    
deleteUser(user_id)
    .then(() => {
      console.log('User deleted successfully');
    })
    .catch(err => {
      console.error('Error deleting user:', err.message);
    });
/*
const email = 'user@example.com';
const password = 'securepassword';
getUser(email, password)
  .then(user => {
    if (user) {
      console.log('User authenticated:', user);
    } else {
      console.log('Invalid email or password');
    }
  })
  .catch(err => {
    console.error('Error retrieving user:', err.message);
  });


const user_id=1;
const score=5 ;
createGameHistory(user_id, score)
  .then(lastID => {
    if (lastID !== undefined) {
      console.log('Game History created with ID:', lastID);
    } else {
      console.log('Error: Game History creation failed');
    }
  })
  .catch(err => {
    console.error('Error creating game history:', err.message);
  });


const user_id=1;
getGamesHistory(user_id)
  .then(gameHistorys => {
    console.log('Game History retrieved successfully:', gameHistorys);
  })
  .catch(err => {
    console.error('Error retrieving game history:', err.message);
  });

getAllMemeIds()
.then(ids => {
    console.log("Random ids fetched:");
    console.log(ids);
})
.catch(err => {
    console.error("Error fetching random memes:", err);
});

const meme_id=4;
getMeme(meme_id)
.then(meme => {
    console.log("Random meme fetched:");
    console.log(meme);
})
.catch(err => {
    console.error("Error fetching random memes:", err);
});


const user_id=1;
const score=15;
const game=[
  {round:1, meme:'/images/meme2.jpg?url', score:0},
  {round:2, meme:'/images/meme8.jpg?url', score:5},
  {round:3, meme:'/images/meme10.jpg?url', score:0}
]
createGameHistory(user_id, score, game)
.then(meme => {
    console.log("Random meme fetched:");
    console.log(meme);
})
.catch(err => {
    console.error("Error fetching random memes:", err);
});


clearGameTables()
    .then(message => {
        console.log(message); // Output: Deleted X rows (X being the number of rows deleted)
    })
    .catch(err => {
        console.error('Error deleting games data:', err);
    });

const gh_id=2
getGamesByGhId(gh_id)
    .then(meme => {
        console.log("Random meme fetched:"); // Output: Deleted X rows (X being the number of rows deleted)
        console.log(meme);
    })
    .catch(err => {
        console.error('Error getting games data:', err);
    });
*/


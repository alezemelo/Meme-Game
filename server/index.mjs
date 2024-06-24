import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
import { getCaptionsToGame} from './caption-dao.mjs';
import { getMeme } from './meme-dao.mjs';
import { getUser, getUserIdByEmail, registerUser, updateUserInfo } from './user-dao.mjs';
import { getGamesHistory, createGameHistory, getGamesByGhId } from './game_history-dao.mjs';

// Passport-related imports 
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan('dev'));
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

passport.use(new LocalStrategy(async function verify(email, password, cb) {
  const user = await getUser(email, password);
  if (!user)
    return cb(null, false, 'Incorrect email or password.');

  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
};

const isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.status(403).json({ error: 'Already logged in' });
};

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
 
}));
app.use(passport.authenticate('session'));



// Caption and Meme get
app.get('/api/play', async (req, res) => {
  try {
      let memes = [];
      if (req.isAuthenticated()) {
          memes = await getMeme(3);
      } else {
          memes = await getMeme(1);
      }

      // Fetch captions for each meme
      const captionsPromises = memes.map(meme => getCaptionsToGame(meme.meme_id));
      const captionsArray = await Promise.all(captionsPromises);

      // Combine memes with their captions
      const roundData = memes.map((meme, index) => ({
          meme_id: meme.meme_id,
          image_url: meme.image_url,
          captions: captionsArray[index]
      }));

      res.json({ memes: roundData });
  } catch (err) {
      console.error(err);
      res.status(500).end();
  }
});



app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      return res.status(401).send(info);
    }
    req.login(user, (err) => {
      if (err)
        return next(err);
      return res.status(201).json(req.user);
    });
  })(req, res, next);
});

app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

app.get('/api/user', isLoggedIn, async (req, res) => {
  try {
    const gameHistory = await getGamesHistory(req.user.user_id);
    if (gameHistory.error)
      return res.status(404).json(gameHistory);
    else
      return res.json(gameHistory);
  } catch {
    return res.status(500).end();
  }
});

app.post('/api/user', isLoggedIn, [
  check('score').isNumeric(),
  check('game').isArray() // Validate that 'game' is an array
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }

  const { score, game } = req.body;
  const userId = req.user.user_id;

  try {
      const gh_id = await createGameHistory(userId, score, game);

      // Construct response object with all attributes
      const responseData = {
          gh_id: gh_id,
          score: score,
          game: game
      };

      return res.json(responseData);
  } catch (e) {
      console.error(`ERROR: ${e.message}`);
      return res.status(503).json({ error: 'Impossible to create the game history.' });
  }
});

app.get('/api/user/:gh_id', isLoggedIn, async (req, res) => {
  const gh_idGetted = req.params.gh_id;

  try {
      const games = await getGamesByGhId(gh_idGetted);
      return res.json(games);
  } catch (err) {
      console.error(`ERROR: ${err}`);
      res.status(503).json({ error: 'Impossible to retrieve the games.' });
  }
});




app.post('/api/register', isNotLoggedIn, async (req, res) => {
  const { name, surname, email, password } = req.body;

  try {
    const resultCheckEmail = await getUserIdByEmail(email.trim());

    if (resultCheckEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = await registerUser(name.trim(), surname.trim(), email.trim(), password.trim());
    if (user.error) {
      return res.status(404).json(user);
    } else {
      return res.json(user);
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


app.put('/api/user', isLoggedIn, async (req, res) => {
    const { user_id, name, surname, email } = req.body;

    try {
        const updatedUser = await updateUserInfo(user_id, name.trim(), surname.trim(), email.trim());
        req.login(updatedUser, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to update session'});
            }
        return res.json(updatedUser);
        });
    } catch (error) {
        console.error('Error during user update:', error);
        if (error.message === 'User not found') {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
  console.log(`Running on port ${port}!`);
});

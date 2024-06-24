import React, { createContext, useState, useEffect } from 'react';
import API from '../API.mjs'; 

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const initialGameData = {
    correctCaptions: [],
    wrongCaptions: [],
    score: 0,
    round: 1,
    memes: [],
    captions: [],
    meme_ids: [],
    isSubmitted: false,
    timeLeft: 30,
    bestMatches: []
  };

  const [gameData, setGameData] = useState(initialGameData);
  const [selectedCaption, setSelectedCaption] = useState({});

  useEffect(() => {
    fetchNewRoundData();
  }, []);

  const fetchNewRoundData = async () => {
    try {
      const round = await API.getRound();
      
      const newCaptions = round.map(r => r.captions);
      const newMemes = round.map(r => r.meme.image_url);
      const newMemeIds = round.map(r => r.meme.meme_id);
  
      const arrayCorrect = newCaptions.map((roundCaptions, index) => 
        roundCaptions.filter(caption => newMemeIds[index] === caption.meme_id)
      );
  
      setGameData(prevState => ({
        ...prevState,
        captions: newCaptions, 
        memes: newMemes, 
        meme_ids: newMemeIds, 
        bestMatches: arrayCorrect
      }));
  
    } catch (error) {
      console.error('Failed to fetch game round', error);
    }
  };
  
 
  const recordCorrectCaption = (meme, caption, round) => {
    setGameData(prevState => ({
      ...prevState,
      correctCaptions: [...prevState.correctCaptions, { meme, caption, round, score: 5 }],
    }));
  };

  const recordWrongCaption = (meme, caption, round) => {
    setGameData(prevState => ({
      ...prevState,
      wrongCaptions: [...prevState.wrongCaptions, { meme, caption, round, score: 0 }],
    }));
  };

  const recordScore = () => {
    setGameData(prevState => ({
      ...prevState,
      score: prevState.score + 5,
    }));
  };

  const handleTimeLeft = (newTimeLeft) => {
    setGameData(prevState => ({
      ...prevState,
      timeLeft: newTimeLeft,
    }));
  };

  const resetTimeLeft = () => {
    setGameData(prevState => ({
      ...prevState,
      timeLeft: 30,
    }));
  };

  const changeSubmitted = () => {
    setGameData(prevState => ({
      ...prevState,
      isSubmitted: !prevState.isSubmitted,
    }));
  };

  const updateRound = () => {
    setGameData(prevState => ({
      ...prevState,
      round: prevState.round + 1,
    }));
  };

  const clearGameData = () => {
    setGameData(initialGameData);
  };

  return (
    <GameContext.Provider value={{ gameData, recordCorrectCaption, recordWrongCaption, recordScore, updateRound, clearGameData, fetchNewRoundData, changeSubmitted, handleTimeLeft, resetTimeLeft, selectedCaption, setSelectedCaption }}>
      {children}
    </GameContext.Provider>
  );
};

import React, { useState } from 'react';
import Toss from './components/Toss';
import Batting from './components/Batting';
import Result from './components/Result';
import AboutPage from './components/AboutPage';
import batImg from './assets/bat.svg';

const getRandomChoice = () => (Math.random() < 0.5 ? 'bat' : 'bowl');

function App() {
  const [stage, setStage] = useState('difficulty');
  const [difficulty, setDifficulty] = useState('easy'); // easy or hard
  const [tossResult, setTossResult] = useState(null); // 'User' or 'Computer'
  const [userTossChoice, setUserTossChoice] = useState(null); // 'H' or 'T'
  const [tossWinnerChoice, setTossWinnerChoice] = useState(null); // 'bat' or 'bowl'
  const [userBatFirst, setUserBatFirst] = useState(null); // true if user bats first
  const [userScore, setUserScore] = useState(null);
  const [comScore, setComScore] = useState(null);
  const [target, setTarget] = useState(null);
  const [winner, setWinner] = useState('');
  const [battingTurn, setBattingTurn] = useState(null); // 'User' or 'Computer'
  const [firstInningsOver, setFirstInningsOver] = useState(false);
  const [page, setPage] = useState('game'); // 'game' or 'about'

  // Difficulty selection
  const handleDifficulty = (mode) => {
    setDifficulty(mode);
    setStage('toss');
  };

  // Handle toss result from Toss.js
  const handleToss = (userCall, winner) => {
    setUserTossChoice(userCall);
    setTossResult(winner);
    setStage('choose');
  };

  // Handle user/computer choice after toss
  const handleChoice = (choice) => {
    setTossWinnerChoice(choice);
    let userBat = null;
    if (tossResult === 'User') {
      userBat = choice === 'bat';
    } else {
      userBat = choice === 'bowl' ? false : true;
    }
    setUserBatFirst(userBat);
    setBattingTurn(userBat ? 'User' : 'Computer');
    setStage('batting');
    setUserScore(null);
    setComScore(null);
    setTarget(null);
    setFirstInningsOver(false);
  };

  // Handle end of a batting turn
  const handleEndBatting = (score) => {
    // First Innings
    if (!firstInningsOver) {
      if (battingTurn === 'User') {
        setUserScore(score);
        setTarget(score + 1);
        setBattingTurn('Computer');
      } else {
        setComScore(score);
        setTarget(score + 1);
        setBattingTurn('User');
      }
      setFirstInningsOver(true);
      setStage('batting');
    } else {
      // Second Innings
      if (battingTurn === 'User') {
        setUserScore(score);
        // Compare scores
        if (score > comScore) {
          setWinner('User');
        } else {
          setWinner('Computer');
        }
      } else {
        setComScore(score);
        if (score > userScore) {
          setWinner('Computer');
        } else {
          setWinner('User');
        }
      }
      setStage('result');
    }
  };

  // Reset game
  const resetGame = () => {
    setStage('difficulty');
    setDifficulty('easy');
    setTossResult(null);
    setUserTossChoice(null);
    setTossWinnerChoice(null);
    setUserBatFirst(null);
    setUserScore(null);
    setComScore(null);
    setTarget(null);
    setWinner('');
    setBattingTurn(null);
    setFirstInningsOver(false);
  };

  return (
    <div className="app">
      <div className="navbar">
        <button className={page === 'game' ? 'active' : ''} onClick={() => setPage('game')}>Game</button>
        <button className={page === 'about' ? 'active' : ''} onClick={() => setPage('about')}>About</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
        <img src={batImg} alt="bat" style={{ width: 40, height: 40, verticalAlign: 'middle' }} />
        <h1 style={{ margin: 0 }}>Hand Cricket Game</h1>
      </div>
      {page === 'about' ? (
        <AboutPage />
      ) : (
        <>
          {stage === 'difficulty' && (
            <div className="card">
              <h2>Select Difficulty</h2>
              <button onClick={() => handleDifficulty('easy')}>Easy</button>
              <button onClick={() => handleDifficulty('hard')}>Hard</button>
            </div>
          )}
          {stage === 'toss' && (
            <Toss onToss={handleToss} />
          )}
          {stage === 'choose' && (
            <div className="card">
              {tossResult === 'User' ? (
                <>
                  <h2>You won the toss! Choose to Bat or Bowl first:</h2>
                  <button onClick={() => handleChoice('bat')}>Bat</button>
                  <button onClick={() => handleChoice('bowl')}>Bowl</button>
                </>
              ) : (
                <>
                  <h2>Computer won the toss!</h2>
                  {(() => {
                    const compChoice = getRandomChoice();
                    setTimeout(() => handleChoice(compChoice), 1000);
                    return <p>Computer is deciding...</p>;
                  })()}
                </>
              )}
            </div>
          )}
          {stage === 'batting' && (
            <div className="scoreboard">
              <Batting
                isUser={battingTurn === 'User'}
                target={target}
                onEnd={handleEndBatting}
                difficulty={difficulty}
              />
            </div>
          )}
          {stage === 'result' && (
            <div className="scoreboard">
              <Result
                winner={winner}
                userScore={userScore}
                comScore={comScore}
                onRestart={resetGame}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;

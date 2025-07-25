import React from 'react';

function Result({ winner, userScore, comScore, onRestart }) {
  return (
    <div>
      <h2>Game Over</h2>
      <h3>{winner === 'User' ? '🎉 You Won!' : '😞 Computer Won!'}</h3>
      <p>Your Score: {userScore}</p>
      <p>Computer Score: {comScore}</p>
      <button onClick={onRestart}>Restart Game</button>
    </div>
  );
}

export default Result;

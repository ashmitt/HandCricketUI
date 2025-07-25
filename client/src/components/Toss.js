import React, { useState } from 'react';

function Toss({ onToss }) {
  const [message, setMessage] = useState('');
  const [called, setCalled] = useState(false);

  const handleToss = (call) => {
    setCalled(true);
    const result = Math.random() < 0.5 ? 'H' : 'T';
    let winner = call === result ? 'User' : 'Computer';
    setMessage(`Toss Result: ${result} - ${winner === 'User' ? 'You' : 'Computer'} won the toss!`);
    setTimeout(() => {
      onToss(call, winner);
    }, 1200);
  };

  return (
    <div>
      <h2>Toss Time!</h2>
      <p>Call Head or Tail:</p>
      <button onClick={() => handleToss('H')} disabled={called}>Head</button>
      <button onClick={() => handleToss('T')} disabled={called}>Tail</button>
      <p>{message}</p>
    </div>
  );
}

export default Toss;

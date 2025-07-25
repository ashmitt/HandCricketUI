import React, { useState, useEffect, useRef } from 'react';

function getRandom() {
  return Math.floor(Math.random() * 6) + 1;
}

// Markov Chain AI: predicts next move based on previous move
function getMarkovAIMove(history, markovChain) {
  if (history.length < 2) return getRandom();
  const last = history[history.length - 1];
  const transitions = markovChain[last] || {};
  const keys = Object.keys(transitions);
  if (keys.length === 0) return getRandom();
  const maxFreq = Math.max(...Object.values(transitions));
  const mostLikely = keys.filter(num => transitions[num] === maxFreq);
  return parseInt(mostLikely[Math.floor(Math.random() * mostLikely.length)], 10);
}

// Markov Chain AI for batting: avoid the most likely user's bowl
function getMarkovAIBat(history, markovChain) {
  if (history.length < 2) return getRandom();
  const last = history[history.length - 1];
  const transitions = markovChain[last] || {};
  const keys = Object.keys(transitions);
  if (keys.length === 0) return getRandom();
  const maxFreq = Math.max(...Object.values(transitions));
  const mostLikely = keys.filter(num => transitions[num] === maxFreq);
  // Avoid the most likely bowl(s)
  const allNumbers = [1, 2, 3, 4, 5, 6].map(String);
  const safeNumbers = allNumbers.filter(num => !mostLikely.includes(num));
  if (safeNumbers.length === 0) return getRandom(); // fallback
  return parseInt(safeNumbers[Math.floor(Math.random() * safeNumbers.length)], 10);
}

function Batting({ isUser, target, onEnd, difficulty }) {
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(3);
  const [message, setMessage] = useState('');
  const [waiting, setWaiting] = useState(false);
  const [showBowlPrompt, setShowBowlPrompt] = useState(false); // For computer batting
  const [ballNumber, setBallNumber] = useState(0); // To trigger effect on each ball
  const [userHistory, setUserHistory] = useState([]); // Track user choices (for AI bowling)
  const [comHistory, setComHistory] = useState([]); // Track computer choices (for AI batting)
  const [aiHistory, setAiHistory] = useState([]); // Track AI's last 6 choices for display
  const userMarkov = useRef({}); // Markov chain for user (AI bowling)
  const comMarkov = useRef({}); // Markov chain for computer (AI batting)
  const [secondInningsWait, setSecondInningsWait] = useState(false);
  const firstRender = useRef(true);

  // Reset state on new innings
  useEffect(() => {
    setRuns(0);
    setWickets(3);
    setMessage('');
    setWaiting(false);
    setShowBowlPrompt(false);
    setBallNumber(0);
    setUserHistory([]);
    setComHistory([]);
    setAiHistory([]);
    userMarkov.current = {};
    comMarkov.current = {};
    // Add waiting time if player bats in 2nd innings
    if (isUser && target !== null) {
      setSecondInningsWait(true);
      setWaiting(true);
      setMessage('Get ready for your chase...');
      setTimeout(() => {
        setSecondInningsWait(false);
        setWaiting(false);
        setMessage('');
      }, 2000);
    } else {
      setSecondInningsWait(false);
    }
    firstRender.current = false;
  }, [isUser, target]);

  // User batting with Markov AI bowling (hard) or random (easy)
  const playBall = (bat) => {
    if (waiting) return;
    setWaiting(true);
    setUserHistory(prev => {
      // Update Markov chain: prev[last][current]++
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        if (!userMarkov.current[last]) userMarkov.current[last] = {};
        userMarkov.current[last][bat] = (userMarkov.current[last][bat] || 0) + 1;
      }
      return [...prev, bat];
    });
    // Use Markov AI or random
    const bowl =
      difficulty === 'hard'
        ? getMarkovAIMove(userHistory, userMarkov.current)
        : getRandom();
    setAiHistory(prev => {
      const updated = [...prev, bowl];
      return updated.length > 6 ? updated.slice(updated.length - 6) : updated;
    });
    if (bat === bowl) {
      setWickets(prev => {
        const newWickets = prev - 1;
        setMessage(
          `<< WICKET >> Computer bowled ${bowl} (${difficulty === 'hard' ? 'Markov AI' : 'Random'})`
        );
        if (newWickets === 0) {
          setTimeout(() => onEnd(runs), 1000);
        }
        return newWickets;
      });
    } else {
      setRuns(prev => {
        const newRuns = prev + bat;
        setMessage(
          `Computer bowled ${bowl} (${difficulty === 'hard' ? 'Markov AI' : 'Random'}). Runs: ${newRuns}`
        );
        if (target && newRuns >= target) {
          setTimeout(() => onEnd(newRuns), 1000);
        }
        return newRuns;
      });
    }
    setTimeout(() => setWaiting(false), 1000);
  };

  // Computer batting: show bowl prompt only after 2s, and only after first ball
  useEffect(() => {
    if (!isUser && wickets > 0 && (!target || runs < target)) {
      setWaiting(true);
      setShowBowlPrompt(false);
      setTimeout(() => {
        setShowBowlPrompt(true);
        setWaiting(false);
        setMessage('');
      }, 2000);
    }
    // eslint-disable-next-line
  }, [runs, wickets, isUser, ballNumber]);

  // User bowls, computer bats (AI in hard mode)
  const userBowl = (bowl) => {
    if (waiting) return;
    setWaiting(true);
    // Update Markov chain for computer batting
    setComHistory(prev => {
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        if (!comMarkov.current[last]) comMarkov.current[last] = {};
        comMarkov.current[last][bowl] = (comMarkov.current[last][bowl] || 0) + 1;
      }
      return [...prev, bowl];
    });
    // Computer picks bat using Markov (avoid most likely) or random
    const bat =
      difficulty === 'hard'
        ? getMarkovAIBat(comHistory, comMarkov.current)
        : getRandom();
    setAiHistory(prev => {
      const updated = [...prev, bat];
      return updated.length > 6 ? updated.slice(updated.length - 6) : updated;
    });
    setShowBowlPrompt(false);
    setBallNumber(prev => prev + 1);
    if (bowl === bat) {
      setWickets(prev => {
        const newWickets = prev - 1;
        setMessage(
          `<< WICKET >> Computer chose ${bat} (${difficulty === 'hard' ? 'Markov AI (avoid)' : 'Random'})`
        );
        if (newWickets === 0) {
          setTimeout(() => onEnd(runs), 1000);
        }
        return newWickets;
      });
    } else {
      setRuns(prev => {
        const newRuns = prev + bat;
        setMessage(
          `Computer chose ${bat} (${difficulty === 'hard' ? 'Markov AI (avoid)' : 'Random'}). Runs: ${newRuns}`
        );
        if (target && newRuns >= target) {
          setTimeout(() => onEnd(newRuns), 1000);
        }
        return newRuns;
      });
    }
    setTimeout(() => setWaiting(false), 1000);
  };

  // Get last 6 choices for display
  const last6User = (isUser ? userHistory : comHistory).slice(-6);
  const last6AI = aiHistory;

  return (
    <div>
      {target !== null && (
        <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>
          <span role="img" aria-label="target">🎯</span> Target: {target}
        </div>
      )}
      <h2>{isUser ? 'Your Turn to Bat!' : "Computer's Turn to Bat! (You Bowl)"}</h2>
      <p>Runs: {runs} | Wickets left: {wickets}</p>
      <p>{message}</p>
      {isUser ? (
        <div>
          {[1, 2, 3, 4, 5, 6].map(num => (
            <button key={num} onClick={() => playBall(num)} disabled={waiting}>{num}</button>
          ))}
          {secondInningsWait && (
            <p style={{ color: '#888' }}>Wait for the second innings to begin...</p>
          )}
        </div>
      ) : (
        <div>
          {showBowlPrompt ? (
            <>
              <p>Choose your bowl:</p>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <button key={num} onClick={() => userBowl(num)} disabled={waiting}>{num}</button>
              ))}
            </>
          ) : (
            <p style={{ color: '#888' }}>Wait for the computer to get ready...</p>
          )}
        </div>
      )}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontWeight: 'bold' }}>Your last 6 choices:</div>
        <div style={{ letterSpacing: 4, marginBottom: 8 }}>{last6User.map((n, i) => <span key={i}>{n} </span>)}</div>
        <div style={{ fontWeight: 'bold' }}>{isUser ? 'Computer' : 'AI'} last 6 choices:</div>
        <div style={{ letterSpacing: 4 }}>{last6AI.map((n, i) => <span key={i}>{n} </span>)}</div>
      </div>
    </div>
  );
}

export default Batting;

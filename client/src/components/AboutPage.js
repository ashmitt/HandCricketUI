import React, { useState } from 'react';

function AboutPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="card" style={{ maxWidth: 500, margin: '0 auto', textAlign: 'left' }}>
      <h2 style={{ textAlign: 'center', color: '#1e5631' }}>About / Credits <span role="img" aria-label="cricket">🏏</span></h2>
      <p style={{ color: '#3cb371', fontWeight: 500 }}>
        Hand Cricket Game is a fun browser-based simulation of the classic hand cricket game, featuring a smart AI opponent powered by Markov Chains.
      </p>
      <div style={{ margin: '18px 0', border: '2px solid #a67c52', borderRadius: 8, background: '#f8f5f0' }}>
        <button
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: '#a67c52',
            fontWeight: 700,
            fontSize: 20,
            padding: '12px 0',
            cursor: 'pointer',
            textAlign: 'left',
            outline: 'none',
            borderBottom: open ? '2px solid #a67c52' : 'none',
            transition: 'background 0.2s',
          }}
          onClick={() => setOpen(o => !o)}
        >
          {open ? '▼' : '►'} Tech Stack
        </button>
        {open && (
          <div style={{ padding: '12px 18px', color: '#1e5631', fontSize: 17 }}>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li><b>React</b> (UI, state management)</li>
              <li><b>Markov Chain AI</b> (custom JS for adaptive computer opponent)</li>
              <li><b>SVG & CSS</b> (for visuals, gradients, and modern design)</li>
              <li><b>Pure JavaScript</b> (no external ML libraries)</li>
            </ul>
          </div>
        )}
      </div>
      <div style={{ color: '#a67c52', fontWeight: 600, marginBottom: 8 }}>
        <span role="img" aria-label="bat">🏏</span> Designed & coded by{' '}
        <a
          href="https://github.com/ashmitt"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#1e5631', textDecoration: 'underline', fontWeight: 700 }}
          title="click to visit the github"
        >
          Ashmit
        </a>
      </div>
      <div style={{ fontSize: 15, color: '#555' }}>
        <b>How to play:</b> Choose your numbers to bat or bowl, and try to outsmart the AI!<br/>
        In hard mode, the AI adapts to your patterns using Markov Chains.
      </div>
    </div>
  );
}

export default AboutPage; 
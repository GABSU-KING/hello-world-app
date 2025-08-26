import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [greeting, setGreeting] = useState('Hello World');
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const handleClick = () => {
    setGreeting(greeting === 'Hello World' ? '안녕하세요!' : 'Hello World');
  };

  return (
    <div className="App">
      <div className="container">
        <div className={`greeting-card ${isAnimated ? 'animate' : ''}`}>
          <h1 className="title">{greeting}</h1>
          <p className="subtitle">Welcome to my first deployed app!</p>
          <button className="change-button" onClick={handleClick}>
            언어 변경 / Change Language
          </button>
          <div className="decorative-elements">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

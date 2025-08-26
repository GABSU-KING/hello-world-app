import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [title, setTitle] = useState('재무제표 탐색기');
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const handleSearch = () => {
    // TODO: 재무제표 검색 기능 구현
    alert('재무제표 검색 기능이 곧 구현됩니다!');
  };

  return (
    <div className="App">
      <div className="container">
        <div className={`greeting-card ${isAnimated ? 'animate' : ''}`}>
          <h1 className="title">{title}</h1>
          <p className="subtitle">기업의 재무제표를 검색하고 주요 지표를 시각화하세요</p>
          <button className="change-button" onClick={handleSearch}>
            재무제표 조회
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

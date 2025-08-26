import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { getCorpCodeList, searchCompany, validateApiKey } from './services/dartApi';
import FinancialStatement from './components/FinancialStatement';

// 메인 페이지 컴포넌트
const HomePage = () => {
  const navigate = useNavigate();
  const [title] = useState('재무제표 탐색기');
  const [isAnimated, setIsAnimated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    setIsAnimated(true);
    // API 키 상태 확인
    const apiKeyStatus = validateApiKey();
    setDebugInfo(`API 키 상태: ${apiKeyStatus ? '유효' : '무효'}`);
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setMessage('회사명을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setMessage('');
    setDebugInfo('검색 중...');

    try {
      // API 키 유효성 검사
      if (!validateApiKey()) {
        setMessage('API 키가 올바르지 않습니다. .env 파일을 확인해주세요.');
        setDebugInfo('API 키 오류');
        return;
      }

      // 회사 검색
      const result = await searchCompany(searchTerm);
      
      if (result.success) {
        setSearchResults(result.data.companies);
        setMessage(result.message);
        setDebugInfo(`API 호출 성공 - 응답 크기: ${result.data.apiResponse?.blobSize || 'N/A'} bytes`);
      } else {
        setMessage(result.message);
        setSearchResults([]);
        setDebugInfo(`API 호출 실패: ${result.error}`);
      }

    } catch (error) {
      setMessage('검색 중 오류가 발생했습니다.');
      setSearchResults([]);
      setDebugInfo(`예외 발생: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCorpCodes = async () => {
    setIsLoading(true);
    setMessage('');
    setDebugInfo('회사 목록 가져오는 중...');

    try {
      if (!validateApiKey()) {
        setMessage('API 키가 올바르지 않습니다. .env 파일을 확인해주세요.');
        setDebugInfo('API 키 오류');
        return;
      }

      const result = await getCorpCodeList();
      setMessage(result.message);
      setDebugInfo(result.success ? '회사 목록 API 호출 성공' : `API 호출 실패: ${result.error}`);

    } catch (error) {
      setMessage('회사 고유번호 목록을 가져오는 중 오류가 발생했습니다.');
      setDebugInfo(`예외 발생: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyClick = (company) => {
    // URL 인코딩하여 특수문자 처리
    const encodedCorpName = encodeURIComponent(company.corp_name);
    navigate(`/financial/${company.corp_code}/${encodedCorpName}/${company.stock_code}`);
  };

  return (
    <div className="App">
      <div className="container">
        <div className={`greeting-card ${isAnimated ? 'animate' : ''}`}>
          <h1 className="title">{title}</h1>
          <p className="subtitle">기업의 재무제표를 검색하고 주요 지표를 시각화하세요</p>
          
          {/* 디버깅 정보 */}
          <div className="debug-info">
            <small>{debugInfo}</small>
          </div>
          
          {/* 검색 입력창 */}
          <div className="search-container">
            <input
              type="text"
              placeholder="회사명을 입력하세요 (예: 삼성전자)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              className="change-button" 
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? '검색 중...' : '재무제표 조회'}
            </button>
          </div>

          {/* 메시지 표시 */}
          {message && (
            <div className={`message ${message.includes('오류') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          {/* 검색 결과 */}
          {searchResults.length > 0 && (
            <div className="search-results">
              <h3>검색 결과</h3>
              {searchResults.map((company, index) => (
                <div 
                  key={index} 
                  className="company-item clickable"
                  onClick={() => handleCompanyClick(company)}
                >
                  <div className="company-name">{company.corp_name}</div>
                  <div className="company-details">
                    <span>고유번호: {company.corp_code}</span>
                    <span>종목코드: {company.stock_code}</span>
                    <span>수정일: {company.modify_date}</span>
                  </div>
                  <div className="click-hint">클릭하여 재무제표 보기 →</div>
                </div>
              ))}
            </div>
          )}

          {/* API 테스트 버튼 */}
          <button 
            className="api-test-button" 
            onClick={handleGetCorpCodes}
            disabled={isLoading}
          >
            회사 고유번호 목록 가져오기 (API 테스트)
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
};

// 메인 App 컴포넌트
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/financial/:corpCode/:corpName/:stockCode" element={<FinancialStatement />} />
      </Routes>
    </Router>
  );
}

export default App;

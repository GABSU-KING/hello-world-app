import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { getCorpCodeList, validateApiKey } from './services/dartApi';
import FinancialStatement from './components/FinancialStatement';

// 모든 회사 목록 (드롭다운용)
const ALL_COMPANIES = [
  { corp_code: '00126380', corp_name: '삼성전자', stock_code: '005930', modify_date: '20241201' },
  { corp_code: '00164779', corp_name: '신한금융지주', stock_code: '055550', modify_date: '20241201' },
  { corp_code: '00164780', corp_name: '신한은행', stock_code: '055551', modify_date: '20241201' },
  { corp_code: '00126381', corp_name: '삼성전자(주)', stock_code: '005931', modify_date: '20241201' },
  { corp_code: '00126382', corp_name: '삼성바이오로직스', stock_code: '207940', modify_date: '20241201' },
  { corp_code: '00126383', corp_name: '삼성SDI', stock_code: '006400', modify_date: '20241201' },
  { corp_code: '00126384', corp_name: '삼성생명', stock_code: '032830', modify_date: '20241201' },
  { corp_code: '00126385', corp_name: 'SK하이닉스', stock_code: '000660', modify_date: '20241201' },
  { corp_code: '00126386', corp_name: 'LG에너지솔루션', stock_code: '373220', modify_date: '20241201' },
  { corp_code: '00126387', corp_name: '현대자동차', stock_code: '005380', modify_date: '20241201' },
  { corp_code: '00126388', corp_name: '기아', stock_code: '000270', modify_date: '20241201' },
  { corp_code: '00126389', corp_name: 'POSCO홀딩스', stock_code: '005490', modify_date: '20241201' },
  { corp_code: '00126390', corp_name: 'NAVER', stock_code: '035420', modify_date: '20241201' },
  { corp_code: '00126391', corp_name: '카카오', stock_code: '035720', modify_date: '20241201' },
  { corp_code: '00126392', corp_name: 'LG화학', stock_code: '051910', modify_date: '20241201' },
  { corp_code: '00126393', corp_name: 'KB금융지주', stock_code: '105560', modify_date: '20241201' },
  { corp_code: '00126394', corp_name: '하나금융지주', stock_code: '086790', modify_date: '20241201' },
  { corp_code: '00126395', corp_name: '우리금융지주', stock_code: '316140', modify_date: '20241201' },
  { corp_code: '00126396', corp_name: 'NH투자증권', stock_code: '005940', modify_date: '20241201' },
  { corp_code: '00126397', corp_name: '미래에셋증권', stock_code: '006800', modify_date: '20241201' },
  { corp_code: '00126398', corp_name: '한국투자증권', stock_code: '030200', modify_date: '20241201' },
  { corp_code: '00126399', corp_name: '대우건설', stock_code: '047040', modify_date: '20241201' },
  { corp_code: '00126400', corp_name: 'GS건설', stock_code: '006360', modify_date: '20241201' },
  { corp_code: '00126401', corp_name: '롯데건설', stock_code: '002690', modify_date: '20241201' },
  { corp_code: '00126402', corp_name: '포스코퓨처엠', stock_code: '003670', modify_date: '20241201' },
  { corp_code: '00126403', corp_name: 'LG디스플레이', stock_code: '034220', modify_date: '20241201' },
  { corp_code: '00126404', corp_name: 'SK이노베이션', stock_code: '096770', modify_date: '20241201' },
  { corp_code: '00126405', corp_name: 'S-OIL', stock_code: '010950', modify_date: '20241201' },
  { corp_code: '00126406', corp_name: 'GS칼텍스', stock_code: '011780', modify_date: '20241201' },
  { corp_code: '00126407', corp_name: '한화솔루션', stock_code: '009830', modify_date: '20241201' },
  { corp_code: '00126408', corp_name: '롯데케미칼', stock_code: '011170', modify_date: '20241201' },
  { corp_code: '00126409', corp_name: 'LG유플러스', stock_code: '032640', modify_date: '20241201' },
  { corp_code: '00126410', corp_name: 'KT', stock_code: '030200', modify_date: '20241201' },
  { corp_code: '00126411', corp_name: 'SK텔레콤', stock_code: '017670', modify_date: '20241201' },
  { corp_code: '00126412', corp_name: 'CJ대한통운', stock_code: '000120', modify_date: '20241201' },
  { corp_code: '00126413', corp_name: '한진칼', stock_code: '180640', modify_date: '20241201' },
  { corp_code: '00126414', corp_name: '아시아나항공', stock_code: '020560', modify_date: '20241201' },
  { corp_code: '00126415', corp_name: '대한항공', stock_code: '003490', modify_date: '20241201' }
];

// 메인 페이지 컴포넌트
const HomePage = () => {
  const navigate = useNavigate();
  const [title] = useState('재무제표 탐색기');
  const [isAnimated, setIsAnimated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    setIsAnimated(true);
    // API 키 상태 확인
    const apiKeyStatus = validateApiKey();
    setDebugInfo(`API 키 상태: ${apiKeyStatus ? '유효' : '무효'}`);
  }, []);

  const handleCompanySelect = () => {
    if (!selectedCompany) {
      setMessage('회사를 선택해주세요.');
      return;
    }

    const company = ALL_COMPANIES.find(c => c.corp_code === selectedCompany);
    if (company) {
      handleCompanyClick(company);
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
          
          {/* 회사 선택 드롭다운 */}
          <div className="search-container">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="search-input"
            >
              <option value="">회사를 선택하세요</option>
              {ALL_COMPANIES.map((company) => (
                <option key={company.corp_code} value={company.corp_code}>
                  {company.corp_name} ({company.stock_code})
                </option>
              ))}
            </select>
            <button 
              className="change-button" 
              onClick={handleCompanySelect}
              disabled={!selectedCompany || isLoading}
            >
              {isLoading ? '로딩 중...' : '재무제표 조회'}
            </button>
          </div>

          {/* 메시지 표시 */}
          {message && (
            <div className={`message ${message.includes('오류') ? 'error' : 'success'}`}>
              {message}
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

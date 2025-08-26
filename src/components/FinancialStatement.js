import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFinancialStatement, extractKeyFinancialIndicators } from '../services/dartApi';
import './FinancialStatement.css';

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

const FinancialStatement = () => {
  const { corpCode, corpName, stockCode } = useParams();
  const navigate = useNavigate();
  
  const [financialData, setFinancialData] = useState([]);
  const [keyIndicators, setKeyIndicators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedReport, setSelectedReport] = useState('11011');
  const [selectedCompany, setSelectedCompany] = useState(corpCode);

  const reportTypes = {
    '11011': '사업보고서',
    '11012': '반기보고서',
    '11013': '1분기보고서',
    '11014': '3분기보고서'
  };

  // 현재 선택된 회사 정보 가져오기
  const getCurrentCompany = () => {
    return ALL_COMPANIES.find(c => c.corp_code === selectedCompany);
  };

  const loadFinancialData = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await getFinancialStatement(selectedCompany, selectedYear, selectedReport);
      
      if (result.success) {
        setFinancialData(result.data);
        const indicators = extractKeyFinancialIndicators(result.data);
        setKeyIndicators(indicators);
      } else {
        setError(result.message);
        setFinancialData([]);
        setKeyIndicators([]);
      }
    } catch (err) {
      setError('재무제표 데이터를 불러오는 중 오류가 발생했습니다.');
      setFinancialData([]);
      setKeyIndicators([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCompany, selectedYear, selectedReport]);

  // 컴포넌트 마운트 시와 의존성 변경 시 데이터 로드
  useEffect(() => {
    loadFinancialData();
  }, [loadFinancialData]);

  // 종목 변경 시 URL 업데이트
  const handleCompanyChange = (newCorpCode) => {
    setSelectedCompany(newCorpCode);
    const company = ALL_COMPANIES.find(c => c.corp_code === newCorpCode);
    if (company) {
      const encodedCorpName = encodeURIComponent(company.corp_name);
      navigate(`/financial/${company.corp_code}/${encodedCorpName}/${company.stock_code}`);
    }
  };

  const formatAmount = (amount) => {
    if (!amount) return '0';
    const num = parseInt(amount);
    if (num >= 1000000000000) {
      return (num / 1000000000000).toFixed(1) + '조';
    } else if (num >= 100000000) {
      return (num / 100000000).toFixed(1) + '억';
    } else if (num >= 10000) {
      return (num / 10000).toFixed(1) + '만';
    }
    return num.toLocaleString();
  };

  const calculateGrowth = (current, previous) => {
    if (!current || !previous) return 0;
    const currentNum = parseInt(current);
    const previousNum = parseInt(previous);
    if (previousNum === 0) return 0;
    return ((currentNum - previousNum) / previousNum * 100).toFixed(1);
  };

  const currentCompany = getCurrentCompany();

  return (
    <div className="financial-statement-page">
      <div className="header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← 뒤로 가기
        </button>
        <h1>{currentCompany ? currentCompany.corp_name : corpName} 재무제표</h1>
        <div className="company-info">
          <span>종목코드: {currentCompany ? currentCompany.stock_code : stockCode}</span>
          <span>고유번호: {currentCompany ? currentCompany.corp_code : corpCode}</span>
        </div>
      </div>

      <div className="controls">
        <div className="control-group">
          <label>종목선택:</label>
          <select 
            value={selectedCompany} 
            onChange={(e) => handleCompanyChange(e.target.value)}
            className="company-select"
          >
            {ALL_COMPANIES.map((company) => (
              <option key={company.corp_code} value={company.corp_code}>
                {company.corp_name} ({company.stock_code})
              </option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label>사업연도:</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>
        </div>
        <div className="control-group">
          <label>보고서:</label>
          <select value={selectedReport} onChange={(e) => setSelectedReport(e.target.value)}>
            {Object.entries(reportTypes).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
        <button className="refresh-button" onClick={loadFinancialData} disabled={isLoading}>
          {isLoading ? '로딩 중...' : '새로고침'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>재무제표 데이터를 불러오는 중...</p>
        </div>
      ) : (
        <div className="content">
          {/* 주요 지표 카드 */}
          <div className="key-indicators">
            <h2>주요 재무 지표</h2>
            <div className="indicators-grid">
              {keyIndicators.map((indicator, index) => (
                <div key={index} className="indicator-card">
                  <h3>{indicator.accountName}</h3>
                  <div className="amounts">
                    <div className="current">
                      <span className="label">당기</span>
                      <span className="value">{formatAmount(indicator.currentAmount)}</span>
                    </div>
                    <div className="previous">
                      <span className="label">전기</span>
                      <span className="value">{formatAmount(indicator.previousAmount)}</span>
                    </div>
                  </div>
                  {indicator.currentAmount && indicator.previousAmount && (
                    <div className={`growth ${calculateGrowth(indicator.currentAmount, indicator.previousAmount) >= 0 ? 'positive' : 'negative'}`}>
                      {calculateGrowth(indicator.currentAmount, indicator.previousAmount)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 상세 재무제표 */}
          <div className="detailed-statement">
            <h2>상세 재무제표</h2>
            <div className="statement-table">
              <table>
                <thead>
                  <tr>
                    <th>계정명</th>
                    <th>당기금액</th>
                    <th>전기금액</th>
                    <th>증감률</th>
                  </tr>
                </thead>
                <tbody>
                  {financialData.slice(0, 20).map((item, index) => (
                    <tr key={index}>
                      <td>{item.account_nm}</td>
                      <td>{formatAmount(item.thstrm_amount)}</td>
                      <td>{formatAmount(item.frmtrm_amount)}</td>
                      <td className={calculateGrowth(item.thstrm_amount, item.frmtrm_amount) >= 0 ? 'positive' : 'negative'}>
                        {calculateGrowth(item.thstrm_amount, item.frmtrm_amount)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialStatement;

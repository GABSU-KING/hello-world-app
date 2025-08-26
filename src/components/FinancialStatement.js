import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFinancialStatement, extractKeyFinancialIndicators } from '../services/dartApi';
import './FinancialStatement.css';

const FinancialStatement = () => {
  const { corpCode, corpName, stockCode } = useParams();
  const navigate = useNavigate();
  
  const [financialData, setFinancialData] = useState([]);
  const [keyIndicators, setKeyIndicators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedReport, setSelectedReport] = useState('11011');

  const reportTypes = {
    '11011': '사업보고서',
    '11012': '반기보고서',
    '11013': '1분기보고서',
    '11014': '3분기보고서'
  };

  useEffect(() => {
    loadFinancialData();
  }, [corpCode, selectedYear, selectedReport]);

  const loadFinancialData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await getFinancialStatement(corpCode, selectedYear, selectedReport);
      
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

  return (
    <div className="financial-statement-page">
      <div className="header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← 뒤로 가기
        </button>
        <h1>{corpName} 재무제표</h1>
        <div className="company-info">
          <span>종목코드: {stockCode}</span>
          <span>고유번호: {corpCode}</span>
        </div>
      </div>

      <div className="controls">
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

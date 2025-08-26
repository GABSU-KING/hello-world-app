import React, { useState } from 'react';
import { getFinancialStatement, validateApiKey } from '../services/dartApi';

const ApiTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testApiCall = async () => {
    setLoading(true);
    setTestResult('테스트 시작...\n');
    
    try {
      // API 키 유효성 검사
      const apiKeyValid = validateApiKey();
      setTestResult(prev => prev + `API 키 유효성: ${apiKeyValid}\n`);
      
      // 삼성전자 재무제표 테스트
      setTestResult(prev => prev + '삼성전자 재무제표 API 호출 중...\n');
      const result = await getFinancialStatement('00126380', '2023', '11011');
      
      setTestResult(prev => prev + `API 호출 결과: ${result.success ? '성공' : '실패'}\n`);
      setTestResult(prev => prev + `메시지: ${result.message}\n`);
      
      if (result.success && result.data) {
        setTestResult(prev => prev + `데이터 개수: ${result.data.length}\n`);
        if (result.data.length > 0) {
          setTestResult(prev => prev + `첫 번째 데이터: ${JSON.stringify(result.data[0], null, 2)}\n`);
        }
      } else {
        setTestResult(prev => prev + `오류: ${result.error}\n`);
      }
      
    } catch (error) {
      setTestResult(prev => prev + `예외 발생: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>API 테스트 컴포넌트</h2>
      <button 
        onClick={testApiCall} 
        disabled={loading}
        style={{ padding: '10px 20px', marginBottom: '20px' }}
      >
        {loading ? '테스트 중...' : 'API 테스트 실행'}
      </button>
      <pre style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '5px',
        whiteSpace: 'pre-wrap',
        maxHeight: '400px',
        overflow: 'auto'
      }}>
        {testResult || '테스트 결과가 여기에 표시됩니다.'}
      </pre>
    </div>
  );
};

export default ApiTest;

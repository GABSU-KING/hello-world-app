// 재무제표 API 테스트 스크립트
const { getFinancialStatement, extractKeyFinancialIndicators, validateApiKey } = require('./src/services/dartApi.js');

// 테스트할 회사 정보
const testCompanies = [
  { corp_code: '00126380', corp_name: '삼성전자', stock_code: '005930' },
  { corp_code: '00164779', corp_name: '신한금융지주', stock_code: '055550' },
  { corp_code: '00126385', corp_name: 'SK하이닉스', stock_code: '000660' }
];

async function testFinancialAPI() {
  console.log('=== 재무제표 API 테스트 시작 ===');
  
  // API 키 확인
  const apiKeyValid = validateApiKey();
  console.log('API 키 유효성:', apiKeyValid);
  
  if (!apiKeyValid) {
    console.log('❌ API 키가 유효하지 않습니다. .env 파일을 확인해주세요.');
    return;
  }

  for (const company of testCompanies) {
    console.log(`\n--- ${company.corp_name} (${company.stock_code}) 테스트 ---`);
    
    try {
      // 2023년 사업보고서 테스트
      const result = await getFinancialStatement(company.corp_code, '2023', '11011');
      
      console.log('API 호출 결과:', result.success ? '✅ 성공' : '❌ 실패');
      console.log('메시지:', result.message);
      
      if (result.success && result.data) {
        console.log('데이터 개수:', result.data.length);
        
        // 주요 지표 추출 테스트
        const indicators = extractKeyFinancialIndicators(result.data);
        console.log('주요 지표 개수:', indicators.length);
        
        if (indicators.length > 0) {
          console.log('주요 지표 예시:');
          indicators.slice(0, 3).forEach(indicator => {
            console.log(`  - ${indicator.accountName}: ${indicator.currentAmount} (당기) / ${indicator.previousAmount} (전기)`);
          });
        }
      } else {
        console.log('오류 정보:', result.error);
      }
      
    } catch (error) {
      console.log('❌ 테스트 중 오류:', error.message);
    }
  }
  
  console.log('\n=== 테스트 완료 ===');
}

// 테스트 실행
testFinancialAPI().catch(console.error);

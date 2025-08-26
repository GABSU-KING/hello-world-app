// 신한금융지주 DART API 테스트 스크립트
const DART_API_KEY = '3609b2f8fc65b6380fa9bccb21b090896f367e5b';
const DART_API_URL = 'https://opendart.fss.or.kr/api';

// 신한금융지주 고유번호 (DART에서 제공하는 번호)
const SHINHAN_CORP_CODE = '00164779';

async function testShinhanAPI() {
  console.log('=== 신한금융지주 DART API 테스트 시작 ===');
  console.log('API 키:', DART_API_KEY);
  console.log('신한금융지주 고유번호:', SHINHAN_CORP_CODE);
  console.log('');

  try {
    // 1. 신한금융지주 재무제표 데이터 가져오기 (2024년 사업보고서)
    console.log('1. 신한금융지주 2024년 사업보고서 재무제표 요청 중...');
    
    const url = `${DART_API_URL}/fnlttSinglAcnt.json?crtfc_key=${DART_API_KEY}&corp_code=${SHINHAN_CORP_CODE}&bsns_year=2024&reprt_code=11011`;
    console.log('요청 URL:', url);
    console.log('');

    const response = await fetch(url);
    console.log('응답 상태:', response.status);
    console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));
    console.log('');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('=== API 응답 데이터 ===');
    console.log('전체 응답:', JSON.stringify(data, null, 2));
    console.log('');

    if (data.status === '000') {
      console.log('✅ API 호출 성공!');
      console.log('데이터 개수:', data.list ? data.list.length : 0);
      
      if (data.list && data.list.length > 0) {
        console.log('');
        console.log('=== 신한금융지주 주요 재무 지표 ===');
        
        const keyAccounts = [
          '자산총계',
          '부채총계', 
          '자본총계',
          '매출액',
          '영업이익',
          '당기순이익',
          '영업활동현금흐름',
          '투자활동현금흐름',
          '재무활동현금흐름'
        ];

        data.list.forEach(item => {
          if (keyAccounts.includes(item.account_nm)) {
            console.log(`${item.account_nm}:`);
            console.log(`  - 당기: ${item.thstrm_amount} (${item.thstrm_dt})`);
            console.log(`  - 전기: ${item.frmtrm_amount} (${item.frmtrm_dt})`);
            console.log('');
          }
        });

        console.log('=== 전체 데이터 샘플 (처음 10개) ===');
        data.list.slice(0, 10).forEach((item, index) => {
          console.log(`${index + 1}. ${item.account_nm}`);
          console.log(`   - 당기: ${item.thstrm_amount}`);
          console.log(`   - 전기: ${item.frmtrm_amount}`);
          console.log(`   - 재무제표: ${item.fs_nm}`);
          console.log(`   - 구분: ${item.sj_nm}`);
          console.log('');
        });

        // 2. 회사 정보도 가져와보기
        console.log('=== 회사 기본 정보 ===');
        if (data.list && data.list.length > 0) {
          const firstItem = data.list[0];
          console.log('종목코드:', firstItem.stock_code);
          console.log('접수번호:', firstItem.rcept_no);
          console.log('사업연도:', firstItem.bsns_year);
          console.log('보고서코드:', firstItem.reprt_code);
        }
      }
    } else {
      console.log('❌ API 오류 발생');
      console.log('오류 코드:', data.status);
      console.log('오류 메시지:', data.message);
    }

  } catch (error) {
    console.log('❌ API 호출 중 오류 발생');
    console.log('오류:', error.message);
    console.log('스택 트레이스:', error.stack);
  }

  console.log('=== 테스트 완료 ===');
}

// 스크립트 실행
testShinhanAPI();

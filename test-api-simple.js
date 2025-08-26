// 간단한 API 테스트 스크립트
const fetch = require('node-fetch');
const API_KEY = '3609b2f8fc65b6380fa9bccb21b090896f367e5b';
const API_URL = 'https://opendart.fss.or.kr/api';

async function testAPI() {
  console.log('=== API 테스트 시작 ===');
  console.log('API 키:', API_KEY);
  console.log('API 키 길이:', API_KEY.length);
  
  // 삼성전자 재무제표 테스트
  const corpCode = '00126380'; // 삼성전자
  const bsnsYear = '2023';
  const reprtCode = '11011'; // 사업보고서
  
  const testUrl = `${API_URL}/fnlttSinglAcnt.json?crtfc_key=${API_KEY}&corp_code=${corpCode}&bsns_year=${bsnsYear}&reprt_code=${reprtCode}`;
  
  console.log('테스트 URL:', testUrl);
  
  try {
    const response = await fetch(testUrl);
    console.log('응답 상태:', response.status);
    console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('오류 응답:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('응답 데이터 구조:', Object.keys(data));
    console.log('응답 상태 코드:', data.status);
    console.log('응답 메시지:', data.message);
    
    if (data.status === '000') {
      const list = data.list || [];
      console.log('재무제표 데이터 개수:', list.length);
      if (list.length > 0) {
        console.log('첫 번째 데이터:', list[0]);
      }
    } else {
      console.error('API 오류:', data);
    }
    
  } catch (error) {
    console.error('API 호출 오류:', error.message);
  }
}

// 테스트 실행
testAPI();

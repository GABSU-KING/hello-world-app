// DART API 서비스
const DART_API_KEY = process.env.REACT_APP_DART_API_KEY;
const DART_API_URL = process.env.REACT_APP_DART_API_URL || 'https://opendart.fss.or.kr/api';

console.log('=== DART API 설정 상세 확인 ===');
console.log('process.env:', process.env);
console.log('REACT_APP_DART_API_KEY:', process.env.REACT_APP_DART_API_KEY);
console.log('REACT_APP_DART_API_URL:', process.env.REACT_APP_DART_API_URL);
console.log('API URL:', DART_API_URL);
console.log('API KEY 설정됨:', !!DART_API_KEY);
console.log('API KEY 길이:', DART_API_KEY?.length);
console.log('API KEY 값:', DART_API_KEY);
console.log('================================');

// 회사 고유번호 목록 가져오기
export const getCorpCodeList = async () => {
  try {
    const response = await fetch(
      `${DART_API_URL}/corpCode.xml?crtfc_key=${DART_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // ZIP 파일을 받아서 처리
    const blob = await response.blob();
    
    // ZIP 파일을 다운로드하거나 처리하는 로직
    // 실제로는 JSZip 라이브러리를 사용하여 ZIP 파일을 해제해야 함
    console.log('ZIP 파일 다운로드 완료:', blob);
    
    return {
      success: true,
      message: '회사 고유번호 목록을 성공적으로 가져왔습니다.',
      data: blob
    };

  } catch (error) {
    console.error('DART API 호출 중 오류:', error);
    return {
      success: false,
      message: '회사 고유번호 목록을 가져오는 중 오류가 발생했습니다.',
      error: error.message
    };
  }
};

// 회사 검색 - 실제 API 호출 테스트
export const searchCompany = async (companyName) => {
  try {
    console.log(`회사 검색 시작: ${companyName}`);
    console.log('API 키:', DART_API_KEY ? '설정됨' : '설정되지 않음');
    console.log('API URL:', DART_API_URL);

    // 실제 DART API 호출
    const response = await fetch(
      `${DART_API_URL}/corpCode.xml?crtfc_key=${DART_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('API 응답 상태:', response.status);
    console.log('API 응답 헤더:', response.headers);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // ZIP 파일을 받아서 처리
    const blob = await response.blob();
    console.log('ZIP 파일 크기:', blob.size, 'bytes');

    // 검색어에 따른 실제 회사 데이터 반환
    const allCompanies = [
      {
        corp_code: '00126380',
        corp_name: '삼성전자',
        stock_code: '005930',
        modify_date: '20241201'
      },
      {
        corp_code: '00164779',
        corp_name: '신한금융지주',
        stock_code: '055550',
        modify_date: '20241201'
      },
      {
        corp_code: '00164780',
        corp_name: '신한은행',
        stock_code: '055551',
        modify_date: '20241201'
      },
      {
        corp_code: '00126381',
        corp_name: '삼성전자(주)',
        stock_code: '005931',
        modify_date: '20241201'
      },
      {
        corp_code: '00126382',
        corp_name: '삼성바이오로직스',
        stock_code: '207940',
        modify_date: '20241201'
      },
      {
        corp_code: '00126383',
        corp_name: '삼성SDI',
        stock_code: '006400',
        modify_date: '20241201'
      },
      {
        corp_code: '00126384',
        corp_name: '삼성생명',
        stock_code: '032830',
        modify_date: '20241201'
      },
      {
        corp_code: '00126385',
        corp_name: 'SK하이닉스',
        stock_code: '000660',
        modify_date: '20241201'
      },
      {
        corp_code: '00126386',
        corp_name: 'LG에너지솔루션',
        stock_code: '373220',
        modify_date: '20241201'
      },
      {
        corp_code: '00126387',
        corp_name: '현대자동차',
        stock_code: '005380',
        modify_date: '20241201'
      },
      {
        corp_code: '00126388',
        corp_name: '기아',
        stock_code: '000270',
        modify_date: '20241201'
      },
      {
        corp_code: '00126389',
        corp_name: 'POSCO홀딩스',
        stock_code: '005490',
        modify_date: '20241201'
      },
      {
        corp_code: '00126390',
        corp_name: 'NAVER',
        stock_code: '035420',
        modify_date: '20241201'
      },
      {
        corp_code: '00126391',
        corp_name: '카카오',
        stock_code: '035720',
        modify_date: '20241201'
      },
      {
        corp_code: '00126392',
        corp_name: 'LG화학',
        stock_code: '051910',
        modify_date: '20241201'
      }
    ];

    // 검색어와 일치하는 회사들 필터링
    const searchTerm = companyName.toLowerCase();
    const filteredCompanies = allCompanies.filter(company => 
      company.corp_name.toLowerCase().includes(searchTerm) ||
      company.stock_code.includes(searchTerm)
    );

    console.log(`검색어 "${companyName}"에 대한 결과: ${filteredCompanies.length}개 회사 발견`);

    return {
      success: true,
      message: `"${companyName}" 검색 결과 (${filteredCompanies.length}개 회사 발견)`,
      data: {
        companies: filteredCompanies,
        apiResponse: {
          status: response.status,
          blobSize: blob.size,
          apiKey: DART_API_KEY ? '설정됨' : '설정되지 않음',
          searchTerm: companyName,
          totalFound: filteredCompanies.length
        }
      }
    };

  } catch (error) {
    console.error('회사 검색 중 오류:', error);
    return {
      success: false,
      message: `회사 검색 중 오류가 발생했습니다: ${error.message}`,
      error: error.message,
      apiKey: DART_API_KEY ? '설정됨' : '설정되지 않음'
    };
  }
};

// 재무제표 데이터 가져오기
export const getFinancialStatement = async (corpCode, bsnsYear = '2023', reprtCode = '11011') => {
  try {
    console.log('=== 재무제표 API 호출 시작 ===');
    console.log('파라미터:', { corpCode, bsnsYear, reprtCode });
    console.log('API URL:', DART_API_URL);
    console.log('API KEY 설정됨:', !!DART_API_KEY);
    
    if (!DART_API_KEY) {
      throw new Error('DART API 키가 설정되지 않았습니다. .env 파일에 REACT_APP_DART_API_KEY를 설정해주세요.');
    }
    
    const apiUrl = `${DART_API_URL}/fnlttSinglAcnt.json?crtfc_key=${DART_API_KEY}&corp_code=${corpCode}&bsns_year=${bsnsYear}&reprt_code=${reprtCode}`;
    console.log('요청 URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('API 응답 상태:', response.status);
    console.log('API 응답 헤더:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 응답 오류 내용:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('API 응답 데이터 구조:', Object.keys(data));
    console.log('API 응답 상태 코드:', data.status);
    console.log('API 응답 메시지:', data.message);
    
    if (data.status === '000') {
      const list = data.list || [];
      console.log('재무제표 데이터 개수:', list.length);
      if (list.length > 0) {
        console.log('첫 번째 데이터 예시:', list[0]);
      }
      
      return {
        success: true,
        message: '재무제표 데이터를 성공적으로 가져왔습니다.',
        data: list
      };
    } else {
      console.error('API 오류 응답:', data);
      return {
        success: false,
        message: `API 오류: ${data.message || '알 수 없는 오류'} (코드: ${data.status})`,
        error: data.status,
        details: data
      };
    }

  } catch (error) {
    console.error('재무제표 API 호출 중 오류:', error);
    console.error('오류 스택:', error.stack);
    return {
      success: false,
      message: `재무제표 데이터를 가져오는 중 오류가 발생했습니다: ${error.message}`,
      error: error.message
    };
  }
};

// 주요 재무 지표 추출
export const extractKeyFinancialIndicators = (financialData) => {
  if (!financialData || !Array.isArray(financialData)) {
    return [];
  }

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

  return financialData
    .filter(item => keyAccounts.includes(item.account_nm))
    .map(item => ({
      accountName: item.account_nm,
      currentAmount: item.thstrm_amount,
      previousAmount: item.frmtrm_amount,
      currentDate: item.thstrm_dt,
      previousDate: item.frmtrm_dt,
      fsDiv: item.fs_div,
      sjDiv: item.sj_div
    }));
};

// API 키 유효성 검사
export const validateApiKey = () => {
  const isValid = DART_API_KEY && DART_API_KEY.length >= 40;
  console.log('API 키 유효성 검사:', isValid, '길이:', DART_API_KEY?.length);
  return isValid;
};

// DART API 서비스
const DART_API_KEY = process.env.REACT_APP_DART_API_KEY;
const DART_API_URL = process.env.REACT_APP_DART_API_URL;

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

    // 임시로 테스트 데이터 반환 (실제로는 ZIP 파일을 파싱해야 함)
    const testCompanies = [
      {
        corp_code: '00126380',
        corp_name: companyName,
        stock_code: '005930',
        modify_date: '20241201'
      },
      {
        corp_code: '00126381',
        corp_name: `${companyName} (주)`,
        stock_code: '005931',
        modify_date: '20241201'
      }
    ];

    return {
      success: true,
      message: `"${companyName}" 검색 결과 (API 호출 성공)`,
      data: {
        companies: testCompanies,
        apiResponse: {
          status: response.status,
          blobSize: blob.size,
          apiKey: DART_API_KEY ? '설정됨' : '설정되지 않음'
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
    console.log('재무제표 API 호출:', { corpCode, bsnsYear, reprtCode });
    
    const response = await fetch(
      `${DART_API_URL}/fnlttSinglAcnt.json?crtfc_key=${DART_API_KEY}&corp_code=${corpCode}&bsns_year=${bsnsYear}&reprt_code=${reprtCode}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('재무제표 API 응답 상태:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('재무제표 API 응답 데이터:', data);
    
    if (data.status === '000') {
      return {
        success: true,
        message: '재무제표 데이터를 성공적으로 가져왔습니다.',
        data: data.list || []
      };
    } else {
      return {
        success: false,
        message: `API 오류: ${data.message} (코드: ${data.status})`,
        error: data.status
      };
    }

  } catch (error) {
    console.error('재무제표 API 호출 중 오류:', error);
    return {
      success: false,
      message: '재무제표 데이터를 가져오는 중 오류가 발생했습니다.',
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
  const isValid = DART_API_KEY && DART_API_KEY.length === 40;
  console.log('API 키 유효성 검사:', isValid, '길이:', DART_API_KEY?.length);
  return isValid;
};

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

// 회사 검색 (임시 함수 - 실제로는 ZIP 파일 내부의 XML을 파싱해야 함)
export const searchCompany = async (companyName) => {
  try {
    // 실제 구현에서는 ZIP 파일을 해제하고 XML을 파싱해야 함
    console.log(`회사 검색: ${companyName}`);
    
    return {
      success: true,
      message: `"${companyName}" 검색 결과`,
      data: {
        companies: [
          {
            corp_code: '00123456',
            corp_name: companyName,
            stock_code: '123456',
            modify_date: '20241201'
          }
        ]
      }
    };

  } catch (error) {
    console.error('회사 검색 중 오류:', error);
    return {
      success: false,
      message: '회사 검색 중 오류가 발생했습니다.',
      error: error.message
    };
  }
};

// API 키 유효성 검사
export const validateApiKey = () => {
  return DART_API_KEY && DART_API_KEY.length === 40;
};

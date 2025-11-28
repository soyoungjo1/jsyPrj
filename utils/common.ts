//에러 관리
import type { ErrorMessage } from '~/server/api/telegram/sendTelegram';

/**
 * 에러 스택에서 컴포넌트 경로 추출
 */
const extractComponentFromStack = (stack: string | undefined): string | null => {
  if (!stack) return null;
  
  // .vue 파일 경로 찾기
  const vueFileMatch = stack.match(/([^\s]+\.vue(?::\d+:\d+)?)/);
  if (vueFileMatch && vueFileMatch[1]) {
    const filePath = vueFileMatch[1];
    // 파일명만 추출하거나 전체 경로 반환
    const fileName = filePath.split('/').pop();
    return fileName || filePath;
  }
  
  // 컴포넌트 이름 패턴 찾기 (setup, render 등)
  const componentMatch = stack.match(/at\s+(\w+)\s+\(/);
  if (componentMatch && componentMatch[1]) {
    return componentMatch[1];
  }
  
  return null;
};
  
/**
 * 에러 로그를 적절하게 출력
 * @param errorType client에러인지, api에러인지 타입
 * @param error 에러 객체 (선택적)
 */
export const errorLog = (errorType: 'client' | 'api', error?: any): void => {
  //에러객체가 없는 경우 리턴
  if (!error) {
    return;
  }

  // 컴포넌트 정보 추출
  const componentInfo = extractComponentFromStack(error.stack);
  const component = componentInfo ? `[${componentInfo}]` : '';

  // 에러 객체가 있는 경우 에러 로그
  const sanitizedError: ErrorMessage = {
    message: error.message || '알 수 없는 에러',
    errorType,
    component: componentInfo || 'undefined',
    ...(error.code && { code: error.code }),
    ...(error.statusCode && { statusCode: error.statusCode })
  };

  callTelegram(sanitizedError);
  
  console.error(`${errorType} ${component}`, sanitizedError, error.stack);
};


/**
 * 에러 텔레그램 호출
 */
const callTelegram = async ( data: any ) => {
  try{
    const response = await $fetch('/api/telegram/sendTelegram', {
      method: 'POST',
      body: data
    })
    if (response && response.RESULT_CODE === '0') {
      console.log('성공함 ㅎㅎ');
    }
  }catch(error: any){
    console.error('텔레그램 호출 실패:', error);
  }
}
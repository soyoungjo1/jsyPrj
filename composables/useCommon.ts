import { useRouter } from 'vue-router';

//공통 뒤로가기
export const useCommon = () => {
  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  return {
    goBack,
  };
};


//에러 관리
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
 * @param context 로그 컨텍스트
 * @param error 에러 객체 (선택적)
 */
export const errorLog = (context: string, error?: any): void => {
  if (!error) {
    // 에러 객체가 없는 경우 경고 로그
    const warningInfo = {
      message: 'Warning: No error object provided',
      context
    };
    console.warn(`[${context}]`, warningInfo);
    return;
  }

  // 컴포넌트 정보 추출
  const componentInfo = extractComponentFromStack(error.stack);
  const component = componentInfo ? `[${componentInfo}]` : '';

  // 에러 객체가 있는 경우 에러 로그
  const sanitizedError = {
    message: error.message || 'Unknown error',
    code: error.code || 'UNKNOWN',
    context,
    component: componentInfo || 'Unknown'
  };
  console.error(`${context} ${component}`, sanitizedError, error.stack);
};
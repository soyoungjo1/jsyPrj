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
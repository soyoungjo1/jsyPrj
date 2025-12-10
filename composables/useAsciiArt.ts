/**
 * 아스키 아트 변환 composable
 */
export const useAsciiArt = () => {
  // 더 많은 아스키 문자로 그라데이션 확장
  const asciiArr = ['@', '#', '$', '%', '&', '*', '+', '=', '-', ':', ';', ',', '.', ' ', ' '];

  /**
   * RGB 배열에서 lightness 계산 
   * 역할: RGB 값을 밝기(0-100)로 변환
   */
  const calculateLightness = (arr: number[]): number => {
    const R = arr[0] ?? 0;
    const G = arr[1] ?? 0;
    const B = arr[2] ?? 0;
    const fR = R / 255.0;
    const fG = G / 255.0;
    const fB = B / 255.0;
    const cMax = Math.max(fR, fG, fB);
    const cMin = Math.min(fR, fG, fB);
    const lightness = (cMax + cMin) / 2;
    const lightnessPercent = Math.round(lightness * 100);
    return lightnessPercent;
  };

  /**
   * ImageData에서 픽셀 데이터 추출
   * Canvas ImageData에서 RGB 배열 추출
   */
  const getPixelData = (imageData: ImageData): number[][] => {
    const pixelData: number[][] = [];
    const { data } = imageData;
    for (let i = 0; i < data.length; i += 4) {
      pixelData.push([data[i] ?? 0, data[i + 1] ?? 0, data[i + 2] ?? 0]);
    }
    return pixelData;
  };

  /**
   * lightness를 아스키 문자로 변환
   * 픽셀 데이터를 아스키 문자 문자열로 변환
   */
  const lightnessToAscii = (pixelData: number[][], width: number): string => {
    let str = '';
    pixelData.forEach((rgb, idx) => {
      const lightness = calculateLightness(rgb);
      // 0-100을 0-14 범위로 매핑 (더 세밀한 그라데이션)
      const index = Math.min(Math.floor(lightness / (100 / asciiArr.length)), asciiArr.length - 1);
      str += asciiArr[index];
      if ((idx + 1) % width === 0) str += '\n';
    });
    return str;
  };

  /**
   * 이미지를 아스키 아트로 변환
   * @param imageElement 이미지 엘리먼트
   * @param width 변환할 너비
   * @param height 변환할 높이
   * @returns 아스키 아트 문자열
   */
  const convertToAscii = (imageElement: HTMLImageElement, width: number, height: number): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // 높이는 절반으로 (문자 비율 때문)
    const actualHeight = height / 2;
    canvas.width = width;
    canvas.height = actualHeight;

    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = getPixelData(imageData);
    return lightnessToAscii(pixelData, width);
  };

  /**
   * 이미지 엘리먼트를 아스키 아트로 변환하여 pre 엘리먼트에 적용
   * @param imageId 이미지 엘리먼트 ID
   * @param preId pre 엘리먼트 ID
   * @param width 변환할 너비
   * @param height 변환할 높이
   * @param maxWidth 최대 너비 제한
   * @param maxHeight 최대 높이 제한
   */
  const convertImageToAscii = (
    imageId: string,
    preId: string,
    width?: number,
    height?: number,
    maxWidth: number = 200,
    maxHeight: number = 200
  ) => {
    const img = document.getElementById(imageId) as HTMLImageElement;
    const pre = document.getElementById(preId) as HTMLPreElement;
    
    if (!img || !pre) return;

    // width, height가 없으면 이미지 원본 크기 사용
    let finalWidth = width || img.naturalWidth || 200;
    let finalHeight = height || img.naturalHeight || 200;

    // 비율 유지하면서 크기 제한
    if (finalWidth > maxWidth || finalHeight > maxHeight) {
      const ratio = Math.min(maxWidth / finalWidth, maxHeight / finalHeight);
      finalWidth = Math.floor(finalWidth * ratio);
      finalHeight = Math.floor(finalHeight * ratio);
    }

    const asciiText = convertToAscii(img, finalWidth, finalHeight);
    pre.innerText = asciiText;
  };

  return {
    convertToAscii,
    convertImageToAscii,
  };
};


import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
/**
 * 아스키 아트 > 이미지 변환 스크롤
 */
export const asciiScrollImg = (wrapper: HTMLElement | null, preId: string, imgId: string) => {
  if (!wrapper) return;
  
  const pre = document.getElementById(preId);
  const img = document.getElementById(imgId);
  
  if (!pre || !img) return;
  
  // 아스키 아트 → 이미지 전환 애니메이션
  // 스크롤 진행도에 따라 그라데이션처럼 부드럽게 전환
  gsap.timeline({
    scrollTrigger: {
      trigger: wrapper,
      start: "top bottom",   // 요소가 뷰포트 하단에 나타날 때 시작
      end: "bottom top",      // 요소가 뷰포트 상단을 벗어날 때 종료
      scrub: 1,               // 부드러운 스크롤 연동 (값이 클수록 더 부드러움)
      markers: false,         // 디버깅용 마커 (필요시 true)
    }
  })
  // 아스키 아트 페이드아웃 (점진적으로 사라짐)
  .to(pre, {
    opacity: 0,
    filter: "blur(2px)",      // 사라질 때 약간의 블러 효과
    duration: 1,
    ease: "power2.inOut",     // 부드러운 이징
  }, 0)
  // 이미지 페이드인 (점진적으로 나타남)
  .fromTo(img, 
    {
      opacity: 0,
      filter: "blur(5px)",    // 시작 시 블러 효과
      scale: 0.98,            // 약간 작게 시작
    },
    {
      opacity: 1,
      filter: "blur(0px)",     // 선명하게 전환
      scale: 1,                // 원래 크기로
      duration: 1,
      ease: "power2.inOut",    // 부드러운 이징
    }, 
    0.2  // 약간 늦게 시작하여 겹치는 효과
  )
}

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import type { AsciiFilterOptions } from '~/composables/useAsciiFilter'
import { applyAsciiFilters } from '~/composables/useAsciiFilter'

gsap.registerPlugin(ScrollTrigger)

/** 필터 타입·함수·프리셋은 `useAsciiFilter.ts`에서 import */
export type { AsciiFilterOptions } from '~/composables/useAsciiFilter'
export { ASCII_FILTER_PRESET_ONLINE, applyAsciiFilters } from '~/composables/useAsciiFilter'

/**
 * @fileoverview 이미지 → ASCII 변환 (선택적 캔버스 필터는 `useAsciiFilter` 참고)
 *
 * ## 필터를 쓸 때 호출 예시
 *
 * ```ts
 * import type { AsciiFilterOptions } from '~/composables/useAsciiFilter'
 * import { useAsciiArt } from '~/composables/useAsciiArt'
 * import { ASCII_FILTER_PRESET_ONLINE } from '~/composables/useAsciiFilter'
 *
 * const { convertImageToAscii } = useAsciiArt()
 *
 * convertImageToAscii('img-id', 'pre-id', undefined, undefined, 62, 120, {
 *   brightness: 44,
 *   contrast: 200,
 * })
 *
 * convertImageToAscii('img-id', 'pre-id', undefined, undefined, 87, 120, {
 *   ...ASCII_FILTER_PRESET_ONLINE,
 * })
 * ```
 */

/**
 * 아스키 아트 변환 composable
 * - `convertToAscii` / `convertImageToAscii`의 마지막 인자에 `AsciiFilterOptions`를 넘기면 필터 적용
 * - `filters`가 없거나 빈 객체이면 필터 생략 (기존 동작)
 */
export const useAsciiArt = () => {
  const asciiArr = ['@', '#', '$', '%', '&', '*', '+', '=', '-', ':', ';', ',', '.', ' ', ' ']

  /** RGB 배열의 밝기(0~100)를 계산해 ASCII 문자 인덱스에 사용 */
  const calculateLightness = (arr: number[]): number => {
    const R = arr[0] ?? 0
    const G = arr[1] ?? 0
    const B = arr[2] ?? 0
    const fR = R / 255.0
    const fG = G / 255.0
    const fB = B / 255.0
    const cMax = Math.max(fR, fG, fB)
    const cMin = Math.min(fR, fG, fB)
    const lightness = (cMax + cMin) / 2
    return Math.round(lightness * 100)
  }

  /** ImageData에서 RGB 튜플 배열로 변환 */
  const getPixelData = (imageData: ImageData): number[][] => {
    const pixelData: number[][] = []
    const { data } = imageData
    for (let i = 0; i < data.length; i += 4) {
      pixelData.push([data[i] ?? 0, data[i + 1] ?? 0, data[i + 2] ?? 0])
    }
    return pixelData
  }

  /** 픽셀별 밝기 → asciiArr 문자로 매핑, width마다 줄바꿈 */
  const lightnessToAscii = (pixelData: number[][], width: number): string => {
    let str = ''
    pixelData.forEach((rgb, idx) => {
      const lightness = calculateLightness(rgb)
      const index = Math.min(Math.floor(lightness / (100 / asciiArr.length)), asciiArr.length - 1)
      str += asciiArr[index]
      if ((idx + 1) % width === 0) str += '\n'
    })
    return str
  }

  /**
   * HTMLImageElement를 캔버스에 그린 뒤 ASCII 문자열로 변환
   * @param filters 선택. 키가 하나라도 있으면 `applyAsciiFilters` 적용
   */
  const convertToAscii = (
    imageElement: HTMLImageElement,
    width: number,
    height: number,
    filters?: AsciiFilterOptions,
  ): string => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    const actualHeight = height / 2
    canvas.width = width
    canvas.height = actualHeight

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height)
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    if (filters && Object.keys(filters).length > 0) {
      imageData = applyAsciiFilters(imageData, filters)
    }

    const pixelData = getPixelData(imageData)
    return lightnessToAscii(pixelData, width)
  }

  /**
   * id로 `img`/`pre`를 찾아 ASCII를 `pre`에 넣음
   * @param maxWidth 최대 가로 문자 수(해상도)
   * @param maxHeight 최대 세로(내부에서 절반으로 샘플링)
   * @param filters 선택적 필터
   */
  const convertImageToAscii = (
    imageId: string,
    preId: string,
    width?: number,
    height?: number,
    maxWidth: number = 200,
    maxHeight: number = 200,
    filters?: AsciiFilterOptions,
  ) => {
    const img = document.getElementById(imageId) as HTMLImageElement
    const pre = document.getElementById(preId) as HTMLPreElement

    if (!img || !pre) return

    let finalWidth = width || img.naturalWidth || 200
    let finalHeight = height || img.naturalHeight || 200

    if (finalWidth > maxWidth || finalHeight > maxHeight) {
      const ratio = Math.min(maxWidth / finalWidth, maxHeight / finalHeight)
      finalWidth = Math.floor(finalWidth * ratio)
      finalHeight = Math.floor(finalHeight * ratio)
    }

    const asciiText = convertToAscii(img, finalWidth, finalHeight, filters)
    pre.innerText = asciiText
  }

  return {
    convertToAscii,
    convertImageToAscii,
    applyAsciiFilters,
  }
}

/**
 * 스크롤에 따라 `<pre>` ASCII 아트를 페이드아웃하고 실제 `<img>`를 페이드인
 */
export const asciiScrollImg = (wrapper: HTMLElement | null, preId: string, imgId: string) => {
  if (!wrapper) return

  const pre = document.getElementById(preId)
  const img = document.getElementById(imgId)

  if (!pre || !img) return

  gsap.timeline({
    scrollTrigger: {
      trigger: wrapper,
      start: 'top 30%',
      end: 'bottom top',
      scrub: 0.05,
      markers: false,
    },
  })
    .to(pre, {
      opacity: 0,
      filter: 'blur(2px)',
      duration: 0.2,
      ease: 'power1.inOut',
    }, 0)
    .fromTo(img,
      {
        opacity: 0,
        filter: 'blur(5px)',
        scale: 0.98,
      },
      {
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
        duration: 0.5,
        ease: 'power1.inOut',
      },
      0.1,
    )
}

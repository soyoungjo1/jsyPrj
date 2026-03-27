/**
 * @fileoverview ASCII 변환 전 캔버스 ImageData에 적용하는 픽셀 필터
 *
 * ## 사용 예시
 *
 * ```ts
 * import type { AsciiFilterOptions } from '~/composables/useAsciiFilter'
 * import { applyAsciiFilters, ASCII_FILTER_PRESET_ONLINE } from '~/composables/useAsciiFilter'
 *
 * const filtered = applyAsciiFilters(imageData, { contrast: 150 })
 * const filtered2 = applyAsciiFilters(imageData, { ...ASCII_FILTER_PRESET_ONLINE })
 * ```
 *
 * `useAsciiArt`의 `convertImageToAscii` 마지막 인자로도 동일한 `AsciiFilterOptions`를 넘길 수 있음.
 */

/**
 * 온라인 ASCII 생성기와 비슷한 조건 (밝기·대비·채도·색조·그레이스케일·반전 등)
 * 수치는 캔버스에서 근사 적용합니다. (웹 도구와 픽셀 단위 일치는 보장 안 함)
 */
export interface AsciiFilterOptions {
  /** 밝기 % (CSS brightness와 유사, 100 = 원본) */
  brightness?: number
  /** 대비 % (100 = 원본, 200 = 2배 대비) */
  contrast?: number
  /** 채도 % (100 = 유지, 54 등으로 채도 조절) */
  saturation?: number
  /** 색조 회전 (도) */
  hue?: number
  /** 그레이스케일 믹스 % (0 = 컬러 유지, 100 = 완전 흑백) */
  grayscale?: number
  /** 세피아 % */
  sepia?: number
  /** 색 반전 믹스 % (0 = 없음, 100 = 완전 반전) */
  invert?: number
}

/** 스크린샷 기준 프리셋 (Characters 87은 maxWidth로 별도 지정) */
export const ASCII_FILTER_PRESET_ONLINE = {
  brightness: 44,
  contrast: 200,
  saturation: 54,
  hue: 171,
  grayscale: 8,
  sepia: 0,
  invert: 3,
} as const satisfies AsciiFilterOptions

/** 0~255 범위로 클램프 */
const clamp255 = (v: number): number => {
  return Math.max(0, Math.min(255, Math.round(v)))
}

/** RGB(0~255)를 HSL로 변환. H, S, L은 0~1. */
const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }
  return [h, s, l]
}

/** HSL(0~1)을 RGB(0~255)로 변환 */
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  let r: number
  let g: number
  let b: number

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      let tt = t
      if (tt < 0) tt += 1
      if (tt > 1) tt -= 1
      if (tt < 1 / 6) return p + (q - p) * 6 * tt
      if (tt < 1 / 2) return q
      if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

/** 세피아 톤을 amount(0~100)%만큼 원본 색과 블렌딩 */
const applySepia = (r: number, g: number, b: number, amount: number): [number, number, number] => {
  const t = amount / 100
  const sr = r * 0.393 + g * 0.769 + b * 0.189
  const sg = r * 0.349 + g * 0.686 + b * 0.168
  const sb = r * 0.272 + g * 0.534 + b * 0.131
  return [
    r + (sr - r) * t,
    g + (sg - g) * t,
    b + (sb - b) * t,
  ]
}

/**
 * ImageData 픽셀에 밝기·대비·HSL·그레이스케일·세피아·반전 필터를 순서대로 적용한 새 ImageData 반환
 * (원본 버퍼는 수정하지 않음)
 */
export const applyAsciiFilters = (
  imageData: ImageData,
  opts: AsciiFilterOptions = {},
): ImageData => {
  const {
    brightness = 100,
    contrast = 100,
    saturation = 100,
    hue = 0,
    grayscale = 0,
    sepia = 0,
    invert = 0,
  } = opts

  const data = imageData.data
  const out = new ImageData(imageData.width, imageData.height)
  const od = out.data

  const brMul = brightness / 100
  const ctMul = contrast / 100
  const satMul = saturation / 100
  const hueShift = (hue % 360) / 360
  const grayMix = grayscale / 100
  const sep = sepia
  const invMix = invert / 100

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i] ?? 0
    let g = data[i + 1] ?? 0
    let b = data[i + 2] ?? 0
    const a = data[i + 3] ?? 255

    r *= brMul
    g *= brMul
    b *= brMul

    r = (r - 128) * ctMul + 128
    g = (g - 128) * ctMul + 128
    b = (b - 128) * ctMul + 128

    r = clamp255(r)
    g = clamp255(g)
    b = clamp255(b)

    let [h, s, l] = rgbToHsl(r, g, b)
    h = (h + hueShift + 1) % 1
    s = Math.min(1, s * satMul)
    ;[r, g, b] = hslToRgb(h, s, l)

    if (grayMix > 0) {
      const y = 0.299 * r + 0.587 * g + 0.114 * b
      r = r + (y - r) * grayMix
      g = g + (y - g) * grayMix
      b = b + (y - b) * grayMix
    }

    if (sep > 0) {
      ;[r, g, b] = applySepia(r, g, b, sep)
    }

    if (invMix > 0) {
      r = r + (255 - r - r) * invMix
      g = g + (255 - g - g) * invMix
      b = b + (255 - b - b) * invMix
    }

    od[i] = clamp255(r)
    od[i + 1] = clamp255(g)
    od[i + 2] = clamp255(b)
    od[i + 3] = a
  }

  return out
}

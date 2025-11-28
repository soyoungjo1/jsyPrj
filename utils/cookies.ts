// utils/cookies.ts

import { useCookie } from 'nuxt/app'
import type { CookieOptions } from 'nuxt/app'

export const setCookie = (name: string, value: string, options?: CookieOptions) => {
  const cookie = useCookie(name, { ...options, readonly: false })
  cookie.value = value
}

export const getCookie = (name: string, options?: CookieOptions) => {
  const cookie = useCookie(name, { ...options, readonly: true })
  return cookie.value
}

export const removeCookie = (name: string, options?: CookieOptions) => {
  const cookie = useCookie(name, { ...options, readonly: false })
  cookie.value = null
}
import { errorLog } from '~/utils/common'
// utils/api.ts 정의:::::

//get요청
export const sendGet = async <T = any>(url: string, params: Record<string, any> = {}) => {
  const config = useRuntimeConfig()
  const query = new URLSearchParams(params).toString()
  const fullUrl = `${config.public.apiBase}${url}${query ? `?${query}` : ''}`
  
  // 토큰 가져오기
  //const token = useCookie('APPSESSID').value

  try {
    const res = await $fetch<T>(fullUrl, {
      method: 'GET',
      // headers: {
      //   ...(token && { 'Authorization': `Bearer ${token}` })
      // }
    })
    return res
  } catch (error) {
    errorLog('api', error)
    throw error
  }
}

//post요청
export const sendPost = async <T = any>(url: string, body: Record<string, any> = {}) => {
  const config = useRuntimeConfig()
  const fullUrl = `${config.public.apiBase}${url}`
  
  // 토큰 가져오기
  //const token = useCookie('APPSESSID').value

  try {
    const res = await $fetch<T>(fullUrl, {
      method: 'POST',
      body,
      // headers: {
      //   ...(token && { 'Authorization': `Bearer ${token}` })
      // }
    })
    return res
  } catch (error) {
    errorLog('api', error)
    throw error
  }
}
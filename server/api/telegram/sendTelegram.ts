import { H3Event } from 'h3'

/**
 * 
 * 에러 타입:
 * - 'client': 클라이언트에러
 * - 'api': api호출시 에러
 */

export interface ErrorMessage {
  errorType : 'client' | 'api',
  message : string,
  component : string,
  statusCode?: number
  code?: number
}

/**
 * 에러 정보 수집 및 텔레그램 알림 전송
 */
export default defineEventHandler(async (event: H3Event) => {
  try{
    const body = await readBody(event) as ErrorMessage
    console.log('body::::::::::', body);
    const config = useRuntimeConfig()
    const telegramBotToken = config.TELEGRAM_BOT_TOKEN;
    const telegramChatId = config.TELEGRAM_CHAT_ID;

    if (!telegramBotToken || !telegramChatId) {
      console.error('텔레그램 설정 누락: BOT_TOKEN 또는 CHAT_ID가 없습니다.');
      return {
        RESULT_CODE: '400',
        RESULT_MESSAGE: '텔레그램 설정 누락',
        DATA: null
      }
    }

    // 에러 타입별 이모지 및 설명
    const errorTypeEmoji: Record<string, { emoji: string; label: string }> = {
      client: { emoji: '🤢', label: 'client에러' },
      api: { emoji: '🥵', label: 'api에러' },
    }
    const errorInfo = errorTypeEmoji[body.errorType] || { emoji: '❌', label: '알 수 없는 에러' }
    const emoji = errorInfo.emoji

    // 텔레그램 HTML 특수문자 escape 함수
    const escapeHtml = (text: string): string => {
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    // 텔레그램 메시지 포맷팅
    const message = `${emoji} <b>에러 알림 - ${errorInfo.label}</b>\n` +
      `<b>에러 타입:</b> ${escapeHtml(body.errorType)}\n` +
      `<b>메시지:</b> ${escapeHtml(body.message)}\n` +
      (body.component ? `<b>에러발생 컴포넌트:</b> ${escapeHtml(body.component)}\n` : '') +
      (body.statusCode ? `<b>에러코드:</b> ${escapeHtml(String(body.statusCode))}\n` : '');

    // 텔레그램 API 호출
    const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`

    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })

    const result = await response.json();

    if (result.ok) {
      return {
        RESULT_CODE: '0',
        RESULT_MESSAGE: '성공',
        DATA: result
      }
    } else {
      return {
        RESULT_CODE: '400',
        RESULT_MESSAGE: '실패',
        DATA: result
      }
    }
  }catch(error: any){
    console.error('텔레그램 전송 에러:', error);
    return {
      RESULT_CODE: '500',
      RESULT_MESSAGE: error?.message || '텔레그램 전송 실패',
      DATA: null
    }
  }
})
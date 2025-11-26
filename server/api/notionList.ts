import { defineEventHandler, getQuery } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const databaseId = query.databaseId as string

  const res = await axios.post(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    {}, // 쿼리 조건 없으면 전체 조회
    {
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        'Notion-Version': process.env.NOTION_VERSION || '2022-06-28',
        'Content-Type': 'application/json',
      }
    }
  )

  return res.data
})

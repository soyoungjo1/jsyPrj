// server/api/notion-block.ts
import { defineEventHandler, getQuery } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event)

  if (!id) return { error: 'No ID provided' }

  const res = await axios.get(`https://api.notion.com/v1/blocks/${id}/children`, {
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      'Notion-Version': process.env.NOTION_VERSION || '2022-06-28',
      'Content-Type': 'application/json',
    },
    params: {
      page_size: 100,
    }
  })

  return res.data
})


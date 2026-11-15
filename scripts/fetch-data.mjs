// 从后端把诗人数据抓下来，写成 public/data.json 静态快照。
// 目的：GitHub Pages 是纯静态托管，没有 Node 后端，线上页面读不到 /api。
// 用法：npm run data  （CI 里也会跑一次，失败不阻塞部署，用仓库里的快照兜底）
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const STU_ID = process.env.STU_ID || '2529425'
const API_ORIGIN = process.env.POET_API || 'http://106.13.165.42:3000'
const url = `${API_ORIGIN}/data?id=${STU_ID}`
const outFile = fileURLToPath(new URL('../public/data.json', import.meta.url))

const res = await fetch(url, { signal: AbortSignal.timeout(20000) })
if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} <- ${url}`)

const text = await res.text()
// 必须先验证是 JSON，否则一旦接口返回错误页，会把整页 HTML 写进快照
const data = JSON.parse(text)

const body = JSON.stringify(data)
await writeFile(outFile, body, 'utf8')
console.log(`[fetch-data] ${url} -> public/data.json  (${data.Title || '?'}, ${Buffer.byteLength(body)} bytes)`)

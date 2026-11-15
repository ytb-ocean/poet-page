<template>
  <div class="container">
    <div v-if="loading" class="tip">正在加载诗人数据...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="poet">
      <h1 class="title">{{ poet.Title }}</h1>
      <div class="card-header">
        <img :src="poet.Intro.portraitData" alt="诗人头像" class="avatar">
        <div>
          <h2>{{ poet.Header.name }}</h2>
          <p class="sub">{{ poet.Header.subtitle }}</p>
        </div>
      </div>

      <div class="block">
        <h3>简介</h3>
        <p>{{ poet.Intro.description }}</p>
        <div class="fact-list">
          <span v-for="item in poet.Intro.facts" :key="item.keyword" class="fact-item">
            {{ item.keyword }}：{{ item.value }}
          </span>
        </div>
      </div>

      <div class="block">
        <h3>生平大事</h3>
        <div v-for="item in poet.Timeline" :key="item.time" class="time-item">
          <span class="time">{{ item.time }}</span>：{{ item.action }}
        </div>
      </div>

      <div class="block">
        <h3>代表作品</h3>
        <div v-for="item in poet.Poems" :key="item.title" class="poem-item">
          《{{ item.title }}》：{{ item.line }}
        </div>
      </div>

      <div class="block">
        <h3>名句摘录</h3>
        <div v-for="sentence in poet.Quotes" :key="sentence" class="quote">
          {{ sentence }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const poet = ref(null)
const error = ref('')
const loading = ref(true)
const stuId = '2529425'

// GitHub Pages 只托管静态文件，没有 Node 后端，线上访问 /api/data 必然 404。
// 所以优先读随构建一起上线的静态快照 public/data.json（npm run data 生成），
// 本地 npm run dev 且还没有快照时，再回退到 vite 代理的 /api。
const loadSnapshot = () =>
  fetch(`${import.meta.env.BASE_URL}data.json`, { cache: 'no-cache' }).then(res => {
    if (!res.ok) throw new Error(`data.json ${res.status}`)
    return res.json()
  })

const loadApi = () =>
  fetch(`/api/data?id=${stuId}`)
    .then(res => {
      if (!res.ok) throw new Error(`api ${res.status}`)
      return res.text()
    })
    .then(text => JSON.parse(text))

onMounted(() => {
  loadSnapshot()
    .catch(() => loadApi())
    .then(data => {
      poet.value = data
    })
    .catch(err => {
      console.error('[poet-page] 诗人数据加载失败', err)
      error.value = '诗人数据加载失败，请稍后刷新重试。'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 30px auto;
  padding: 0 20px;
  font-family: "Microsoft Yahei", sans-serif;
}
.tip, .error {
  text-align: center;
  font-size: 18px;
  margin-top: 40px;
}
.error {
  color: #d33;
}
.title {
  text-align: center;
  color: #2c3e50;
}
.card-header {
  display: flex;
  gap: 24px;
  align-items: center;
  margin: 30px 0;
}
.avatar {
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 2px 8px #ccc;
}
.sub {
  color: #666;
}
.block {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}
h3 {
  border-left: 4px solid #3498db;
  padding-left: 10px;
  color: #2c3e50;
}
.fact-list {
  margin-top: 10px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.fact-item {
  background: #fff;
  padding: 4px 10px;
  border-radius: 6px;
}
.time-item, .poem-item {
  margin: 10px 0;
  line-height: 1.6;
}
.time {
  font-weight: bold;
  color: #2980b9;
}
.quote {
  margin: 10px 0;
  font-style: italic;
  color: #8e44ad;
}
</style>

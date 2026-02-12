<template>
  <header class="site-header">
    <div class="header-inner">
      <div class="header-left">
        <span class="rec-label">REC</span>
        <span class="rec-time">{{ recTime }}</span>
      </div>
      <div class="header-center">
        <NuxtLink to="/" class="brand">©YA_SOYOUNG_A FRONTDEV</NuxtLink>
      </div>
      <nav class="header-right">
        <NuxtLink to="/about" class="nav-link">
          <span class="menu_text">ABOUT</span>
          <span class="menu_text2">ABOUT</span>
        </NuxtLink>
        <NuxtLink to="/docs" class="nav-link">
          <span class="menu_text">DOCS</span>
          <span class="menu_text2">DOCS</span>
        </NuxtLink>
        <NuxtLink to="/works" class="nav-link">
          <span class="menu_text">WORK</span>
          <span class="menu_text2">WORK</span>
        </NuxtLink>
        <NuxtLink to="/contact" class="nav-link">
          <span class="menu_text">CONTACT</span>
          <span class="menu_text2">CONTACT</span>
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const

const recTime = ref('')

function updateRecTime() {
  const now = new Date()
  const day = DAYS[now.getDay()]
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  const s = String(now.getSeconds()).padStart(2, '0')
  recTime.value = `${day}${h}:${m}:${s}`
}

let interval: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  updateRecTime()
  interval = setInterval(updateRecTime, 1000)
})
onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<style lang="scss" scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 99999;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 12px 24px;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #222;
}

.header-left {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.rec-label {
  margin-right: 4px;
}

.rec-time {
  font-variant-numeric: tabular-nums;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 0;
}

.brand {
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
  &:hover {
    text-decoration: underline;
  }
}

.header-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  min-width: 0;
}

.nav-link {
  position: relative;
  display: inline-block;
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
  transform-style: preserve-3d;
}

.menu_text,
.menu_text2 {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
  font-family: inherit;
}

.menu_text {
  display: inline-block;
  transition-duration: 0.3s;
}

.nav-link:hover .menu_text {
  transform: translateY(-10px) rotateX(90deg);
}

.menu_text2 {
  position: absolute;
  right: 0;
  top: 10px;
  transform: translateZ(20px) rotateX(90deg);
  transform-origin: center center;
  transition-duration: 0.3s;
  pointer-events: none;
}

.nav-link:hover .menu_text2 {
  top: 0;
  transform: translateZ(0) rotateX(0deg);
}

.nav-link.router-link-active .menu_text2 {
  text-decoration: line-through;
}
</style>

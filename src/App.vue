<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

type ChartPanel = {
  key: string
  title: string
  subtitle: string
  colorClass: string
  areaClass: string
  values: number[]
}

type ChartPoint = {
  x: number
  y: number
  value: number
  index: number
}

type HoverState = {
  x: number
  y: number
  value: number
  index: number
} | null

type KlineCandle = {
  open: number
  high: number
  low: number
  close: number
}

type KlineHoverState = {
  index: number
  x: number
  y: number
  candle: KlineCandle
} | null

const theme = ref<'light' | 'dark'>('light')

const isDark = computed(() => theme.value === 'dark')

const setTheme = (nextTheme: 'light' | 'dark') => {
  theme.value = nextTheme
  document.documentElement.classList.toggle('dark', nextTheme === 'dark')
}

const toggleTheme = () => {
  setTheme(isDark.value ? 'light' : 'dark')
}

onMounted(() => {
  const cachedTheme = localStorage.getItem('stock-ui-theme')
  if (cachedTheme === 'dark' || cachedTheme === 'light') {
    setTheme(cachedTheme)
    return
  }

  const preferDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  setTheme(preferDark ? 'dark' : 'light')
})

watch(theme, (value) => {
  localStorage.setItem('stock-ui-theme', value)
})

const stockList = ref([
  { code: '000001', name: '平安银行', price: 12.56, change: 3.25, percent: '+2.65%', industry: '银行' },
  { code: '000002', name: '万科A', price: 15.32, change: -1.22, percent: '-1.89%', industry: '地产' },
  { code: '000003', name: '国华网安', price: 8.89, change: 0.00, percent: '0.00%', industry: '软件' },
  { code: '000004', name: '国农科技', price: 22.10, change: 5.60, percent: '+3.52%', industry: '医药' },
  { code: '000005', name: '世纪星源', price: 3.76, change: -0.85, percent: '-4.21%', industry: '环保' },
])

const searchKey = ref('')
const activeTab = ref('all')
const activeMarket = ref('全部')
const activePublishWindow = ref('近一周')
const activeRegion = ref('全部')
const activeReportType = ref('行业研究')
const activeSort = ref('综合排序')

const chartPanels = ref<ChartPanel[]>([
  {
    key: 'intraday',
    title: '分时走势',
    subtitle: '上证指数 · 9:30 - 15:00',
    colorClass: 'text-rise',
    areaClass: 'fill-red-500/15 dark:fill-red-400/10',
    values: [3210, 3222, 3216, 3233, 3240, 3231, 3248, 3256, 3251, 3262, 3270, 3264],
  },
  {
    key: 'daily-k',
    title: '日线趋势',
    subtitle: '近12交易日收盘价',
    colorClass: 'text-sky-500',
    areaClass: 'fill-sky-500/15 dark:fill-sky-400/10',
    values: [12.1, 12.3, 12.25, 12.4, 12.65, 12.58, 12.72, 12.68, 12.9, 13.05, 13.18, 13.26],
  },
  {
    key: 'capital-flow',
    title: '主力资金',
    subtitle: '当日净流入（万元）',
    colorClass: 'text-emerald-500',
    areaClass: 'fill-emerald-500/15 dark:fill-emerald-400/10',
    values: [120, 132, 118, 149, 170, 164, 188, 210, 204, 218, 233, 246],
  },
  {
    key: 'sector-heat',
    title: '板块热度',
    subtitle: '热门板块强度指数',
    colorClass: 'text-amber-500',
    areaClass: 'fill-amber-500/15 dark:fill-amber-400/10',
    values: [61, 64, 68, 66, 71, 75, 73, 78, 82, 84, 81, 86],
  },
])

const platformSections = [
  { title: '竞价', items: ['竞价异动', '竞价强度'] },
  { title: '挖掘', items: ['个股挖掘', '概念检索', '研报检索'] },
  { title: '复盘', items: ['每日复盘', '板块轮动', '龙头高度', '连板天梯'] },
  { title: '热点', items: ['热点聚焦', '聚合热搜'] },
]

const quickEntries = ['语音快讯', '看盘插件', '涨停表现', '龙虎榜', 'PC端版面', '联系客服']

const marketScopes = ['沪市主板', '深市主板', '创业板', '科创板', '北交所', '全部']
const publishWindows = ['近三天', '近一周', '近一月', '近半年', '近一年', '全部']
const regionOptions = [
  '广东', '北京', '上海', '四川', '浙江', '陕西', '安徽', '江苏', '福建', '山东', '湖北', '河南',
  '湖南', '江西', '河北', '天津', '贵州', '吉林', '海南', '山西', '重庆', '云南', '辽宁', '甘肃',
  '青海', '西藏', '宁夏', '广西', '新疆', '内蒙', '黑龙江', '全部',
]
const reportTypes = ['行业研究', '公司研究', '招股说明书', '年报季报', '政策法规', '宏观策略', '管理咨询']
const highlightTags = ['新鲜出炉', '深度研究', '热门研报', '仅券商']

const miningRows = ref([
  { name: '平安银行', code: '000001', match: '银行数字化转型', marketCap: '2,265亿', change: '+2.65%' },
  { name: '万科A', code: '000002', match: '地产修复预期', marketCap: '1,740亿', change: '-1.89%' },
  { name: '国华网安', code: '000004', match: '数据安全', marketCap: '95亿', change: '+3.52%' },
])

const hotRows = ref([
  { code: '300308', name: '中际旭创', change: '+6.12%', marketCap: '1,238亿', popularity: '92', abnormal: 4 },
  { code: '002594', name: '比亚迪', change: '+3.08%', marketCap: '7,620亿', popularity: '96', abnormal: 5 },
  { code: '601127', name: '赛力斯', change: '-1.12%', marketCap: '1,958亿', popularity: '88', abnormal: 2 },
  { code: '600519', name: '贵州茅台', change: '+0.66%', marketCap: '20,580亿', popularity: '85', abnormal: 1 },
])

const ladderRows = ref([
  { stage: '首板', rate: '42%' },
  { stage: '2连板', rate: '35%' },
  { stage: '3连板', rate: '22%' },
  { stage: '4连板+', rate: '12%' },
])

const chartWidth = 480
const chartHeight = 180
const chartPadding = 18
let chartTimer: ReturnType<typeof setInterval> | null = null

const hoverMap = ref<Record<string, HoverState>>({})
const klineHover = ref<KlineHoverState>(null)

const klineCandles = ref<KlineCandle[]>([
  { open: 12.12, high: 12.3, low: 12.01, close: 12.24 },
  { open: 12.24, high: 12.38, low: 12.18, close: 12.2 },
  { open: 12.2, high: 12.42, low: 12.08, close: 12.36 },
  { open: 12.36, high: 12.5, low: 12.28, close: 12.44 },
  { open: 12.44, high: 12.58, low: 12.32, close: 12.35 },
  { open: 12.35, high: 12.63, low: 12.31, close: 12.59 },
  { open: 12.59, high: 12.71, low: 12.48, close: 12.53 },
  { open: 12.53, high: 12.76, low: 12.41, close: 12.67 },
  { open: 12.67, high: 12.79, low: 12.55, close: 12.61 },
  { open: 12.61, high: 12.88, low: 12.58, close: 12.81 },
  { open: 12.81, high: 12.96, low: 12.73, close: 12.9 },
  { open: 12.9, high: 13.02, low: 12.8, close: 12.86 },
])

const getChartPoints = (values: number[]): ChartPoint[] => {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  return values.map((value, index) => {
    const x = chartPadding + (index * (chartWidth - chartPadding * 2)) / Math.max(values.length - 1, 1)
    const y = chartHeight - chartPadding - ((value - min) / range) * (chartHeight - chartPadding * 2)
    return { x, y, value, index }
  })
}

const getPolylinePoints = (values: number[]) => {
  return getChartPoints(values)
    .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join(' ')
}

const getPointByIndex = (values: number[], index: number) => {
  const points = getChartPoints(values)
  if (!points.length) return null
  return points[Math.min(Math.max(index, 0), points.length - 1)]
}

const getHoverTooltipStyle = (panelKey: string) => {
  const hover = hoverMap.value[panelKey]
  if (!hover) return {}

  const left = Math.min(Math.max(hover.x + 14, 12), chartWidth - 120)
  const top = Math.min(Math.max(hover.y - 56, 8), chartHeight - 56)

  return {
    left: `${left}px`,
    top: `${top}px`,
  }
}

const updatePanelValue = (panel: ChartPanel) => {
  const lastValue = panel.values[panel.values.length - 1] ?? 0
  const volatility = Math.max(Math.abs(lastValue) * 0.008, 0.5)
  const nextValue = Number(Math.max(lastValue + (Math.random() - 0.5) * volatility * 2, 0.01).toFixed(2))
  panel.values = [...panel.values.slice(1), nextValue]
}

const handleChartMove = (event: MouseEvent, panel: ChartPanel) => {
  const target = event.currentTarget as SVGElement | null
  if (!target) return

  const rect = target.getBoundingClientRect()
  const mouseX = ((event.clientX - rect.left) / rect.width) * chartWidth
  const ratio = (mouseX - chartPadding) / (chartWidth - chartPadding * 2)
  const pointIndex = Math.round(Math.min(Math.max(ratio, 0), 1) * (panel.values.length - 1))
  const point = getPointByIndex(panel.values, pointIndex)
  if (!point) return

  hoverMap.value[panel.key] = {
    x: point.x,
    y: point.y,
    value: point.value,
    index: point.index,
  }
}

const clearChartHover = (panelKey: string) => {
  hoverMap.value[panelKey] = null
}

const getKlineMinMax = (candles: KlineCandle[]) => {
  const lows = candles.map((item) => item.low)
  const highs = candles.map((item) => item.high)
  return {
    min: Math.min(...lows),
    max: Math.max(...highs),
  }
}

const getPriceY = (price: number, min: number, max: number) => {
  const range = max - min || 1
  return chartHeight - chartPadding - ((price - min) / range) * (chartHeight - chartPadding * 2)
}

const getKlineGeometry = (candles: KlineCandle[]) => {
  const { min, max } = getKlineMinMax(candles)
  const slot = (chartWidth - chartPadding * 2) / Math.max(candles.length, 1)
  const bodyWidth = Math.max(slot * 0.54, 6)

  return candles.map((candle, index) => {
    const centerX = chartPadding + slot * index + slot / 2
    const openY = getPriceY(candle.open, min, max)
    const closeY = getPriceY(candle.close, min, max)
    const highY = getPriceY(candle.high, min, max)
    const lowY = getPriceY(candle.low, min, max)
    const bodyTop = Math.min(openY, closeY)
    const bodyHeight = Math.max(Math.abs(openY - closeY), 1.6)

    return {
      index,
      centerX,
      bodyX: centerX - bodyWidth / 2,
      bodyTop,
      bodyHeight,
      highY,
      lowY,
      candle,
      isRise: candle.close >= candle.open,
    }
  })
}

const updateKlineCandles = () => {
  const last = klineCandles.value[klineCandles.value.length - 1]
  if (!last) return

  const open = Number((last.close + (Math.random() - 0.5) * 0.16).toFixed(2))
  const close = Number((open + (Math.random() - 0.5) * 0.26).toFixed(2))
  const high = Number((Math.max(open, close) + Math.random() * 0.14).toFixed(2))
  const low = Number((Math.max(Math.min(open, close) - Math.random() * 0.14, 0.1)).toFixed(2))

  klineCandles.value = [...klineCandles.value.slice(1), { open, high, low, close }]
}

const handleKlineMove = (event: MouseEvent) => {
  const target = event.currentTarget as SVGElement | null
  if (!target) return

  const rect = target.getBoundingClientRect()
  const mouseX = ((event.clientX - rect.left) / rect.width) * chartWidth
  const slot = (chartWidth - chartPadding * 2) / Math.max(klineCandles.value.length, 1)
  const ratioX = Math.min(Math.max(mouseX - chartPadding, 0), chartWidth - chartPadding * 2)
  const index = Math.min(Math.floor(ratioX / slot), klineCandles.value.length - 1)
  const geometry = getKlineGeometry(klineCandles.value)[index]
  if (!geometry) return

  klineHover.value = {
    index,
    x: geometry.centerX,
    y: (geometry.highY + geometry.lowY) / 2,
    candle: geometry.candle,
  }
}

const clearKlineHover = () => {
  klineHover.value = null
}

const getKlineTooltipStyle = () => {
  if (!klineHover.value) return {}
  const left = Math.min(Math.max(klineHover.value.x + 14, 10), chartWidth - 150)
  const top = Math.min(Math.max(klineHover.value.y - 62, 8), chartHeight - 70)
  return {
    left: `${left}px`,
    top: `${top}px`,
  }
}

onMounted(() => {
  chartTimer = setInterval(() => {
    chartPanels.value = chartPanels.value.map((panel) => {
      updatePanelValue(panel)
      return { ...panel }
    })
    updateKlineCandles()
  }, 1800)
})

onUnmounted(() => {
  if (chartTimer) {
    clearInterval(chartTimer)
  }
})

const formatChartValue = (value: number) => {
  if (value >= 1000) return value.toFixed(0)
  if (value >= 100) return value.toFixed(1)
  return value.toFixed(2)
}

const chipClass = (active: boolean) => {
  return [
    'rounded-md border px-2.5 py-1 text-xs transition',
    active
      ? 'border-red-300 bg-red-50 text-red-600 dark:border-red-400/50 dark:bg-red-400/10 dark:text-red-300'
      : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
  ]
}

const getAreaPoints = (values: number[]) => {
  const points = getPolylinePoints(values)
  if (!points) return ''

  const firstX = points.split(' ')[0]?.split(',')[0] ?? '18'
  const parts = points.split(' ')
  const lastX = parts[parts.length - 1]?.split(',')[0] ?? '462'
  return `${firstX},162 ${points} ${lastX},162`
}

const getStrokeClass = (colorClass: string) => {
  return colorClass.replace('text-', 'stroke-')
}

const getFillClass = (colorClass: string) => {
  return colorClass.replace('text-', 'fill-')
}

</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 md:p-6">
    <!-- 头部标题 -->
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold">
          短线股票行情中心
        </h1>
        <p class="mt-1 text-slate-500 dark:text-slate-400">
          对标同花顺风格 · Vue3 + Tailwind + shadcn-vue
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
        @click="toggleTheme"
      >
        {{ isDark ? '切换浅色模式' : '切换黑夜模式' }}
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm text-gray-500">上涨家数</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-rise">1289</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm text-gray-500">下跌家数</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-fall">2156</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm text-gray-500">涨停数量</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-rise">36</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-sm text-gray-500">跌停数量</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-fall">12</div>
        </CardContent>
      </Card>
    </div>

    <!-- 多图行情区 -->
    <div class="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Card v-for="panel in chartPanels" :key="panel.key" class="border-slate-200/80 dark:border-slate-700/80 dark:bg-slate-900/70">
        <CardHeader class="pb-2">
          <CardTitle class="flex items-center justify-between text-base">
            <span>{{ panel.title }}</span>
            <span :class="['text-sm', panel.colorClass]">{{ panel.values[panel.values.length - 1] }}</span>
          </CardTitle>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ panel.subtitle }}</p>
        </CardHeader>
        <CardContent>
          <div class="relative">
            <svg
              viewBox="0 0 480 180"
              class="h-44 w-full rounded-md bg-slate-50 dark:bg-slate-950/70"
              @mousemove="handleChartMove($event, panel)"
              @mouseleave="clearChartHover(panel.key)"
            >
              <g>
                <line
                  v-for="lineY in [36, 72, 108, 144]"
                  :key="lineY"
                  x1="0"
                  :y1="lineY"
                  x2="480"
                  :y2="lineY"
                  class="stroke-slate-200/70 dark:stroke-slate-800/80"
                  stroke-width="1"
                />
              </g>
              <polygon :points="getAreaPoints(panel.values)" :class="panel.areaClass" />
              <polyline
                :points="getPolylinePoints(panel.values)"
                :class="getStrokeClass(panel.colorClass)"
                fill="none"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <template v-if="hoverMap[panel.key]">
                <line
                  :x1="hoverMap[panel.key]?.x"
                  y1="18"
                  :x2="hoverMap[panel.key]?.x"
                  y2="162"
                  class="stroke-slate-400/60 dark:stroke-slate-500/60"
                  stroke-dasharray="4 4"
                />
                <line
                  x1="18"
                  :y1="hoverMap[panel.key]?.y"
                  x2="462"
                  :y2="hoverMap[panel.key]?.y"
                  class="stroke-slate-300/70 dark:stroke-slate-600/70"
                  stroke-dasharray="4 4"
                />
                <circle
                  :cx="hoverMap[panel.key]?.x"
                  :cy="hoverMap[panel.key]?.y"
                  r="4.8"
                  class="fill-white dark:fill-slate-900"
                  stroke-width="2"
                  :class="getStrokeClass(panel.colorClass)"
                />
                <circle
                  :cx="hoverMap[panel.key]?.x"
                  :cy="hoverMap[panel.key]?.y"
                  r="2.3"
                  :class="getFillClass(panel.colorClass)"
                />
              </template>
            </svg>
            <div
              v-if="hoverMap[panel.key]"
              class="pointer-events-none absolute rounded-md border border-slate-200 bg-white/95 px-2 py-1 text-xs shadow-sm dark:border-slate-700 dark:bg-slate-900/95"
              :style="getHoverTooltipStyle(panel.key)"
            >
              <div class="text-slate-500 dark:text-slate-400">第 {{ (hoverMap[panel.key]?.index ?? 0) + 1 }} 个点</div>
              <div :class="['font-semibold', panel.colorClass]">{{ formatChartValue(hoverMap[panel.key]?.value ?? 0) }}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card class="border-slate-200/80 dark:border-slate-700/80 dark:bg-slate-900/70">
        <CardHeader class="pb-2">
          <CardTitle class="flex items-center justify-between text-base">
            <span>K线模拟图</span>
            <span class="text-sm text-rise">{{ formatChartValue(klineCandles[klineCandles.length - 1]?.close ?? 0) }}</span>
          </CardTitle>
          <p class="text-xs text-slate-500 dark:text-slate-400">近12根K线 · 实时模拟更新</p>
        </CardHeader>
        <CardContent>
          <div class="relative">
            <svg
              viewBox="0 0 480 180"
              class="h-44 w-full rounded-md bg-slate-50 dark:bg-slate-950/70"
              @mousemove="handleKlineMove"
              @mouseleave="clearKlineHover"
            >
              <line
                v-for="lineY in [36, 72, 108, 144]"
                :key="`kline-grid-${lineY}`"
                x1="0"
                :y1="lineY"
                x2="480"
                :y2="lineY"
                class="stroke-slate-200/70 dark:stroke-slate-800/80"
                stroke-width="1"
              />
              <g v-for="item in getKlineGeometry(klineCandles)" :key="`candle-${item.index}`">
                <line
                  :x1="item.centerX"
                  :x2="item.centerX"
                  :y1="item.highY"
                  :y2="item.lowY"
                  :class="item.isRise ? 'stroke-rise' : 'stroke-fall'"
                  stroke-width="1.4"
                />
                <rect
                  :x="item.bodyX"
                  :y="item.bodyTop"
                  :width="Math.max((chartWidth - chartPadding * 2) / Math.max(klineCandles.length, 1) * 0.54, 6)"
                  :height="item.bodyHeight"
                  :class="item.isRise ? 'fill-rise/80' : 'fill-fall/80'"
                  rx="1"
                />
              </g>
              <template v-if="klineHover">
                <line
                  :x1="klineHover.x"
                  y1="18"
                  :x2="klineHover.x"
                  y2="162"
                  class="stroke-slate-400/60 dark:stroke-slate-500/60"
                  stroke-dasharray="4 4"
                />
              </template>
            </svg>
            <div
              v-if="klineHover"
              class="pointer-events-none absolute rounded-md border border-slate-200 bg-white/95 px-2 py-1 text-xs shadow-sm dark:border-slate-700 dark:bg-slate-900/95"
              :style="getKlineTooltipStyle()"
            >
              <div class="text-slate-500 dark:text-slate-400">第 {{ klineHover.index + 1 }} 根K线</div>
              <div>开 {{ formatChartValue(klineHover.candle.open) }} / 收 {{ formatChartValue(klineHover.candle.close) }}</div>
              <div>高 {{ formatChartValue(klineHover.candle.high) }} / 低 {{ formatChartValue(klineHover.candle.low) }}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- 搜索 + 板块标签 -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <Input
        v-model="searchKey"
        placeholder="输入股票代码/名称搜索"
        class="md:w-72 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
      <Tabs v-model="activeTab">
        <TabsList>
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="zt">涨停</TabsTrigger>
          <TabsTrigger value="dt">跌停</TabsTrigger>
          <TabsTrigger value="hot">热点板块</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>

    <!-- 股票列表表格 -->
    <Card class="border-slate-200/80 dark:border-slate-700/80 dark:bg-slate-900/70">
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>股票代码</TableHead>
              <TableHead>股票名称</TableHead>
              <TableHead>所属板块</TableHead>
              <TableHead class="text-right">最新价</TableHead>
              <TableHead class="text-right">涨跌额</TableHead>
              <TableHead class="text-right">涨跌幅</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in stockList" :key="item.code">
              <TableCell class="font-mono">{{ item.code }}</TableCell>
              <TableCell class="font-medium">{{ item.name }}</TableCell>
              <TableCell>
                <Badge variant="secondary" class="dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">{{ item.industry }}</Badge>
              </TableCell>
              <TableCell class="text-right font-medium">
                {{ item.price }}
              </TableCell>
              <TableCell
                class="text-right"
                :class="item.change > 0 ? 'text-rise' : item.change < 0 ? 'text-fall' : 'text-flat'"
              >
                {{ item.change > 0 ? '+' : '' }}{{ item.change }}
              </TableCell>
              <TableCell
                class="text-right font-bold"
                :class="item.percent.includes('+') ? 'text-rise' : item.percent.includes('-') ? 'text-fall' : 'text-flat'"
              >
                {{ item.percent }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- 短线侠首页内容映射 -->
    <div class="mt-6 space-y-6">
      <Card class="border-slate-200/80 dark:border-slate-700/80 dark:bg-slate-900/70">
        <CardHeader>
          <CardTitle class="text-base">功能导航</CardTitle>
        </CardHeader>
        <CardContent class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div
            v-for="section in platformSections"
            :key="section.title"
            class="rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-950/40"
          >
            <div class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ section.title }}</div>
            <div class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="item in section.items"
                :key="item"
                class="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {{ item }}
              </span>
            </div>
          </div>
          <div class="rounded-lg border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-950/40 md:col-span-2 xl:col-span-4">
            <div class="text-sm font-semibold">快捷入口</div>
            <div class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="item in quickEntries"
                :key="item"
                class="rounded-md border border-slate-200 px-3 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                {{ item }}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-slate-200/80 dark:border-slate-700/80 dark:bg-slate-900/70">
        <CardHeader class="pb-3">
          <CardTitle class="text-base">个股/概念挖掘检索</CardTitle>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            高级版挖掘功能更全面，支持互动易与公告检索（示例页面）
          </p>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <div class="mb-2 text-xs text-slate-500 dark:text-slate-400">检索范围</div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in marketScopes"
                :key="item"
                type="button"
                :class="chipClass(activeMarket === item)"
                @click="activeMarket = item"
              >
                {{ item }}
              </button>
            </div>
          </div>

          <div>
            <div class="mb-2 text-xs text-slate-500 dark:text-slate-400">发布时间</div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in publishWindows"
                :key="item"
                type="button"
                :class="chipClass(activePublishWindow === item)"
                @click="activePublishWindow = item"
              >
                {{ item }}
              </button>
            </div>
          </div>

          <div>
            <div class="mb-2 text-xs text-slate-500 dark:text-slate-400">地区筛选</div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in regionOptions"
                :key="item"
                type="button"
                :class="chipClass(activeRegion === item)"
                @click="activeRegion = item"
              >
                {{ item }}
              </button>
            </div>
          </div>

          <div class="rounded-lg border border-slate-200 dark:border-slate-700">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名称</TableHead>
                  <TableHead>代码</TableHead>
                  <TableHead>匹配</TableHead>
                  <TableHead class="text-right">市值</TableHead>
                  <TableHead class="text-right">涨幅</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="row in miningRows" :key="row.code">
                  <TableCell>{{ row.name }}</TableCell>
                  <TableCell class="font-mono">{{ row.code }}</TableCell>
                  <TableCell>{{ row.match }}</TableCell>
                  <TableCell class="text-right">{{ row.marketCap }}</TableCell>
                  <TableCell
                    class="text-right font-semibold"
                    :class="row.change.startsWith('+') ? 'text-rise' : 'text-fall'"
                  >
                    {{ row.change }}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div class="grid gap-6 xl:grid-cols-2">
        <Card class="border-slate-200/80 dark:border-slate-700/80 dark:bg-slate-900/70">
          <CardHeader class="pb-3">
            <CardTitle class="text-base">互动易检索</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div>
              <div class="mb-2 text-xs text-slate-500 dark:text-slate-400">报告类型</div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="item in reportTypes"
                  :key="item"
                  type="button"
                  :class="chipClass(activeReportType === item)"
                  @click="activeReportType = item"
                >
                  {{ item }}
                </button>
              </div>
            </div>
            <div>
              <div class="mb-2 text-xs text-slate-500 dark:text-slate-400">特色标签</div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in highlightTags"
                  :key="tag"
                  class="rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400">查询到 128 条结果</div>
          </CardContent>
        </Card>

        <Card class="border-slate-200/80 dark:border-slate-700/80 dark:bg-slate-900/70">
          <CardHeader class="pb-3">
            <CardTitle class="text-base">热点聚焦榜单</CardTitle>
            <div class="flex gap-2 text-xs">
              <button
                type="button"
                :class="chipClass(activeSort === '综合排序')"
                @click="activeSort = '综合排序'"
              >
                综合排序
              </button>
              <button
                type="button"
                :class="chipClass(activeSort === '时间排序')"
                @click="activeSort = '时间排序'"
              >
                时间排序
              </button>
            </div>
          </CardHeader>
          <CardContent class="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>代码</TableHead>
                  <TableHead>名称</TableHead>
                  <TableHead class="text-right">涨幅</TableHead>
                  <TableHead class="text-right">市值</TableHead>
                  <TableHead class="text-right">人气</TableHead>
                  <TableHead class="text-right">异动次数</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="row in hotRows" :key="row.code">
                  <TableCell class="font-mono">{{ row.code }}</TableCell>
                  <TableCell>{{ row.name }}</TableCell>
                  <TableCell
                    class="text-right font-semibold"
                    :class="row.change.startsWith('+') ? 'text-rise' : 'text-fall'"
                  >
                    {{ row.change }}
                  </TableCell>
                  <TableCell class="text-right">{{ row.marketCap }}</TableCell>
                  <TableCell class="text-right">{{ row.popularity }}</TableCell>
                  <TableCell class="text-right">{{ row.abnormal }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card class="border-slate-200/80 dark:border-slate-700/80 dark:bg-slate-900/70">
        <CardHeader class="pb-3">
          <CardTitle class="text-base">连板天梯</CardTitle>
        </CardHeader>
        <CardContent class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div
            v-for="row in ladderRows"
            :key="row.stage"
            class="rounded-lg border border-slate-200 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-950/40"
          >
            <div class="text-xs text-slate-500 dark:text-slate-400">{{ row.stage }}</div>
            <div class="mt-1 text-lg font-semibold text-rise">{{ row.rate }}</div>
          </div>
        </CardContent>
      </Card>

      <div class="rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
        免责声明：本站部分数据来源于互联网公开信息，仅作辅助参考，不构成任何投资建议。
      </div>
    </div>
  </div>
</template>
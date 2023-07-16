import memoize from 'lodash/memoize'

const [width, height] = [100, 100]
const svgMap = new Map()

// 生成随机ID
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536 + '') + ''
  return (+(randomNum + timestamp)).toString(32)
}

// 精确小数位
const RoundNum = (num, decimal = 2) => Math.round(num * 10 ** decimal) / 10 ** decimal

/** 获取base64格式的 SVG */
export const memoizeGetSVG = memoize(
  function getSVG(node, customColor = '') {
    const { svgName, svgColor } = node
    if (!svgName) return ''

    let svg
    try {
      if (svgMap.has(svgName)) {
        svg = svgMap.get(svgName)
      } else {
        // 加载 SVG
        // const path = svgName.replace('-', '/')
        svg = require(`@/icons/svg/${svgName}.svg`).default.render()
        svgMap.set(svgName, svg)
      }
      svg.style.color = customColor || svgColor || '#fff'
      svg.setAttribute('width', '24')
      svg.setAttribute('height', '24')
      const svgText = svg.outerHTML.replace(/symbol/g, 'svg')
      return encodeURI('data:image/svg+xml;utf-8,' + svgText)
    } catch (error) {
      console.error('找不到图标', error)
      return ''
    }
  },
  (ele) => ele.svgName + ele.svgColor
)

export function transformLevel(record, levelFlag) {
  const { level, direction } = record
  const map = { 0: 0, 1: 2, 3: -2 }
  const middle = 0.5

  if (level == 2) {
    if (direction) {
      levelFlag.leftFlag = !levelFlag.leftFlag
      return levelFlag.leftFlag ? -middle : middle
    } else {
      levelFlag.rightFlag = !levelFlag.rightFlag
      return levelFlag.rightFlag ? -middle : middle
    }
  }
  return map[level]
}

export function createDefaultData(level) {
  if (level == 2) {
    return { leftCount: [0, 0], rightCount: [0, 0], list: [[], []] }
  } else {
    return { leftCount: 0, rightCount: 0, list: [] }
  }
}

export function calcPosition(item) {
  const { x, y } = item

  return {
    x: x * width,
    y: y * height,
  }
}

export function addPosition(data, key, record, position) {
  const { level, direction } = record

  const handleAdd = (index) => {
    if (index !== undefined) {
      const x = direction ? ++data.leftCount[index] : ++data.rightCount[index]
      position.x = direction ? -x : x
      position.y = key
      direction ? data.list[index].unshift(position) : data.list[index].push(position)
    } else {
      const x = direction ? ++data.leftCount : ++data.rightCount
      position.x = direction ? -x : x
      position.y = key
      direction ? data.list.unshift(position) : data.list.push(position)
    }
  }

  if (level == 2) {
    const index = key === 1 ? 0 : 1
    handleAdd(index)
  } else {
    handleAdd()
  }
}

export function getMaxPositionLength(positionMap) {
  let maxLeft = 0
  let maxRight = 0

  const handle = ({ leftCount, rightCount }) => {
    if (Array.isArray(leftCount)) leftCount = Math.max(...leftCount)
    if (Array.isArray(rightCount)) rightCount = Math.max(...rightCount)
    if (maxLeft < leftCount) maxLeft = leftCount
    if (maxRight < rightCount) maxRight = rightCount
  }

  for (const key in positionMap) {
    const item = positionMap[key]
    handle(item)
  }

  return { maxLeft, maxRight }
}

export function getFrameOptions(maxLeft, maxRight) {
  const nodeOptions = { classes: 'desc-node', selectable: false, grabbable: false, pannable: true }
  const edgeOptions = { classes: 'none-arrow dashed-edge', pannable: true }
  const nodeWidth = width
  const nodeHeight = height
  const outerLevel = 1.75
  const gapLevel = 1
  maxLeft = -maxLeft - 0.5
  maxRight = maxRight + 0.5

  return {
    nodes: [
      {
        id: createUniqueString(),
        x: maxLeft,
        y: -outerLevel,
        width: nodeWidth,
        height: nodeHeight * 1.5,
        backgroundColor: '#d5e9fc',
        label: '父辈',
        options: nodeOptions,
      },
      {
        id: createUniqueString(),
        x: maxLeft,
        y: 0,
        width: nodeWidth,
        height: nodeHeight * 2,
        backgroundColor: '#d5e9fc',
        label: '平辈',
        options: nodeOptions,
      },
      {
        id: createUniqueString(),
        x: maxLeft,
        y: outerLevel,
        width: nodeWidth,
        height: nodeHeight * 1.5,
        backgroundColor: '#d5e9fc',
        label: '子辈',
        options: nodeOptions,
      },
      {
        id: createUniqueString(),
        x: maxLeft,
        y: gapLevel,
        label: '',
        options: { ...nodeOptions, classes: 'invisible' },
      },
      {
        id: createUniqueString(),
        x: maxRight,
        y: gapLevel,
        label: '',
        options: { ...nodeOptions, classes: 'invisible' },
      },
      {
        id: createUniqueString(),
        x: maxLeft,
        y: -gapLevel,
        label: '',
        options: { ...nodeOptions, classes: 'invisible' },
      },
      {
        id: createUniqueString(),
        x: maxRight,
        y: -gapLevel,
        label: '',
        options: { ...nodeOptions, classes: 'invisible' },
      },
    ],
    edges: [
      { id: createUniqueString(), y: gapLevel, label: '', options: edgeOptions },
      { id: createUniqueString(), y: -gapLevel, label: '', options: edgeOptions },
    ],
  }
}

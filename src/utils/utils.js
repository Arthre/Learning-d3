import memoize from 'lodash/memoize'

const svgMap = new Map()

// 生成随机ID
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536 + '') + ''
  return (+(randomNum + timestamp)).toString(32)
}

/** 获取base64格式的 SVG */
export const memoizeGetSVG = memoize(
  function getSVG(node, customColor = '') {
    const { svgName, svgColor } = node
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

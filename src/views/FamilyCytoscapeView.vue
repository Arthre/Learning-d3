<template>
  <div class="container">
    <div class="cy-wrapper">
      <div id="cy-container"></div>
      <div id="aerial-view"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import cytoscape from 'cytoscape'
import panzoom from 'cytoscape-panzoom'
import navigator from 'cytoscape-navigator'
import fcose from 'cytoscape-fcose'
import dagre from 'cytoscape-dagre'
import cola from 'cytoscape-cola'
import cosmos from 'cosmos-over-cytoscape'
import layoutUtilities from 'cytoscape-layout-utilities'
import d3Force from 'cytoscape-d3-force'
import styleConfig from './styleConfig'
import { panZoomOptions, navigatorOptions, fcoseLayout, dagreLayout, circle, preset } from './options.js'
import familyData from '@/assets/json/family.js'
import {
  createDefaultData,
  transformLevel,
  calcPosition,
  addPosition,
  getMaxPositionLength,
  getFrameOptions,
} from '@/utils/utils'

cytoscape.warnings(process.env.NODE_ENV === 'development')
panzoom(cytoscape)
navigator(cytoscape)
cytoscape.use(fcose)
cytoscape.use(dagre)
cytoscape.use(cola)
cytoscape.use(cosmos)
cytoscape.use(d3Force)
cytoscape.use(layoutUtilities)

export default {
  name: 'FamilyCytoscapeView',
  data() {
    return {
      url: {
        list: 'https://mock.apifox.cn/m1/2185386-0-default/family-cytoscape',
      },
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {},
  methods: {
    getGraphData(type) {
      if (type === 'json') return Promise.resolve(familyData)
      return axios.get(this.url.list, { params: { nodes: 10, edges: 10 } }).then((res) => {
        const { positionMap, data } = this.handleNodeLayout(res.data.data)
        this.handleGraphFrame(data, positionMap)
        console.log(data)
        return data
      })
    },
    async init() {
      const data = await this.getGraphData()
      const { nodes, edges } = data
      this.cy = cytoscape({
        container: document.getElementById('cy-container'),
        elements: { nodes, edges },
        style: styleConfig,
        minZoom: 0.01,
        maxZoom: 100,
        layout: preset,
        wheelSensitivity: 0.1,
        hideEdgesOnViewport: true,
        textureOnViewport: false,
        pixelRatio: 1,
      })
      this.layoutUtils = this.cy.layoutUtilities()
      // 初始化 panzoom UI 控件
      this.cy.panzoom(panZoomOptions)
      // 初始化 鸟瞰图 控件
      this.cy.navigator(navigatorOptions)
      // })
    },
    runLayoutUtils(nodes, edges, layout) {
      const extendCollection = this.cy.collection()
      nodes.forEach((v) => {
        extendCollection.merge(this.cy.add(v))
      })
      edges.forEach((v) => this.cy.add(v))

      this.layoutUtils.placeNewNodes(extendCollection)
      const fcoseLayoutOptions =
        this.cy._private.options.layout.name === 'fcose'
          ? Object.assign({}, fcoseLayout, { randomize: false, packComponents: false })
          : layout
      this.cy.layout(fcoseLayoutOptions).run()
    },
    runLockLayout(nodes, edges, layout) {
      const lockNodes = this.cy.nodes().lock()

      nodes.forEach((v) => this.cy.add(v))
      edges.forEach((v) => this.cy.add(v))
      this.cy.layout(layout).run()
      this.cy.once('layoutstop', () => {
        lockNodes.unlock()
      })
    },
    reset() {
      this.cy.destroy()
      this.init()
    },
    handleNodeLayout(res) {
      // 同辈上下切换排列开关
      const levelFlag = { leftFlag: false, rightFlag: false }
      const positionMap = {}
      const nodeMap = {}

      // 生成节点坐标表
      for (let i = 0; i < res.nodes.length; i++) {
        const item = res.nodes[i].data
        nodeMap[item.id] = res.nodes[i]
        const position = { id: item.id, x: 0, y: 0 }

        if (item.level == 0) {
          positionMap[item.level] = createDefaultData(item.level)
          positionMap[item.level].list.push(position)
          continue
        }

        const key = transformLevel(item, levelFlag)
        if (!positionMap[key]) {
          positionMap[key] = createDefaultData(item.level)
        }
        addPosition(positionMap[key], key, item, position)
      }

      // 根据坐标表设置节点位置
      const handlePosition = (item) => {
        const { id } = item
        const obj = nodeMap[id]
        obj.position = calcPosition(item)
      }
      for (const key in positionMap) {
        for (const item of positionMap[key].list) {
          if (Array.isArray(item)) {
            item.forEach((innerItem) => handlePosition(innerItem))
          } else {
            handlePosition(item)
          }
        }
      }

      return {
        positionMap,
        data: res,
      }
    },
    handleGraphFrame(data, positionMap) {
      const { maxLeft, maxRight } = getMaxPositionLength(positionMap)
      const { nodes, edges } = getFrameOptions(maxLeft + 1, maxRight + 1)

      nodes.forEach((item) => {
        const { options, ...nodeData } = item
        const obj = {
          data: nodeData,
          position: calcPosition(item),
          ...options,
        }
        data.nodes.push(obj)
      })
      edges.forEach((item) => {
        const [target, source] = nodes.filter((v) => v.y === item.y)
        const obj = {
          data: { id: item.id, target: target.id, source: source.id, label: item.label },
          ...item.options,
        }
        data.edges.push(obj)
      })
    },
  },
}
</script>

<style lang="less" scoped>
#cy-container {
  position: relative;
  height: 800px;
  border: 1px solid var(--primaryColor);
}
#progress-box {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;
}
#aerial-view {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 200px;
  height: 200px;
  overflow: hidden;
  border: 1px solid skyblue;
  background-color: #f9f9f9;
}
.container {
  display: flex;
  .left-container {
    width: 10%;
    text-align: center;
  }
  .cy-wrapper {
    position: relative;
    width: 80%;
    margin: 0 auto;
  }
  .right-container {
    width: 10%;
  }
}

.drag-box {
  display: block;
  margin: 10px auto;
  padding: 10px;
  width: 60px;
  height: 60px;
  border: 1px solid skyblue;
  border-radius: 10px;
  color: deeppink;
}
.block-btn {
  display: block;
  + .block-btn {
    margin-top: 10px;
  }
}
</style>

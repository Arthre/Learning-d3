<template>
  <div class="container">
    <div class="left-container">
      <div>
        <label>nodes:</label> <span>{{ elementCount.nodes }}</span>
      </div>
      <div>
        <label>edges:</label> <span>{{ elementCount.edges }}</span>
      </div>

      <div id="drag-container">
        <div class="drag-box">
          <svg-icon icon-name="car.svg" />
        </div>
        <div class="drag-box">
          <svg-icon icon-name="address.svg" />
        </div>
      </div>
    </div>
    <div class="cy-wrapper">
      <div id="cy-container"></div>
      <div id="progress-box">
        <div id="progress-text"></div>
      </div>
      <div id="aerial-view"></div>
    </div>
    <div class="right-container">
      <button class="block-btn" @click="reset">reset</button>
      <button class="block-btn" @click="addDataToGraph">添加数据</button>
      <button class="block-btn" @click="toggleStyle">切换样式</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import dragula from 'dragula'
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
import { panZoomOptions, navigatorOptions, fcoseLayout, dagreLayout, circle } from './options.js'
import debounce from 'lodash/debounce'

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
  name: 'CytoscapeView',
  data() {
    return {
      url: {
        list: 'https://mock.apifox.cn/m1/2185386-0-default/list-cytoscape',
        extend: 'http://127.0.0.1:4523/m1/1424996-0-default/extend-cytoscape',
      },
      elementCount: {
        nodes: 0,
        edges: 0,
      },
    }
  },
  mounted() {
    this.init()
    this.initDrag()
  },
  beforeDestroy() {
    this.dragula.destroy()
  },
  methods: {
    init() {
      axios.get(this.url.list, { params: { nodes: 50, edges: 50 } }).then((res) => {
        const { nodes, edges } = res.data.data
        this.elementCount.nodes = nodes.length
        this.elementCount.edges = edges.length
        this.cy = cytoscape({
          container: document.getElementById('cy-container'),
          elements: { nodes, edges },
          style: styleConfig,
          minZoom: 0.01,
          maxZoom: 100,
          layout: fcoseLayout,
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
        console.time('layout')

        // this.cy.on('mousemove', debounce(this.handlerAddDragNode, 30))

        this.cy.on(
          'layoutstop',
          (this.handleLayoutStop = () => {
            console.timeEnd('layout')
          })
        )
        // this.highlightingNeighbor()
      })
    },
    initDrag() {
      let cyPosition = null
      let mouseEvent = null
      const cyContainer = document.getElementById('cy-container')
      this.dragula = dragula({ copy: true, mirrorContainer: cyContainer })
      this.dragula.containers.push(document.getElementById('drag-container'))

      const mousemoveFn = debounce(function (e) {
        cyPosition = e
      }, 30)
      const mouseupFn = (e) => {
        mouseEvent = e
      }

      this.dragula.on('drag', () => {
        this.cy.on('mousemove', mousemoveFn)
        document.addEventListener('mouseup', mouseupFn)
      })
      this.dragula.on('dragend', () => {
        setTimeout(() => {
          if (this.isMouseExistContainer(cyContainer, mouseEvent)) {
            console.log(cyPosition)
          }
          this.cy.off('mousemove', mousemoveFn)
          document.removeEventListener('mouseup', mouseupFn)
        }, 0)
      })
    },
    addDataToGraph() {
      const targetId = this.cy.$(':selected')[0].data('id')
      axios.get(this.url.extend, { params: { nodes: 10, edges: 10, targetId, enableId: 1 } }).then((res) => {
        console.time('layout')
        const { nodes, edges } = res.data.data
        this.elementCount.nodes += nodes.length
        this.elementCount.edges += edges.length
        this.runLayoutUtils(nodes, edges, fcoseLayout)
        // this.runLockLayout(nodes, edges, dagreLayout)
      })
    },
    toggleStyle() {
      this.cy.batch(() => {
        this.cy.nodes().forEach((item) => {
          item.toggleClass('active')
        })
        this.cy.edges().forEach((item) => {
          item.toggleClass('active')
        })
      })
    },
    highlightingNeighbor() {
      const { cy } = this
      this.cy.on(
        'click',
        (this.handleNodeClick = (e) => {
          if (e.target !== cy && e.target.isNode()) {
            const allEles = cy.elements()
            const nNode = e.target.closedNeighborhood()
            const others = allEles.not(nNode)
            cy.batch(() => {
              allEles.removeClass('faded highlight')
              nNode.addClass('highlight')
              others.addClass('faded')
            })
          } else {
            cy.batch(() => {
              cy.elements().removeClass('faded highlight')
            })
          }
        })
      )

      // bind tapstart to edges and highlight the connected nodes
      this.cy.bind('tapstart', 'edge', function (event) {
        const connected = event.target.connectedNodes()
        connected.addClass('highlight')
      })

      // bind tapend to edges and remove the highlight from the connected nodes
      this.cy.bind('tapend', 'edge', function (event) {
        const connected = event.target.connectedNodes()
        connected.removeClass('highlight')
      })
    },
    handlerAddDragNode(e) {
      this.cyPosition = e
      console.log('handlerAddDragNode', e)
      return e.classList.contains('dragula-container')
    },
    isMouseExistContainer(container, e) {
      if (!container.getBoundingClientRect) return undefined

      const domRect = container.getBoundingClientRect()
      const { clientX, clientY } = e
      if (
        clientX >= Math.floor(domRect.left) &&
        clientX <= Math.floor(domRect.right) &&
        clientY >= Math.floor(domRect.top) &&
        clientY <= Math.floor(domRect.bottom)
      ) {
        return true
      }
      return false
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
    margin: 0 10px;
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

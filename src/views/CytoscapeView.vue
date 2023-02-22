<template>
  <div class="container">
    <div class="left-container">
      <div>
        <label>nodes:</label> <span>{{ elementCount.nodes }}</span>
      </div>
      <div>
        <label>edges:</label> <span>{{ elementCount.edges }}</span>
      </div>
    </div>
    <div id="cy-container">
      <div id="progress-box">
        <div id="progress-text"></div>
      </div>
    </div>
    <div class="right-container">
      <button class="block-btn" @click="addDataToGraph">添加数据</button>
      <button class="block-btn" @click="toggleStyle">切换样式</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import cytoscape from 'cytoscape'
import panzoom from 'cytoscape-panzoom'
import fcose from 'cytoscape-fcose'
import cola from 'cytoscape-cola'
import cosmos from 'cosmos-over-cytoscape'
import d3Force from 'cytoscape-d3-force'
import styleConfig from './styleConfig'
import { panZoomOptions, fcoseLayout } from './options.js'

panzoom(cytoscape)
cytoscape.use(fcose)
cytoscape.use(cola)
cytoscape.use(cosmos)
cytoscape.use(d3Force)

export default {
  name: 'CytoscapeView',
  data() {
    return {
      url: {
        list: 'https://mock.apifox.cn/m1/2185386-0-default/list-cytoscape',
      },
      elementCount: {
        nodes: 0,
        edges: 0,
      },
    }
  },
  mounted() {
    this.init()
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
          wheelSensitivity: 0.1,
          hideEdgesOnViewport: true,
          textureOnViewport: false,
          pixelRatio: 1,
        })
        // 设置布局
        this.layout = this.cy.layout(fcoseLayout).run()
        this.cy.panzoom(panZoomOptions)
        console.time('layout')

        this.cy.on(
          'layoutstop',
          (this.handleLayoutStop = () => {
            console.timeEnd('layout')
          })
        )
        this.highlightingNeighbor()
      })
    },
    addDataToGraph() {
      axios.get(this.url.list, { params: { nodes: 1000, edges: 1000, enableId: 1 } }).then((res) => {
        console.time('layout')
        const { nodes, edges } = res.data.data
        this.elementCount.nodes += nodes.length
        this.elementCount.edges += edges.length
        nodes.forEach((v) => this.cy.add(v))
        edges.forEach((v) => this.cy.add(v))
        this.cy.layout(fcoseLayout).run()
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
      this.cy.on('click', (e) => {
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
.container {
  display: flex;
  .left-container {
    width: 10%;
    text-align: center;
  }
  #cy-container {
    width: 80%;
    margin: 0 10px;
  }
  .right-container {
    width: 10%;
  }
}

.block-btn {
  display: block;
  + .block-btn {
    margin-top: 10px;
  }
}
</style>

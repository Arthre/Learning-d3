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
import { panZoomOptions } from './options.js'
import { getSVG } from '@/utils/utils.js'

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
          style: [
            {
              selector: 'node',
              style: {
                label: 'data(label)',
                'background-color': '#666',
                'background-image': (e) => getSVG({ svgName: e.attr('svgName'), svgColor: e.attr('svgColor') }),
              },
            },
            {
              selector: 'edge',
              style: {
                width: 3,
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'triangle',
                'curve-style': 'haystack',
              },
            },
            {
              selector: 'label',
              style: {
                'min-zoomed-font-size': 12,
              },
            },
            {
              selector: ':selected',
              style: {
                'background-color': 'SteelBlue',
                'line-color': 'black',
                'target-arrow-color': 'black',
                'source-arrow-color': 'black',
              },
            },
            {
              selector: '.active',
              style: {
                'background-color': 'deeppink',
                'line-color': 'skyblue',
                'target-arrow-color': 'skyblue',
                'source-arrow-color': 'skyblue',
              },
            },
            {
              selector: 'node.highlight',
              style: {
                'border-color': '#FFF',
                'border-width': '2px',
              },
            },
            {
              selector: 'node.semitransp',
              style: { opacity: '0.5' },
            },
            {
              selector: 'edge.highlight',
              style: { 'mid-target-arrow-color': '#FFF' },
            },
            {
              selector: 'edge.semitransp',
              style: { opacity: '0.2' },
            },
          ],
          minZoom: 0.01,
          maxZoom: 100,
          wheelSensitivity: 0.1,
          hideEdgesOnViewport: true,
          textureOnViewport: false,
          pixelRatio: 1,
        })
        // 设置布局
        this.layout = this.cy
          .layout({
            name: 'fcose',
            // name: 'd3-force',
            // animate: false,
            // fit: false,
            // linkId: function id(d) {
            //   return d.id
            // },
            // linkDistance: 100,
            // manyBodyStrength: -600,
            // ready: function () {
            //   document.getElementById('progress-box').style.display = 'block'
            // },
            // stop: function () {
            //   document.getElementById('progress-box').style.display = 'none'
            // },
            // tick: function (progress) {
            //   let text = (progress * 100).toFixed(1) + '%'
            //   document.getElementById('progress-text').innerHTML = `正在计算布局，请稍后 ${text}`
            // },
            // randomize: false,
            // infinite: false,
          })
          .run()
        this.cy.panzoom(panZoomOptions)
        console.time('layout')

        this.cy.on('layoutstop', this.handleLayoutStop)
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
        this.cy.layout({ name: 'fcose' }).run()
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
      let previous_node
      let previous_sel
      this.cy.on('click', 'node', (e) => {
        var sel = e.target
        var id = e.target.id()

        this.cy.batch(() => {
          if (id != previous_node && previous_node != undefined && previous_sel != undefined) {
            this.cy.elements().removeClass('semitransp')
            previous_sel.removeClass('highlight').outgoers().union(previous_sel.incomers()).removeClass('highlight')
          }
          this.cy.elements().difference(sel.outgoers().union(sel.incomers())).not(sel).addClass('semitransp')
          sel.addClass('highlight').outgoers().union(sel.incomers()).addClass('highlight')

          previous_sel = sel
          previous_node = id
        })
      })

      // this.cy.on('tapunselect', () => {
      //   if (previous_node != undefined) {
      //     const sel = this.cy.$id(previous_node)
      //     this.cy.batch(() => {
      //       this.cy.elements().removeClass('semitransp')
      //       sel.removeClass('highlight').outgoers().union(sel.incomers()).removeClass('highlight')
      //     })
      //   }
      // })
    },
    handleLayoutStop(e) {
      console.timeEnd('layout')
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

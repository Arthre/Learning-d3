<template>
  <div class="home">
    <div id="container"></div>
    <div class="active-box">
      <button @click="handleAddData">添加数据</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import groupsData from '@/assets/groups.js'
import * as vis from 'vis-network/dist/vis-network.min.js'

console.log(vis)

export default {
  name: 'VisView',
  data() {
    return {
      url: {
        list: 'https://mock.apifox.cn/m1/2185386-0-default/list-vis',
      },
      nodes: null,
      edges: null,
      netWork: null,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      axios.get(this.url.list, { params: { nodes: 100, edges: 100 } }).then((res) => {
        const data = res.data.data
        const containerDom = document.getElementById('container')
        this.nodes = new vis.DataSet(data.nodes)
        this.edges = new vis.DataSet(data.edges)
        console.log(this.nodes)

        const options = {
          // nodes: {
          //   shape: 'dot',
          //   scaling: {
          //     min: 10,
          //     max: 30,
          //     label: {
          //       min: 8,
          //       max: 30,
          //       drawThreshold: 12,
          //       maxVisible: 50,
          //     },
          //   },
          //   font: {
          //     size: 12,
          //     face: 'Tahoma',
          //   },
          // },
          layout: {
            improvedLayout: false,
            hierarchical: {
              direction: 'UD',
              // levelSeparation: 100,
              sortMethod: 'directed',
              shakeTowards: 'roots',
            },
          },
          physics: {
            enabled: false,
            forceAtlas2Based: {
              gravitationalConstant: -26,
              centralGravity: 0.005,
              springLength: 230,
              springConstant: 0.18,
            },
            maxVelocity: 146,
            solver: 'forceAtlas2Based',
            timestep: 0.35,
            stabilization: { iterations: 150 },
          },
          interaction: {
            tooltipDelay: 200,
            hideEdgesOnDrag: true,
            hideEdgesOnZoom: true,
          },
          manipulation: {
            enabled: true,
          },
        }

        this.netWork = new vis.Network(containerDom, { nodes: this.nodes, edges: this.edges }, options)
        // this.netWork.fit()
        // this.netWork.on('afterDrawing', () => {
        //   console.log('afterDrawing')
        // })
      })
    },
    handleAddData() {
      axios.get(this.url.list, { nodes: 30, edges: 30 }).then((res) => {
        const { nodes, edges } = res.data.data
        console.log(res.data.data)

        try {
          nodes.forEach((item) => {
            console.log(item)
            this.nodes.add(item)
          })
          edges.forEach((item) => {
            this.edges.add(item)
          })
        } catch (error) {
          console.log(error)
          alert('添加失败:', error)
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
#container {
  width: 1500px;
  height: 800px;
  margin: 0 auto;
  border: 1px solid var(--primaryColor);
}
.home {
  position: relative;
  display: inline-block;
}
.active-box {
  position: absolute;
  top: 0;
  right: 0;
  padding: 20px;
  transform: translateX(100%);
}
</style>

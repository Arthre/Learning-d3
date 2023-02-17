<template>
  <div class="home">
    <div id="container"></div>
  </div>
</template>

<script>
import axios from 'axios'
import miserables from '@/assets/miserables.json'
import { ForceGraph } from './graph/layout/forceGraphSVG'

export default {
  name: 'SVGView',
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      axios
        .get(`https://mock.apifox.cn/m1/2185386-0-default/list-svg`, { params: { nodes: 1000, links: 1000 } })
        .then((res) => {
          const data = res.data.data
          console.log(data)

          const containerDom = document.getElementById('container')
          const width = containerDom.offsetWidth,
            height = containerDom.offsetHeight

          const chart = ForceGraph(data, {
            nodeId: (d) => d.id,
            nodeGroup: (d) => d.group,
            nodeTitle: (d) => `${d.id}\n${d.group}`,
            linkStrokeWidth: (l) => Math.sqrt(l.value),
            width,
            height,
          })
          containerDom.append(chart)
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
</style>

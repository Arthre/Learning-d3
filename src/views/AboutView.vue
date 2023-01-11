<template>
  <div class="about">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'about',
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      var num = 20000

      var canvas = document.getElementById('canvas')
      var width = (canvas.width = 960)
      var height = (canvas.height = 500)
      var ctx = canvas.getContext('2d')

      var particles = d3.range(num).map(function (i) {
        return [Math.round(width * Math.random()), Math.round(height * Math.random())]
      })

      d3.timer(step)

      function step() {
        ctx.fillStyle = 'rgba(255,255,255,0.3)'
        ctx.fillRect(0, 0, width, height)
        ctx.fillStyle = 'rgba(0,0,0,0.5)'
        particles.forEach(function (p) {
          p[0] += Math.round(2 * Math.random() - 1)
          p[1] += Math.round(2 * Math.random() - 1)
          if (p[0] < 0) p[0] = width
          if (p[0] > width) p[0] = 0
          if (p[1] < 0) p[1] = height
          if (p[1] > height) p[1] = 0
          drawPoint(p)
        })
      }

      function drawPoint(p) {
        ctx.fillRect(p[0], p[1], 1, 1)
      }
    },
  },
}
</script>

<style lang="less" scoped>
#canvas {
  width: 1500px;
  height: 800px;
  margin: 0 auto;
  border: 1px solid var(--primaryColor);
}
</style>

<template>
  <div class="about">
    <div id="container"></div>
    <div id="tooltip"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'about',
  data() {
    return {
      width: 1400,
      height: 750,
      nextCol: 1,
      colorToNode: {},
      custom: null,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const that = this
      var data = []
      d3.range(2000).forEach(function (el) {
        data.push({ x: d3.randomNormal(5, 3)(), y: d3.randomNormal(5, 3)(), r: d3.randomNormal(3, 1)() })
      })
      console.log(data)

      // main canvas
      var mainCanvas = d3
        .select('#container')
        .append('canvas')
        .classed('mainCanvas', true)
        .attr('width', this.width)
        .attr('height', this.height)

      // hidden canvas
      var hiddenCanvas = d3
        .select('#container')
        .append('canvas')
        .classed('hiddenCanvas', true)
        .attr('width', this.width)
        .attr('height', this.height)

      var customBase = document.createElement('custom')
      this.custom = d3.select(customBase) // replacement of SVG

      var x = d3.scaleLinear().domain([2, 8]).range([0, this.width])

      var y = d3.scaleLinear().domain([2, 8]).range([this.height, 0])
      this.databind(data, x, y)
      var t = d3.timer(function (elapsed) {
        that.draw(mainCanvas, false)
        if (elapsed > 300) t.stop()
        // timer running the draw function repeatedly for 300ms.
      })

      d3.select('.mainCanvas').on('mousemove', function (event) {
        that.draw(hiddenCanvas, true)
        var mouseX = event.layerX || event.offsetX
        var mouseY = event.layerY || event.offsetY

        var hiddenCtx = hiddenCanvas.node().getContext('2d')
        var col = hiddenCtx.getImageData(mouseX, mouseY, 1, 1).data

        var colKey = 'rgb(' + col[0] + ',' + col[1] + ',' + col[2] + ')'
        var nodeData = that.colorToNode[colKey]

        if (nodeData) {
          console.log(nodeData)
          d3.select('#tooltip')
            .style('opacity', 0.8)
            .style('top', event.pageY + 5 + 'px')
            .style('left', event.pageX + 5 + 'px')
            .html('x: ' + nodeData.x + '<br>' + 'y: ' + nodeData.y + '<br>' + 'radius: ' + nodeData.r)
        } else {
          d3.select('#tooltip').style('opacity', 0)
        }
      })
    },
    genColor() {
      var ret = []
      if (this.nextCol < 16777215) {
        ret.push(this.nextCol & 0xff) //R
        ret.push((this.nextCol & 0xff00) >> 8) //G
        ret.push((this.nextCol & 0xff0000) >> 16) //B

        this.nextCol += 1
      }
      var col = 'rgb(' + ret.join(',') + ')'
      return col
    },
    databind(data, x, y) {
      var join = this.custom.selectAll('custom.circle').data(data)

      var enterSel = join
        .enter()
        .append('custom')
        .attr('class', 'circle')
        .attr('x', function (d, i) {
          return x(d.x)
        })
        .attr('y', function (d, i) {
          return y(d.y)
        })
        .attr('r', function (d, i) {
          return Math.abs(d.r)
        })

      join
        .merge(enterSel)
        .transition()
        .attr('fillStyleHidden', (d) => {
          if (!d.hiddenCol) {
            d.hiddenCol = this.genColor()
            this.colorToNode[d.hiddenCol] = d
          }
          return d.hiddenCol
        })
    },
    draw(canvas, hidden) {
      var context = canvas.node().getContext('2d')

      context.clearRect(0, 0, this.width, this.height)

      var elements = this.custom.selectAll('custom.circle')
      elements.each(function (d, i) {
        var node = d3.select(this)
        context.fillStyle = hidden ? node.attr('fillStyleHidden') : 'steelblue'
        context.beginPath()
        context.arc(node.attr('x'), node.attr('y'), node.attr('r'), 0, 2 * Math.PI)
        context.fill()
      })
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .hiddenCanvas {
  display: none;
}

div#tooltip {
  position: absolute;
  display: inline-block;
  padding: 10px;
  font-family: 'Open Sans' sans-serif;
  color: #000;
  background-color: #fff;
  border: 1px solid #999;
  border-radius: 2px;
  pointer-events: none;
  opacity: 0;
  z-index: 1;
}
</style>

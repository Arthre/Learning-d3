import * as d3 from 'd3'

const scale = d3.scaleOrdinal(d3.schemeCategory10)
const color = (d) => scale(d.group)

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/force-directed-graph-canvas
export function ForceGraph(data, { width, height = 600 }) {
  const w2 = width / 2,
    h2 = height / 2,
    nodeRadius = 5

  const ctx = context2d(width, height)
  const canvas = ctx.canvas

  const simulation = forceSimulation(width, height)
  let transform = d3.zoomIdentity

  // The simulation will alter the input data objects so make
  // copies to protect the originals.
  const nodes = data.nodes.map((d) => Object.assign({}, d))
  const edges = data.links.map((d) => Object.assign({}, d))

  d3.select(canvas)
    .call(
      d3
        .drag()
        // Must set this in order to drag nodes. New in v5?
        .container(canvas)
        .subject(dragSubject)
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded)
    )
    .call(
      d3
        .zoom()
        .scaleExtent([1 / 10, 8])
        .on('zoom', zoomed)
    )

  simulation.nodes(nodes).on('tick', simulationUpdate)
  simulation.force('link').links(edges)

  function zoomed(event) {
    transform = event.transform
    simulationUpdate()
  }

  /** Find the node that was clicked, if any, and return it. */
  function dragSubject(event) {
    const x = transform.invertX(event.x),
      y = transform.invertY(event.y)
    const node = findNode(nodes, x, y, nodeRadius)
    if (node) {
      node.x = transform.applyX(node.x)
      node.y = transform.applyY(node.y)
    }
    // else: No node selected, drag container
    return node
  }

  function dragStarted(event) {
    if (!event.active) {
      simulation.alphaTarget(0.3).restart()
    }
    event.subject.fx = transform.invertX(event.x)
    event.subject.fy = transform.invertY(event.y)
  }

  function dragged(event) {
    event.subject.fx = transform.invertX(event.x)
    event.subject.fy = transform.invertY(event.y)
  }

  function dragEnded(event) {
    if (!event.active) {
      simulation.alphaTarget(0)
    }
    event.subject.fx = null
    event.subject.fy = null
  }

  function simulationUpdate() {
    ctx.save()
    ctx.clearRect(0, 0, width, height)
    ctx.translate(transform.x, transform.y)
    ctx.scale(transform.k, transform.k)
    // Draw edges
    edges.forEach(function (d) {
      ctx.beginPath()
      ctx.moveTo(d.source.x, d.source.y)
      ctx.lineTo(d.target.x, d.target.y)
      ctx.lineWidth = Math.sqrt(d.value)
      ctx.strokeStyle = '#aaa'
      ctx.stroke()
    })
    // Draw nodes
    nodes.forEach(function (d, i) {
      ctx.beginPath()
      // Node fill
      ctx.moveTo(d.x + nodeRadius, d.y)
      ctx.arc(d.x, d.y, nodeRadius, 0, 2 * Math.PI)
      ctx.fillStyle = color(d)
      ctx.fill()
      // Node outline
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = '1.5'
      ctx.stroke()
    })
    ctx.restore()
  }

  return canvas
}

function findNode(nodes, x, y, radius) {
  const rSq = radius * radius
  let i
  for (i = nodes.length - 1; i >= 0; --i) {
    const node = nodes[i],
      dx = x - node.x,
      dy = y - node.y,
      distSq = dx * dx + dy * dy
    if (distSq < rSq) {
      return node
    }
  }
  // No node selected
  return undefined
}

function forceSimulation(width, height) {
  return d3
    .forceSimulation()
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('charge', d3.forceManyBody())
    .force(
      'link',
      d3.forceLink().id((d) => d.id)
    )
}

function context2d(width, height, dpi) {
  if (dpi == null) dpi = window.devicePixelRatio
  var canvas = document.createElement('canvas')
  canvas.width = width * dpi
  canvas.height = height * dpi
  canvas.style.width = width + 'px'
  var context = canvas.getContext('2d')
  context.scale(dpi, dpi)
  return context
}

export const panZoomOptions = {
  zoomFactor: 0.05, // zoom factor per zoom tick
  zoomDelay: 45, // how many ms between zoom ticks
  minZoom: 0.1, // min zoom level
  maxZoom: 10, // max zoom level
  fitPadding: 50, // padding when fitting
  panSpeed: 10, // how many ms in between pan ticks
  panDistance: 10, // max pan distance per tick
  panDragAreaSize: 75, // the length of the pan drag box in which the vector for panning is calculated (bigger = finer control of pan speed and direction)
  panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
  panInactiveArea: 8, // radius of inactive area in pan drag box
  panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
  zoomOnly: false, // a minimal version of the ui only with zooming (useful on systems with bad mousewheel resolution)
  fitSelector: undefined, // selector of elements to fit
  animateOnFit: function () {
    // whether to animate on fit
    return false
  },
  fitAnimationDuration: 1000, // duration of animation on fit

  // icon class names
  sliderHandleIcon: 'iconfont icon-minus',
  zoomInIcon: 'iconfont icon-plus',
  zoomOutIcon: 'iconfont icon-minus',
  resetIcon: 'iconfont icon-expand',
}

export const navigatorOptions = {
  container: '#aerial-view', // string | false | undefined. Supported strings: an element id selector (like "#someId"), or a className selector (like ".someClassName"). Otherwise an element will be created by the library.
  viewLiveFramerate: 30, // set false to update graph pan only on drag end; set 0 to do it instantly; set a number (frames per second) to update not more than N times per second
  thumbnailEventFramerate: 30, // max thumbnail's updates per second triggered by graph updates
  thumbnailLiveFramerate: false, // max thumbnail's updates per second. Set false to disable
  dblClickDelay: 200, // milliseconds
  removeCustomContainer: true, // destroy the container specified by user on plugin destroy
  rerenderDelay: 300, // ms to throttle rerender updates to the panzoom for performance
}

// 布局配置：https://github.com/iVis-at-Bilkent/cytoscape.js-fcose
export const fcoseLayout = {
  name: 'fcose',
  randomize: true,
  animate: true,
  animationDuration: 500,
  uniformNodeDimensions: true,
  nodeRepulsion: () => 15000, // 节点排斥  默认：4500
  idealEdgeLength: () => 300, // 理想边长   默认：50
  edgeElasticity: () => 1, // 边缘弹性  默认：0.45
  nestingFactor: 0.1, // 嵌套的因素 默认：0.1
  gravity: 0.25, // 重力（常数）  默认：0.25
  gravityRange: 3.8, // 重力范围  默认：3.8
  initialEnergyOnIncremental: 0.8, // 初始能量增量  默认：0.3
  tilingPaddingVertical: 80, // 平铺填充垂直   默认：10
  tilingPaddingHorizontal: 80, // 平铺填充水平  默认：10
}

// 布局配置：https://github.com/cytoscape/cytoscape.js-dagre
export const dagreLayout = {
  name: 'dagre',
  // Type of algorithm to assign a rank to each node in the input graph.
  // Possible values: 'network-simplex', 'tight-tree' or 'longest-path'
  ranker: 'longest-path',
  // general layout options
  fit: true, // whether to fit to viewport
  padding: 120, // fit padding
  spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node
  animate: true, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
}

// 布局配置：https://js.cytoscape.org/#layouts/circle
export const circle = {
  name: 'circle',
  fit: true, // whether to fit the viewport to the graph
  padding: 30, // the padding on fit
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space
  nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  radius: undefined, // the radius of the circle
  startAngle: (3 / 2) * Math.PI, // where nodes start in radians
  sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
  clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
  sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
  animate: true, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
}

// 布局配置：https://github.com/shichuanpo/cytoscape.js-d3-force
export const d3Force = {
  name: 'd3-force',
  animate: false,
  fit: false,
  linkId: function id(d) {
    return d.id
  },
  linkDistance: 100,
  manyBodyStrength: -600,
  ready: function () {
    document.getElementById('progress-box').style.display = 'block'
  },
  stop: function () {
    document.getElementById('progress-box').style.display = 'none'
  },
  tick: function (progress) {
    let text = (progress * 100).toFixed(1) + '%'
    document.getElementById('progress-text').innerHTML = `正在计算布局，请稍后 ${text}`
  },
  randomize: false,
  infinite: false,
}

// 布局配置：https://js.cytoscape.org/#layouts/preset
export const preset = {
  name: 'preset',
  zoom: 1,
  fit: true,
  animate: true,
  animationDuration: 500,
}

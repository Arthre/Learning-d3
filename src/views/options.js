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
  idealEdgeLength: (edge) => 100,
  tilingPaddingVertical: 20,
  tilingPaddingHorizontal: 20,
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

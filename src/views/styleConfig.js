import { memoizeGetSVG } from '@/utils/utils.js'

export const styleConfig = [
  {
    selector: 'node',
    style: {
      width: 30,
      height: 30,
      label: 'data(label)',
      'background-color': 'data(svgColor)',
      // 'background-image': (e) => memoizeGetSVG({ svgName: e.attr('svgName'), svgColor: e.attr('svgColor') }),
      'min-zoomed-font-size': 12,
      'text-wrap': 'wrap',
      'text-margin-y': 5,
      'text-max-width': 200,
      'text-overflow-wrap': 'anywhere',
      'text-valign': 'bottom',
    },
  },
  {
    selector: 'edge',
    style: {
      width: 3,
      label: 'data(label)',
      'line-color': '#ccc',
      'curve-style': 'bezier',
      // 'curve-style': 'segments',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'vee',
      'source-text-offset': 5,
      'target-text-offset': 5,
    },
  },
  {
    selector: ':parent',
    style: {
      'background-color': '#e8e8e8',
      'border-color': '#DADADA',
      'text-valign': 'bottom',
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
      'underlay-color': 'skyblue',
      'underlay-padding': 6,
      'underlay-opacity': 0.8,
      'line-color': '#157af7',
      'target-arrow-color': '#157af7',
      'source-arrow-color': '#157af7',
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
      'border-color': 'deeppink',
      'border-width': '2px',
    },
  },
  {
    selector: 'node.faded',
    style: { opacity: '0.5' },
  },
  {
    selector: 'edge.highlight',
    style: { 'line-color': 'deeppink', 'target-arrow-color': 'deeppink', 'source-arrow-color': 'deeppink' },
  },
  {
    selector: 'edge.faded',
    style: { opacity: '0.2' },
  },
  {
    selector: '.hidden',
    style: { display: 'none' },
  },
  {
    selector: '.invisible',
    style: { visibility: 'hidden' },
  },
  {
    selector: '.taxi-edge',
    style: { 'curve-style': 'taxi', 'taxi-direction': 'downward', 'taxi-turn': 20, 'taxi-turn-min-distance': 5 },
  },
  {
    selector: '.none-arrow',
    style: { 'target-arrow-shape': 'none' },
  },
  {
    selector: '.dashed-edge',
    style: { 'line-style': 'dashed' },
  },
  {
    selector: '.desc-node',
    style: {
      shape: 'rectangle',
      label: 'data(label)',
      width: 'data(width)',
      height: 'data(height)',
      'background-color': 'data(backgroundColor)',
      'text-halign': 'center',
      'text-valign': 'center',
      'line-height': 1.5,
      'font-size': 20,
      'font-weight': 'bold',
      'min-zoomed-font-size': 0,
      'text-overflow-wrap': 'anywhere',
      'text-justification': 'left',
      'text-wrap': 'wrap',
      'text-events': 'no',
    },
  },
]
export default styleConfig

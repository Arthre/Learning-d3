import { getSVG } from '@/utils/utils.js'

export const styleConfig = [
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
      'curve-style': 'bezier',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'vee',
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
      'line-color': 'SteelBlue',
      'target-arrow-color': 'SteelBlue',
      'source-arrow-color': 'SteelBlue',
    },
  },
  {
    selector: '.hidden',
    style: { display: 'none' },
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
]
export default styleConfig

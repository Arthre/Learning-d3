export default {
  nodes: [
    {
      data: {
        id: 'node0',
        label: '父辈',
      },
    },
    {
      data: {
        id: 'node1',
        parent: 'node0',
        label: '男',
      },
    },
    {
      data: {
        id: 'node2',
        parent: 'node0',
        label: '女',
      },
    },
    {
      data: {
        id: 'node4',
        label: '余洋(辈分)',
        svgName: 'suspicious',
        svgColor: '#79f2ea',
        parent: 'node1',
      },
    },
    {
      data: {
        id: 'node44',
        label: '余洋(辈分)',
        svgName: 'suspicious',
        svgColor: '#79f2ea',
        parent: 'node1',
      },
    },
    {
      data: {
        id: 'node5',
        label: '程伟(辈分)',
        svgName: 'suspicious',
        svgColor: '#a379f2',
        parent: 'node2',
      },
    },
    {
      data: {
        id: 'node55',
        label: '程伟(辈分)',
        svgName: 'suspicious',
        svgColor: '#a379f2',
        parent: 'node2',
      },
    },

    {
      data: {
        id: 'node6',
        label: '同辈',
      },
    },
    {
      data: {
        id: 'node7',
        parent: 'node6',
        label: '男',
      },
    },
    {
      data: {
        id: 'node8',
        parent: 'node6',
        label: '女',
      },
    },
    {
      data: {
        id: 'node9',
        label: '余洋(辈分)',
        svgName: 'suspicious',
        svgColor: '#79f2ea',
        parent: 'node7',
      },
    },
    {
      data: {
        id: 'node10',
        label: '程伟(辈分)',
        svgName: 'suspicious',
        svgColor: '#a379f2',
        parent: 'node8',
      },
    },

    {
      data: {
        id: 'node11',
        label: '子辈',
      },
    },
    {
      data: {
        id: 'node12',
        parent: 'node11',
        label: '男',
      },
    },
    {
      data: {
        id: 'node13',
        parent: 'node11',
        label: '女',
      },
    },
    {
      data: {
        id: 'node14',
        label: '余洋(辈分)',
        svgName: 'suspicious',
        svgColor: '#79f2ea',
        parent: 'node12',
      },
    },
    {
      data: {
        id: 'node15',
        label: '程伟(辈分)',
        svgName: 'suspicious',
        svgColor: '#a379f2',
        parent: 'node13',
      },
    },
    {
      data: {
        id: 'node16',
        label: '张三',
        svgName: 'suspicious',
        svgColor: '#79f280',
      },
    },
  ],
  edges: [
    {
      data: {
        id: 'edge0',
        target: 'node0',
        source: 'node16',
      },
    },
    // {
    //   "data": {
    //     "id": "edge1",
    //     "source": "node44",
    //     "target": "node16",
    //     "label": "父辈"
    //   }
    // },
    // {
    //   "data": {
    //     "id": "edge2",
    //     "source": "node5",
    //     "target": "node16",
    //     "label": "父辈"
    //   }
    // },
    // {
    //   "data": {
    //     "id": "edge3",
    //     "source": "node55",
    //     "target": "node16",
    //     "label": "父辈"
    //   }
    // },
    // {
    //   "data": {
    //     "id": "edge4",
    //     "source": "node9",
    //     "target": "node16",
    //     "label": "同辈"
    //   }
    // },
    {
      data: {
        id: 'edge5',
        target: 'node6',
        source: 'node16',
      },
    },
    {
      data: {
        id: 'edge20',
        target: 'node11',
        source: 'node16',
      },
    },
  ],
}

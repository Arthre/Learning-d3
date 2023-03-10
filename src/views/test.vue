<template>
  <div class="container" :style="gridStyle">
    <div v-for="item in fields" :key="item.name" class="grid-item" :style="{ gridArea: item.name }">
      {{ item.name }}
    </div>
  </div>
</template>

<script>
import DataJson from '@/assets/form-build.json'

export default {
  name: 'test',
  data() {
    return {
      fields: DataJson.fields,
      gridStyle: {},
    }
  },
  components: {},
  mounted() {
    this.getStyle(DataJson)
  },
  destroyed() {},
  methods: {
    getStyle(data) {
      const columns = Number(data.form.columns)
      const _fields = [...data.fields]
      let gridTemplate = []
      while (_fields.length > 0) {
        const item = _fields.shift()
        const span = item.span <= columns ? item.span : columns // 自身的大小
        const freeSpace = columns - (gridTemplate.length % columns) // 剩余空间大小
        const selfSpace = Array.from({ length: span }, () => item.name)
        // 当前剩余空间是否能容纳当前字段本身的大小
        // yes：在当前数据后面添加
        // no：用 . 填充剩余空间，并添加字段本身的大小的空间
        if (freeSpace >= span || freeSpace == 0) {
          gridTemplate = [...gridTemplate, ...selfSpace]
        } else {
          gridTemplate = [...gridTemplate, ...Array.from({ length: freeSpace }, () => '.')]
          gridTemplate = [...gridTemplate, ...selfSpace]
        }
      }
      // 用 . 填充最后一行的空缺区域
      if (gridTemplate.length % columns != 0) {
        const fillSpace = columns - (gridTemplate.length % columns)
        gridTemplate = [...gridTemplate, ...Array.from({ length: fillSpace }, () => '.')]
      }
      let length = gridTemplate.length / columns
      let gridTemplateAreas = []
      for (let i = 0; i < length; i++) {
        const index = i * columns
        const sliceArr = gridTemplate.slice(index, index + columns)
        gridTemplateAreas.push(`"${sliceArr.join(' ')}"`)
      }
      this.gridStyle = {
        display: 'grid',
        gap: '10px',
        gridTemplateAreas: gridTemplateAreas.join(' '),
      }
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  max-width: 80%;
  margin: 0 auto;
}
.grid-item {
  min-height: 60px;
  text-align: center;
  background-color: deeppink;
  border-radius: 10px;
}
</style>

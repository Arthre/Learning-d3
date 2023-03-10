<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconHref" />
  </svg>
</template>

<script>
export default {
  name: 'svgIcon',
  props: {
    iconName: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
  },
  computed: {
    svgClass() {
      //svg 的class
      if (this.className) {
        return `svg-icon ${this.className}`
      } else {
        return 'svg-icon'
      }
    },
    iconHref() {
      //svg xlink-href 指向的文件名
      return `#icon-${this.iconName}`
    },
  },
}
</script>
<style scoped>
.svg-icon {
  width: 100%;
  height: 100%;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>

<template>
  <div>
    <form-create v-model="fApi" :rule="rule" :option="options" />
  </div>
</template>

<script>
import ruleJson from '@/assets/json/rule.json'

export default {
  name: 'formBuild',
  data() {
    return {
      fApi: {},
      rule: ruleJson,
      options: {},
    }
  },
  components: {},
  mounted() {},
  destroyed() {},
  methods: {
    onSubmit(data) {
      console.log(data)
    },
  },
}
</script>

<style lang="less" scoped></style>

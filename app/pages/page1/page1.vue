<template>
  <h1>page1</h1>
  <el-table :data="tableData">
    <el-table-column label="姓名" prop="name" />
    <el-table-column label="年龄" prop="age" />
    <el-table-column label="地址" prop="address" />
  </el-table>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import curl from '$elpisCommon/curl'
const tableData = ref([])

onMounted(() => {
  curl({ url: '/api/project/getlist' }).then((res) => {
  })
})

</script>

<style lang="less" scoped>
h1 {
  color: red;
}
</style>

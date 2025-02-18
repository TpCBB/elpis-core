<template>
    <h1>page1</h1>

    <input v-model="content" type="text">

    {{ content }}

</template>

<script setup>
import { ref } from 'vue';
import utils from '$common/utils'
const content = ref('')

console.log(utils)
</script>

<style lang="less" scoped>
h1 {
    color: red;
}
</style>
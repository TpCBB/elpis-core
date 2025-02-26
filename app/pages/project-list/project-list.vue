<template>
  <HeaderContainer :title="'项目列表'">
    <template #main-content>
      <div v-loading="loading">
        <div v-for="item in modelList" :key="item.model?.key">
          <!-- 展示model -->
          <div class="model-panel">
            <el-row type="flex" align="middle">
              <div class="title"> {{ item.model?.name }} </div>
            </el-row>
            <div class="divider"></div>
          </div>
          <!-- 展示project -->
          <el-row type="flex" class="project-list">
            <el-card v-for="projItem in item.project" :key="projItem.key" class="project-card">
              <template #header>
                <div class="title">
                  <span>{{ projItem.name }}</span>
                </div>
              </template>
              <div class="content">
                {{ projItem.desc ?? '--------' }}
              </div>
              <template #footer>
                <el-row justify="end">
                  <el-button type="primary" link @click="onEnter(projItem)">进入项目</el-button>
                </el-row>
              </template>
            </el-card>
          </el-row>
        </div>
      </div>
    </template>
  </HeaderContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import curl from '$common/curl'
import HeaderContainer from '$widgets/header-container/header-container.vue'

const loading = ref(false)
const modelList = ref([])

// 获取项目列表
async function getModelList() {
  loading.value = true
  const res = await curl({ method: 'get', url: '/api/project/getModelList', errorMessage: '获取项目列表失败' })
  loading.value = false

  if (!res || !res.success || !res.data) {
    return
  }

  modelList.value = res.data
}

onMounted(() => {
  getModelList()
})

// 进入项目
function onEnter(projItem) {
  const { origin } = window.location
  window.open(`${origin}/view/dashboard#${projItem.homePage}`)
}
</script>

<style lang="less" scoped>
.model-panel {
  margin: 20px 50px;
  min-width: 500px;
  .title {
    font-size: 25px;
    font-weight: bold;
    color: #e5e5e5;
  }
  .divider {
    margin-top: 10px;
    border-bottom: 1px dashed #d7d7d7;
    width: 200px;
  }
}
.project-list {
  margin: 0 50px;
  .project-card {
    margin-right: 30px;
    margin-bottom: 20px;
    width: 300px;
    .title {
      font-weight: bold;
      font-size: 17px;
      color: #47a2ff;
    }
    .content {
      height: 70px;
      color: darkgray;
      font-size: 15px;
      overflow: scroll;
    }
  }
}
</style>

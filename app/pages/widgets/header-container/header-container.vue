<!-- 通用的头部组件 具体的容器 -->
<template>
  <el-container class="header-container">
    <el-header class="header">
      <el-row type="flex" align="middle" justify="space-between" class="header-row">
        <!-- 左上方 title -->
        <el-row type="flex" align="middle" class="title-panel">
          <img src="./asserts/logo.png" class="logo" />
          <el-row>{{ title }}</el-row>
        </el-row>
        <!-- 插槽 菜单区域 -->
        <slot name="menu-content"></slot>
        <!-- 右上方 信息展示 -->
        <el-row type="flex" align="middle" justify="end" class="setting-panel">
          <slot name="setting-content"></slot>
          <img src="./asserts/avatar.png" alt="" class="avatar" />
          <el-dropdown @command="handleUserCommand">
            <span class="userName">{{ userName }}<i class="el-icon-arrow-down el-icon--right"></i></span>
            <template #dropdown>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </template>
          </el-dropdown>
        </el-row>
      </el-row>
      <el-main class="main-container">
        <!-- 核心内容-->
        <slot name="main-content" />
      </el-main>
    </el-header>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
defineProps({
  title: String
})

const userName = ref('管理员')

const handleUserCommand = (event) => {
  if (event === 'logout') {
    console.log('退出登录')
  }
}
</script>

<style lang="less" scoped>
.header-container {
  height: 100%;
  min-width: 100px;
  overflow: hidden;

  .header {
    max-height: 120px;
    border-bottom: 1px solid #e8e8e8;

    .header-row {
      color: #fff;
      height: 60px;
      padding: 0 20px;

      .title-panel {
        width: 180px;
        min-width: 180px;

        .logo {
          margin-right: 10px;
          width: 25px;
          height: 25px;
          border-radius: 50%;
        }

        .text {
          font-size: 15px;
          font-weight: 500;
        }
      }
      .setting-panel {
        min-width: 180px;
        .avatar {
          margin-right: 12px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .userName {
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          outline: none;
        }
      }
    }
  }

  .main-container {
  }
}

:deep(.el-header) {
  padding: 0;
}
</style>

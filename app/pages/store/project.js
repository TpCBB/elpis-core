import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectStore = defineStore('project', () => {
  // Project list
  const projectList = ref([])

  // Set the project list
  const setProjectList = (list) => {
    projectList.value = list
  }

  return {
    projectList,
    setProjectList
  }
})

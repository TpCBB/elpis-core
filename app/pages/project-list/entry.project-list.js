import boot from '$pages/boot'
import projectList from '$pages/project-list/project-list.vue'

const routes = []
const libs = []

boot(projectList, { routes, libs })

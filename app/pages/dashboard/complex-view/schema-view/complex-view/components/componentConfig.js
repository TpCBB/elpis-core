import createForm from './create-form/create-form.vue'
import editForm from './edit-form/edit-form.vue'
import detailPanel from './detail-panel/detail-panel.vue'
import businessComponentsConfig from '$businessComponentsConfig'


const componentConfig = {
  createForm: {
    component: createForm
  },
  editForm: {
    component: editForm
  },
  detailPanel: {
    component: detailPanel
  },
}

export default {
  ...componentConfig,
  ...businessComponentsConfig
}

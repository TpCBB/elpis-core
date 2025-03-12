import input from './complex-view/input/input.vue'
import inputNumber from './complex-view/input-number/input-number.vue'
import select from './complex-view/select/select.vue'
import dateRange from './complex-view/date-range/date-range.vue'

const FormItemConfig = {
  input: {
    component: input
  },
  inputNumber: {
    component: inputNumber
  },
  select: {
    component: select
  },
  dateRange: {
    component: dateRange
  }
}
export default FormItemConfig

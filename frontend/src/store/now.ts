import { reactive, readonly } from 'vue'

const state = reactive({
  now: new Date(),
});

setInterval(() => {
  state.now = new Date()
}, 1000)

export const store = readonly({
  state,
});

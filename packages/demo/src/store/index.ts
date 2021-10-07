import { createStore, createLogger } from 'vuex'

import face from './modules/face'
import webcam from './modules/webcam'

// const debug = process.env.NODE_ENV !== "production";
const debug = false

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    face,
    webcam,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
})

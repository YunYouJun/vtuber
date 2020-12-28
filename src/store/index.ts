import { createStore, createLogger } from "vuex";

import face from "./modules/face";

// const debug = process.env.NODE_ENV !== "production";
const debug = false;

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    face,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});

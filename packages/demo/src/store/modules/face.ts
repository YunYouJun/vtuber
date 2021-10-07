const state = () => ({
  points: [],
})

const mutations = {
  setPoints(state: any, val: any[]) {
    state.points = val
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}

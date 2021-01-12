const state = () => ({
  flip: false,
});

const mutations = {
  setFlip(state: any, val: boolean) {
    state.flip = val;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};

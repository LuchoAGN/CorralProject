import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dialogFacturacion: false,
    countUpdate: 0,
  },
  getters: {
  },
  mutations: {
    setDialogFacturacion(state, data){
      state.dialogFacturacion = data;
    },
    setCountUpdate(state, data){
      state.countUpdate = data;
    }
  },
  actions: {
  },
  modules: {
  }
})

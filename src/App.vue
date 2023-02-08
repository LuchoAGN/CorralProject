<template>
  <v-app>
    <v-app-bar
      app
      color="amber lighten-2"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          elevation="24"
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          :src="logo_img"
          transition="scale-transition"
          width="60"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn v-if="isExist"
        class="btn_exit"
        color="error"
        elevation="5"
        small
        depressed
        @click="logout()"
      >
        Salir
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

import logo_img from './assets/aves-de-corral.png'
import api from './api/index.js';

export default {
  name: 'App',
  data(){
    return{
      logo_img,
      isExist: false,
    }
  },
  mounted(){
    this.isExist = localStorage.getItem('user');
  },
  methods:{
    logout: async function (){
      var self = this;
      const config = {
        Authorization: `Bearer ${JSON.parse(localStorage.user).token}`,
      };
      console.log(config);
      await api
        .requestH("post", "/logout", config)
        .then((response) => {
          console.log(response);
          if(response.status == 200){
            localStorage.removeItem("user");
            self.$router.replace("/login");
            window.location.reload();
          }
        })
        .catch(function (e) {
            console.log(e);
        });
    }
  }
};
</script>
<style>
  .btn_exit.theme--dark.v-btn.v-btn--has-bg{
    background-color: #ff5252 !important;
  }
</style>

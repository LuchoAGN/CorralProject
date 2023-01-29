<template>
  <v-app>
    <v-app-bar
      app
      color="amber lighten-2"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          :src="logo_img"
          transition="scale-transition"
          width="60"
        />
      </div>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

import logo_img from './assets/aves-de-corral.png'

export default {
  name: 'App',
  data(){
    return{
      logo_img
    }
  }
};
</script>

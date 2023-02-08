<template>
  <div>
    <v-bottom-navigation
      v-model="value"
      :background-color="color"
      dark
      shift
    >
      <v-btn>
        <span>Crear</span>

        <v-icon>mdi-table-row-plus-after</v-icon>
      </v-btn>

      <v-btn>
        <span>Activos</span>

        <v-icon>mdi-table-row </v-icon>
      </v-btn>

      <v-btn>
        <span>Facturacion</span>

        <v-icon>mdi-table-row-height</v-icon>
      </v-btn>

      <v-btn>
        <span>Historial</span>

        <v-icon>mdi-table-arrow-down</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <bodyCard :color="color"/>

  </div>
</template>
<script>

import bodyCard from '../body/BodyCard.vue';

export default {
    name: 'MenuOpt',
    components:{
      bodyCard
    },
    data(){
        return{
          value: 1,
        }
    },
    computed: {
      color () {
        switch (this.value) {
          case 0: return 'blue-grey'
          case 1: return 'teal'
          case 2: return 'brown'
          case 3: return 'indigo'
          default: return 'blue-grey'
        }
      },
    },
    mounted(){
      window.scrollTo(0, 0);
    },
    methods:{

    }
}
</script>
<style>
    .theme--dark.v-btn.v-btn--has-bg {
      background-color: transparent!important;
    }
    .v-btn:not(.v-btn--round).v-size--default {
      height: 56px!important;
    }
</style>
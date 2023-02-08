<template>
  <v-container>
    <MenuOpt v-if="!isAdmin"/>
    <CardReg v-if="isAdmin"/>
  </v-container>
</template>

<script>
  
  import MenuOpt from './menu/MenuOpcion.vue';
  import CardReg from './body/CardRegister.vue';

  export default {
    name: 'Inicio',
    components:{
      MenuOpt,
      CardReg
    },
    data(){
      return{
        isAdmin: null,
      }
    },  
    mounted(){
      this.detectRol();
      window.scrollTo(0, 0);
    },
    methods:{
      detectRol: async function(){
        if('user' == await JSON.parse(localStorage.getItem('user')).dataperson.rol){
          this.isAdmin = false;
        }else{
          this.isAdmin = true;
        }
      }
    }
  }
</script>

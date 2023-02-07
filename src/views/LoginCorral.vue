<template>
  <div v-if="sizeHeight != null" :style="`height: ${sizeHeight-250}px!important; display: flex;
    align-items: center;`">
    <v-container>
      <v-card
        elevation="24"
      > 
        <h1 class="text-title pt-3">
          Ingrese al sistema
        </h1>
        <form @submit.prevent="submit" class="pa-6 ma-2">
            <v-text-field
              v-model="email"
              :rules="[rules.required]"
              label="E-mail"
            ></v-text-field>

            <v-text-field
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="show ? 'text' : 'password'"
              name="input-10-2"
              label="Contraseña"
              hint="Al menos 8 caracteres"
              v-model="password"
              class="input-group--focused"
              @click:append="show = !show"
            ></v-text-field>
          <v-btn
            :loading="loading"
            :disabled="loading"
            @click="login(); loader = 'loading';"
            block
            class="mt-6"
            color="success"
            type="submit"
          >
            Login
            <template v-slot:loader>
              <span class="custom-loader">
                <v-icon light>mdi-cached</v-icon>
              </span>
            </template>
          </v-btn>
      
        </form>
      </v-card>
    </v-container>
  </div>
</template>
<script>
import api from '../api/index.js';

export default {
  name: "loginCorral",
  components: {

  },
  data(){
    return{
      sizeHeight: null,
      email: '',
      password: '',
      show: false,
      rules: {
        required: value => !!value || 'Requerido',
        min: v => v.length >= 8 || 'Minimo 8 caracteres',
      },
      loading: false,
      loader: null
    }
  },
  mounted(){
    this.sizeHeight = window.screen.height;
  },
  methods:{
    login: async function (){
      var obj = {
        email: this.email,
        password: this.password
      };

      await api
        .request("post", "/login", obj)
        .then((data) => {
            console.log(data)
        })
        .catch(function (e) {
            console.log(e);
        });
    }
  },
  watch: {
    loader () {
      const l = this.loader
      this[l] = !this[l]

      setTimeout(() => (this[l] = false), 3000)

      this.loader = null
    },
  },
}
</script>
<style>

  .text-title{
    text-align: center;
    font-weight: 300;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }

  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
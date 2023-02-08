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
        <form @submit.prevent="login();" class="pa-6 ma-2">
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

    <v-snackbar
      v-model="notiFail"
      color="red accent-2"
      outlined
      timeout="5000"
      :top="true"
    >
      Email o contraseña incorrecta

      <template v-slot:action="{ attrs }">
          <v-btn
          color="red accent-2"
          text
          v-bind="attrs"
          @click="notiFail = false"
          >
          <v-icon>
              mdi-close
          </v-icon>
          </v-btn>
      </template>
    </v-snackbar>
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
      notiFail: false,
    }
  },
  mounted(){
    this.sizeHeight = window.screen.height;
  },
  methods:{
    login: async function (){
      var self = this;

      self.loading = true;
      var infoperson = null
      var tokenO = null;
      var obj = {
        email: this.email,
        password: this.password
      };

      await api
        .request("post", "/login", obj)
        .then((response) => {
          tokenO = response.data.token
        })
        .catch(function () {
          self.notiFail = true;
        });

      if(tokenO != null){
        const config = {
          Authorization: `Bearer ${tokenO}`,
        };
        await api
        .requestH("get", "/user-profile", config)
        .then((response) => {
          infoperson = { 
            dataperson: response.data.userData,
            token: tokenO        
          }
        })
        .catch(function () {
          self.notiFail = true;
        });
      }

      if(infoperson != null){
        window.localStorage.setItem("user", JSON.stringify(infoperson));
        this.$router.push("/");
        window.location.reload();
      }
      self.loading = false;
    }
  },
  watch: {
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
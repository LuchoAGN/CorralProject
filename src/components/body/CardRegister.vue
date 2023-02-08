<template>

    <div v-if="sizeHeight != null" :style="`height: ${sizeHeight-250}px!important; display: flex;
        align-items: center;`"
    >
        <v-container>
            <v-card
                elevation="24"
            >
                <h1 class="text-title pt-3">
                    Registro de usuarios
                </h1>
                <form @submit.prevent="register();" class="pa-2 ma-2">
                    <v-row>
                        <v-col cols="6">
                            <v-text-field
                                v-model="email"
                                :rules="[rules.required]"
                                label="E-mail"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                v-model="name"
                                :rules="[rules.required]"
                                label="Nombres"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
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
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                :rules="[rules.required, rules.min, rules.equals]"
                                :type="show1 ? 'text' : 'password'"
                                name="input-10-2"
                                label="Contraseña"
                                hint="Al menos 8 caracteres"
                                v-model="password_confirmation"
                                class="input-group--focused"
                                @click:append="show1 = !show1"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-btn
                        :loading="loading"
                        :disabled="loading"
                        block
                        class="mt-6"
                        color="success"
                        type="submit"
                    >
                        Registrar Usuario
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
            v-model="notiSuccess"
            color="success"
            outlined
            timeout="5000"
            :top="true"
        >
            Se ha creado el <strong>Usuario</strong>

            <template v-slot:action="{ attrs }">
                <v-btn
                color="success"
                text
                v-bind="attrs"
                @click="notiSuccess = false"
                >
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </template>
        </v-snackbar>

        <v-snackbar
            v-model="notiFail"
            color="red accent-2"
            outlined
            timeout="5000"
            :top="true"
        >
            No se ha podido registrar el usuario
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

import api from '../../api/index.js';

export default {
    name: 'CardReg',
    data(){
        return{
            sizeHeight: null,
            show: false,
            show1: false,
            loading: false,
            notiFail: false,
            notiSuccess: false,
            rules: {
                required: value => !!value || 'Requerido',
                min: v => v.length >= 8 || 'Minimo 8 caracteres',
                equals: value => value == this.password || 'Las contraseñas deben coincidir',
            },
            email: '',
            name: '',
            password: '',
            password_confirmation: ''
        }
    },
    mounted(){
        this.sizeHeight = window.screen.height;
    },
    methods:{
        register: async function(){
            var self = this;
            var obj = {
                name: this.name,
                email: this.email,
                password: this.password,
                password_confirmation: this.password_confirmation,
                rol: "user"
            };
            const config = {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
            };
            await api
                .requestOH("post", "/register", obj, config)
                .then(() => {
                    self.notiSuccess = true;
                })
                .catch(function () {
                    self.notiFail = true;
                });
            
            if(this.notiSuccess){
                this.email = '';
                this.name = '';
                this.password = '';
                this.password_confirmation = '';
            }
        }
    }
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
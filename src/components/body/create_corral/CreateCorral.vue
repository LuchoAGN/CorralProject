<template>
    <div>
        <v-card
            elevation="1"
        >
            <h2 class="text-title pt-3">
                Registro de corrales
            </h2>
            <form @submit.prevent="createCorrales();" class="pa-2 ma-2">
                <v-row>
                    <v-col cols="12">
                        <v-text-field
                            height="13"
                            v-model="name"
                            :rules="[rules.required]"
                            label="Nombre del corral"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <v-text-field
                            height="13"
                            v-model="num_chicken"
                            :rules="[rules.required]"
                            label="Numero de pollos"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field
                            height="13"
                            v-model="price_chicken"
                            :rules="[rules.required]"
                            label="Precio unitario de los pollos"
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
                    small
                >
                    Crear Corral
                    <template v-slot:loader>
                        <span class="custom-loader">
                            <v-icon light>mdi-cached</v-icon>
                        </span>
                    </template>
                </v-btn>
            </form>
        </v-card>

        <v-card elevation="1" v-if="dataCorral.length > 0" class="mt-4">
            <v-list>
                <v-subheader class="text-subtitle">Corrales</v-subheader>
                <v-list-item-group
                  color="primary"
                  style="height: 25vh; overflow-y: scroll!important;"
                >
                  <v-list-item
                    v-for="(item, i) in dataCorral"
                    :key="i"
                  >
                    <v-list-item-icon>
                        <font-awesome-icon icon="fa-solid fa-xmarks-lines" class="fa-3x" 
                            :class="item.status == 'active' ? 'xmarks_active' : 'xmark_desactive'"/>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title class="text-a" v-text="`Nombre: ${item.name}`"></v-list-item-title>
                        <v-list-item-title class="text-a" v-text="`Numero de pollos: ${item.num_chicken}`"></v-list-item-title>
                        <v-list-item-title class="text-a" v-text="`Precio unitario: ${(item.price_chicken).toLocaleString('es-CO')}$`"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-card>

        <v-overlay :value="overlay">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>

        <v-snackbar
            v-model="notiSuccess"
            color="success"
            outlined
            timeout="5000"
            :top="true"
        >
            Se ha creado el <strong>Corral</strong>

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
            No se ha podido crear el <strong>Corral</strong>
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

import api from '../../../api/index.js';

export default {
    name: "CreateCorral",
    data(){
        return{
            overlay: true,
            loading: false,
            rules: {
                required: value => !!value || 'Requerido',
            },
            name: '',
            num_chicken: '',
            price_chicken: '',
            id_user: JSON.parse(localStorage.getItem('user')).dataperson.id,
            notiSuccess: false,
            notiFail: false,
            dataCorral: []
        }
    },
    mounted(){
        this.getDataCorral();
    },
    methods:{
        createCorrales: async function(){
            var self = this;
            var obj = {        
                name: this.name,
                num_chicken: this.num_chicken,
                price_chicken: this.price_chicken,
                status: "active",
                sales_chicken: 0,
                deaths_chicken: 0,
                id_user: this.id_user,
                value_insumo: 0,
            };
            const config = {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
            };
            await api
                .requestOH("post", "/corrales", obj, config)
                .then(() => {
                    self.notiSuccess = true;
                })
                .catch(function () {
                    self.notiFail = true;
                });
            
            if(this.notiSuccess){
                this.name = '';
                this.num_chicken = '';
                this.price_chicken = '';
                await this.getDataCorral();
            }
        },
        getDataCorral: async function(){
            var self = this;
            const config = {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
            };
            await api
                .requestH("get", `/corrales/${JSON.parse(localStorage.getItem('user')).dataperson.id}`, 
                    config)
                .then((response) => {
                    self.dataCorral = response.data;
                    self.overlay = false;
                })
                .catch(function () {
                });
        }
    }
}
</script>
<style>

    .xmarks_active{
        color: #a18262;
    }
    
    .xmarks_desactive{
        color: grey;
    }

    .text-subtitle{
        font-size:  20px;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        color: #212121!important;
    }
    .v-label{
        font-size: 12px;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    }

</style>
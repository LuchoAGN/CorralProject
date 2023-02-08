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
                            v-model="name"
                            :rules="[rules.required]"
                            label="Nombre del corral"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <v-text-field
                            v-model="num_chicken"
                            :rules="[rules.required]"
                            label="Numero de pollos"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field
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
            loading: false,
            rules: {
                required: value => !!value || 'Requerido',
            },
            name: '',
            num_chicken: '',
            price_chicken: '',
            id_user: JSON.parse(localStorage.getItem('user')).dataperson.id,
            notiSuccess: false,
            notiFail: false
        }
    },
    mounted(){

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
                id_user: this.id_user
            };
            const config = {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
            };
            await api
                .requestOH("post", "/corrales", obj, config)
                .then((response) => {
                    console.log(response)
                    self.notiSuccess = true;
                })
                .catch(function (e) {
                    self.notiFail = true;
                    console.log(e);
                });
            
            if(this.notiSuccess){
                this.name = '';
                this.num_chicken = '';
                this.price_chicken = '';
            }
        }
    }
}
</script>
<style>
    
</style>
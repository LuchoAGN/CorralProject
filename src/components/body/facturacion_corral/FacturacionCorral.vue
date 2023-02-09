<template>
    <div>
        <v-card
            elevation="1"
        >
            <div style="display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;"
            >
                <v-select
                    id="select-corral"
                    class="ma-2"
                    :items="items"
                    label="Seleccione un corral"
                    dense
                    outlined
                ></v-select>
                <v-btn
                    class="ma-2"
                    color="success"
                    small
                >
                    Seleccionar
                </v-btn>
            </div>
        </v-card>

        <v-overlay :value="overlay">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
    </div>
</template>
<script>

import api from '../../../api/index.js';

export default {
    name: 'FactuarionCorral',
    data(){
        return{
            items: [],
            dataCorral: [],
            overlay: true,
        }
    },
    mounted(){
        this.getDataCorral();
    },
    methods:{
        getDataCorral: async function(){
            var self = this;
            const config = {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
            };
            await api
                .requestH("get", `/corrales/${JSON.parse(localStorage.getItem('user')).dataperson.id}`, 
                    config)
                .then((response) => {
                    console.log(response)
                    self.dataCorral = response.data;
                    self.overlay = false;
                })
                .catch(function () {
                });

            this.dataCorral.map( function(element){
                self.items.push({
                    text: element.name,
                    value: element.id
                })
            });
        }
    }
}
</script>
<style>
    #select-corra .v-text-field__details {
        display: none!important;
    }
</style>
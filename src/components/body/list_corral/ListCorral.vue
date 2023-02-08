<template>
    <div>

        <v-card elevation="1" v-if="dataCorral.length > 0" class="mt-4">
            <v-list>
                <v-subheader class="text-subtitle">Lista de corrales activos</v-subheader>
                <v-list-item-group
                color="primary"
                style="height: 55vh; overflow-y: scroll!important;"
                >
                    <div v-for="(item, i) in dataCorral"
                    :key="i">
                    <v-list-item
                        
                    >   
                        <v-list-item-content>
                            <v-list-item-title class="mb-2" v-text="`Nombre: ${item.name}`"/>
                            <!-- <v-list-item-title class="mb-2" v-text="``"/> -->

                            <v-list-item-title v-text="`Total vendidos:`"/>
                            <v-list-item-title class="mb-2" v-text="`${item.sales_chicken}`"/>

                            <v-list-item-title v-text="`Balance estimado:`"/>
                            <v-list-item-title class="mb-2" v-text="`${parseInt(item.price_chicken)*parseInt(item.num_chicken)}$`"/>

                            <v-list-item-title v-text="`Recaudo:`"/>
                            <v-list-item-title class="mb-2" v-text="`${parseInt(item.price_chicken)*parseInt(item.sales_chicken)}$`"/>

                        </v-list-item-content>
                        <v-list-item-content>
                            <v-list-item-title v-text="`Numero de pollos:`"/>
                            <v-list-item-title class="mb-2" v-text="`${item.num_chicken}`"/>

                            <v-list-item-title v-text="`Total muertos:`"/>
                            <v-list-item-title class="mb-2" v-text="`${item.deaths_chicken}`"/>

                            <v-list-item-title v-text="`Gastos de insumo:`"/>
                            <v-list-item-title v-text="`0$`"/>
                            
                        </v-list-item-content>
                        
                    </v-list-item>
                    <v-divider/>
                </div>
                    
                </v-list-item-group>
            </v-list>
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
    name: 'ListCorral',
    data(){
        return{
            dataCorral: [],
            overlay: true
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
    
</style>
<template>
    <div>
        <v-card elevation="1" v-if="dataCorral.length > 0">
            <div>
                <v-subheader class="text-subtitle">Lista de corrales activos</v-subheader>
                <div style="height: 55vh; overflow-y: scroll!important;">
                    <v-expansion-panels>
                        <v-expansion-panel
                            v-for="(item, i) in dataCorral"
                            :key="i"
                        >
                            <v-expansion-panel-header>
                                <p class="text-a"><strong>{{item.name}}</strong></p>
                                <p class="text-a"><strong>Ganancia estimada: {{ (((item.price_chicken*item.num_chicken)-parseInt(item.value_insumo)-(item.deaths_chicken*item.price_chicken))).toLocaleString('es-CO') }}$</strong></p>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <div class="panel-row">
                                    <p class="text-a">Numero de pollos: {{ item.num_chicken }}</p> &nbsp; 
                                    <p class="text-a">Total muertos: {{ item.deaths_chicken }}</p> &nbsp;
                                </div>
                                <div class="panel-row">
                                    <p class="text-a">Total vendidos: {{ item.sales_chicken }}</p> &nbsp;
                                    <p class="text-a">Recaudo: {{ (item.price_chicken*item.sales_chicken-parseInt(item.value_insumo)).toLocaleString('es-CO') }}$</p> &nbsp;
                                </div>
                                <div class="panel-row">
                                    <p class="text-a">Gastos de insumo: {{ (parseInt(item.value_insumo)).toLocaleString('es-CO') }}$</p>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div> 
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
            var dataC = [];
            const config = {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
            };
            await api
                .requestH("get", `/corrales/${JSON.parse(localStorage.getItem('user')).dataperson.id}`, 
                    config)
                .then((response) => {
                    dataC = response.data;
                    self.overlay = false;
                })
                .catch(function () {
                });
            
            dataC.map(function(element){
                if(element.status == "active"){
                    self.dataCorral.push(element)
                }
            })
        }
    }
}
</script>
<style>
    div.panel-row{
        justify-content: space-between;
        display: flex;
        flex-direction: row;
    }
    .text-a{
        font-size: 12px;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    }
</style>
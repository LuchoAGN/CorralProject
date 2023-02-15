<template>
    <div>
        <v-card
            elevation="1"
        >
            <div class="select-corral"
            >
                <v-select
                    class="ma-2"
                    v-model="select_corral"
                    :items="items"
                    label="Seleccione el corral"
                    dense
                    outlined
                    @change="filtCorral();"
                ></v-select>
            </div>
        </v-card>

        <v-card
            v-if="filtData != null"
            elevation="1"
            class="mt-4"
        >
            <div class="pa-2">
                <div class="panel-row">
                    <p class="text-a">Numero de pollos: {{ filtData.num_chicken }}</p> &nbsp; 
                    <p class="text-a">Total muertos: {{ filtData.deaths_chicken }}</p> &nbsp;
                </div>
                <div class="panel-row">
                    <p class="text-a">Total vendidos: {{ filtData.sales_chicken }}</p> &nbsp;
                    <p class="text-a">Recaudo: {{ (filtData.price_chicken*filtData.sales_chicken-parseInt(filtData.value_insumo)).toLocaleString('es-CO') }}$</p> &nbsp;
                </div>
                <div class="panel-row">
                    <p class="text-a">Gastos de insumo: {{ filtData.value_insumo }}$</p>
                </div>
                <div class="panel-row">
                    <p class="text-a">Ganancia estimada: {{ (((filtData.price_chicken*filtData.num_chicken)-parseInt(filtData.value_insumo)-(filtData.deaths_chicken*filtData.price_chicken))).toLocaleString('es-CO') }}$</p>
                </div>
            </div>
            <v-fab-transition>
                <v-btn
                style="margin-bottom: 50px; right: 30px;"
                color="brown"
                outlined
                fab
                absolute
                bottom
                right
                small
                @click="activeDialog();"
                >
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </v-fab-transition>
        </v-card>

        <v-card
            v-if="filtData != null"
            elevation="1"
            class="mt-4"
        >
            <form class="pa-2 ma-2">
                <v-row>
                    <v-col cols="6">
                        <v-text-field
                            type="number"
                            height="13"
                            v-model="sales_chicken"
                            :rules="[rules.tope_sales_chicken]" 
                            label="Numero de pollos vendidos"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field
                            type="number"
                            height="13"
                            v-model="deaths_chicken"
                            :rules="[rules.tope_deaths_chicken]"
                            label="Numero de pollos muertos"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <v-text-field
                            type="number"
                            height="13"
                            v-model="value_insumo"
                            :rules="[rules.value_tope]"
                            label="Costo del insumo"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row style="justify-content: flex-end;">
                    <v-col cols="7" v-if="!activeFinish">
                        <v-btn
                            :loading="loading"
                            :disabled="loading"
                            block
                            class="mt-0"
                            color="success"
                            type="submit"
                            small
                            @click="registerCostos();"
                        >
                            Registrar costos
                            <template v-slot:loader>
                                <span class="custom-loader">
                                    <v-icon light>mdi-cached</v-icon>
                                </span>
                            </template>
                        </v-btn>
                    </v-col>

                    <v-col cols="8" v-if="activeFinish">
                        <v-btn
                            :loading="loading"
                            :disabled="loading"
                            block
                            class="mt-0"
                            color="success"
                            type="submit"
                            small
                            @click="facturarCorral();"
                        >
                            Finalizar facturación
                            <template v-slot:loader>
                                <span class="custom-loader">
                                    <v-icon light>mdi-cached</v-icon>
                                </span>
                            </template>
                        </v-btn>
                    </v-col>
                </v-row>
            </form>
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
            Se ha registrado los cambios del corral

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
            Supera el numero de pollos
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
        <dialogFacturacion :activeEdit="activeEdit" :filtData="filtData"/>
    </div>
</template>
<script>

import api from '../../../api/index.js';
import dialogFacturacion from './modals/DialogFacturacion.vue';

export default {
    name: 'FactuarionCorral',
    components:{
        dialogFacturacion
    },
    data(){
        return{
            activeEdit: false,
            notiFail: false,
            notiSuccess: false,
            rules: {
                tope_sales_chicken: value => this.deaths_chicken == 0 ? 
                (parseInt(value) <= this.filtData.num_chicken ? 
                    (parseInt(value)+this.filtData.sales_chicken+this.filtData.deaths_chicken) <= this.filtData.num_chicken : 
                    "Supera el numero de pollos") : (parseInt(this.deaths_chicken)+parseInt(value) <= this.filtData.num_chicken ? 
                    (parseInt(this.deaths_chicken)+parseInt(value)+this.filtData.sales_chicken+this.filtData.deaths_chicken) <= this.filtData.num_chicken : 
                    "Supera el numero de pollos"),

                tope_deaths_chicken: value => this.sales_chicken == 0 ? 
                (parseInt(value) <= this.filtData.num_chicken ? 
                    (parseInt(value)+this.filtData.sales_chicken+this.filtData.deaths_chicken) <= this.filtData.num_chicken : 
                    "Supera el numero de pollos") : (parseInt(this.sales_chicken)+parseInt(value) <= this.filtData.num_chicken ? 
                    (parseInt(this.sales_chicken)+parseInt(value)+this.filtData.sales_chicken+this.filtData.deaths_chicken) <= this.filtData.num_chicken : 
                    "Supera el numero de pollos"),
                
                value_tope: value => value < ((this.filtData.price_chicken*this.filtData.num_chicken)-(this.filtData.price_chicken*this.filtData.deaths_chicken))-this.filtData.value_insumo 
                    || "No puede exceder las ganacias",
            },
            loading: false,
            sales_chicken: 0,
            deaths_chicken: 0,
            value_insumo: 0,
            activeFinish: false,
            items: [],
            dataCorral: [],
            overlay: true,
            select_corral: null,
            filtData: null,
            id_user: JSON.parse(localStorage.getItem('user')).dataperson.id,
            token: JSON.parse(localStorage.getItem('user')).token
        }
    },
    mounted(){
        this.getDataCorral();
    },
    methods:{
        activeDialog(){
            this.activeEdit = true;
            this.$store.commit("setDialogFacturacion", true);
        },
        getDataCorral: async function(){
            var self = this;
            const config = {
                Authorization: `Bearer ${this.token}`,
            };
            await api
                .requestH("get", `/corrales/${this.id_user}`, 
                    config)
                .then((response) => {
                    console.log(response)
                    self.dataCorral = response.data;
                    self.overlay = false;
                })
                .catch(function () {
                });

            this.dataCorral.map( function(element, index){
                if(element.status == "active"){
                    self.items.push({
                        text: element.name,
                        value: element.id
                    })
                }
                if(self.filtData == null){
                    if(index == 0){
                        self.select_corral = element.id;
                    }
                }
            });

            await this.filtCorral()
            this.sales_chicken = 0;
            this.deaths_chicken = 0;
        },
        filtCorral: async function(){
            var self = this
            this.dataCorral.map( function(element){
                if(element.id == self.select_corral && element.status == "active"){
                    self.filtData = {
                        id: element.id,
                        name: element.name,
                        num_chicken: parseInt(element.num_chicken),
                        price_chicken: parseInt(element.price_chicken),
                        status: element.status,
                        sales_chicken: parseInt(element.sales_chicken),
                        deaths_chicken: parseInt(element.deaths_chicken),
                        id_user: element.id_user,
                        value_insumo: parseInt(element.value_insumo),
                        created_at: element.created_at,
                        updated_at: element.updated_at,
                    }
                }
            });
            this.activeFinish = await this.filtData.sales_chicken + this.filtData.deaths_chicken == this.filtData.num_chicken ? true : false;
            this.loading = false;
        },
        registerCostos: async function(){
            this.loading = true;
            var sales = this.rules.tope_sales_chicken(this.sales_chicken)
            var death = this.rules.tope_deaths_chicken(this.deaths_chicken)
            var veryInsumo = this.rules.value_tope(parseInt(this.value_insumo))

            if(sales == true && death == true && veryInsumo == true){
                var self = this;
                var sales_chicken = parseInt(this.sales_chicken);
                var deaths_chicken = parseInt(this.deaths_chicken);
                var value_insumo  = parseInt(this.value_insumo);

                var obj = {        
                    name: this.filtData.name,
                    num_chicken: this.filtData.num_chicken,
                    price_chicken: this.filtData.price_chicken,
                    status: "active",
                    sales_chicken: this.filtData.sales_chicken+sales_chicken,
                    deaths_chicken: this.filtData.deaths_chicken+deaths_chicken,
                    id_user: this.id_user,
                    value_insumo: this.filtData.value_insumo+value_insumo,
                };

                const config = {
                    Authorization: `Bearer ${this.token}`,
                };
                await api
                    .requestOH("put", `/corrales/${this.filtData.id}`, obj, config)
                    .then(() => {
                        self.notiSuccess = true;
                    })
                    .catch(function () {
                        self.notiFail = true;
                    });
                
                if(this.notiSuccess){
                    this.sales_chicken = 0,
                    this.deaths_chicken = 0,
                    this.value_insumo = 0,
                    await this.getDataCorral();
                    await this.filtCorral();
                }
                this.loading = false;
            }else{
                this.notiFail = true;
                this.loading = false;
            }
        },
        facturarCorral: async function(){
            this.loading = true;
            var self = this;
            var obj = {        
                name: this.filtData.name,
                num_chicken: this.filtData.num_chicken,
                price_chicken: this.filtData.price_chicken,
                sales_chicken: this.filtData.sales_chicken,
                deaths_chicken: this.filtData.deaths_chicken,
                id_user: this.id_user,
                value_insumo: this.filtData.value_insumo,
                collected: ((this.filtData.price_chicken*this.filtData.num_chicken)-this.filtData.value_insumo)-(this.filtData.deaths_chicken*this.filtData.price_chicken),
            };
            const config = {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
            };

            await api
                .requestOH("post", "/history", obj, config)
                .then(() => {
                    self.notiSuccess = true;
                })
                .catch(function () {
                    self.notiFail = true;
                });
            
            if(this.notiSuccess){
                obj = {        
                    name: this.filtData.name,
                    num_chicken: this.filtData.num_chicken,
                    price_chicken: this.filtData.price_chicken,
                    status: "desactive",
                    sales_chicken: 0,
                    deaths_chicken: 0,
                    id_user: this.id_user,
                    value_insumo: 0,
                };
                await api
                .requestOH("put", `/corrales/${this.filtData.id}`, obj, config)
                .then(() => {
                    self.notiSuccess = true;
                })
                .catch(function () {
                    self.notiFail = true;
                });
                await this.getDataCorral();
            }
            this.loading = false;
        }
    },
    watch:{
        '$store.state.dialogFacturacion': async function(){
            this.activeEdit = this.$store.state.dialogFacturacion == false ? 
            this.$store.state.dialogFacturacion : this.activeEdit;
        },
        '$store.state.countUpdate': async function(){
            await this.getDataCorral();
        },
        sales_chicken(){
            this.sales_chicken = !this.sales_chicken ? 
            this.sales_chicken = 0 : this.sales_chicken = this.sales_chicken;
        },
        deaths_chicken(){
            this.deaths_chicken = !this.deaths_chicken ? 
            this.deaths_chicken = 0 : this.deaths_chicken = this.deaths_chicken;
        },
        value_insumo(){
            this.value_insumo = !this.value_insumo ? 
            this.value_insumo = 0 : this.value_insumo = this.value_insumo;
        }
    }
}
</script>
<style>
    div.select-corral{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }  
    .select-corral .v-text-field__details {
        display: none!important;
    }
    .b-btn{
        font-size: 11px!important;
    }
</style>
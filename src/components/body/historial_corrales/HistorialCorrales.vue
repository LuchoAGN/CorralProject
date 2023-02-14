<template>
    <div>
        <v-card
            elevation="1"
        >
            <div style="display: flex;
            justify-content: center;">
                <v-col style="display: flex;
                flex-direction: column;
                align-items: center;">
                    <v-date-picker
                        class="ma-2"
                        v-model="dates"
                        locale="es_CO"
                        range
                    ></v-date-picker>
                    <v-btn
                        class="ma-2"
                        :loading="loading"
                        :disabled="loading"
                        color="success"
                        small
                        @click="getInformeC();"
                    >
                        Descargar informe
                        <template v-slot:loader>
                            <span class="custom-loader">
                                <v-icon light>mdi-cached</v-icon>
                            </span>
                        </template>
                    </v-btn>
                </v-col>
            </div>
        </v-card>
    </div>
</template>
<script>

import api from '../../../api/index.js';

export default {
    name: 'HistorialCorrales',
    data(){
        return{
            loading: false,
            dates: [],
            id_user: JSON.parse(localStorage.getItem('user')).dataperson.id,
            token: JSON.parse(localStorage.getItem('user')).token
        }
    },
    methods:{
        getInformeC: async function(){
            this.loading = true;
            var obj = null;
            var b64to = "";
            var name = "";

            if(this.dates.length == 0){
                obj = {
                    id_user: this.id_user,
                    keyTime: "all"
                }
            }else if(this.dates.length == 1){
                obj = {
                    id_user: this.id_user,
                    keyTime: "date",
                    fechaInicio: `${this.dates[0]}`
                }
            }else if(this.dates.length == 2){
                obj = {
                    id_user: this.id_user,
                    keyTime: "range",
                    fechaInicio: `${this.dates[0]} 00:00:00`,
                    fechaFin: `${this.dates[1]} 00:00:00`
                }
            }

            const config = {
                Accept: "*/*",
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json"
            };

            console.log(obj);
            await api
                .requestOH("post", `/download-pdf`, obj,
                    config)
                .then((response) => {
                    b64to = response.data.data;
                    name = response.data.name;
                })
                .catch(function () {
                });
                
            const base64 = await fetch(b64to)
            const blob = await base64.blob();
            var fileURL = window.URL.createObjectURL(blob);
            var fileLink = document.createElement("a");
            fileLink.href = fileURL;
            fileLink.setAttribute("download", `${name}.pdf`);
            document.body.appendChild(fileLink);
            fileLink.click();

            this.loading = false;
        },
    },
    watch:{
    }
}
</script>
<style>
    
</style>
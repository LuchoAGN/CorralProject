<template>
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="brown"
        >
          <v-toolbar-title>Editar valores del corral</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            dark
            @click="closeDialog();"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <form class="pa-2 ma-2 mt-12">
          <v-row>
            <v-col cols="6">
                <v-text-field
                    type="number"
                    height="13"
                    v-model="price_chicken"
                    :rules="[rules.value_chicken_tope]"
                    label="Precio unitario de los pollos"
                ></v-text-field>
            </v-col>
            <v-col cols="6">
                <v-text-field
                    type="number"
                    height="13"
                    v-model="num_chicken"
                    :rules="[rules.tope_num_chicken]"
                    label="Numero de pollos"
                ></v-text-field>
            </v-col>
          </v-row>
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
              <v-col cols="7">
                  <v-btn
                      :loading="loading"
                      :disabled="loading"
                      block
                      class="mt-0"
                      color="success"
                      type="submit"
                      small
                      @click="editValue();"
                  >
                      Editar corral
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

      <v-snackbar
        v-model="notiSuccess"
        color="success"
        outlined
        timeout="5000"
        :top="true"
      >
        Se ha registrado los costos

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
    </v-dialog>

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
  </div>
</template>
<script>

import api from '../../../../api/index.js';

export default {
  name: 'dialogFacturacion',
  data(){
    return{
      notiFail: false,
      notiSuccess: false,
      rules: {
          tope_num_chicken: value => parseInt(value) >= this.deaths_chicken+this.sales_chicken 
            || "Debe aumentar el numero de pollos",

          value_chicken_tope: value => ((parseInt(value)*this.num_chicken)-(parseInt(value)*this.deaths_chicken)) >= this.value_insumo 
            || "Debe aumentar el valor unitario",

          tope_sales_chicken: value => parseInt(value)+this.deaths_chicken <= this.num_chicken 
            || "Supera el numero de pollos",

          tope_deaths_chicken: value => parseInt(value)+this.sales_chicken <= this.num_chicken 
            || "Supera el numero de pollos",
          
          value_tope: value => parseInt(value) < ((this.price_chicken*this.num_chicken)-(this.price_chicken*this.deaths_chicken)) 
            || "No puede exceder las ganacias",
      },
      loading: false,
      dialog: false,
      price_chicken: 0,
      num_chicken: 0,
      sales_chicken: 0,
      deaths_chicken: 0,
      value_insumo: 0,
      id_user: JSON.parse(localStorage.getItem('user')).dataperson.id,
      token: JSON.parse(localStorage.getItem('user')).token
    }
  },
  props: [ 'activeEdit', 'filtData' ],
  created(){

  },
  methods:{
    closeDialog(){
      this.dialog = false;
      this.$store.commit("setDialogFacturacion", false);
    },
    editValue: async function(){
      this.loading = true;
      var num = this.rules.tope_num_chicken(this.num_chicken);
      var value = this.rules.value_chicken_tope(this.price_chicken);
      var sales = this.rules.tope_sales_chicken(this.sales_chicken);
      var death = this.rules.tope_deaths_chicken(this.deaths_chicken);
      var veryInsumo = this.rules.value_tope(this.value_insumo);

      if(num == true && value == true && sales == true  && death == true  && veryInsumo == true ){
          var self = this;
          var num_chicken = parseInt(this.num_chicken);
          var price_chicken = parseInt(this.price_chicken);
          var sales_chicken = parseInt(this.sales_chicken);
          var deaths_chicken = parseInt(this.deaths_chicken);
          var value_insumo  = parseInt(this.value_insumo);

          var obj = {        
              name: this.filtData.name,
              num_chicken: num_chicken,
              price_chicken: price_chicken,
              status: "active",
              sales_chicken: sales_chicken,
              deaths_chicken: deaths_chicken,
              id_user: this.id_user,
              value_insumo: value_insumo,
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
            this.notiSuccess = true;
            var count = this.$store.state.countUpdate+1;
            this.$store.commit("setCountUpdate", count);
            this.loading = false;
          }
      }else{
        this.notiFail = true;
        this.loading = false;
      }
  }
  },
  watch:{
    activeEdit(){
      this.dialog =  this.activeEdit == true ?  this.activeEdit : this.dialog;
    },
    filtData(){
      console.log(this.filtData)
      this.price_chicken = this.filtData.price_chicken;
      this.num_chicken = this.filtData.num_chicken;
      this.sales_chicken = this.filtData.sales_chicken;
      this.deaths_chicken = this.filtData.deaths_chicken;
      this.value_insumo = this.filtData.value_insumo;
    }
  }
}
</script>
<style>
  
</style>
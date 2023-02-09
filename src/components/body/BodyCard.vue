<template>
    <div>
        <v-card
            elevation="24"
            :style="colorSelect == 'blue-grey' ?  
                'background-color: #607D8B!important;' : colorSelect == 'brown' ? 
                'background-color: #795548!important;' : colorSelect == 'indigo' ? 
                'background-color: #3F50B2!important;' : 'background-color: #379184!important;'"
        >
            <CreateCorral class="pa-3 ma-2" v-if="colorSelect == 'blue-grey'"/>
            <ListCorral class="pa-3 ma-2" v-if="colorSelect == 'teal'" />
            <FacturacionCorral class="pa-3 ma-2" v-if="colorSelect == 'brown'"/>
            <HistorialCorrales class="pa-3 ma-2" v-if="colorSelect == 'indigo'"/>
            
        </v-card>
    </div>
</template>
<script>

import CreateCorral from './create_corral/CreateCorral.vue';
import FacturacionCorral from './facturacion_corral/FacturacionCorral.vue';
import HistorialCorrales from './historial_corrales/HistorialCorrales.vue';
import ListCorral from './list_corral/ListCorral.vue';

export default {
    name: 'BodyCard',
    components: {
    CreateCorral,
    ListCorral,
    HistorialCorrales,
    FacturacionCorral
},
    data(){
        return{
            colorSelect: 'teal',
        }
    },
    props: [ 'color' ],
    methods:{
        
    },
    watch:{
        color(){
            this.colorSelect = this.color;
        }
    }
}
</script>
<style>
    
</style>
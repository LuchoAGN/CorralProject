<template>
    <div>
        <v-card
            elevation="24"
            :style="colorSelect == 'blue-grey' ?  'background-color: #607D8B!important;' : 'background-color: #009688!important;' "
        >
            <CreateCorral class="pa-3 ma-2" v-if="colorSelect == 'blue-grey'"/>
        </v-card>
    </div>
</template>
<script>

import CreateCorral from './create_corral/CreateCorral.vue';

export default {
    name: 'BodyCard',
    components: {
        CreateCorral,
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
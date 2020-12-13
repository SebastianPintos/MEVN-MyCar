<template>
<div>
<v-tabs background-color="#2764c4" tile dark grow>
      <v-tab  @click="vistaMaestros = true;">ABM</v-tab>
      <v-tab  @click="vistaMaestros = false;">Entregas</v-tab>
   
    </v-tabs>

<Documentacion v-show="vistaMaestros" />
</div>
</template>

<script>
import Documentacion from '@/components/Documentacion.vue';

export default {
   data: () => ({
     vistaMaestros : true,
   }),
   components: {
        Documentacion
    }
};
</script>

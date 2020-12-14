<template>
<div>
<v-tabs background-color="#2764c4" tile dark grow>
      <v-tab  @click="vistaABM = true;">ABM</v-tab>
      <v-tab  @click="vistaABM = false;">Entregas</v-tab>
   
    </v-tabs>

<Documentacion v-show="vistaABM" />
<Entregas v-show="vistaABM==false" />
</div>
</template>

<script>
import Documentacion from '@/components/Documentacion.vue';
import Entregas from '@/components/Entregas.vue';

export default {
   data: () => ({
     vistaABM : true,
   }),
   components: {
        Documentacion,
        Entregas
    }
};
</script>

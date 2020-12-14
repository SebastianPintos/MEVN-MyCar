<template>
<div>
<v-tabs background-color="#2764c4" tile dark grow>
      <v-tab  @click="vistaABM = true;realizadas=false; entregas=false">ABM</v-tab>
      <v-tab  @click="vistaABM = false;realizadas=false;entregas=true">Entregas pendientes</v-tab>
      <v-tab  @click="vistaABM = false;realizadas=true;entregas=false">Entregas realizadas</v-tab>
    </v-tabs>

<Documentacion v-show="vistaABM" />
<Entregas v-show="entregas" />
<EntregasRealizadas v-show="realizadas" />
</div>
</template>

<script>
import Documentacion from '@/components/Documentacion.vue';
import Entregas from '@/components/Entregas.vue';
import EntregasRealizadas from '@/components/EntregasRealizadas.vue';

export default {
   data: () => ({
     vistaABM : true,
     realizadas:false,
     entregas: false
   }),
   components: {
        Documentacion,
        Entregas,
        EntregasRealizadas
    }
};
</script>

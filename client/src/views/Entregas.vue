<template>
<div>
<v-tabs background-color="#2764c4" tile dark grow>
      <v-tab  @click="realizadas=false;entregas=true">pendientes</v-tab>
      <v-tab  @click="realizadas=true;entregas=false">realizadas</v-tab>
    </v-tabs>

<Entregas v-show="entregas" />
<EntregasRealizadas v-show="realizadas" />
</div>
</template>

<script>
import Entregas from '@/components/Entregas.vue';
import EntregasRealizadas from '@/components/EntregasRealizadas.vue';

export default {
   data: () => ({
     realizadas:false,
     entregas: true
   }),
   components: {
        Entregas,
        EntregasRealizadas
    }
};
</script>

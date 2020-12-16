<template>
<div>
<v-tabs background-color="#2764c4" tile dark grow>
      <v-tab  @click="vistaIngresos = true; vistaEgresos = false;">Ingresos  <v-icon>mdi-cash-plus</v-icon></v-tab>
      <v-tab  @click="vistaIngresos = false; vistaEgresos = true;">Egresos  <v-icon>mdi-cash-minus</v-icon></v-tab>
 </v-tabs>

<Egresos v-show="vistaEgresos" />
<Ingresos v-show="vistaIngresos" />
</div>
</template>

<script>
import Ingresos from '@/components/Ingresos.vue';
import Egresos from '@/components/Egresos.vue';

export default {
   data: () => ({
     vistaIngresos : true,
     vistaEgresos: false,
   }),
   components: {
        Egresos,
        Ingresos
    }
};
</script>
<template>
<div>
    <v-tabs background-color="#2764c4" tile dark grow>
        <v-tab @click="vistaVehiculosStock = true; vistaVehiculosEncargue = false">En Stock</v-tab>
        <v-tab @click=" vistaVehiculosStock = false; vistaVehiculosEncargue = true">Por Encargue</v-tab>
    </v-tabs>
    <VentaVehiculosStock v-show="vistaVehiculosStock" />
    <VentaVehiculosEncargue v-show="vistaVehiculosEncargue" />    
</div>
</template>

<script>
import VentaVehiculosEncargue from '@/components/VentaVehiculosEncargue.vue';
import VentaVehiculosStock from '@/components/VentaVehiculosStock.vue';

export default {
    data: () => ({
        vistaVehiculosStock: true,
        vistaVehiculosEncargue: false,
      }),
    components: {
        VentaVehiculosStock,
        VentaVehiculosEncargue,
    },
};
</script>

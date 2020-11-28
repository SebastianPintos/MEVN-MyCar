<template>
<div>
<v-tabs background-color="#2764c4" tile dark grow>
      <v-tab  @click="vistaVehiculos = true; vistaRepuestos = false;">Vehículos</v-tab>
      <v-tab  @click=" vistaVehiculos = false; vistaRepuestos = true;">Repuestos</v-tab>      
</v-tabs>

<VentaVehiculos v-show="vistaVehiculos" />
<VentaRepuestos v-show="vistaRepuestos" />
</div>
</template>

<script>
import VentaRepuestos from '@/components/VentaRepuestos.vue';
import VentaVehiculos from '@/components/VentaVehiculos.vue';

export default {
   data: () => ({
     vistaVehiculos : true,
     vistaRepuestos: false,
   }),
   components: {
        VentaVehiculos,
        VentaRepuestos,
    }
};
</script>

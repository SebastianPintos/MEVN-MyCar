<template>
<div>
<v-tabs background-color="#2764c4" tile dark grow>
      <v-tab  @click="vistaABM = true; vistaProveedores = false; vistaStock = false;">ABM</v-tab>
      <v-tab  @click="vistaStock = true; vistaABM = false; vistaProveedores = false;">Stock</v-tab>
      <v-tab @click="vistaProveedores = true; vistaABM = false; vistaStock=false;">Proveedores</v-tab>
</v-tabs>

<Vehiculos v-show="vistaABM" />
<VehiculosStock v-show="vistaStock" />
<Proveedores tipo="VEHICLE" v-show="vistaProveedores" />
</div>
</template>

<script>
import Vehiculos from '@/components/Vehiculos.vue';
import VehiculosStock from '@/components/VehiculosStock.vue';
import Proveedores from '@/components/Proveedores.vue';

export default {
   data: () => ({
     vistaABM : true,
     vistaProveedores: false,
     vistaStock: false,
   }),
   components: {
        Vehiculos,
        VehiculosStock,
        Proveedores,
    }
};
</script>

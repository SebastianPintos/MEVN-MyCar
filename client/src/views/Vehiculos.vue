<template>
<div>
<v-tabs background-color="#2764c4" tile dark grow>
      <v-tab  @click="vistaABM = true; vistaStock = false; vistaOrdenCompra = false">Vehículos Maestros</v-tab>
      <v-tab  @click="vistaStock = false; vistaABM = false; vistaOrdenCompra=true">Ordenes de Compra</v-tab>
      <v-tab  @click="vistaStock = true; vistaABM = false; vistaOrdenCompra=false">Stock</v-tab>
 </v-tabs>

<Vehiculos v-show="vistaABM" />
<VehiculosStock v-show="vistaStock" />
<OrdenCompraV v-show="vistaOrdenCompra" />
</div>
</template>

<script>
import Vehiculos from '@/components/Vehiculos.vue';
import VehiculosStock from '@/components/VehiculosStock.vue';
import OrdenCompraV from '@/components/OrdenCompraV.vue';

export default {
   data: () => ({
     vistaABM : true,
     vistaStock: false,
     vistaOrdenCompra: false,
   }),
   components: {
        Vehiculos,
        VehiculosStock,
        OrdenCompraV
    }
};
</script>

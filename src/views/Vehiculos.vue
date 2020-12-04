<template>
<div>
<v-tabs background-color="#2764c4" tile dark grow>
      <v-tab  @click="vistaABM = true; vistaProveedores = false; vistaStock = false; vistaOrdenCompra = false">Vehículos Maestros</v-tab>
      <v-tab  @click="vistaStock = false; vistaABM = false; vistaProveedores = false; vistaOrdenCompra=true">Ordenes de Compra</v-tab>
      <v-tab  @click="vistaStock = true; vistaABM = false; vistaProveedores = false; vistaOrdenCompra=false">Stock</v-tab>
      <v-tab @click="vistaProveedores = true; vistaABM = false; vistaStock=false; vistaOrdenCompra=false">Proveedores</v-tab>
</v-tabs>

<Vehiculos v-show="vistaABM" />
<VehiculosStock v-show="vistaStock" />
<Proveedores tipo="VEHICLE" v-show="vistaProveedores" />
<OrdenCompraV v-show="vistaOrdenCompra" />
</div>
</template>

<script>
import Vehiculos from '@/components/Vehiculos.vue';
import VehiculosStock from '@/components/VehiculosStock.vue';
import Proveedores from '@/components/Proveedores.vue';
import OrdenCompraV from '@/components/OrdenCompraV.vue';

export default {
   data: () => ({
     vistaABM : true,
     vistaProveedores: false,
     vistaStock: false,
     vistaOrdenCompra: false,
   }),
   components: {
        Vehiculos,
        VehiculosStock,
        Proveedores,
        OrdenCompraV
    }
};
</script>

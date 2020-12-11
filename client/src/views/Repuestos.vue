<template>
<div>
<v-tabs background-color="#2764c4" tile dark grow>
      <v-tab  @click="vistaMaestros = true; vistaProveedores = false; vistaOrdenes = false;vistaStock=false">Repuestos Maestros</v-tab>
      <v-tab  @click="vistaOrdenes = true; vistaMaestros = false; vistaProveedores = false;vistaStock=false">Ordenes de Compra</v-tab>
      <v-tab  @click="vistaOrdenes = false; vistaMaestros = false; vistaProveedores = false; vistaStock=true">Stock</v-tab>
  </v-tabs>

<Repuestos v-show="vistaMaestros" />
<OrdenCompraR v-show="vistaOrdenes" />
<ProductStock v-show="vistaStock" />
</div>
</template>

<script>
import Repuestos from '@/components/Repuestos.vue';
import OrdenCompraR from '@/components/OrdenCompraR.vue';
import ProductStock from '@/components/ProductStock.vue';

export default {
   data: () => ({
     vistaMaestros : true,
     vistaOrdenes: false,
     vistaStock: false,
   }),
   components: {
        Repuestos,
        OrdenCompraR,
        ProductStock
    }
};
</script>

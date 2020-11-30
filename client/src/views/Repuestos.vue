<template>
<div>
<v-tabs background-color="#2764c4" tile dark grow>
      <v-tab  @click="vistaMaestros = true; vistaProveedores = false; vistaOrdenes = false;vistaStock=false">Repuestos Maestros</v-tab>
      <v-tab  @click="vistaOrdenes = true; vistaMaestros = false; vistaProveedores = false;vistaStock=false">Ordenes de Compra</v-tab>
      <v-tab  @click="vistaOrdenes = false; vistaMaestros = false; vistaProveedores = false; vistaStock=true">Stock</v-tab>
      <v-tab @click="vistaProveedores = true; vistaMaestros = false; vistaOrdenes=false; vistaStock=false">Proveedores</v-tab>
</v-tabs>

<Repuestos v-show="vistaMaestros" />
<RepuestoStock v-show="vistaOrdenes" />
<ProductStock v-show="vistaStock" />
<Proveedores tipo="PRODUCT" v-show="vistaProveedores" />
</div>
</template>

<script>
import Repuestos from '@/components/Repuestos.vue';
import RepuestoStock from '@/components/RepuestoStock.vue';
import Proveedores from '@/components/Proveedores.vue';
import ProductStock from '@/components/ProductStock.vue';

export default {
   data: () => ({
     vistaMaestros : true,
     vistaProveedores: false,
     vistaOrdenes: false,
     vistaStock: false,
   }),
   components: {
        Repuestos,
        RepuestoStock,
        Proveedores,
        ProductStock
    }
};
</script>

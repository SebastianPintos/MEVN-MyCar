<template>
<div>
<v-tabs background-color="#2764c4" tile dark grow>
      <v-tab  @click="vistaABM = true; vistaProveedores = false; vistaStock = false;">ABM</v-tab>
      <v-tab  @click="vistaStock = true; vistaABM = false; vistaProveedores = false;">Stock</v-tab>
      <v-tab @click="vistaProveedores = true; vistaABM = false; vistaStock=false;">Proveedores</v-tab>
</v-tabs>

<Repuestos v-show="vistaABM" />
<RepuestoStock v-show="vistaStock" />
<ProveedoresRepuestos v-show="vistaProveedores" />
</div>
</template>

<script>
import Repuestos from '@/components/Repuestos.vue';
import RepuestoStock from '@/components/RepuestoStock.vue';
import ProveedoresRepuestos from '@/components/ProveedoresRepuestos.vue';

export default {
   data: () => ({
     vistaABM : true,
     vistaProveedores: false,
     vistaStock: false,
   }),
   components: {
        Repuestos,
        RepuestoStock,
        ProveedoresRepuestos,
    }
};
</script>
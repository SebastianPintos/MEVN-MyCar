<template>
<div>
<v-tabs background-color="#2764c4" tile dark grow>
      <v-tab  @click="vistaProveedoresR = true; vistaProveedoresV = false;">Repuestos</v-tab>
      <v-tab  @click="vistaProveedoresR = false; vistaProveedoresV = true;">Vehículos</v-tab>
 </v-tabs>

<Proveedores tipo="VEHICLE" v-show="vistaProveedoresV" />
<Proveedores tipo="PRODUCT" v-show="vistaProveedoresR" />
</div>
</template>

<script>
import Proveedores from '@/components/Proveedores.vue';

export default {
   data: () => ({
     vistaProveedoresR : true,
     vistaProveedoresV: false,
   }),
   components: {
        Proveedores,
    }
};
</script>

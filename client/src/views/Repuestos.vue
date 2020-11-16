<template>
<div>
<v-tabs>
      <v-tab @click="vistaABM = true">ABM</v-tab>
      <v-tab @click="vistaABM = false">Stock</v-tab>

</v-tabs>

<Repuestos v-show="vistaABM" />
<RepuestoStock v-show="vistaABM==false" />
</div>
</template>

<script>
import Repuestos from '@/components/Repuestos.vue';
import RepuestoStock from '@/components/RepuestoStock.vue';

export default {
  
   data: () => ({
     vistaABM : true,
   }),
   components: {
        Repuestos,
        RepuestoStock,
    }
};
</script>
<template>
  <v-app>
    <Navegacion/>
    <v-main>
      <router-view></router-view>
    </v-main>
    
  </v-app>
</template>

<script>
import Navegacion from "@/components/Navegacion.vue";

export default {
  name: "App",

  data: () => ({

  }),
  components: {
    Navegacion
  }
};
</script>

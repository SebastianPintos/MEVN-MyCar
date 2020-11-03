<template>
<v-app >
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
<style >
.bkg-img{
  padding-bottom: 80px;
}
.titulo{
  text-align: center;
  margin: 40px;
  margin-bottom: 70px;
  font-size: 75px;
  color: white;
  font-family: 'Montserrat', sans-serif;
  border-bottom: ridge;
}
.mb-2{
  margin-left: 3px;
  margin-right: 3px;
}
</style>
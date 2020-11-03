<template>
<v-app >
  <div class="appl">
    <Navegacion/>
    <v-main>
      <router-view></router-view>
    </v-main>
  </div>
    
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
.appl{
background-image: url("./assets/Hellcat.jpg");
height: 100vh;
background-size: cover;
background-position-x: center;
}
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
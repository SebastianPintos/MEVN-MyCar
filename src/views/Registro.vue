<template>
  <div class="registro">
    
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      nombre: "",
      apellido: "",
      email: "",
      contraseña: "",
      repContraseña: "",
      info: ""
    };
  },
  mounted() {
    axios
      .get("https://jsonplaceholder.typicode.com/todos/1")
      .then(response => (this.info = response.data));
  }
};
</script>

<style></style>

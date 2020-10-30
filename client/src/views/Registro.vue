<template>
  <div class="registro">
    <div class="container">
      <h1 class="titulo">Registrarse</h1>
      <h2>{{ info }}</h2>
      <br /><br />
      <label for="nombre"><b>Nombre</b></label>
      <input type="text" v-model="nombre" id="nombre" placeholder="Nombre" />
      <label for="apellido"><b>Apellido</b></label>
      <input
        type="text"
        v-model="apellido"
        id="apellido"
        placeholder="Apellido"
      />
      <label for="email"><b>Email</b></label>
      <input type="email" v-model="email" id="email" placeholder="Email" />
      <label for="contraseña"><b>Contraseña</b></label>
      <input
        type="password"
        v-model="contraseña"
        id="contraseña"
        placeholder="Contraseña"
      />
      <label for="repContraseña"><b>Repetir contraseña</b></label>
      <input
        type="password"
        v-model="repContraseña"
        id="repContraseña"
        placeholder="Repetir contraseña"
      />
      <button type="submit">Registrarse</button>
    </div>
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

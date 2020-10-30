<template>
  <div class="login">
    <div class="container">
      <h1 class="titulo">Iniciar Sesión</h1>
      <br /><br />
      <label for="uname"><b>Usuario</b></label>
      <input type="text" placeholder="Usuario" name="uname" required />
      <br />
      <label for="psw"><b>Contraseña</b></label>
      <input type="password" placeholder="Contraseña" name="psw" required />
      <br />
      <button type="submit">Login</button>
      <label>
        <input
          type="checkbox"
          checked="checked"
          v-model="recordarme"
          name="remember"
        />
        Recordarme
      </label>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recordarme: "true",
      usuario: "",
      contraseña: ""
    };
  }
};
</script>

<style>
.titulo {
  text-align: center;
}
.container {
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 100px;
  margin-bottom: 100px;
  padding: 25px 25px 25px 25px;
  border-radius: 10px;
  background-color: #e0e0e0;
  text-align: left;
}
.container > * {
  margin-top: 15px;
  margin-bottom: 10px;
}
@media screen and (max-width: 768px) {
  .container {
    width: 80%;
  }
}
label {
  padding-left: 10px;
}
input:not([type="checkbox"]) {
  width: 100%;
  padding: 12px 20px;
  margin: 15px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 14px 20px;
  margin: 0px 0;
  border: none;
  cursor: pointer;
  width: 100%;
}

button:hover {
  opacity: 0.8;
}
</style>

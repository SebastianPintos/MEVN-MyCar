<template>
    <div class="registro">
        <div class="container">
            <h1> Registrarse </h1>
            <br><br>
            <label for="nombre"><b>Nombre</b></label>
            <input type="text" v-model="nombre" id="nombre" placeholder="Nombre">
            <label for="apellido"><b>Apellido</b></label>
            <input type="text" v-model="apellido" id="apellido" placeholder="Apellido">
            <label for="email"><b>Email</b></label>
            <input type="email" v-model="email" id="email" placeholder="Email">
            <label for="contraseña"><b>Contraseña</b></label>
            <input type="password" v-model="contraseña" id="contraseña" placeholder="Contraseña">
            <label for="repContraseña"><b>Repetir contraseña</b></label>
            <input type="password" v-model="repContraseña" id="repContraseña" placeholder="Repetir contraseña">
            <button type="submit">Registrarse</button>
        </div>
    </div>  
</template>

<script>
export default {
    data() {
        return {
            nombre: '',
            apellido: '',
            email: '',
            contraseña: '',
            repContraseña: '',
        }
    }
}
</script>

<style>
</style>
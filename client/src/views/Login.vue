<template>
    <div class="login">
        <div class="container">
            <label for="uname"><b>Usuario</b></label>
            <input type="text" placeholder="Usuario..." name="uname" required>
            <br>
            <label for="psw"><b>Contraseña</b></label>
            <input type="password" placeholder="Contraseña..." name="psw" required>
            <br>
            <button type="submit">Login</button>
            <label>
            <input type="checkbox" checked="checked" v-model="recordarme" name="remember"> Recordarme
            </label>
        </div>
    </div>  
</template>

<script>
export default {
    data() {
        return {
            recordarme: 'true',
        }
    }
}
</script>

<style>
    .container{
        width: 50%;
        margin-left: auto;
        margin-right: auto;
        margin-top: 100px;
        padding: 25px 25px 25px 25px;
        border-radius: 10px;
        background-color: #e0e0e0;
    }
    .container > *{
        margin-top: 15px;
        margin-bottom: 10px;
    }
    input[type=text], input[type=password] {
    width: 100%;
    padding: 12px 20px;
    margin: 15px 0;
    display: inline-block;
    border: 1px solid #ccc;
    box-sizing: border-box;
    }

    button {
    background-color: #4CAF50;
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
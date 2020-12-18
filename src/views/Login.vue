<template>
  <div class="login">
    <v-container >
    <v-card class="mx-auto my-12" max-width="400" elevation="5">
      <v-card-title class="justify-center">Iniciar Sesión</v-card-title>
      <v-card-text>
        <v-form>
      <v-row class="justify-center">
        <v-col
          sm="11" xs="11"
        >
         <v-text-field
            v-model="user"
            :rules="[rules.required]"
            name="input-10-1"
            label="Usuario"
           ></v-text-field>
        </v-col>
        </v-row>
        <v-row class="justify-center">
        <v-col sm="11" xs="11">
         <v-text-field
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Contraseña"
            counter
            @click:append="show1 = !show1"
          ></v-text-field>
        </v-col>
   </v-row> 
    <v-container>
      <v-alert dense type="error" v-if="error != ''">
      {{error}}
    </v-alert>
    </v-container>
   <v-row class="justify-center">
        <v-col sm="4" xs="11">
          <v-btn color="primary" elevation="2" @click="validateLogin()">Ingresar</v-btn>
        </v-col>
   </v-row>
  </v-form>
  </v-card-text>
    </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import urlAPI from '../config/config';
export default {
  data() {
    return {
      recordarme: "true",
      user: "",
      contraseña: "",
      error: "",
      show1: false,
      show2: true,
      show3: false,
      show4: false,
      password: "",
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
        emailMatch: () => `The email and password you entered don't match`,
      },
    };
  },
  methods: {
    validateLogin(){
      axios.post( urlAPI + 'login',{
          "user": this.user,
          "password": this.password
      })
      .then(data => {
          localStorage.setItem("token", data.data.token)
          localStorage.setItem("logged", true)
          this.getUser()
          this.$router.push('/')
      })
      .catch(data => this.error = data.response.data.title)
    },
    getUser(){
      axios.get(urlAPI + 'getinfo',{
          "headers":{
            "token": localStorage.getItem('token')
          }
        })
        .then(data => {
          localStorage.setItem("userType",data.data.Hierarchy)
          localStorage.setItem("userName",data.data.Name + " " + data.data.LastName)
          localStorage.setItem("employee",JSON.stringify(data.data))
          })
    }
  }
};
</script>

<style>
.md-2 {
  width: 40%;
  padding-left: 10%;
}
</style>

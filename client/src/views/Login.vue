<template>
  <div class="login">
      <v-form>
      
    <v-container fluid class="md-2">
      <h2>Ingrese sus datos para continuar</h2>
      <v-row>
        <v-col
          cols="12"
          sm="6"
        >
         <v-text-field
            v-model="email"
            :rules="[rules.required]"
            name="input-10-1"
            label="Usuario"
           ></v-text-field>
        </v-col>
        </v-row>
        <v-row>
        <v-col>
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
    </v-container>
  </v-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recordarme: "true",
      usuario: "",
      contraseña: "",
        show1: false,
        show2: true,
        show3: false,
        show4: false,
        password: 'Password',
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
          emailMatch: () => (`The email and password you entered don't match`),
        },
    };
  }
};
</script>

<style>
  .md-2{
    width: 40%;
    padding-left: 10%;
  }
  h2{
    text-align: center;
    color: white;
  }
</style>

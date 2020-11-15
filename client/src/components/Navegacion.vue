<template>
  <div>

      <v-app-bar 
      app
      color="#2764c4"
      dark
      tile
      >

      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title>{{currentPage}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn class="success" >Ingresar</v-btn>

      </v-app-bar>
       <v-navigation-drawer
      v-model="drawer"
      app
      temporary
    >
    
      <v-list
        nav
      >
      <v-list-item>
        <v-list-item-avatar color="primary" size="60">
            <span class="white--text headline">CJ</span>
        </v-list-item-avatar>
        
        <v-list-item-content>
          <v-list-item-title>Juan Carlos</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

       <v-divider></v-divider>

        <v-list-item-group
          v-model="group"
          active-class="indigo--text text--accent-4"
        >
         <v-list-item @click="bind('Home')" :to="'/'">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title >Home</v-list-item-title>
          </v-list-item>
          
          <v-list-item  @click="bind('Clientes')" :to="'/clientes'">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title >Clientes</v-list-item-title>
          </v-list-item>

           <v-list-item @click="bind('Proveedores')" :to="'/proveedores'">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title >Proveedores</v-list-item-title>
          </v-list-item>

          <v-list-item @click="bind('Vehiculos')" :to="'/vehiculos'">
            <v-list-item-icon>
              <v-icon>mdi-car</v-icon>
            </v-list-item-icon>
            <v-list-item-title >Vehiculos</v-list-item-title>
          </v-list-item>

          <v-list-item @click="bind('Repuestos')" :to="'/repuestos'">
            <v-list-item-icon>
              <v-icon>mdi-hammer-wrench</v-icon>
            </v-list-item-icon>
            <v-list-item-title >Repuestos</v-list-item-title>
          </v-list-item>

            <v-list-item @click="bind('Reservas')" :to="'/reservas'">
            <v-list-item-icon>
              <v-icon>mdi-calendar</v-icon>
            </v-list-item-icon>
            <v-list-item-title >Reservas</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {

  data: () => ({
    drawer: false,
    group: null,
    currentPage: '',
  }),
  methods: {
    bind(data){
      this.currentPage = data;
    }
  },
};
</script>

<style>

</style>

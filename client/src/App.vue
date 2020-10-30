<template>
  <v-app>
    <v-toolbar app max-height=64 tile>

      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title>My Car</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn class="success" >Ingresa</v-btn>

      </v-toolbar>
       <v-navigation-drawer
      v-model="drawer"
      app
      temporary
        
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="indigo--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
      
    <v-content>
      <router-view></router-view>
    </v-content>
    
  </v-app>
</template>

<script>

export default {
  name: "App",

  data: () => ({
    drawer: false,
    group: null,
  })
};
</script>

<template>
<div>

    <v-app-bar app color="#2764c4" dark tile>

        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

        <v-toolbar-title>{{$route.name}}</v-toolbar-title>

        <v-spacer></v-spacer>

        <div v-if="isLogged()" class="text-center">
            <v-menu offset-y>
                <template v-slot:activator="{ attrs, on }">
                    <v-btn color="primary" class="white--text ma-5" v-bind="attrs" v-on="on">
                        {{userName}}
                        <v-icon>
                            mdi-chevron-down
                        </v-icon>
                    </v-btn>

                </template>
                <v-list>
                    <v-list-item link to="/configuracion">
                        <v-list-item-title>Configuración</v-list-item-title>
                    </v-list-item>

                    <v-list-item link @click="logout()">
                        <v-list-item-title>Salir</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <v-btn v-if="!isLogged()" color="success" to="/login">INGRESAR</v-btn>

    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app temporary>

        <v-spacer></v-spacer>
        <v-list nav shaped>
            <v-list-item-group v-model="group" active-class="indigo--text text--accent-4">
                <v-list-item :to="'/'">
                    <v-list-item-icon>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Inicio</v-list-item-title>
                </v-list-item>

                <v-list-item v-if="validateUsers('Vendedor','Supervisor')" :to="'/clientes'">
                    <v-list-item-icon>
                        <v-icon>mdi-account</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Clientes</v-list-item-title>
                </v-list-item>

                <v-list-item v-if="validateUsers('Vendedor','Supervisor')" :to="'/reservas'">
                    <v-list-item-icon>
                        <v-icon>mdi-calendar</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Reservas</v-list-item-title>
                </v-list-item>

                <v-list-group prepend-icon="mdi-clipboard-list-outline ">
                    <template v-slot:activator>
                        <v-list-item-title>Inventario</v-list-item-title>
                    </template>

                    <v-list-item :to="'/repuestos'">
                        <v-list-item-icon>
                            <v-icon>mdi-car-cog</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Repuestos</v-list-item-title>
                    </v-list-item>
                    <v-list-item :to="'/vehiculos'">
                        <v-list-item-icon>
                            <v-icon>mdi-car</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Vehiculos</v-list-item-title>
                    </v-list-item>
                </v-list-group>

                <v-list-group prepend-icon="mdi-cog-outline">
                    <template v-slot:activator>
                        <v-list-item-title>Configuración</v-list-item-title>
                    </template>
                    <v-list-item :to="'/sucursales'">
                        <v-list-item-icon>
                            <v-icon>mdi-store</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Sucursales</v-list-item-title>
                    </v-list-item>
                    <v-list-item :to="'/mails'">
                        <v-list-item-icon>
                            <v-icon>mdi-email-multiple</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Conf. Mails</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="validateUsers('Supervisor','Supervisor Taller', 'Gerente','Administrador')" :to="'/empleados'">
                        <v-list-item-icon>
                            <v-icon>mdi-account-tie </v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Empleados</v-list-item-title>
                    </v-list-item>

                </v-list-group>

                <v-list-item :to="'/servicios'">
                    <v-list-item-icon>
                        <v-icon>mdi-hammer-wrench</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Servicios</v-list-item-title>
                </v-list-item>

                <v-list-item :to="'/ventas'">
                    <v-list-item-icon>
                        <v-icon>mdi-briefcase-variant-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Ventas</v-list-item-title>
                </v-list-item>

                <v-list-item :to="'/documentacion'">
                    <v-list-item-icon>
                        <v-icon>
                            mdi-file-document-multiple-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Documentación</v-list-item-title>
                </v-list-item>
                
                <v-list-item :to="'/entregas'">
                    <v-list-item-icon>
                        <v-icon>
                            mdi-truck-delivery-outline</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Entregas</v-list-item-title>
                </v-list-item>

                  <v-list-item :to="'/caja'">
                    <v-list-item-icon>
                        <v-icon>
                           mdi-cash-register</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Caja</v-list-item-title>
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
        userName: ''
    }),
    methods: {
        validateUsers(...authorizedUsers) {
            if (localStorage.getItem('userType') != null) {
                return (authorizedUsers.includes(localStorage.getItem('userType'))) ? true : false
            }
            return false;
        },
        isLogged() {
            if (localStorage.getItem('userName') != null) {
                this.userName = localStorage.getItem('userName')
                return true
            }
            return false;
        },
        logout() {
            localStorage.clear();
            this.$router.push('/login')
        }
    },
    computed: {

    }
};
</script>

<style>

</style>

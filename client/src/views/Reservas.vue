<template>
<div>
<v-flex auto>
    <v-tabs background-color="#2764c4" tile dark grow>
        <v-tab @click="vistaReservas=false; vistaServicios=true">Servicios</v-tab>
        <v-tab @click="vistaReservas=true; vistaServicios=false">Turnos</v-tab>
    </v-tabs>
    <Reservas v-if="vistaReservas" />
    <ListaServicios v-if="vistaServicios" />
</v-flex>
</div>
</template>

<script>
import Reservas from '@/components/Reservas.vue';
import ListaServicios from '@/components/ListaServicios.vue';

export default {
    data: () => ({
        fab: true,
        vistaReservas: false,
        vistaServicios: true,
    }),
    components: {
        Reservas,
        ListaServicios
    }
};
</script>

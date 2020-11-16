V<template>
<div>
    <v-data-table v-model="selected" :single-select="singleSelect" show-select :headers="headers" :items="servicios" :search="search" item-key="_id" class="elevation-1">
        <template v-slot:item.actions="{ item }">

            <v-btn fab small color="success">
                <v-icon class="text-center" @click="agregar=false">
                    mdi-cart-plus</v-icon>
            </v-btn>
            <v-btn fab small color="error">
                <v-icon class="text-center" @click="editItem(item)">
                    mdi-cart-remove</v-icon>
            </v-btn>

        </template>
        <template v-slot:top>
            <v-toolbar flat>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details></v-text-field>
                <v-divider class="mx-4" dark vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" @click="editItem(selected[0])">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>

                <v-btn color="error" dark class="mb-2" v-bind="attrs" v-on="on" @click="deleteItem()">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on" @click="deleteItem()">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-toolbar>
        </template>
    </v-data-table>

    <template>
        <v-speed-dial v-model="fab" :top="top" :right="right" :direction="direction" :open-on-hover="hover" :transition="transition">
            <template v-slot:activator>
                <v-flex class="text-right">
                    <v-btn v-model="fab" color="warning" dark fab>
                        <v-icon v-if="fab">
                            mdi-close
                        </v-icon>
                        <v-icon v-else>
                            mdi-cart-outline
                        </v-icon>
                    </v-btn>
                </v-flex>
            </template>
            <v-col class="text-right" style="margin-left: 20px; margin-top: -20px; margin-bottom: -20px">
                <v-btn fab dark small color="info">
                    <v-icon>mdi-check</v-icon>
                </v-btn>
            </v-col>
            <v-col class="text-right" style="margin-left: 20px;">
                <v-btn fab dark small color="info">
                    <v-icon>mdi-cart-off </v-icon>
                </v-btn>
            </v-col>
        </v-speed-dial>
    </template>

</div>
</template>

<script>
export default {
    data: () => ({
        agregar: true,
        selected: [],
        direction: 'top',
        fab: false,
        search: '',
        singleSelect: true,
        fling: false,
        hover: false,
        tabs: null,
        top: true,
        right: true,
        bottom: true,
        left: false,
        transition: 'slide-y-reverse-transition',

        headers: [{
                text: 'Nombre',
                value: 'Description',
                align: 'start',
                sortable: false,
            },
            {
                text: 'Precio',
                value: 'Precio',
            },
            {
                text: 'Sucursal',
                value: 'Sucursal',
            },
            {
                text: 'Duración',
                value: 'Duración',
            },
            {
                text: 'Marca',
                value: 'Marca'
            },
            {
                text: 'Modelo',
                value: 'Modelo'
            },
            {
                text: 'Año',
                value: 'Año'
            },

            {
                text: 'Acciones',
                value: 'actions',
                sortable: false
            },

        ],

        service: {
            Description: 'Servicio de los 100km',
            Precio: '1000',
            Sucursal: 'Sucursal A',
            Duración: '30 min',
            Marca: 'Marca',
            Modelo: 'Modelo',
            Año: 'Año',
            Repuestos: 'Rep1, rep2, rep3',
            Sucursales: 'S1, S2, S3..',
        },
        servicios: [{
                _id: 1,
                Description: 'Servicio de los 100km',
                Precio: '1000',
                Sucursal: 'Sucursal A',
                Duración: '30 min',
                Marca: 'Marca',
                Modelo: 'Modelo',
                Año: 'Año',
                Repuestos: 'Rep1, rep2, rep3',
                Sucursales: 'S1, S2, S3..',
            },
            {
                _id: 2,
                Description: 'Servicio de los 100km',
                Precio: '1000',
                Sucursal: 'Sucursal A',
                Duración: '30 min',
                Marca: 'Marca',
                Modelo: 'Modelo',
                Año: 'Año',
                Repuestos: 'Rep1, rep2, rep3',
                Sucursales: 'S1, S2, S3..',
            }, {
                _id: 3,
                Description: 'Servicio de los 100km',
                Precio: '1000',
                Sucursal: 'Sucursal A',
                Duración: '30 min',
                Marca: 'Marca',
                Modelo: 'Modelo',
                Año: 'Año',
                Repuestos: 'Rep1, rep2, rep3',
                Sucursales: 'S1, S2, S3..',
            }, {
                _id: 4,
                Description: 'Servicio de los 100km',
                Precio: '1000',
                Sucursal: 'Sucursal A',
                Duración: '30 min',
                Marca: 'Marca',
                Modelo: 'Modelo',
                Año: 'Año',
                Repuestos: 'Rep1, rep2, rep3',
                Sucursales: 'S1, S2, S3..',
            }, {
                _id: 5,
                Description: 'Servicio de los 100km',
                Precio: '1000',
                Sucursal: 'Sucursal A',
                Duración: '30 min',
                Marca: 'Marca',
                Modelo: 'Modelo',
                Año: 'Año',
                Repuestos: 'Rep1, rep2, rep3',
                Sucursales: 'S1, S2, S3..',
            },
        ]
    }),
};
</script>

<style>

</style>

V<template>
<div>
    <v-data-table v-model="selected" :single-select="singleSelect" show-select :headers="headers" :items="servicios" :search="search" item-key="_id" class="elevation-1">
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
</div>
</template>

<script>
import axios from "axios";

export default {
    data: () => ({
        selected: [],
        search: '',
        singleSelect: true,
        on: '',
        attrs: '',

        editedItem: {
            Description: '',
            LaborPrice: '',
            Time: '',
            Marca: '',
            Modelo: '',
            Año: '',
            BranchOffice: '',
        },

        defaultItem: {
            Description: '',
            LaborPrice: '',
            Time: '',
            Marca: '',
            Modelo: '',
            Año: '',
            BranchOffice: '',
        },

        headers: [{
                text: 'Nombre',
                value: 'Description',
                align: 'start',
                sortable: false,
            },
            {
                text: 'Precio',
                value: 'LaborPrice',
            },
            {
                text: 'Sucursal',
                value: 'BranchOffice.Name',
            },
            {
                text: 'Duración',
                value: 'Time',
            },
            {
                text: 'Marca-Vehículo',
                value: 'Vehicle.Brand'
            },
            {
                text: 'Modelo-Vehículo',
                value: 'Vehicle.Model'
            },
            {
                text: 'Año-Vehículo',
                value: 'Vehicle.Year'
            },

            {
                text: 'Acciones',
                value: 'actions',
                sortable: false
            },
        ],

        servicios: [],
        sucursales: [],
        repuestos: [],
    }),
    created() {
        this.iniciar();
    },
    methods: {
        iniciar() {
            this.getServicios();
            this.getSucursales();
            this.getRepuestos();
        },

        async getServicios() {
            let servicios = [];
            await axios.get('http://localhost:8081/service')
                .then(res => {
                    servicios = res.data.service.filter(aService => aService.Status === "ACTIVE");
                    if (servicios != null) {
                        servicios.forEach(servicio => {
                         if (servicio.BranchOffice.length > 0) {
                                servicio.BranchOffice.forEach(sucursal => {
                                    let servicioAGuardar ={
                                            "Description": servicio.Description,
                                            "LaborPrice": servicio.LaborPrice,
                                            "Time": servicio.Time,
                                            "Vehicle": servicio.Vehicle,
                                            "BranchOffice": sucursal,
                                        };
                                    this.servicios.push(servicioAGuardar);
                                })
                            }
                        })
                    }
                    console.log(JSON.stringify(this.servicios));
                });
        },
        async getSucursales() {
            await axios.get('http://localhost:8081/branchOffice')
                .then(res => {
                    this.sucursales = res.data.branchOffice.filter(aBranchOffice => aBranchOffice.Status === "ACTIVE")
                });
        },
        async getRepuestos() {
            await axios.get('http://localhost:8081/product')
                .then(res => {
                    this.repuestos = res.data.product.filter(aProduct => aProduct.Status === "ACTIVE")
                });
        },
        agregarAlCarrito() {
            console.log("carrito++");
        },
        eliminarDelCarrito() {
            console.log("carrito--");
        }
    }
};
</script>

<style>

</style>

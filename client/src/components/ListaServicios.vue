V<template>
<div>
 <!--Filtros-->
        <template>
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header class="indigo darken-4 white--text">
                        Ver filtros Disponibles
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-container>
                            <h2>Filtros</h2>
                            <v-row>
                                <v-col cols="12" sm="6" md="3">
                                  <v-select v-model="filtros.BranchOffice" :items="sucursales" item-text="Name" item-value="Name" label="Sucursal"></v-select>
                               </v-col>

                                <v-col cols="12" sm="6" md="3">
                                    <v-text-field v-model="filtros.Model" label="Modelo-Vehículo"></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="6" md="3">
                                    <v-text-field v-model="filtros.Brand" label="Marca-Vehículo"></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field v-model="filtros.Year" label="Año-Vehículo"></v-text-field>
                                </v-col>
 
                              <v-col cols="12" sm="6" md="6">
                                    <v-btn class="success" @click="aplicarFiltros">
                                        <v-icon>mdi-check</v-icon>
                                    </v-btn>
                                    <v-btn class="warning" @click="reiniciarFiltros">
                                        <v-icon>mdi-cancel</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>

    <v-data-table v-model="selected" :single-select="singleSelect" show-select :headers="headers" :items="serviciosFiltrados" :search="search" item-key="_id" class="elevation-1">
        <template v-slot:item.actions="{ item }">

            <v-btn v-if="item.carrito == false" fab small color="success">
                <v-icon class="text-center" @click="agregarAlCarrito(item)">
                    mdi-cart-plus</v-icon>
            </v-btn>
            <v-btn v-if="item.carrito" fab small color="error">
                <v-icon class="text-center" @click="eliminarDelCarrito(item)">
                    mdi-cart-remove</v-icon>
            </v-btn>

        </template>

        <template v-slot:top>
            <v-toolbar flat>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details></v-text-field>
                <v-divider class="mx-4" dark vertical></v-divider>
                <v-spacer></v-spacer>
                <v-flex class="text-right">
                    <v-btn right color="warning" dark class="mb-2" v-bind="attrs" v-on="on" @click="deleteItem()">
                        <v-icon>
                            mdi-cart-outline
                        </v-icon>
                    </v-btn>
                </v-flex>
            </v-toolbar>
        </template>
    </v-data-table>
    <v-snackbar v-model="snackbar">
        {{ mensaje }}

        <template v-slot:action="{ attrs }">
            <v-btn class="info" v-bind="attrs" @click="snackbar = false">
                <v-icon>mdi-check</v-icon>
            </v-btn>

        </template>
    </v-snackbar>

</div>
</template>

<script>
import axios from "axios";

export default {
    data: () => ({
          filtros: [{
            BranchOffice: '',
            Model: '',
            Brand: '',
            Year: '',
        }],
        selected: [],
        singleSelect: true,
        search: '',
        on: '',
        attrs: '',
        snackbar: false,
        mensaje: '',
        editedItem: {
            Description: '',
            LaborPrice: '',
            Time: '',
            Marca: '',
            Modelo: '',
            Año: '',
            BranchOffice: '',
            carrito: false,
        },

        defaultItem: {
            Description: '',
            LaborPrice: '',
            Time: '',
            Marca: '',
            Modelo: '',
            Año: '',
            BranchOffice: '',
            carrito: false,
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
        serviciosFiltrados: [],
        sucursales: [],
    }),
    created() {
        this.iniciar();
    },
    methods: {
        iniciar() {
            this.getServicios();
            this.getSucursales();
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
                                    let servicioAGuardar = {
                                        "Description": servicio.Description,
                                        "LaborPrice": servicio.LaborPrice,
                                        "Time": servicio.Time,
                                        "Vehicle": servicio.Vehicle,
                                        "BranchOffice": sucursal,
                                        "carrito": false,
                                    };
                                    this.servicios.push(servicioAGuardar);
                                    this.serviciosFiltrados.push(servicioAGuardar);
                                })
                            }
                        })
                    }
                });
        },
        async getSucursales() {
            await axios.get('http://localhost:8081/branchOffice')
                .then(res => {
                    this.sucursales = res.data.branchOffice.filter(aBranchOffice => aBranchOffice.Status === "ACTIVE")
                });
        },
     
        agregarAlCarrito(item) {
            let seleccionado = this.servicios.indexOf(item);
            if (seleccionado != -1) {
                this.servicios[seleccionado].carrito = true;
            }
        },
        eliminarDelCarrito(item) {
            let seleccionado = this.servicios.indexOf(item);
            if (seleccionado != -1) {
                this.servicios[seleccionado].carrito = false;
            }
        },
        verificarSeleccionado() {
            if (this.selected.length == 0) {
                this.snackbar = true;
                this.mensaje = 'No ha seleccionado ningún elemento!';
                return false;
            }
            return true;
        },
         aplicarFiltros() {
            let Brand = this.filtros.Brand != null & this.filtros.Brand != ""
            let Model = this.filtros.Model != null & this.filtros.Model != ""
            let BranchOffice = this.filtros.BranchOffice != null & this.filtros.BranchOffice != ""
            let Year = this.filtros.Year != null & this.filtros.Year != ""
            
            if (!Brand && !Model && !Year && !BranchOffice) {
                return
            }
            let BrandMatches = true
            let ModelMatches = true
            let BranchOfficeMatches = true
            let YearMatches = true
            let serviciosAux = []
            let cant = 0
            for (var i = 0; i < this.servicios.length; i++) {
                BrandMatches = Brand ? this.servicios[i].Vehicle.Brand === this.filtros.Brand : BrandMatches
                ModelMatches = Model ? this.servicios[i].Vehicle.Model === this.filtros.Model : ModelMatches
                BranchOfficeMatches = BranchOffice ? this.servicios[i].BranchOffice.Name === this.filtros.BranchOffice : BranchOfficeMatches
                YearMatches = Year ? this.servicios[i].Vehicle.Year == this.filtros.Year : YearMatches
            
                if (BrandMatches & ModelMatches & BranchOfficeMatches & YearMatches) {
                    serviciosAux[cant] = this.servicios[i]
                    cant++
                }
            }
            this.serviciosFiltrados = serviciosAux;
        },
         reiniciarFiltros() {
            this.filtros = [{
                BranchOffice: '',
                Brand: '',
                Model: '',
                Year: '',
            }]
            this.serviciosFiltrados = this.servicios
        },

    }
};
</script>

<style>

</style>

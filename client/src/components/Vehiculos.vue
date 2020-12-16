<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>
        <!--Filtros-->
        <template>
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header class="indigo darken-4 white--text">
                        <template v-slot:actions>
                            <v-icon color="white">
                                $expand
                            </v-icon>
                        </template>
                        Ver filtros Disponibles
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-container>
                            <h2>Filtros</h2>
                            <v-row>
                                <v-col cols="12" sm="6" md="3">
                                    <v-select v-model="filtros.Brand" v-on:change="filterModels()" :items="brandsList" item-text="Name" item-value="Name" label="Marca"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                    <v-select v-model="filtros.Model" :items="filteredModels" item-text="Name" item-value="Name" label="Modelo"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                    <v-select v-model="filtros.Category" :items="categoriesList" label="Categoria"></v-select>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-select v-model="filtros.Fuel" :items="fuelsList" label="Combustible"></v-select>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field v-model="filtros.Type" label="Tipo"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-select v-model="filtros.transmission" :items="transmissionsList" label="Transmision"></v-select>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-select v-model="filtros.origin" :items="paises" item-text="name" label="Origen"></v-select>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-select v-model="filtros.year" :items="años" label="Año"></v-select>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-select v-model="filtros.Dealer" :items="dealersList" item-text="Email" item-value="Email" label="Proveedor" required></v-select>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field type="number" v-model="filtros.pDesde" prefix="$" label="Precio Sugerido Desde"></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field type="number" v-model="filtros.pHasta" prefix="$" label="Precio Sugerido Hasta"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="12">
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

        <!-- Tabla -->
        <v-data-table v-model="selected" show-select :headers="headers" :items="vehículosFiltrados" :search="search" item-key="_id" sort-by="Brand" class="elevation-1">
            <template v-slot:item.SuggestedPrice="{ item }">
                {{ formatPrice(item.SuggestedPrice) }}
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda Rápida" single-line hide-details></v-text-field>

                    <v-divider class="mx-4" dark vertical></v-divider>
                    <v-spacer></v-spacer>

                    <v-btn color="warning" dark class="mb-2" v-bind="attrs" v-on="on" @click="calcularStock">
                        Stock
                    </v-btn>

                    <div v-if="validateUsers('Administrativo','Gerente','Administrador')">
                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" @click="editItem(selected[0])">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>

                        <v-btn color="error" dark class="mb-2" v-bind="attrs" v-on="on" @click="deleteItem(selected)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>

                        <v-dialog v-model="dialog" max-width="500px" persistent>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on">
                                    <v-icon>mdi-plus</v-icon>
                                </v-btn>
                            </template>
                            <v-card>
                                <v-form ref="form" v-if="selected.length <= 1" v-model="valid" lazy-validation>

                                    <v-card-title>
                                        <span class="headline">{{ formTitle }}</span>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-container>
                                            <v-row>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-select v-model="editedItem.Brand" v-on:change="filterModels()" :items="brandsList" item-text="Name" item-value="Name" label="Marca" :rules="requerido"></v-select>
                                                </v-col>

                                                <v-col cols="12" sm="6" md="6">
                                                    <v-select v-model="editedItem.Model" :items="filteredModels" item-text="Name" item-value="Name" label="Modelo" :rules="requerido"></v-select>
                                                </v-col>

                                                <v-col cols="12" sm="6" md="4">
                                                    <v-select v-model="editedItem.Category" :items="categoriesList" label="Categoria" :rules="requerido"></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-text-field v-model="editedItem.Type" label="Tipo" :rules="requerido"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-select v-model="editedItem.Fuel" :items="fuelsList" label="Combustible" :rules="requerido"></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-select v-model="editedItem.transmission" :items="transmissionsList" label="Transmision" :rules="requerido"></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-select v-model="editedItem.origin" :items="paises" item-text="name" label="Origen" :rules="requerido"></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-select v-model="editedItem.year" :items="años" item-text="year" item-value="year" label="Año" :rules="requerido"></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-select v-model="editedItem.Dealer" :items="dealersList" item-text="Email" item-value="_id" label="Proveedor" :rules="requerido"></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-text-field v-model="editedItem.SuggestedPrice" prefix="$" label="Precio Sugerido" :rules="requerido"></v-text-field>
                                                </v-col>

                                            </v-row>
                                        </v-container>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn class="info" text @click="reset">
                                            <v-icon>mdi-cancel</v-icon>
                                        </v-btn>
                                        <v-btn class="info" text @click="save">
                                            <v-icon>mdi-check</v-icon>
                                        </v-btn>
                                    </v-card-actions>
                                </v-form>
                            </v-card>

                            <v-card>
                                <v-form ref="editarVarios" v-if="selected.length > 1" v-model="valid" lazy-validation>

                                    <v-card-title>
                                        <span class="headline">Editar varios</span>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-container>
                                            <v-row>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-btn-toggle v-model="toggle_none">
                                                        <v-btn fab dark small class="warning">
                                                            <v-icon>mdi-plus</v-icon>
                                                        </v-btn>
                                                        <v-btn fab dark small class="warning">
                                                            <v-icon>mdi-minus</v-icon>
                                                        </v-btn>
                                                    </v-btn-toggle>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-text-field v-model="editedItem.SuggestedPrice" :disabled="deshabilitarPorcentaje" suffix="%" label="Precio" :rules="reglaEditarPorcentaje"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="2">
                                                    <v-btn :class="classBotonPorcentaje" @click="clickPorcentaje()">
                                                        <v-icon>{{nombrePorcentaje}}</v-icon>
                                                    </v-btn>
                                                </v-col>

                                                <v-col cols="12" sm="6" md="6">
                                                    <v-select v-model="editedItem.Dealer" :items="dealersList" :disabled="deshabilitarProveedor" item-text="Email" item-value="_id" label="Proveedor" :rules="reglaEditarProveedor"></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="2">
                                                    <v-btn :class="classBotonProveedor" @click="clickProveedor()">
                                                        <v-icon>{{nombreProveedor}}</v-icon>
                                                    </v-btn>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="reset">
                                            Cancelar
                                        </v-btn>
                                        <v-btn color="blue darken-1" text @click="save">
                                            Guardar
                                        </v-btn>
                                    </v-card-actions>
                                </v-form>
                            </v-card>

                        </v-dialog>
                        <v-dialog v-model="dialogDelete" max-width="500px" persistent>
                            <v-card>
                                <v-card-title class="headline">Estas seguro de que quiere eliminar el/los elemento/s?</v-card-title>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn class="info" text @click="dialogDelete=false">
                                        <v-icon>mdi-cancel</v-icon>
                                    </v-btn>
                                    <v-btn class="info" text @click="deleteItemConfirm">
                                        <v-icon>mdi-check</v-icon>
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </div>
                </v-toolbar>
            </template>
        </v-data-table>
        <v-snackbar v-model="snackbar">
            {{ mensaje }}

            <template v-slot:action="{ attrs }">
                <v-btn class="info" text v-bind="attrs" @click="snackbar = false">
                    <v-icon>mdi-check</v-icon>
                </v-btn>
            </template>
        </v-snackbar>

        <v-dialog v-model="dialogStock" persistent max-width="400px">
            <v-card>
                <v-flex class="text-center">
                    <v-card-text>
                        <h2>Nuevos</h2>
                        <h3 v-if="stockNuevos.disponibles==0">-Sin Stock-</h3>
                        <v-text-field disabled :label="'Disponibles: '+stockNuevos.disponibles"></v-text-field>
                        <v-text-field disabled :label="'No Disponibles: '+stockNuevos.noDisponibles"></v-text-field>
                        <v-text-field disabled :label="'Reservados: '+stockNuevos.reservados"></v-text-field>
                        <v-text-field disabled :label="'Vendidos: '+stockNuevos.vendidos"></v-text-field>
                        <h2>Usados</h2>
                        <h3 v-if="stockUsados.disponibles==0">-Sin Stock-</h3>
                        <v-text-field disabled :label="'Disponibles: '+stockUsados.disponibles"></v-text-field>
                        <v-text-field disabled :label="'No Disponibles: '+stockUsados.noDisponibles"></v-text-field>
                        <v-text-field disabled :label="'Reservados: '+stockUsados.reservados"></v-text-field>
                        <v-text-field disabled :label="'Vendidos: '+stockUsados.vendidos"></v-text-field>
                    </v-card-text>
                </v-flex>
                <v-card-actions>
                    <v-flex class="text-right">
                        <v-btn class="info" @click="stockUsados=defaultStock;stockNuevos=defaultStock;dialogStock=false;selected=[]">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</v-img>
</template>

<script>
import axios from "axios"
import urlAPI from "../config/config.js"
export default {
    data: () => ({
        paises: [],
        dialogStock: false,
        stockNuevos: {
            disponibles: 0,
            reservados: 0,
            vendidos: 0,
            noDisponibles: 0
        },
        stockUsados: {
            disponibles: 0,
            reservados: 0,
            vendidos: 0,
            noDisponibles: 0
        },
        defaultStock: {
            disponibles: 0,
            reservados: 0,
            vendidos: 0,
            noDisponibles: 0
        },
        vehicleStock: [],
        textoBoton: ['mdi-pencil', 'mdi-eyedropper-minus'],
        classBoton: ['success', 'error'],
        classBotonPorcentaje: 'success',
        classBotonProveedor: 'success',
        nombrePorcentaje: 'mdi-pencil',
        nombreProveedor: 'mdi-pencil',
        toggle_none: null,
        selected: [],
        search: '',
        valid: true,
        snackbar: false,
        mensaje: "",
        dialog: false,
        dialogDelete: false,
        deshabilitarPorcentaje: true,
        deshabilitarProveedor: true,
        reglaEditarProveedor: [],
        reglaEditarPorcentaje: [],
        headers: [{
                text: 'Marca',
                value: 'Brand',
                align: 'start',
            },
            {
                text: 'Modelo',
                value: 'Model'
            },
            {
                text: 'Categoria',
                value: 'Category'
            },
            {
                text: 'Combustible',
                value: 'Fuel'
            },
            {
                text: 'Tipo',
                value: 'Type'
            },
            {
                text: 'Transmision',
                value: 'transmission'
            },
            {
                text: 'Origen',
                value: 'origin'
            },
            {
                text: 'Año',
                value: 'year'
            },
            {
                text: 'Proveedor',
                value: 'Dealer.Email'
            },
            {
                text: 'Precio Sugerido',
                value: 'SuggestedPrice'
            },

        ],
        nuevoUsado: ['NUEVO', 'USADO'],
        filtroNuevoUsado: ['TODOS', 'NUEVO', 'USADO'],
        fuelsList: ['Nafta', 'Diesel', 'Hibrido'],
        categoriesList: ['Sedan 3prts', 'Sedan 5prts', 'SUV', 'HatchBack 3ptrs', 'HatchBack 5ptrs'],
        transmissionsList: ['Automatica', 'Manual'],
        brandsList: [],
        modelsList: [],
        filteredModels: [],
        vehículos: [],
        allvehiculos: [],
        vehículosFiltrados: [],
        años: ["2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006"],
        statusList: ["Activo", "Inactivo"],
        dealersList: [],
        requerido: [
            value => !!value || 'Requerido.',
        ],

        filtros: [{
            Brand: '',
            Model: '',
            Category: '',
            Fuel: '',
            Type: '',
            transmission: '',
            origin: '',
            year: '',
            Dealer: '',
            pDesde: '',
            pHasta: ''
        }],

        editedIndex: -1,
        attrs: '',
        on: '',
        editedItem: {
            Brand: '',
            Model: '',
            Category: '',
            Fuel: '',
            Type: '',
            transmission: '',
            origin: '',
            year: '',
            Dealer: '',
            SuggestedPrice: 0,
            Status: ''
        },
        defaultItem: {
            Brand: '',
            Model: '',
            Category: '',
            Fuel: '',
            Type: '',
            transmission: '',
            origin: '',
            year: '',
            Dealer: '',
            SuggestedPrice: 0
        },
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo Vehículo' : 'Editar Vehículo'
        },
    },

    created() {
        this.initialize();
        this.getVehicles();
        this.getDealers();
        this.getPaises();
        this.getVehicleStock();
    },

    methods: {
        validateUsers(...authorizedUsers) {
            if (localStorage.getItem('userType') != null) {
                return (authorizedUsers.includes(localStorage.getItem('userType'))) ? true : false
            }
            return false;
        },

        getPaises() {
            axios.get('https://restcountries.eu/rest/v2/all')
                .then(res => {
                    this.paises = res.data;
                });

        },

        getVehicles() {
            this.vehículos = []
            axios.get(urlAPI + 'vehicle')
                .then(res => {
                    this.allvehiculos = res.data.vehicle;
                    this.allvehiculos.forEach(vehiculo => {
                        if (vehiculo.Status === "ACTIVE") {
                            this.vehículos.push(vehiculo);
                        }
                    })
                })
            this.vehículosFiltrados = this.vehículos;
            axios.get(urlAPI + 'brand')
                .then(res => {
                    this.brandsList = res.data.brand.filter(brand => brand.Kind == 'VEHICLE');
                })
            axios.get(urlAPI + 'model')
                .then(res => {
                    this.modelsList = res.data.model;
                })
        },

        async getDealers() {
            await axios.get(urlAPI + 'dealer')
                .then(res => {
                    let dealersList = res.data.dealer;
                    if (dealersList != null) {
                        dealersList.forEach(dealer => {
                            if (dealer.Kind == "VEHICLE" & dealer.Status == "ACTIVE") {
                                this.dealersList.push(dealer);
                            }
                        })
                    }
                })
        },

        async getVehicleStock() {
            await axios.get(urlAPI + 'vehiclestock')
                .then(res => {
                    let vehicleList = res.data.vehicle;
                    if (vehicleList != null) {
                        vehicleList.forEach(v => {
                            if (v.Status == "AVAILABLE") {
                                this.vehicleStock.push(v);
                            }
                        })
                    }
                })
        },

        filterModels() {
            if (this.editedItem.Brand != '') {
                this.filteredModels = []
                let actualBrand;
                actualBrand = this.brandsList.find(brand => brand.Name == this.editedItem.Brand)
                this.modelsList.forEach(model => {
                    if (model.Brand == actualBrand._id) {
                        this.filteredModels.push(model)
                    }
                })
            }
        },

        initialize() {
            this.vehículos = []
        },

        haySeleccionado() {
            return this.selected.length > 0;
        },

        mensajeNoSelecciono() {
            if (!this.haySeleccionado()) {
                this.snackbar = true
                this.mensaje = "No ha seleccionado ningun elemento!"
                return true;
            }
            return false;
        },

        editItem(item) {
            if (!this.mensajeNoSelecciono()) {
                if (this.selected.length === 1) {
                    this.editedIndex = this.vehículos.indexOf(item)
                    this.editedItem = Object.assign({}, item)
                    if (this.dealersList != null) {
                        this.dealersList.forEach(dealer => {
                            if (dealer._id == item.Dealer) {
                                this.editedItem.Dealer = dealer.Email;
                            }
                        })
                    }
                    this.dialog = true
                } else {
                    this.dialog = true
                }
            }
        },

        clickProveedor() {
            this.deshabilitarProveedor = !this.deshabilitarProveedor;
            if (this.nombreProveedor === this.textoBoton[0]) {
                this.reglaEditarProveedor = this.requerido;
                this.nombreProveedor = this.textoBoton[1];
                this.classBotonProveedor = this.classBoton[1];
            } else {
                this.reglaEditarProveedor = [];
                this.nombreProveedor = this.textoBoton[0];
                this.classBotonProveedor = this.classBoton[0];
            }
        },

        clickPorcentaje() {
            this.deshabilitarPorcentaje = !this.deshabilitarPorcentaje;
            if (this.nombrePorcentaje === this.textoBoton[0]) {
                this.reglaEditarPorcentaje = this.requerido;
                this.nombrePorcentaje = this.textoBoton[1];
                this.classBotonPorcentaje = this.classBoton[1];
            } else {
                this.reglaEditarPorcentaje = [];
                this.nombrePorcentaje = this.textoBoton[0];
                this.classBotonPorcentaje = this.classBoton[0];
            }
        },
        deleteItem(items) {
            if (!this.mensajeNoSelecciono()) {
                this.editedIndex = this.vehículos.indexOf(items)
                this.editedItem = Object.assign({}, items)
                this.dialogDelete = true
            }
        },

        deleteItemConfirm() {
            this.selected.forEach(item => {
                this.vehículos.splice(this.vehículos.indexOf(item), 1)
                this.deleteVehicle(item)
            });
            this.dialogDelete = false;
        },
        reset() {
            if (this.dialog) {
                this.$refs.form.resetValidation();
            }
            this.selected = []
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
            this.toggle_none = null;
            this.nombrePorcentaje = this.textoBoton[0];
            this.nombreProveedor = this.textoBoton[0];
            this.classBotonPorcentaje = this.classBoton[0];
            this.classBotonProveedor = this.classBoton[0];
            this.deshabilitarPorcentaje = true;
            this.deshabilitarProveedor = true;
            this.reglaEditarPorcentaje = [];
            this.reglaEditarProveedor = [];
            this.dialog = false;
            this.dialogDelete = false;
        },
        validate() {
            return this.$refs.form.validate()
        },
        aplicarFiltros() {
            let Brand = this.filtros.Brand != null & this.filtros.Brand != ""
            let Model = this.filtros.Model != null & this.filtros.Model != ""
            let Category = this.filtros.Category != null & this.filtros.Category != ""
            let Fuel = this.filtros.Fuel != null & this.filtros.Fuel != ""
            let Type = this.filtros.Type != null & this.filtros.Type != ""
            let transmission = this.filtros.transmission != null & this.filtros.transmission != ""
            let origin = this.filtros.origin != null & this.filtros.origin != ""
            let year = this.filtros.year != null & this.filtros.year != ""
            let pDesde = this.filtros.pDesde != null & this.filtros.pDesde != ""
            let pHasta = this.filtros.pHasta != null & this.filtros.pHasta != ""
            let Dealer = this.filtros.Dealer != null & this.filtros.Dealer != ""
            if (!Brand & !Model & !Category & !Fuel & !Type & !transmission & !origin & !year & !pDesde & !pHasta & !Dealer) {
                return
            }
            let BrandMatches = true
            let ModelMatches = true
            let CategoryMatches = true
            let FuelMatches = true
            let TypeMatches = true
            let transmissionMatches = true
            let originMatches = true
            let yearMatches = true
            let pDesdeMatches = true
            let pHastaMatches = true
            let DealerMatches = true
            let repAux = []
            let cant = 0

            for (var i = 0; i < this.vehículos.length; i++) {
                BrandMatches = Brand ? this.vehículos[i].Brand === this.filtros.Brand : BrandMatches
                ModelMatches = Model ? this.vehículos[i].Model === this.filtros.Model : ModelMatches
                CategoryMatches = Category ? this.vehículos[i].Category === this.filtros.Category : CategoryMatches
                FuelMatches = Fuel ? this.vehículos[i].Fuel === this.filtros.Fuel : FuelMatches
                TypeMatches = Type ? this.vehículos[i].Type === this.filtros.Type : TypeMatches
                transmissionMatches = transmission ? this.vehículos[i].transmission === this.filtros.transmission : transmissionMatches
                originMatches = origin ? this.vehículos[i].origin === this.filtros.origin : originMatches
                yearMatches = year ? this.vehículos[i].year == this.filtros.year : yearMatches
                pDesdeMatches = pDesde ? this.vehículos[i].SuggestedPrice >= this.filtros.pDesde : pDesdeMatches
                pHastaMatches = pHasta ? this.vehículos[i].SuggestedPrice <= this.filtros.pHasta : pHastaMatches
                DealerMatches = Dealer ? this.vehículos[i].Dealer.Email === this.filtros.Dealer : DealerMatches

                if (BrandMatches & ModelMatches & CategoryMatches & FuelMatches & TypeMatches & transmissionMatches & originMatches & yearMatches & pDesdeMatches & pHastaMatches & DealerMatches) {
                    repAux[cant] = this.vehículos[i]
                    cant++
                }
            }
            this.vehículosFiltrados = repAux

        },
        formatPrice(value) {
            return value == null ? "$0" : "$" + value;
        },
        reiniciarFiltros() {
            this.filtros = [{
                Brand: '',
                Model: '',
                Category: '',
                Fuel: '',
                Type: '',
                transmission: '',
                origin: '',
                year: '',
                Dealer: '',
                SuggestedPrice: 0,
            }]
            this.vehículosFiltrados = this.vehículos
        },

        deleteVehicle(item) {
            axios.delete(urlAPI + 'vehicle/' + item._id + '/delete').then(res => {
                if (res != null) {
                    this.reset();
                }
            })
        },

        async updateVehicle() {
            await axios.post(urlAPI + 'vehicle/' + this.selected[0]._id + '/update', {
                "vehicle": {
                    "Brand": this.editedItem.Brand,
                    "Model": this.editedItem.Model,
                    "Type": this.editedItem.Type,
                    "Category": this.editedItem.Category,
                    "Fuel": this.editedItem.Fuel,
                    "transmission": this.editedItem.transmission,
                    "origin": this.editedItem.origin,
                    "year": this.editedItem.year,
                    "Dealer": this.editedItem.Dealer,
                    "SuggestedPrice": this.editedItem.SuggestedPrice,
                    "Status": "ACTIVE"
                }
            }).then(res => {
                if (res != null) {
                    this.reset();
                    this.getVehicles()
                }
            })
        },

        async updateManyVehicles() {
            await this.selected.forEach(vehicle => {
                let suggestedPrice = this.deshabilitarPorcentaje ? vehicle.SuggestedPrice : this.editedItem.SuggestedPrice;
                let dealer = this.deshabilitarProveedor ? vehicle.Dealer : this.editedItem.Dealer;

                if (suggestedPrice != vehicle.SuggestedPrice) {
                    let porcentaje = (vehicle.SuggestedPrice * suggestedPrice) / 100;

                    if (this.toggle_none === 1) {
                        suggestedPrice = vehicle.SuggestedPrice - porcentaje;
                    } else {
                        suggestedPrice = vehicle.SuggestedPrice + porcentaje;
                    }
                }

                axios.post(urlAPI + 'vehicle/' + vehicle._id + '/update', {
                    "vehicle": {
                        "Brand": vehicle.Brand,
                        "Model": vehicle.Model,
                        "Type": vehicle.Type,
                        "Category": vehicle.Category,
                        "Fuel": vehicle.Fuel,
                        "transmission": vehicle.transmission,
                        "origin": vehicle.origin,
                        "year": vehicle.year,
                        "Dealer": dealer,
                        "SuggestedPrice": suggestedPrice,
                        "Status": "ACTIVE"
                    }
                })
                if (i == this.selected.length - 1) {
                    this.reset();
                    this.getVehicles();
                }
            })
        },

        async createVehicle() {
            await axios.post(urlAPI + 'vehicle/add', {
                "vehicle": {
                    "Brand": this.editedItem.Brand,
                    "Model": this.editedItem.Model,
                    "Type": this.editedItem.Type,
                    "Category": this.editedItem.Category,
                    "Fuel": this.editedItem.Fuel,
                    "transmission": this.editedItem.transmission,
                    "origin": this.editedItem.origin,
                    "year": this.editedItem.year,
                    "Dealer": this.editedItem.Dealer,
                    "SuggestedPrice": this.editedItem.SuggestedPrice
                }
            }).then(res => {
                if (res != null) {
                    this.reset();
                    this.getVehicles()
                }
            })
        },

        save() {

            if (this.editedIndex > -1) {
                if (this.validate()) {
                    Object.assign(this.vehículos[this.editedIndex], this.editedItem)
                    this.updateVehicle();
                }
            } else {
                if (this.selected.length > 1) {
                    if (this.$refs.editarVarios.validate()) {
                        this.updateManyVehicles()
                    }
                } else {
                    if (this.validate()) {
                        this.vehículos.push(this.editedItem);
                        this.createVehicle();
                    }
                }
            }
        },

        calcularStock() {
            if (!this.mensajeNoSelecciono) {
                if (this.selected.length > 1) {
                    this.mensaje = "Sólo puede corroborar stock de un elemento a la vez!";
                    this.snackbar = true;
                    return;
                }
            }
            if (this.vehicleStock.length == 0) {
                this.mensaje = "No hay vehículos en stock para corroborar!";
                this.snackbar = true;
                return;
            }
            let vehiculosEnStock = this.vehicleStock.filter(v => v.Vehicle._id == this.selected[0]._id);

            let nuevos = vehiculosEnStock.filter(v => v.Kind == "NUEVO");
            let usados = vehiculosEnStock.filter(v => v.Kind == "USADO");

            nuevos.forEach(n => {
                if (n.Status == "AVAILABLE")
                    this.stockNuevos.disponibles++;
                if (n.Status == "RESERVED")
                    this.stockNuevos.reservados++;
                if (n.Status == "SOLD")
                    this.stockNuevos.vendidos++;
                if (n.Status == "NOT AVAILABLE")
                    this.stockNuevos.noDisponibles++;
            });
            usados.forEach(u => {
                if (u.Status == "AVAILABLE")
                    this.stockUsados.disponibles++;
                if (u.Status == "RESERVED")
                    this.stockUsados.reservados++;
                if (u.Status == "SOLD")
                    this.stockUsados.vendidos++;
                if (u.Status == "NOT AVAILABLE")
                    this.stockUsados.noDisponibles++;
            });
            this.dialogStock = true;
        },
    },
}
</script>

<style>
.mb-2 {
    margin-left: 3px;
    margin-right: 3px;
}
</style>

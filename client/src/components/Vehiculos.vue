<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
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
                                    <v-text-field v-model="filtros.Brand" label="Marca"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                    <v-text-field v-model="filtros.Model" label="Modelo"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                    <v-text-field v-model="filtros.Category" label="Categoria"></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="6" md="4">
                                    <v-select v-model="filtros.Kind" :items="filtroNuevoUsado" label="Nuevo/Usado"></v-select>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field v-model="filtros.Fuel" label="Combustible"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field v-model="filtros.Type" label="Tipo"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field v-model="filtros.transmission" label="Transmision"></v-text-field>
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
                                    <v-text-field v-model="filtros.pDesde" prefix="$" label="Precio Sugerido Desde"></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field v-model="filtros.pHasta" prefix="$" label="Precio Sugerido Hasta"></v-text-field>
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
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda Rápida" single-line hide-details></v-text-field>

                    <v-divider class="mx-4" dark vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" @click="editItem(selected[0])">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn color="error" dark class="mb-2" v-bind="attrs" v-on="on" @click="deleteItem(selected)">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>

                    <v-dialog v-model="dialog" max-width="500px">
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
                                                <v-text-field v-model="editedItem.Brand" label="Marca" :rules="requerido"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="editedItem.Model" label="Modelo" :rules="requerido"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.Category" label="Categoria" :rules="requerido"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-select v-model="editedItem.Kind" label="Nuevo/Usado" :items="nuevoUsado" :rules="requerido"></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.Type" label="Tipo" :rules="requerido"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.Fuel" label="Combustible" :rules="requerido"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="editedItem.transmission" label="Transmision" :rules="requerido"></v-text-field>
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
                                    <v-btn class="info" text @click="close">
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
                                    <v-btn color="blue darken-1" text @click="close">
                                        Cancelar
                                    </v-btn>
                                    <v-btn color="blue darken-1" text @click="save">
                                        Guardar
                                    </v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-card>

                    </v-dialog>
                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title class="headline">Estas seguro de que quiere eliminar el/los elemento/s?</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn class="info" text @click="closeDelete">
                                    <v-icon>mdi-cancel</v-icon>
                                </v-btn>
                                <v-btn class="info" text @click="deleteItemConfirm">
                                    <v-icon>mdi-check</v-icon>
                                </v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
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
    </div>
</v-img>
</template>

<script>
import axios from "axios"
import urlAPI from "../config/config.js"
export default {
    data: () => ({
        paises: [],
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
                text: 'Nuevo/Usado',
                value: 'Kind'
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
            pHasta: '',
            Kind: '',
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
            Status: '',
            Kind: '',

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
            SuggestedPrice: 0,
            Kind: '',
        },
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo Vehículo' : 'Editar Vehículo'
        },
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    created() {
        this.initialize();
        this.getVehicles();
        this.getDealers();
        this.getPaises();
    },

    methods: {

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
            this.closeDelete()
        },
        reset() {
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
        },
        close() {
            this.dialog = false
            this.reset()
        },

        closeDelete() {
            this.dialogDelete = false
            this.reset()
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
            let Kind = this.filtros.Kind != null & this.filtros.Kind != ""
            if (!Brand & !Model & !Category & !Fuel & !Type & !transmission & !origin & !year & !pDesde & !pHasta & !Dealer & !Kind) {
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
            let KindMatches = true
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
                KindMatches = Kind ? this.vehículos[i].Dealer.Kind === this.filtros.Kind || this.filtros.Kind == "TODOS" : KindMatches

                if (BrandMatches & ModelMatches & CategoryMatches & FuelMatches & TypeMatches & transmissionMatches & originMatches & yearMatches & pDesdeMatches & pHastaMatches & DealerMatches & KindMatches) {
                    repAux[cant] = this.vehículos[i]
                    cant++
                }
            }
            this.vehículosFiltrados = repAux

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
            axios.delete(urlAPI + 'vehicle/' + item._id + '/delete')
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
                    "Status": "ACTIVE",
                    "Kind": this.editedItem.Kind,
                }
            })
            this.getVehicles()
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
                        "Status": "ACTIVE",
                        "Kind": vehicle.Kind,
                    }
                })
            })
            this.getVehicles()
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
                    "SuggestedPrice": this.editedItem.SuggestedPrice,
                    "Kind": this.editedItem.Kind,
                }
            })
            this.getVehicles()
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
            this.close()
        }
    },
}
</script>

<style>
.mb-2 {
    margin-left: 3px;
    margin-right: 3px;
}
</style>

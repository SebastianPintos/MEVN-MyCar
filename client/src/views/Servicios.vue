<template>
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
                            <v-col cols="12" sm="6" md="6">
                                <v-select v-model="filtros.Brand" v-on:change="filterModels()" :items="brandsList" item-text="Name" item-value="Name" label="Marca-Vehículo" :rules="requerido"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-select v-model="filtros.Model" :items="filteredModels" item-text="Name" item-value="Name" label="Modelo-Vehículo"></v-select>
                            </v-col>
                            <v-col cols="12" sm="4" md="3">
                                <v-select v-model="filtros.Year" :items="años" label="Año-Vehículo"></v-select>
                            </v-col>
                            <v-col cols="12" sm="4" md="3">
                                <v-select v-model="filtros.BranchOffice" :items="sucursales" item-text="Name" item-value="_id" label="Sucursal"></v-select>
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

    <v-data-table :expanded.sync="expanded" v-model="selected" show-expand show-select :headers="headers" :items="serviciosFiltrados" :search="search" item-key="_id" class="elevation-1">
         <template v-slot:item.LaborPrice="{ item }">
                {{ formatPrice(item.LaborPrice) }}
            </template>
        <template v-slot:top>
            <v-toolbar flat>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda Rapida" single-line hide-details></v-text-field>
                <v-divider class="mx-4" dark vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" @click="editItem(selected[0])">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>

                <v-btn color="error" dark class="mb-2" v-bind="attrs" v-on="on" @click="deleteItem(selected[0])">
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
                                        <v-col cols="12" sm="6" md="12">
                                            <v-text-field v-model="editedItem.Description" label="Nombre del service" :rules="requerido"></v-text-field>
                                        </v-col>
                                           <v-col cols="12" sm="6" md="12">
                                            <v-select v-model="editedItem.Type" label="Tipo" :rules="requerido" :items="types"></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="editedItem.LaborPrice" prefix="$" label="Precio mano de obra" :rules="requerido"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field type="number" v-model="editedItem.Time" label="Tiempo en minutos" :rules="requerido"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="12">
                                            <v-select v-model="editedItem.BranchOffice" label="Sucursal" multiple chips deletable-chips :items="sucursales" item-text="Name" item-value="_id" :rules="requerido"></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="12">
                                            <v-select v-model="editedItem.Vehicle" label="Vehiculo" :items="vehicles" item-text="Model" item-value="_id" :rules="requerido">
                                                <template slot="item" slot-scope="data">
                                                    {{ data.item.Brand }} {{ data.item.Model }} - {{ data.item.year }}
                                                </template>
                                            </v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="12">
                                            <v-select v-model="editedItem.Products" label="Productos" multiple chips deletable-chips :items="products" item-text="Brand" item-value="_id" :rules="requerido">
                                                <template slot="item" slot-scope="data">
                                                    {{ data.item.Brand }} - {{ data.item.Category }} {{ data.item.SubCategory }}
                                                </template>
                                            </v-select>
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
            </v-toolbar>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
                <v-chip-group>
                    <v-chip color="success" small v-for="sucursal in item.BranchOffice" :key="sucursal._id">{{sucursal.Name }}</v-chip>
                </v-chip-group>
            </td>
        </template>
    </v-data-table>

    <v-snackbar v-model="snackbar">
        {{ mensaje }}

        <template v-slot:action="{ attrs }">
            <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
                Aceptar
            </v-btn>
        </template>
    </v-snackbar>
</div>
</template>

<script>
import axios from "axios";
import urlAPI from "../config/config.js"

export default {
    data: () => ({
        selected: [],
        search: '',
        singleSelect: true,
        valid: true,
        editedIndex: -1,
        on: '',
        attrs: '',
        snackbar: false,
        mensaje: '',
        dialog: false,
        types: ["INTERNO","EXTERNO"],
        dialogDelete: false,
        toggle_none: null,
        serviciosFiltrados: [],
        selectedProducts: [],
        filtros: [{
            BranchOffice: '',
            Model: '',
            Brand: '',
            Year: '',
        }],
        años: ["2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006"],

        requerido: [
            value => !!value || 'Requerido.',
        ],

        editedItem: {
            Description: '',
            LaborPrice: '',
            Time: '',
            Vehicle: '',
            BranchOffice: [],
            Products: [],
            Type: ''

        },

        defaultItem: {
            Description: '',
            LaborPrice: '',
            Time: '',
            Brand: '',
            Model: '',
            Year: '',
            Products: [],
            BranchOffice: '',
            Type: ''
        },

        headers: [{
                text: 'Nombre',
                value: 'Description',
                align: 'start',
                sortable: false,
            },
            {
                text: 'Tipo',
                value: 'Type',
            },
            {
                text: 'Precio',
                value: 'LaborPrice',
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
                value: 'Vehicle.year'
            },
        ],

        servicios: [],
        sucursales: [],
        products: [],
        vehicles: [],
        expanded: [],
        employee: null,
        brandsList: [],
        modelsList: [],
        filteredModels: []
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo Servicio' : 'Editar Servicio'
        },
    },

    created() {
        let employee = localStorage.getItem("employee");
        employee = JSON.parse(employee);
        if (employee != null & employee.BranchOffice != null & employee.BranchOffice != '') {
            this.filtros.BranchOffice = employee.BranchOffice;
            this.employee = employee;
        }
        this.iniciar();
    },

    methods: {
        iniciar() {
            this.getServices();
            this.getSucursales();
            this.getProducts();
            this.getVehicles();
        },

        async getServices() {
            let servicios = [];
            this.servicios = [];
            this.serviciosFiltrados = [];
            await axios.get(urlAPI + 'service')
                .then(res => {
                    servicios = res.data.service.filter(aService => aService.Status === "ACTIVE");
                    if (servicios != null) {
                        servicios.forEach(servicio => {
                            this.servicios.push(servicio);
                            this.serviciosFiltrados.push(servicio);
                        })
                   //     this.aplicarFiltros();
                    }
                });
        },

        getSucursales() {
            axios.get(urlAPI + 'branchOffice')
                .then(res => {
                    this.sucursales = res.data.branchOffice.filter(aBranchOffice => aBranchOffice.Status === "ACTIVE")
                });

        },

        getProducts() {
            axios.get(urlAPI + 'product')
                .then(res => {
                    this.products = res.data.product.filter(product => product.Status === "ACTIVE")
                });
        },

        getVehicles() {
            axios.get(urlAPI + 'vehicle')
                .then(res => {
                    this.vehicles = res.data.vehicle.filter(vehicle => vehicle.Status === "ACTIVE")
                });
            axios.get(urlAPI + 'brand')
                .then(res => {
                    this.brandsList = res.data.brand.filter(brand => brand.Kind == 'VEHICLE');
                })
            axios.get(urlAPI + 'model')
                .then(res => {
                    this.modelsList = res.data.model;
                })
        },

        async createService() {
            await axios.post(urlAPI + 'service/add', {
                "service": {
                    "Description": this.editedItem.Description,
                    "LaborPrice": this.editedItem.LaborPrice,
                    "Time": this.editedItem.Time,
                    "Vehicle": {
                        "_id": this.editedItem.Vehicle
                    },
                    "Product": this.editedItem.Products,
                    "BranchOffice": this.editedItem.BranchOffice,
                    "Type": this.editedItem.Type
                }
            }).then(res => {
                if (res != null) {
                    this.reset();
                    this.getServices();
                }
            })
        },
        deleteService(item) {
            axios.delete(urlAPI + 'service/' + item._id + '/delete').then(() => this.getServices())
        },

        async updateService() {
            await axios.post(urlAPI + 'service/' + this.selected[0]._id + '/update', {
                "service": {
                    "Status": "ACTIVE",
                    "Description": this.editedItem.Description,
                    "LaborPrice": this.editedItem.LaborPrice,
                    "Time": this.editedItem.Time,
                    "Vehicle": {
                        "_id": this.editedItem.Vehicle
                    },
                    "Product": this.editedItem.Products,
                    "BranchOffice": this.editedItem.BranchOffice,
                    "Type": this.editedItem.Type
                }
            }).then(res => {
                if (res != null) {
                    this.reset();
                    this.getServices();
                }
            })
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
                let vehicle = this.selected[0].Vehicle != null ? this.selected[0].Vehicle._id : null;
                let product = null;
                if (this.selected[0].Product != null) {
                    product = [];
                    this.selected[0].Product.forEach(p => {
                        product.push(p._id);
                    })
                }
                if (this.selected.length === 1) {
                    this.editedIndex = this.servicios.indexOf(item)
                    this.editedItem = Object.assign({}, item)
                    this.editedItem.Vehicle = vehicle;
                    this.editedItem.Products = product;
                    this.editedItem.Type = item.Type;
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
        deleteItem(items) {
            if (!this.mensajeNoSelecciono()) {
                this.dialogDelete = true
            }
        },

        deleteItemConfirm() {
            for (let i = 0; i < this.selected.length; i++) {
                this.deleteService(this.selected[i]);
                if (i == this.selected.length - 1) {
                    this.reset();
                }
            }
        },

        reset() {
            if (this.dialog) {
                this.$refs.form.resetValidation();
            }
            this.dialog = false;
            this.selected = []
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        validate() {
            return this.$refs.form.validate()
        },

        aplicarFiltros() {
            let Brand = this.filtros.Brand != null & this.filtros.Brand != ""
            let Model = this.filtros.Model != null & this.filtros.Model != ""
            let BranchOffice = this.filtros.BranchOffice != null & this.filtros.BranchOffice != ""
            let Year = this.filtros.Year != null & this.filtros.Year != ""
            console.log("MARCA: "+Brand+" Modelo:: "+Model+" Anio: "+Year+" Sucursal: "+BranchOffice);
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
                YearMatches = Year ? this.servicios[i].Vehicle.Year == this.filtros.Year : YearMatches

                for (let j = 0; j < this.servicios[i].BranchOffice.length; j++) {
                    BranchOfficeMatches = BranchOffice ? String(this.servicios[i].BranchOffice[j]._id) === this.filtros.BranchOffice : BranchOfficeMatches
                }
                if (BrandMatches & ModelMatches & BranchOfficeMatches & YearMatches) {
                    serviciosAux[cant] = this.servicios[i]
                    cant++
                }
            }
            this.serviciosFiltrados = serviciosAux;
            console.log("filtrados: "+JSON.stringify(this.serviciosFiltrados))
            console.log("servicios: "+JSON.stringify(this.servicios))
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
        save() {

            if (this.editedIndex > -1) {
                if (this.validate()) {
                    if (this.selected.length > 1) {
                        this.mensaje = "Solo se puede editar un elemento a la vez!";
                        this.snackbar = true;
                        return;
                    } else if (this.selected == 0) {
                        this.mensaje = "No ha seleccionado ningún elemento!";
                        this.snackbar = true;
                        return;
                    }
                    Object.assign(this.servicios[this.editedIndex], this.editedItem)
                    this.updateService();
                }
            } else {
                if (this.validate()) {
                    this.createService();
                }
            }
        },

        filterModels() {
            if (this.filtros.Brand != '') {
                this.filteredModels = []
                let actualBrand;
                actualBrand = this.brandsList.find(brand => brand.Name == this.filtros.Brand)
                this.modelsList.forEach(model => {
                    if (model.Brand == actualBrand._id) {
                        this.filteredModels.push(model)
                    }
                })
            }
        },

        formatPrice(value) {
            return value == null ? "$0" : "$" + value;
        },

    }
};
</script>

<style>

</style>

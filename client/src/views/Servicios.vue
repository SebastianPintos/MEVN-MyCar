<template>
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
                                    <v-text-field v-model="filtros.Brand" label="Marca-Vehículo"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                    <v-text-field v-model="filtros.Model" label="Modelo-Vehículo"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-select v-model="filtros.Year" :items="años" label="Año-Vehículo"></v-select>
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

    <v-data-table :expanded.sync="expanded" v-model="selected" show-expand show-select  :headers="headers" :items="serviciosFiltrados" :search="search" item-key="_id" class="elevation-1">
        <template v-slot:top>
            <v-toolbar flat>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda Rapida" single-line hide-details></v-text-field>
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
                                            <v-col cols="12" sm="6" md="12">
                                                <v-text-field v-model="editedItem.Description" label="Nombre del service" :rules="requerido"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="editedItem.LaborPrice" prefix="$" label="Precio mano de obra" :rules="requerido"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="editedItem.Time" label="Tiempo en minutos" :rules="requerido"></v-text-field>
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
                                                <v-select v-model="editedItem.Products" label="Productos" multiple chips deletable-chips :items="products" item-text="SubCategory" item-value="_id" :rules="requerido">
                                                </v-select>
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
        <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
                <v-chip-group >
                    <v-chip color="success" small v-for="sucursal in item.BranchOffice" :key="sucursal._id">{{sucursal.Name }}</v-chip>
                </v-chip-group>
            </td>
        </template>
    </v-data-table>
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
        dialog: false,
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
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo Servicio' : 'Editar Servicio'
        },
    },

    created() {
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
            this.servicios=[];
            this.serviciosFiltrados=[];
            await axios.get(urlAPI + 'service')
                .then(res => {
                    servicios = res.data.service.filter(aService => aService.Status === "ACTIVE");
                    if (servicios != null) {
                        servicios.forEach(servicio => {
                                    this.servicios.push(servicio);
                                    this.serviciosFiltrados.push(servicio);
                        })
                    }
                    console.log(JSON.stringify(this.servicios));
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
        },

        async createService() {
            await axios.post(urlAPI + 'service/add', {
                "service":{
                    "Description": this.editedItem.Description,
                    "LaborPrice": this.editedItem.LaborPrice,
                    "Time": this.editedItem.Time,
                    "Vehicle":{
                        "_id": this.editedItem.Vehicle
                    },
                    "Product":
                        this.editedItem.Products,
                    "BranchOffice":
                        this.editedItem.BranchOffice
                }
            })
            this.getServices()
        },
        deleteService(item) {
            axios.delete(urlAPI + 'service/' + item._id + '/delete').then(() => this.getServices())
        },

        async updateService() {
            await axios.post(urlAPI + 'service/' + this.selected[0]._id + '/update', {
                "service":{
                    "Status": "ACTIVE",
                    "Description": this.editedItem.Description,
                    "LaborPrice": this.editedItem.LaborPrice,
                    "Time": this.editedItem.Time,
                    "Vehicle":{
                        "_id": this.editedItem.Vehicle
                    },
                    "Product":
                        this.editedItem.Products,
                    "BranchOffice":
                        this.editedItem.BranchOffice
                }
            })
            this.getServices()
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
                    this.editedIndex = this.servicios.indexOf(item)
                    this.editedItem = Object.assign({}, item)
                    this.editedItem.Vehicle = this.editedItem.Vehicle._id
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
                this.editedIndex = this.servicios.indexOf(items)
                this.editedItem = Object.assign({}, items)
                this.dialogDelete = true
            }
        },

        deleteItemConfirm() {
            this.selected.forEach(item => {
                this.deleteService(item)
            });
            this.closeDelete()
        },
        reset() {
            this.selected = []
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
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
        save() {

            if (this.editedIndex > -1) {
                if (this.validate()) {
                    Object.assign(this.servicios[this.editedIndex], this.editedItem)
                    this.updateService();
                }
            } else {
                if (this.selected.length > 1) {
                    if (this.$refs.editarVarios.validate()) {
                        this.updateManyServices()
                    }
                } else {
                    if (this.validate()) {
                        this.createService();

                    }
                }

            }
            this.close()
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

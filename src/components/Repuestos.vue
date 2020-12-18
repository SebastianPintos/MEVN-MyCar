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
                                <v-col cols="12" sm="6" md="6">
                                    <v-select v-model="filtros.Brand" v-on:change="filterCategory(filtros.Brand)" :items="brandsList" item-text="Name" item-value="Name" label="Marca" :rules="requerido"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                    <v-select v-model="filtros.Category" :items="filteredCategory" item-text="Name" item-value="Name" label="Categoría" v-on:change="filterSubcategory(filtros.Category)"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                    <v-select v-model="filtros.SubCategory" :items="filteredSubCategory" item-text="Name" item-value="Name" label="Sub-Categoría"></v-select>
                                </v-col>

                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field v-model="filtros.SKU" label="SKU"></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field type="number" prefix="$" v-model="filtros.cDesde" label="Precio última Compra Desde"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field type="number" prefix="$" v-model="filtros.cHasta" label="Precio última Compra Hasta"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field type="number" prefix="$" v-model="filtros.vDesde" label="Precio de Venta Desde"></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field type="number" prefix="$" v-model="filtros.vHasta" label="Precio de Venta Hasta"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-select v-model="filtros.Dealer" :items="dealersList" item-text="Email" item-value="Email" label="Proveedor"></v-select>

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

        <!-- Tabla -->
        <v-data-table v-model="selected" show-select :headers="headers" :items="repuestos" :search="search" item-key="_id" sort-by="Brand" class="elevation-1">
            <template v-slot:item.SalePrice="{ item }">
                {{ formatPrice(item.SalePrice) }}
            </template>
            <template v-slot:item.LastPurchasePrice="{ item }">
                {{ formatPrice(item.LastPurchasePrice) }}
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-divider class="mx-4" dark vertical></v-divider>
                    <v-spacer></v-spacer>
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
                                                    <v-select v-model="editedItem.Brand" v-on:change="filterCategory(editedItem.Brand)" :items="brandsList" item-text="Name" item-value="Name" label="Marca" :rules="requerido"></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-select v-model="editedItem.Category" :items="filteredCategory" item-text="Name" item-value="Name" label="Categoría" v-on:change="filterSubcategory(editedItem.Category)"></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-select v-model="editedItem.SubCategory" :items="filteredSubCategory" item-text="Name" item-value="Name" label="Sub-Categoría"></v-select>
                                                </v-col>

                                                <v-col cols="12" sm="4" md="6">
                                                    <v-text-field :rules="reglaSKU" v-model="editedItem.SKU" label="SKU"></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="4" md="6">
                                                    <v-text-field type="number" :rules="reglaPrecio" prefix="$" v-model="editedItem.LastPurchasePrice" label="Precio última Compra"></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="4" md="6">
                                                    <v-text-field type="number" :rules="reglaPrecio" prefix="$" v-model="editedItem.SalePrice" label="Precio de Venta"></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="4" md="12">
                                                    <v-select v-model="editedItem.Dealer" :items="dealersList" item-text="Email" item-value="_id" label="Proveedor" :rules="requerido"></v-select>
                                                </v-col>

                                                <v-col cols="12" sm="4" md="12">
                                                    <v-text-field type="number" v-model="editedItem.ShippingDealer" label="Tiempo envío entre Sucursales (días)" :rules="requerido"></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="4" md="12">
                                                    <v-text-field type="number" v-model="editedItem.ShippingBranch" label="Tiempo de envío Proveedor (días)" :rules="requerido"></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-textarea v-model="editedItem.Description" label="Descripción"></v-textarea>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn text @click="reset" class="info">
                                            <v-icon>mdi-cancel</v-icon>
                                        </v-btn>
                                        <v-btn text @click="save" class="info">
                                            <v-icon>mdi-check</v-icon>
                                        </v-btn>
                                    </v-card-actions>
                                </v-form>
                            </v-card>

                            <v-card>
                                <v-form ref="editarVarios" v-if="selected.length > 1" v-model="valid" lazy-validation>

                                    <v-card-title>
                                        <span class="tituloChico">Editar varios</span>
                                    </v-card-title>

                                    <v-card-text>
                                        <v-container>
                                            <v-row>

                                                <v-btn-toggle v-model="toggle_none1">
                                                    <v-btn fab dark small class="warning">
                                                        <v-icon>mdi-plus</v-icon>
                                                    </v-btn>
                                                    <v-btn fab dark small class="warning">
                                                        <v-icon>mdi-minus</v-icon>
                                                    </v-btn>
                                                </v-btn-toggle>

                                                <v-col cols="12" sm="6" md="10">
                                                    <v-text-field type="number" id="precioVenta" suffix="%" :disabled="deshabilitarPrecioVenta" :rules="reglaEditarVenta" v-model="editedItem.SalePrice" prefix="$" label="Precio de Venta"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="2">
                                                    <v-btn :class="classBotonVenta" @click="clickPrecioVenta()">
                                                        <v-icon>{{nombrePrecioVenta}}</v-icon>
                                                    </v-btn>
                                                </v-col>

                                                <v-btn-toggle v-model="toggle_none2">
                                                    <v-btn fab dark small class="warning">
                                                        <v-icon>mdi-plus</v-icon>
                                                    </v-btn>
                                                    <v-btn fab dark small class="warning">
                                                        <v-icon>mdi-minus</v-icon>
                                                    </v-btn>
                                                </v-btn-toggle>

                                                <v-col cols="12" sm="6" md="10">
                                                    <v-text-field type="number" :disabled="deshabilitarPrecioCompra" suffix="%" :rules="reglaEditarCompra" v-model="editedItem.LastPurchasePrice" prefix="$" label="Precio de última Compra"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="2">
                                                    <v-btn :class="classBotonCompra" @click="clickPrecioCompra()">
                                                        <v-icon>{{nombrePrecioCompra}}</v-icon>
                                                    </v-btn>
                                                </v-col>

                                                <v-col cols="12" sm="6" md="10">
                                                    <v-select :disabled="deshabilitarProveedor" :rules="reglaEditarProveedor" v-model="editedItem.Dealer" :items="dealersList" item-text="Email" item-value="_id" label="ID Proveedor" required></v-select>
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
                                        <v-btn class="info" text @click="reset">
                                            <v-icon>mdi-cancel</v-icon>
                                        </v-btn>
                                        <v-btn class="info" text @click="save">
                                            <v-icon>mdi-check</v-icon>
                                        </v-btn>
                                    </v-card-actions>
                                </v-form>
                            </v-card>

                        </v-dialog>
                    </div>

                    <v-btn dark class="mb-2" color="warning" @click="controlarStock">
                        Stock
                    </v-btn>

                    <v-dialog v-model="dialogStock" max-width="500px" persistent>
                        <v-card>
                            <h1 class="text-center">Stock</h1>
                            <v-card-text>
                                <v-text-field readonly :value="'Disponibles: '+disponibles"></v-text-field>
                                <v-text-field readonly :value="'Reservados: '+reservados"></v-text-field>
                                <v-text-field readonly :value="'Fuera de Servicio: '+fueraDeServicio"></v-text-field>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn text class="success" @click="reiniciarStock">
                                    <v-icon>mdi-check</v-icon>
                                </v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="dialogDelete" max-width="500px" persistent>
                        <v-card>
                            <v-card-title class="headline">Estas seguro de que quiere eliminar el/los elemento/s?</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn text @click="reset" class="info">
                                    <v-icon>mdi-cancel</v-icon>
                                </v-btn>
                                <v-btn text @click="deleteItemConfirm" class="info">
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
                <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
                    Aceptar
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
        selected: [],
        toggle_none1: null,
        disponibles: "0",
        reservados: "",
        fueraDeServicio: "",
        repuestosStock: [],
        toggle_none2: null,
        search: '',
        valid: true,
        snackbar: false,
        mensaje: "",
        dialog: false,
        dialogDelete: false,
        textoBoton: ['mdi-pencil', 'mdi-eyedropper-minus'],
        classBoton: ['success', 'error'],
        classBotonVenta: 'success',
        classBotonCompra: 'success',
        classBotonProveedor: 'success',
        nombrePrecioCompra: 'mdi-pencil',
        nombrePrecioVenta: 'mdi-pencil',
        nombreProveedor: 'mdi-pencil',
        deshabilitarPrecioVenta: true,
        deshabilitarPrecioCompra: true,
        deshabilitarProveedor: true,
        dialogStock: false,

        reglaPrecio: [
            value => !!value || 'Requerido.',
            value => {
                const pattern = /^[0-9]{1,}(.[0-9]{1,}){0,1}$/
                return pattern.test(value) || 'Sólo se permiten números!'
            },
        ],

        reglaEditarCompra: [],
        reglaEditarVenta: [],
        reglaEditarProveedor: [],

        requerido: [
            value => !!value || 'Requerido.',
        ],

        reglaSKU: [
            value => (value || '').length <= 12 || 'Máximo 12 caracteres',
            value => (value || '').length >= 8 || 'Mínimo 8 caracteres',
            value => {
                const pattern = /^[0-9 A-Z]{8,12}$/
                return pattern.test(value) || 'SKU inválido'
            },
        ],

        headers: [{
                text: 'Categoría',
                value: 'Category',
                align: 'start',
            },
            {
                text: 'Sub Categoría',
                value: 'SubCategory'
            },
            {
                text: 'Marca',
                value: 'Brand'
            },
            {
                text: 'SKU',
                value: 'SKU'
            },
            {
                text: 'Precio última Compra',
                value: 'LastPurchasePrice'
            },
            {
                text: 'Precio Venta',
                value: 'SalePrice'
            },
            {
                text: 'Proveedor',
                value: 'Dealer.Email'
            },
            {
                text: 'Descripción',
                value: 'Description'
            }
        ],
        repuestos: [],
        allRepuestos: [],
        repuestosFiltrados: [],
        statusList: ["Activo", "Inactivo"],
        dealersList: [],
        filtros: [{
            Description: '',
            Category: '',
            SubCategory: '',
            Brand: '',
            SKU: '',
            cDesde: '',
            cHasta: '',
            vDesde: '',
            vHasta: '',
            Dealer: '',
            Status: '',
        }],
        editedIndex: -1,
        attrs: '',
        on: '',
        editedItem: {
            Description: '',
            ShippingDealer: '',
            ShippingBranch: '',
            Category: '',
            SubCategory: '',
            Brand: '',
            SKU: '',
            LastPurchasePrice: 0,
            SalePrice: 0,
            Dealer: '',
            Status: '',
        },
        brandsList: [],
        categoryList: [],
        subcategoryList: [],
        filteredCategory: [],
        filteredSubCategory: [],
        defaultItem: {
            ShippingDealer: '',
            ShippingBranch: '',
            Description: '',
            Category: '',
            SubCategory: '',
            Brand: '',
            SKU: '',
            LastPurchasePrice: 0,
            SalePrice: 0,
            Dealer: '',
        },
    }),
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo Repuesto' : 'Editar Repuesto'
        }
    },
    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.close()
        },
    },
    created() {
        this.initialize();
        this.getRepuestos();
        this.getrepuestosStock();
        this.repuestosFiltrados = this.repuestos;
        this.getProveedores();
    },

    methods: {
        initialize() {
            this.repuestos = []
        },
        async getProveedores() {
            await axios.get(urlAPI + 'dealer')
                .then(res => {
                    let dealersList = res.data.dealer;
                    if (dealersList != null) {
                        dealersList.forEach(dealer => {
                            if (dealer.Kind == "PRODUCT" && dealer.Status == "ACTIVE") {
                                this.dealersList.push(dealer);
                            }
                        })
                    }
                })
        },

        async getRepuestos() {
            await axios.get(urlAPI + 'product')
                .then(res => {
                    this.allRepuestos = res.data.product;
                    this.allRepuestos.forEach(repuesto => {
                        if (repuesto.Status === "ACTIVE") {
                            this.repuestos.push(repuesto);
                        }
                    })
                })

            axios.get(urlAPI + 'brand')
                .then(res => {
                    this.brandsList = res.data.brand.filter(brand => brand.Kind == 'PRODUCT');
                })
            axios.get(urlAPI + 'category')
                .then(res => {
                    this.categoryList = res.data.category;
                })
            axios.get(urlAPI + 'subcategory')
                .then(res => {
                    this.subcategoryList = res.data.subcategory;
                })
        },

        getrepuestosStock() {
            axios.get(urlAPI + 'productStock')
                .then(res => {
                    let repuestosStock = res.data.productStock;
                    if (repuestosStock != null) {
                        repuestosStock.forEach(repuesto => {
                            if (repuesto.Status === "ACTIVE") {
                                this.repuestosStock.push(repuesto);
                            }
                        })
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
        validateUsers(...authorizedUsers) {
            if (localStorage.getItem('userType') != null) {
                return (authorizedUsers.includes(localStorage.getItem('userType'))) ? true : false
            }
            return false;
        },

        editItem(item) {
            if (!this.mensajeNoSelecciono()) {
                if (this.selected.length === 1) {
                    this.editedIndex = this.repuestos.indexOf(item)
                    this.editedItem = Object.assign({}, item)
                    this.dialog = true
                } else {
                    this.dialog = true
                }
            }
        },
        deleteItem(items) {
            if (!this.mensajeNoSelecciono()) {
                this.editedIndex = this.repuestos.indexOf(items)
                this.editedItem = Object.assign({}, items)
                this.dialogDelete = true
            }
        },
        controlarStock() {
            let auxDisp = 0;
            let auxReservados = 0;
            let auxFueraServ = 0;
            if (this.selected.length != 1) {
                this.snackbar = true;
                this.mensaje = "Sólo puede corroborar un elemento a la vez!";
                return;
            }
            this.getrepuestosStock();
            if (this.repuestosStock == null) {
                this.disponibles = "0";
                this.reservados = "0";
                this.fueraDeServicio = "0";
                return;
            }
            this.repuestosStock.forEach(repuesto => {
                if (repuesto.Product._id === this.selected[0]._id) {
                    auxDisp += repuesto.Available;
                    auxReservados += repuesto.Reserved;
                    auxFueraServ += repuesto.OutOfService;
                }
            });
            this.reservados = String(auxReservados);
            this.disponibles = String(auxDisp);
            this.fueraDeServicio = String(auxFueraServ);
            this.dialogStock = true;
        },

        reiniciarStock() {
            this.disponibles = 0;
            this.reservados = 0;
            this.fueraDeServicio = 0;
            this.dialogStock = false;
        },

        deleteItemConfirm() {
            this.selected.forEach(item => {
                this.repuestos.splice(this.repuestos.indexOf(item), 1)
                this.deleteproduct(item)
            });
        },
        reset() {
            this.selected = [];
            if (this.dialog) {
                this.$refs.form.resetValidation();
            }
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
            this.close();

        },
        close() {
            this.dialogStock = false;
            this.dialogDelete = false;
            this.dialog = false;
            this.toggle_none1 = null;
            this.toggle_none2 = null;
            this.nombrePrecioCompra = this.textoBoton[0];
            this.nombrePrecioVenta = this.textoBoton[0];
            this.nombreProveedor = this.textoBoton[0];
            this.classBotonCompra = this.classBoton[0];
            this.classBotonProveedor = this.classBoton[0];
            this.classBotonVenta = this.classBoton[0];
            this.deshabilitarPrecioCompra = true;
            this.deshabilitarPrecioVenta = true;
            this.deshabilitarProveedor = true;
            this.reglaEditarCompra = [];
            this.reglaEditarProveedor = [];
            this.reglaEditarVenta = [];
        },
        formatPrice(value) {
            return value == null ? "$0" : "$" + value;
        },
        validate() {
            return this.$refs.form.validate()
        },
        aplicarFiltros() {
            let Brand = this.filtros.Brand != null & this.filtros.Brand != ""
            let SubCategory = this.filtros.SubCategory != null & this.filtros.SubCategory != ""
            let Category = this.filtros.Category != null & this.filtros.Category != ""
            let SKU = this.filtros.SKU != null & this.filtros.SKU != ""
            let cDesde = this.filtros.cDesde != null & this.cDesde != ""
            let cHasta = this.filtros.cHasta != null & this.filtros.cHasta != ""
            let vDesde = this.filtros.vDesde != null & this.vDesde != ""
            let vHasta = this.filtros.vHasta != null & this.filtros.vHasta != ""
            let Dealer = this.filtros.Dealer != null & this.filtros.Dealer != ""
            let Status = this.filtros.Satus != null & this.filtros.Status != ""

            if (!Brand && !Category && !SubCategory && !cDesde && !cHasta && !vDesde & !vHasta && !Dealer && !Status && !SKU) {
                return
            }
            let BrandMatches = true
            let SubCategoryMatches = true
            let CategoryMatches = true
            let SKUMatches = true
            let cDesdeMatches = true
            let cHastaMatches = true
            let vDesdeMatches = true
            let vHastaMatches = true
            let StatusMatches = true
            let DealerMatches = true
            let repAux = []
            let cant = 0
            for (var i = 0; i < this.repuestos.length; i++) {
                BrandMatches = Brand ? this.repuestos[i].Brand === this.filtros.Brand : BrandMatches
                SubCategoryMatches = SubCategory ? this.repuestos[i].SubCategory === this.filtros.SubCategory : SubCategoryMatches
                CategoryMatches = Category ? this.repuestos[i].Category === this.filtros.Category : CategoryMatches
                SKUMatches = SKU ? this.repuestos[i].SKU === this.filtros.SKU : SKUMatches

                cDesdeMatches = cDesde ? parseFloat(this.repuestos[i].LastPurchasePrice) >= parseFloat(this.filtros.cDesde) : cDesdeMatches
                vDesdeMatches = vDesde ? parseFloat(this.repuestos[i].SalePrice) >= parseFloat(this.filtros.vDesde) : vDesdeMatches

                cHastaMatches = cHasta ? parseFloat(this.repuestos[i].LastPurchasePrice) <= parseFloat(this.filtros.cHasta) : cHastaMatches
                vHastaMatches = vHasta ? parseFloat(this.repuestos[i].SalePrice) <= parseFloat(this.filtros.vHasta) : vHastaMatches
                StatusMatches = Status ? this.repuestos[i].Status === this.filtros.Status : StatusMatches
                DealerMatches = Dealer ? this.repuestos[i].Dealer.Email == this.filtros.Dealer : DealerMatches

                if (BrandMatches & SubCategoryMatches & CategoryMatches & SKUMatches & cDesdeMatches & cHastaMatches & vDesdeMatches & vHastaMatches & StatusMatches & DealerMatches) {
                    repAux[cant] = this.repuestos[i]
                    cant++
                }
            }
            this.repuestosFiltrados = repAux
            this.repuestos = this.repuestosFiltrados
        },

        clickPrecioVenta() {
            this.deshabilitarPrecioVenta = !this.deshabilitarPrecioVenta;
            if (this.nombrePrecioVenta === this.textoBoton[0]) {
                this.reglaEditarVenta = this.requerido;
                this.nombrePrecioVenta = this.textoBoton[1];
                this.classBotonVenta = this.classBoton[1];
            } else {
                this.reglaEditarVenta = [];
                this.nombrePrecioVenta = this.textoBoton[0];
                this.classBotonVenta = this.classBoton[0];
            }
        },

        clickPrecioCompra() {
            this.deshabilitarPrecioCompra = !this.deshabilitarPrecioCompra;
            if (this.nombrePrecioCompra === this.textoBoton[0]) {
                this.reglaEditarCompra = this.requerido;
                this.nombrePrecioCompra = this.textoBoton[1];
                this.classBotonCompra = this.classBoton[1];
            } else {
                this.reglaEditarCompra = [];
                this.nombrePrecioCompra = this.textoBoton[0];
                this.classBotonCompra = this.classBoton[0];
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

        reiniciarFiltros() {
            this.filtros = [{
                Description: '',
                Category: '',
                SubCategory: '',
                Brand: '',
                SKU: '',
                LastPurchasePrice: 0,
                SalePrice: 0,
                Dealer: '',
                Status: '',
            }]
            this.repuestosFiltrados = []
            this.initialize();
            this.getRepuestos();
            this.getProveedores();
            this.repuestosFiltrados = this.repuestos
        },

        deleteproduct(item) {
            axios.delete(urlAPI + 'product/' + item._id + '/delete').then(res => {
                if (res != null) {
                    this.reset();
                }
            })
        },

        async updateproduct() {
            await axios.post(urlAPI + 'product/' + this.selected[0]._id + '/update', {
                "product": {
                    "Description": this.editedItem.Description,
                    "Category": this.editedItem.Category,
                    "SubCategory": this.editedItem.SubCategory,
                    "Brand": this.editedItem.Brand,
                    "ShippingDealer": this.editedItem.ShippingDealer,
                    "ShippingBranch": this.editedItem.ShippingBranch,
                    "SKU": this.editedItem.SKU,
                    "LastPurchasePrice": this.editedItem.LastPurchasePrice,
                    "SalePrice": this.editedItem.SalePrice,
                    "Dealer": this.editedItem.Dealer,
                    "Status": "ACTIVE",
                    "Kind": "PRODUCT",
                }
            }).then(res => {
                if (res != null) {
                    this.reset();
                    this.initialize();
                    this.getRepuestos();
                }
            })
        },

        async updateManyproducts() {
            await this.selected.forEach(product => {
                let precioVenta = this.deshabilitarPrecioVenta ? product.SalePrice : this.editedItem.SalePrice;
                let precioCompra = this.deshabilitarPrecioCompra ? product.LastPurchasePrice : this.editedItem.LastPurchasePrice;

                if (precioVenta != product.SalePrice) {
                    if (this.toggle_none1 === 1) {
                        precioVenta = -precioVenta;
                    }
                    precioVenta = product.SalePrice + ((product.SalePrice * precioVenta) / 100);
                }
                if (precioCompra != product.LastPurchasePrice) {
                    if (this.toggle_none2 === 1) {
                        precioCompra = -precioCompra;
                    }
                    precioCompra = product.LastPurchasePrice + ((product.LastPurchasePrice * precioCompra) / 100);
                }
                let proveedor = this.deshabilitarProveedor ? product.Dealer : this.editedItem.Dealer;
                axios.post(urlAPI + 'product/' + product._id + '/update', {
                    "product": {
                        "Description": product.Description,
                        "Category": product.Category,
                        "SubCategory": product.SubCategory,
                        "Brand": product.Brand,
                        "SKU": product.SKU,
                        "LastPurchasePrice": precioCompra,
                        "SalePrice": precioVenta,
                        "Dealer": proveedor,
                        "Status": product.Status,
                        "Kind": "PRODUCT",
                        "ShippingDealer": product.ShippingDealer,
                        "ShippingBranch": product.ShippingBranch,
                    }
                })
                if (i == this.selected.length - 1) {
                    this.reset();
                    this.initialize();
                    this.getRepuestos();
                }
            })
        },

        async createproduct() {
            await axios.post(urlAPI + 'product/add', {
                "product": {
                    "Description": this.editedItem.Description,
                    "Category": this.editedItem.Category,
                    "ShippingDealer": this.editedItem.ShippingDealer,
                    "ShippingBranch": this.editedItem.ShippingBranch,
                    "SubCategory": this.editedItem.SubCategory,
                    "Brand": this.editedItem.Brand,
                    "SKU": this.editedItem.SKU,
                    "LastPurchasePrice": this.editedItem.LastPurchasePrice,
                    "SalePrice": this.editedItem.SalePrice,
                    "Dealer": this.editedItem.Dealer,
                    "Kind": "PRODUCT",
                }
            }).then(res => {
                if (res != null) {
                    this.initialize();
                    this.getRepuestos();
                    this.reset();
                }
            })
        },
        save() {
            if (this.editedIndex > -1) {
                if (this.validate()) {
                    Object.assign(this.repuestos[this.editedIndex], this.editedItem)
                    this.updateproduct();
                }
            } else {
                if (this.selected.length > 1) {
                    if (this.$refs.editarVarios.validate()) {
                        this.updateManyproducts()
                        this.$refs.editarVarios.resetValidation();
                        this.reset();
                    }
                } else {
                    if (this.validate()) {
                        this.repuestos.push(this.editedItem);
                        this.createproduct();
                    }
                }

            }
        },

        filterCategory(marca) {
            if (marca != '') {
                this.filteredCategory = []
                let actualBrand;
                actualBrand = this.brandsList.find(brand => brand.Name == marca)
                this.categoryList.forEach(category => {
                    if (category.Brand == actualBrand._id) {
                        this.filteredCategory.push(category)
                    }
                })
            }
        },

        filterSubcategory(category) {
            if (category != '') {
                this.filteredSubCategory = []
                let actualCategory;
                actualCategory = this.categoryList.find(c => c.Name == category)

                this.subcategoryList.forEach(scategory => {
                    if (scategory.Category._id == actualCategory._id) {
                        this.filteredSubCategory.push(scategory)
                    }
                })
            }
        },

    },
};
</script>

<style>
.mb-2 {
    margin-left: 3px;
    margin-right: 3px;
}

.btnMasMenos {
    margin: -10%;
}
</style>

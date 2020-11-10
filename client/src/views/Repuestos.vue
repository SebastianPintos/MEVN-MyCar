<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <v-container>
        <h1 class="titulo">REPUESTOS</h1>

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
                                    <v-text-field v-model="filtros.Category" label="Categoria"></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="6" md="3">
                                    <v-text-field v-model="filtros.SubCategory" label="Sub Categoría"></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="6" md="3">
                                    <v-text-field v-model="filtros.Brand" label="Marca"></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field v-model="filtros.SKU" label="SKU"></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field prefix="$" v-model="filtros.LastPurchasePrice" label="Precio última Compra"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field prefix="$" v-model="filtros.SalePrice" label="Precio de Venta"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-select v-model="filtros.Dealer" :items="dealersList" item-text="Email" item-value="_id" label="Proveedor"></v-select>

                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                    <v-btn class="success" @click="aplicarFiltros">Aplicar Filtros</v-btn>
                                    <v-btn class="warning" @click="reiniciarFiltros">Reiniciar Filtros</v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>

        <!-- Tabla -->
        <v-data-table v-model="selected" show-select :headers="headers" :items="repuestos" :search="search" item-key="_id" sort-by="Brand" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details></v-text-field>

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

                                            <v-col cols="12" sm="6" md="3">
                                                <v-text-field v-model="editedItem.Category" label="Categoria" :rules="requerido"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="3">
                                                <v-text-field v-model="editedItem.SubCategory" label="Sub Categoría"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="3">
                                                <v-text-field v-model="editedItem.Brand" label="Marca" :rules="requerido"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="4" md="3">
                                                <v-text-field :rules="reglaSKU" v-model="editedItem.SKU" label="SKU"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="4" md="3">
                                                <v-text-field :rules="reglaPrecio" v-model="editedItem.LastPurchasePrice" label="Precio última Compra"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="4" md="3">
                                                <v-text-field :rules="reglaPrecio" v-model="editedItem.SalePrice" label="Precio de Venta"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="4" md="3">
                                                <v-select v-model="editedItem.Dealer" :items="dealersList" item-text="Email" item-value="_id" label="Proveedor" :rules="requerido"></v-select>

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

                        <v-card>
                            <v-form ref="editarVarios" v-if="selected.length > 1" v-model="valid" lazy-validation>

                                <v-card-title>
                                    <span class="headline">Editar varios</span>
                                </v-card-title>

                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="8">
                                                <v-text-field id="precioVenta" :disabled="deshabilitarPrecioVenta" :rules="reglaEditarVenta" v-model="editedItem.SalePrice" prefix="$" label="Precio de Venta"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-btn class="warning" @click="clickPrecioVenta()">{{nombrePrecioVenta}}</v-btn>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="8">
                                                <v-text-field :disabled="deshabilitarPrecioCompra" :rules="reglaEditarCompra" v-model="editedItem.LastPurchasePrice" prefix="$" label="Precio de última Compra"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-btn class="warning" @click="clickPrecioCompra()">{{nombrePrecioCompra}}</v-btn>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="8">
                                                <v-select :disabled="deshabilitarProveedor" :rules="reglaEditarProveedor" v-model="editedItem.Dealer" :items="dealersList" item-text="Email" item-value="_id" label="ID Proveedor" required></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-btn class="warning" @click="clickProveedor()">{{nombreProveedor}}</v-btn>
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
                                <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                                <v-btn color="blue darken-1" text @click="deleteItemConfirm">Confirmar</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>

            <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">
                    Reset
                </v-btn>
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
    </v-container>
</v-img>
</template>

<script>
import axios from "axios"
export default {
    data: () => ({
        selected: [],
        search: '',
        valid: true,
        snackbar: false,
        mensaje: "",
        dialog: false,
        dialogDelete: false,
        textoBoton: ['Editar', 'Cancelar'],
        nombrePrecioCompra: 'Editar',
        nombrePrecioVenta: 'Editar',
        nombreProveedor: 'Editar',
        deshabilitarPrecioVenta: true,
        deshabilitarPrecioCompra: true,
        deshabilitarProveedor: true,

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
                text: 'Category',
                value: 'Category',
                align: 'start',
            },
            {
                text: 'SubCategory',
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
            LastPurchasePrice: 0,
            SalePrice: 0,
            Dealer: '',
            Status: '',
        }],
        editedIndex: -1,
        attrs: '',
        on: '',
        editedItem: {
            Description: '',
            Category: '',
            SubCategory: '',
            Brand: '',
            SKU: '',
            LastPurchasePrice: 0,
            SalePrice: 0,
            Dealer: '',
            Status: '',
        },
        defaultItem: {
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
            return this.editedIndex === -1 ? 'Nuevo Repuesto' : 'Editar Vehículo'
        }
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
        this.getRepuestos();
        this.repuestosFiltrados = this.repuestos;
        this.getProveedores();
    },

    methods: {
        initialize() {
            this.repuestos = []
        },
        async getProveedores() {
            await axios.get('http://localhost:8081/dealer')
                .then(res => {
                    this.dealersList = res.data.dealer;
                })
        },

        async getRepuestos() {
            await axios.get('http://localhost:8081/product')
                .then(res => {
                    this.allRepuestos = res.data.product;
                    this.allRepuestos.forEach(repuesto => {
                        if (repuesto.Status === "ACTIVE") {
                            this.repuestos.push(repuesto);
                        }
                    })
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
        deleteItemConfirm() {
            this.selected.forEach(item => {
                this.repuestos.splice(this.repuestos.indexOf(item), 1)
                this.deleteproduct(item)
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
            let SubCategory = this.filtros.SubCategory != null & this.filtros.SubCategory != ""
            let Category = this.filtros.Category != null & this.filtros.Category != ""
            let SKU = this.filtros.SKU != null & this.filtros.SKU != ""
            let LastPurchasePrice = this.filtros.LastPurchasePrice != null & this.filtros.LastPurchasePrice != ""
            let SalePrice = this.filtros.SalePrice != null & this.filtros.SalePrice != ""
            let Dealer = this.filtros.Dealer != null & this.filtros.Dealer != ""
            let Status = this.filtros.Satus != null & this.filtros.Status != ""

            if (!Brand && !Category && !SubCategory && !LastPurchasePrice && !SalePrice && !Dealer && !Status && !SKU) {
                return
            }
            let BrandMatches = true
            let SubCategoryMatches = true
            let CategoryMatches = true
            let SKUMatches = true
            let LastPurchasePriceMatches = true
            let SalePriceMatches = true
            let StatusMatches = true
            let DealerMatches = true
            let repAux = []
            let cant = 0
            for (var i = 0; i < this.repuestos.length; i++) {
                BrandMatches = Brand ? this.repuestos[i].Brand === this.filtros.Brand : BrandMatches
                SubCategoryMatches = SubCategory ? this.repuestos[i].SubCategory === this.filtros.SubCategory : SubCategoryMatches
                CategoryMatches = Category ? this.repuestos[i].Category === this.filtros.Category : CategoryMatches
                SKUMatches = SKU ? this.repuestos[i].SKU === this.filtros.SKU : SKUMatches
                LastPurchasePriceMatches = LastPurchasePrice ? this.repuestos[i].LastPurchasePrice === this.filtros.LastPurchasePrice : LastPurchasePriceMatches
                SalePriceMatches = SalePrice ? this.repuestos[i].SalePrice === this.filtros.SalePrice : SalePriceMatches
                StatusMatches = Status ? this.repuestos[i].Status === this.filtros.Status : StatusMatches
                DealerMatches = Dealer ? this.repuestos[i].Dealer._id == this.filtros.Dealer._id : DealerMatches
                if (BrandMatches & SubCategoryMatches & CategoryMatches & SKUMatches & LastPurchasePriceMatches & SalePriceMatches & StatusMatches & DealerMatches) {
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
            } else {
                this.reglaEditarVenta = [];
                this.nombrePrecioVenta = this.textoBoton[0];
            }
        },

        clickPrecioCompra() {
            this.deshabilitarPrecioCompra = !this.deshabilitarPrecioCompra;
            if (this.nombrePrecioCompra === this.textoBoton[0]) {
                this.reglaEditarCompra = this.requerido;
                this.nombrePrecioCompra = this.textoBoton[1];
            } else {
                this.reglaEditarCompra = [];
                this.nombrePrecioCompra = this.textoBoton[0];
            }
        },

        clickProveedor() {
            this.deshabilitarProveedor = !this.deshabilitarProveedor;
            if (this.nombreProveedor === this.textoBoton[0]) {
                this.reglaEditarProveedor = this.requerido;
                this.nombreProveedor = this.textoBoton[1];
            } else {
                this.reglaEditarProveedor = [];
                this.nombreProveedor = this.textoBoton[0];
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
            axios.delete('http://localhost:8081/product/' + item._id + '/delete')
        },

        async updateproduct() {
            await axios.post('http://localhost:8081/product/' + this.selected[0]._id + '/update', {
                "product": {
                    "Description": this.editedItem.Description,
                    "Category": this.editedItem.Category,
                    "SubCategory": this.editedItem.SubCategory,
                    "Brand": this.editedItem.Brand,
                    "SKU": this.editedItem.SKU,
                    "LastPurchasePrice": this.editedItem.LastPurchasePrice,
                    "SalePrice": this.editedItem.SalePrice,
                    "Dealer": this.editedItem.Dealer,
                    "Status": "ACTIVE",
                }
            })
            this.initialize();
            this.getRepuestos();
        },
        async updateManyproducts() {
            await this.selected.forEach(product => {
                let precioVenta = this.deshabilitarPrecioVenta ? product.SalePrice : this.editedItem.SalePrice;
                let precioCompra = this.deshabilitarPrecioCompra ? product.LastPurchasePrice : this.editedItem.LastPurchasePrice;
                let proveedor = this.deshabilitarProveedor ? product.Dealer : this.editedItem.Dealer;
                axios.post('http://localhost:8081/product/' + product._id + '/update', {
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
                    }
                })
            })
            this.initialize();
            this.getRepuestos();
        },
        async createproduct() {
            await axios.post('http://localhost:8081/product/add', {
                "product": {
                    "Description": this.editedItem.Description,
                    "Category": this.editedItem.Category,
                    "SubCategory": this.editedItem.SubCategory,
                    "Brand": this.editedItem.Brand,
                    "SKU": this.editedItem.SKU,
                    "LastPurchasePrice": this.editedItem.LastPurchasePrice,
                    "SalePrice": this.editedItem.SalePrice,
                    "Dealer": this.editedItem.Dealer,
                }
            })
            this.initialize();
            this.getRepuestos();
        },
        save() {
            if (this.editedIndex > -1) {
                if (this.validate()) {
                    Object.assign(this.repuestos[this.editedIndex], this.editedItem)
                    this.updateproduct();
                    this.reset();
                    this.reiniciar();
                }
            } else {
                if (this.selected.length > 1) {
                    if (this.$refs.editarVarios.validate()) {
                        this.updateManyproducts()
                        this.$refs.editarVarios.resetValidation()
                        this.nombrePrecioCompra = this.textoBoton[0]
                        this.nombrePrecioVenta = this.textoBoton[0]
                        this.nombreProveedor = this.textoBoton[0]
                        this.reset()
                        this.close()
                    }
                } else {
                    if (this.validate()) {
                        this.repuestos.push(this.editedItem)
                        this.createproduct()
                        this.reiniciar();
                    }
                }

            }
        },

        reiniciar() {
            this.close()
            this.$refs.form.resetValidation()
        },

    },
};
</script>

<style>
.mb-2 {
    margin-left: 3px;
    margin-right: 3px;
}
</style>

<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>
        <v-data-table v-model="selected" :single-select="true" show-select :headers="headers" :items="productsStock" :search="search" item-key="_id" sort-by="Brand" class="elevation-1">
            <template v-slot:item.Expiration="{ item }">
                {{ formatDate(item.Expiration)}}
            </template>
            <template v-slot:item.Price="{ item }">
                {{ formatPrice(item.Price) }}
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details single-select></v-text-field>
                    <v-divider class="mx-4" dark vertical></v-divider>
                    <v-spacer></v-spacer>

                    <div v-if="validateUsers('Administrativo')">
                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" @click="editar">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>

                        <v-btn color="error" dark class="mb-2" v-bind="attrs" v-on="on" @click="corroborarSeleccionado">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>

                        <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on" @click="dialogNuevo=true; nuevo=true; titulo='Nuevo Repuesto';">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
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
        <v-dialog v-model="dialogNuevo" max-width="600px" persistent>
            <v-card>
                <v-card-title>{{titulo}}</v-card-title>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-card-text>
                        <v-text-field type="number" v-model="editedItem.BatchNum" label="N° de Lote"></v-text-field>
                        <v-text-field type="number" v-model="editedItem.Price" prefix="$" label="Precio" :rules="requerido"></v-text-field>
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-text-field type="number" v-model="editedItem.Available" label="Disponibles" :rules="reglaNumero"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field type="number" v-model="editedItem.Reserved" label="Reservados" :rules="reglaNumero"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-text-field type="number" v-model="editedItem.OutOfService" label="Fuera de Servicio" :rules="reglaNumero"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field v-model="editedItem.Expiration" label="Fecha de Vencimiento" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                            </template>
                            <v-date-picker ref="picker" v-model="editedItem.Expiration" locale="es" min="2020-11-23" @change="save"></v-date-picker>
                        </v-menu>
                        <v-select :items="repuestos" item-text="SKU" v-model="editedItem.Product" item-value="_id" label="Repuesto" :rules="requerido">
                            <template slot="item" slot-scope="data">
                                SKU: {{ data.item.SKU }},CATEGORÍA :{{ data.item.Category }},MARCA :{{ data.item.Brand }}
                            </template>
                        </v-select>
                        <v-select :items="sucursales" item-text="Name" v-model="editedItem.BranchOffice" item-value="_id" label="Sucursal" :rules="requerido"></v-select>
                    </v-card-text>
                    <v-card-actions>
                        <v-flex class="text-right">
                            <v-btn class="mb-2 info" @click="reset">
                                <v-icon>mdi-cancel</v-icon>
                            </v-btn>
                            <v-btn class="mb-2 info" @click="guardar">
                                <v-icon>mdi-check</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px" persistent>
            <v-card>
                <v-card-title class="headline">¿Estás seguro de que deseas eliminarlo?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="info" text @click="dialogDelete=false;selected=[]">
                        <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-btn class="info" text @click="eliminar">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
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
        dialogMensaje: false,
        mensaje: '',
        nuevo: false,
        valid: true,
        dialogNuevo: false,
        snackbar: false,
        dialogConfirm: false,
        titulo: '',
        menu: false,
        selected: [],
        date: null,
        dialogDelete: false,
        productsStock: [],
        search: '',
        requerido: [
            value => !!value || 'Requerido.',
        ],

        editedItem: {
            BatchNum: 0,
            Reserved: 0,
            Available: 0,
            OutOfService: 0,
            Expiration: null,
            Price: 0,
            Product: null,
            BranchOffice: null
        },
        defaultItem: {
            BatchNum: 0,
            Reserved: 0,
            Available: 0,
            OutOfService: 0,
            Expiration: null,
            Price: 0,
            Product: null,
            BranchOffice: null
        },
        reglaNumero: [
            value => {
                const pattern = /^[0-9]{1,}$/
                return pattern.test(value) || 'Sólo se permiten números!'
            },
        ],

        headers: [{
                text: 'SKU',
                value: 'Product.SKU',
                align: 'start',
            },
            {
                text: 'N° de Lote',
                value: 'BatchNum',
            },
            {
                text: 'Disponibles',
                value: 'Available',
            },
            {
                text: 'Reservados',
                value: 'Reserved',
            },
            {
                text: 'Fuera de Servicio',
                value: 'OutOfService'
            },

            {
                text: 'Precio',
                value: 'Price',
                align: 'right'
            },
            {
                text: 'Vencimiento',
                value: 'Expiration',
            }
        ],
        repuestos: [],
        sucursales: [],
        editedIndex: -1,
        attrs: '',
        on: '',
        branchOffice: "",

    }),

    created() {
        let employee = localStorage.getItem("employee");
        employee = JSON.parse(employee);
        this.branchOffice = employee != null & employee.BranchOffice != null ? employee.BranchOffice : "";
        this.getRepuestosStock(this.branchOffice);
        this.getRepuestos();
        this.getSucursales();
    },

    methods: {
        save() {
            this.$refs.menu.save(this.editedItem.Expiration)
        },
        validateUsers(...authorizedUsers) {
            if (localStorage.getItem('userType') != null) {
                return (authorizedUsers.includes(localStorage.getItem('userType'))) ? true : false
            }
            return false;
        },
        formatDate(value) {
            if (value == null) {
                return "N/A";
            }
            value = String(value);
            value = value.slice(0, 10);
            return value;
        },
        formatPrice(value) {
            return value == null ? "$0" : "$" + value;
        },
        async getRepuestosStock(branchOffice) {
            await axios.get(urlAPI + 'productStock')
                .then(res => {
                    let productsStock = res.data.productStock;
                    if (productsStock != null) {
                        this.productsStock = productsStock.filter(r => r.Status == "ACTIVE");
                        if (branchOffice != "") {
                            this.productsStock = this.productsStock.filter(r => r.BranchOffice._id == branchOffice);
                        }
                    }
                })
        },

        async getSucursales() {
            await axios.get(urlAPI + 'branchOffice')
                .then(res => {
                    let sucursales = res.data.branchOffice;
                    if (sucursales != null) {
                        sucursales.forEach(s => {
                            if (s.Status === "ACTIVE") {
                                this.sucursales.push(s);
                            }
                        })
                    }
                })
        },
        async getRepuestos() {
            await axios.get(urlAPI + 'product')
                .then(res => {
                    let products = res.data.product;
                    if (products != null) {
                        products.forEach(r => {
                            if (r.Status === "ACTIVE") {
                                this.repuestos.push(r);
                            }
                        })
                    }
                })
        },

        guardar() {
            if (this.validate()) {
                let auxRepuesto = {
                    "productStock": {
                        "Reserved": Number(this.editedItem.Reserved),
                        "Available": Number(this.editedItem.Available),
                        "OutOfService": Number(this.editedItem.OutOfService),
                        "Expiration": this.editedItem.Expiration,
                        "BranchOffice": this.editedItem.BranchOffice,
                        "Product": this.editedItem.Product,
                        "Price": parseFloat(this.editedItem.Price),
                        "BatchNum": String(this.editedItem.BatchNum)
                    }
                };
                if (this.nuevo == true) {
                    axios.post(urlAPI + "productStock/add", auxRepuesto).then(res => {
                        if (res != null) {
                            this.productsStock = [];
                            this.getRepuestosStock(this.branchOffice);
                            this.reset();
                        }
                    })

                } else {
                    axios.post(urlAPI + "productStock/" + this.selected[0]._id + "/update", auxRepuesto).then(res => {
                        if (res != null) {
                            this.productsStock = [];
                            this.getRepuestosStock(this.branchOffice);
                            this.reset();
                        }
                    })
                }
            }
        },

        eliminar() {
            axios.delete(urlAPI + "productStock/" + this.selected[0]._id + "/delete").then(res => {
                if (res != null) {
                    this.productsStock.splice(this.productsStock.indexOf(this.selected[0]), 1)
                    this.selected = [];
                    this.dialogDelete = false;
                    this.reset();
                }
            })

        },
        corroborarSeleccionado() {
            if (this.selected.length != 1) {
                this.mensaje = "No ha seleccionado ningún elemento!";
                this.snackbar = true;
                return;
            }
            this.dialogDelete = true;
        },
        editar() {
            if (this.selected.length != 1) {
                this.mensaje = "No ha seleccionado ningún elemento!";
                this.snackbar = true;
                return;
            }
            this.editedItem.BatchNum = this.selected[0].BatchNum;
            this.editedItem.Reserved = this.selected[0].Reserved;
            this.editedItem.Available = this.selected[0].Available;
            this.editedItem.OutOfService = this.selected[0].OutOfService;
            this.editedItem.Price = this.selected[0].Price;
            this.editedItem.BranchOffice = this.selected[0].BranchOffice;
            this.editedItem.Product = this.selected[0].Product._id;
            this.titulo = "Editar Repuesto";
            this.dialogNuevo = true;
        },

        validate() {
            return this.$refs.form.validate();
        },

        reset() {
            if (this.dialogNuevo) {
                this.$refs.form.resetValidation();
            }
            this.editedItem = Object.assign({}, this.defaultItem)
            this.dialogNuevo = false;
            this.nuevo = false;
        }
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

.izq {
    align: left;
    margin-left: -90%;
}
</style>

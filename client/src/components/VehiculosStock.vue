<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>
        <v-data-table v-model="selected" :single-select="true" show-select :headers="headers" :items="vehicleStock" :search="search" item-key="_id" sort-by="Brand" class="elevation-1">
            <template v-slot:item.Domain="{ item }">
                {{ formatDomain(item.Domain,'N/A')}}
            </template>
            <template v-slot:item.PurchasedPrice="{ item }">
                {{ formatPrice(item.PurchasedPrice) }}
            </template>
            <template v-slot:item.Detail="{ item }">
                {{ formatDomain(item.Detail,'-') }}
            </template>
            <template v-slot:item.Status="{ item }">
                {{ formatStatus(item.Status)}}
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details single-select></v-text-field>
                    <v-divider class="mx-4" dark vertical></v-divider>
                    <v-spacer></v-spacer>

                    <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" @click="editar">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn color="error" dark class="mb-2" v-bind="attrs" v-on="on" @click="corroborarSeleccionado">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>

                    <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on" @click="dialogNuevo=true; nuevo=true; titulo='Nuevo Repuesto'">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>

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

        <v-dialog v-model="dialogNuevo" max-width="600px">
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
                            <v-btn class="mb-2 info" @click="editedItem=defaultItem;dialogNuevo=false">
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
        colores: ["Amarillo", "Azul", "Blanco", "Celeste", "Gris", "Rojo", "Negro"],
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
        vehicleStock: [],
        search: '',
        requerido: [
            value => !!value || 'Requerido.',
        ],

        editedItem: {
            ChasisNum: "",
            EngineNum: "",
            Vehicle: "",
            Color: "",
            Dominio: null,
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
            Product: "",
            BranchOffice: ""
        },
        reglaNumero: [
            value => {
                const pattern = /^[0-9]{1,}$/
                return pattern.test(value) || 'Sólo se permiten números!'
            },
        ],
        headers: [{
                text: 'N° de Chasis:',
                value: 'ChasisNum',
                align: 'start',
            },
            {
                text: 'N° de Motor',
                value: 'EngineNum',
            },
            {
                text: 'Dominio',
                value: 'Domain',
            },
            {
                text: 'Color',
                value: 'Color',
            },
            {
                text: 'Precio',
                value: 'PurchasedPrice'
            },

            {
                text: 'Detalle',
                value: 'Detail',
            },
            {
                text: 'Detalle Usado',
                value: 'UsedDetail.Detail'
            },
            {
                text: 'Modificación Precio Usado',
                value: 'UsedDetail.PriceModifier'
            },
            {
                text: 'Marca',
                value: 'Vehicle.Brand',
            },
            {
                text: 'Modelo',
                value: 'Vehicle.Model',
            },
            {
                text: 'Año',
                value: 'Vehicle.year',
            },
            {
                text: 'Combustible',
                value: 'Vehicle.Fuel',
            },
            {
                text: 'Transmisión',
                value: 'Vehicle.transmission',
            }, ,
            {
                text: 'Tipo',
                value: 'Vehicle.Type',
            },
            {
                text: 'Origen',
                value: 'Vehicle.origin',
            },
            {
                text: 'NUEVO/USADO',
                value: 'Kind',
            },
            {
                text: 'Estado',
                value: 'Status',
            }

        ],
        repuestos: [],
        sucursales: [],
        editedIndex: -1,
        attrs: '',
        on: '',

    }),

    created() {
        this.getVehicleStock();
        this.getRepuestos();
        this.getSucursales();
    },

    methods: {
        save() {
            this.$refs.menu.save(this.editedItem.Expiration)
        },
        formatDomain(value, string) {
            if (value == null) {
                return string;
            }
            return String(value);
        },
       formatStatus(value) {
            if (value == "AVAILABLE") {
                return "Disponible";
            }
            if(value == "NOT AVAILABLE"){
                return "No Disponible";
            }
            if(value=="SOLD"){
                return "Vendido";
            }
            if(value=="RESERVED"){
                return "Reservado";
            }
            return String(value);
        },
        formatPrice(value) {
            return value == null ? "$0" : "$" + value;
        },
        /**/
        async getVehicleStock() {
            await axios.get(urlAPI + 'vehicleStock')
                .then(res => {
                    let vehicleStock = res.data.vehicle;
                    if (vehicleStock != null) {
                        vehicleStock.forEach(r => {
                            this.vehicleStock.push(r);
                        })
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
                            this.editedItem = this.defaultItem;
                            this.vehicleStock = [];
                            this.getVehicleStock();
                        }
                    })
                    this.nuevo = false;
                    this.dialogNuevo = false;

                } else {
                    axios.post(urlAPI + "productStock/" + this.selected[0]._id + "/update", auxRepuesto).then(res => {
                        if (res != null) {
                            this.vehicleStock = [];
                            this.editedItem = this.defaultItem;
                            this.getVehicleStock();
                        }
                    })
                    this.nuevo = false;
                }
                this.dialogNuevo = false;
            }
        },

        eliminar() {
            axios.delete(urlAPI + "productStock/" + this.selected[0]._id + "/delete").then(res => {
                if (res != null) {
                    this.vehicleStock.splice(this.vehicleStock.indexOf(this.selected[0]), 1)
                    this.selected = [];
                    this.dialogDelete = false;
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

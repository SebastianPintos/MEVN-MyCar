<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>
        <v-data-table v-model="selected" :single-select="true" show-select :headers="headers" :items="productsStock" :search="search" item-key="_id" sort-by="Brand" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-divider class="mx-4" dark vertical></v-divider>
                    <v-spacer></v-spacer>

                    <v-btn color="info" dark class="mb-2" v-bind="attrs" v-on="on">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn color="error" dark class="mb-2" v-bind="attrs" v-on="on">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>

                    <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    
                </v-toolbar>
            </template>
        </v-data-table>

        <v-dialog v-model="dialogMensaje" max-width="400px">
            <v-card>
                <v-card-text>
                    <br>
                    <h2>{{mensaje}}</h2>
                </v-card-text>
                <v-card-actions>
                    <v-flex class="text-right">
                        <v-btn class="info">
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
        dialogMensaje: false,
        mensaje: '',
        dialogStock: false,
        valid: true,
        dialogConfirm: false,
        selected: [],
        proveedores: [],
        proveedor: null,
        productsStock: [],
        fueraServicio: [],
        noLlegaron: [],
        max: [],
        repuestos: [],
        search: '',
        defectuosos: 0,
        noRecibidos: 0,
        reglaNumero: [
            value => {
                const pattern = /^[0-9]{1,}$/
                return pattern.test(value) || 'Sólo se permiten números!'
            },
        ],
        requerido: [
            value => !!value || 'Requerido.',
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
                text: 'Fuera de Servicio',
                value: 'OutOfService'
            },

            {
                text: 'Precio',
                value: 'Price',
            },
            {
                text: 'Vencimiento',
                value: 'Expiration',
            }
        ],

        editedIndex: -1,
        attrs: '',
        on: '',

        files: [],
        data: null,
        chosenFile: null,
    }),

    created() {
        this.getOrders();
    },

    methods: {

        async getOrders() {
            await axios.get(urlAPI + 'productStock')
                .then(res => {
                    let productsStock = res.data.productStock;
                    if (productsStock != null) {
                        productsStock.forEach(orden => {
                            if (orden.Status === "ACTIVE") {
                                this.productsStock.push(orden);
                            }
                        })
                    }
                })
        },

        formatPrice(value) {
            return value == null ? "$0" : "$" + value;
        },

        formatDate(value) {
            if (value == null) {
                return "Sin Definir";
            }
            value = String(value);
            value = value.slice(0, 10);
            return value;
        },

        validate() {
            return this.$refs.form.validate();
        },
        comprobarMax(event, r, array, otroArray) {
            let nuevoValor = Number(String(array[r]) + String(event.key));
            let total = nuevoValor + Number(otroArray[r]);
            if (nuevoValor > Number(this.max[r]) || total > Number(this.max[r])) {
                event.preventDefault();
                return false;
            }

            return true;
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

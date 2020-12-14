<template>
<div>
    <v-data-table v-model="selected" :single-select="singleSelect" :headers="headers" :items="vehiculos" :search="search" item-key="_idTabla" class="elevation-1">
        <template v-slot:item.SuggestedPrice="{ item }">
            {{ formatPrice(item.SuggestedPrice) }}
        </template>

        <template v-slot:[`item.actions`]="{ item }">

            <v-btn v-if="item.carrito == false" fab small color="success">
                <v-icon class="text-center" @click="agregarAlCarrito(item);aplicarDescuento=true">
                    mdi-cart-plus</v-icon>
            </v-btn>
            <v-btn v-else fab small color="error">
                <v-icon class="text-center" @click="eliminarDelCarrito(item)">
                    mdi-cart-remove</v-icon>
            </v-btn>

        </template>
    </v-data-table>
    <v-dialog v-model="aplicarDescuento" max-width="300px" persistent>
        <v-card>
            <v-card-title>Descuento</v-card-title>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-card-text>
                    <v-select v-model="colorElegido" :items="colores" label="Color" :rules="requerido"></v-select>
                    <v-text-field type="number" v-model="descuento" suffix="%" label="Descuento" :rules="requerido"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-flex class="text-right">
                        <v-btn class="info mb-2" @click="cancelarCarrito">
                            <v-icon>mdi-cancel</v-icon>
                        </v-btn>
                        <v-btn class="info mb-2" @click="confirmarElemento">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </v-flex>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</div>
</template>

<script>
import axios from "axios";
import urlAPI from "../config/config.js"

export default {
    data: () => ({
        selected: [],
        singleSelect: true,
        aplicarDescuento: false,
        vehiculos: [],
        vehiculosFiltrados: [],
        search: '',
        on: '',
        ultimoEnCarrito: null,
        colorElegido: '',
        colores: ['Amarillo', 'Azul', 'Blanco', 'Gris', 'Negro', 'Rojo', 'Verde'],
        descuento: 0,
        descontado: 0,
        attrs: '',
        valid: true,
        requerido: [
            value => {
                const pattern = /^[0-9]{1,}([,]{1}[0-9]{1,}){0,1}([.]{1}[0-9]{1,}){0,1}$/
                return pattern.test(value) || 'Requerido.'
            },
            value => parseFloat(value) < 100 || 'El máximo es 100%!'
        ],
        headers: [{
                text: 'Marca',
                value: 'Brand',
                align: 'start',
                sortable: false,
            },
            {
                text: 'Modelo',
                value: 'Model',
            },

            {
                text: 'Año',
                value: 'year',
            },

            {
                text: 'Tipo',
                value: 'Type',
            },

            {
                text: 'Combustible',
                value: 'Fuel',
            },

            {
                text: 'Transmision',
                value: 'transmission',
            },

            {
                text: 'Precio',
                value: 'SuggestedPrice',
            },
            {
                text: 'Acciones',
                value: 'actions',
                sortable: false
            },
        ],
    }),
    created() {
        this.iniciar();
    },
    methods: {
        iniciar() {
            this.getVehiculos();
        },

        async getVehiculos() {
            let vehiculos = [];
            let vehiculoAGuardar = {};
            let cont = 0;
            await axios.get(urlAPI + "vehicle")
                .then(res => {
                    vehiculos = res.data.vehicle.filter(v => v.Status === "ACTIVE");
                    if (vehiculos != null) {
                        for (let i = 0; i < vehiculos.length; i++) {
                            let item = JSON.parse(localStorage.getItem(String("vM" + i)));
                            let carrito = false;
                            let descuento = 0;
                            let descontado = 0;
                            let color = "";
                            if (item != null) {
                                carrito = item.carrito;
                            }
                            if (item != null && item.descuento != null) {
                                descuento = item.descuento;
                            }
                            if (item != null && item.Color != null) {
                                color = item.Color;
                            }
                            if (item != null && item.descontado != null) {
                                descontado = item.descontado;
                            }
                            vehiculoAGuardar = {
                                "_id": vehiculos[i]._id,
                                "Brand": vehiculos[i].Brand,
                                "Model": vehiculos[i].Model,
                                "Type": vehiculos[i].Type,
                                "year": vehiculos[i].year,
                                "Category": vehiculos[i].Category,
                                "Fuel": vehiculos[i].Fuel,
                                "transmission": vehiculos[i].transmission,
                                "Dealer": vehiculos[i].Dealer,
                                "SuggestedPrice": vehiculos[i].SuggestedPrice,
                                "carrito": carrito,
                                "descuento": descuento,
                                "descontado": descontado,
                                "Color": color
                            };
                            this.vehiculos.push(vehiculoAGuardar);
                            this.vehiculosFiltrados.push(vehiculoAGuardar);
                            localStorage.setItem(String("vM" + cont), JSON.stringify(vehiculoAGuardar));
                            cont++;
                        }
                    }
                })
            localStorage.setItem("lengthvM", cont);
        },
        agregarAlCarrito(item) {
            this.ultimoEnCarrito = item;
            let seleccionado = this.vehiculos.indexOf(item);
            if (seleccionado != -1) {
                this.vehiculos[seleccionado].carrito = true;
                let item = JSON.parse(localStorage.getItem(String("vM" + seleccionado)));
                if (item != null) {
                    item.carrito = true;
                    localStorage.setItem(String("vM" + seleccionado), JSON.stringify(item));
                }
            }
        },
        eliminarDelCarrito(item) {
            this.ultimoEnCarrito = false;
            let seleccionado = this.vehiculos.indexOf(item);
            if (seleccionado != -1) {
                this.vehiculos[seleccionado].carrito = false;
                let item = JSON.parse(localStorage.getItem("vM" + String(seleccionado)));
                if (item != null) {
                    item.carrito = false;
                    this.descuento = 0;
                    item.descuento = 0;
                    localStorage.setItem(String("vM" + seleccionado), JSON.stringify(item));
                }
            }
        },
        confirmarElemento() {
            if (this.$refs.form.validate()) {
                let index = this.vehiculos.indexOf(this.ultimoEnCarrito);
                if (index != -1) {

                    let item = JSON.parse(localStorage.getItem("vM" + String(index)));
                    if (item != null) {
                        item.descuento = this.descuento;
                        item.Color = this.colorElegido;
                        let valorDescuento = (item.SuggestedPrice * this.descuento) / 100;
                        item.descontado = item.SuggestedPrice - valorDescuento;
                        localStorage.setItem(String("vM" + String(index)), JSON.stringify(item));
                    }
                }
                this.descuento = 0;
                this.descontado = 0;
                this.aplicarDescuento = false;
            }
        },
        cancelarCarrito() {
            this.eliminarDelCarrito(this.ultimoEnCarrito);
            this.aplicarDescuento = false
        },

        formatPrice(value) {
            return value == null ? "$0" : "$" + value;
        },
    }
}
</script>

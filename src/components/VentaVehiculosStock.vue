<template>
<div>
    <v-data-table v-model="selected" :single-select="singleSelect" :headers="headers" :items="vehiculos" :search="search" item-key="_idTabla" class="elevation-1">
        <template v-slot:item.PurchasedPrice="{ item }">
            {{ formatPrice(item.PurchasedPrice) }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <div v-if="caja=='ABIERTA'">
            <v-btn v-if="item.carrito == false" fab small color="success" @click="agregarAlCarrito(item);aplicarDescuento=true">
                <v-icon class="text-center" >
                    mdi-cart-plus</v-icon>
            </v-btn>
            <v-btn v-else fab small color="error" @click="eliminarDelCarrito(item)">
                <v-icon class="text-center" >
                    mdi-cart-remove</v-icon>
            </v-btn>
            </div>
        </template>
    </v-data-table>
    <v-dialog v-model="aplicarDescuento" max-width="300px" persistent>
        <v-card>
            <v-card-title>Descuento</v-card-title>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-card-text>
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
        descuento: 0,
        descontado: 0,
        attrs: '',
        employee: null,
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
                value: 'Vehicle.Brand',
                align: 'start',
                sortable: false,
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
                text: 'Color',
                value: 'Color',
            },

            {
                text: 'Precio',
                value: 'PurchasedPrice',
                align: 'right'
            },
            {
                text: 'Acciones',
                value: 'actions',
                sortable: false
            },
        ],
        caja: 'CERRADA',
    }),
    created() {
        let employee = localStorage.getItem("employee");
        if (employee != null) {
            this.employee = JSON.parse(employee);
            this.iniciar();
        }
    },
    methods: {
      getCaja() {
            axios.get(urlAPI + 'branchOffice').then(res => {
                if (res != null) {
                    let branchOffice = res.data.branchOffice;
                    branchOffice = branchOffice.find(b => b._id == this.employee.BranchOffice);
                    if (branchOffice != null) {
                        if(branchOffice.Caja==null){
                            this.caja="CERRADA";
                        }
                        else{
                            if(branchOffice.Caja.Estado==null){
                                this.caja="CERRADA";
                            }
                            else{
                                  this.caja = branchOffice.Caja.Estado;
                            }
                        }
                  }
                }
            })
        },
        iniciar() {
            this.getVehiculos();
            this.getCaja();
        },

        async getVehiculos() {
            let vehiculos = [];
            let vehiculoAGuardar = {};
            let cont = 0;
            await axios.get(urlAPI + "vehicleStock")
                .then(res => {
                    vehiculos = res.data.vehicle.filter(v => v.Status === "AVAILABLE");
                   if (this.employee != null & this.employee.BranchOffice != null) {
                        vehiculos = vehiculos.filter(v => v.BranchOffice == this.employee.BranchOffice);
                    }
                    if (vehiculos != null) {
                        for (let i = 0; i < vehiculos.length; i++) {
                            let item = JSON.parse(localStorage.getItem(String("v" + i)));
                            let carrito = false;
                            let descuento = 0;
                            let descontado = 0;
                            if (item != null) {
                                carrito = item.carrito;
                            }
                            if (item != null && item.descuento != null) {
                                descuento = item.descuento;
                            }
                            if (item != null && item.descontado != null) {
                                descontado = item.descontado;
                            }
                            vehiculoAGuardar = {
                                "_id": vehiculos[i]._id,
                                "ChasisNum": vehiculos[i].ChasisNum,
                                "vehicleStock": vehiculos[i].EngineNum,
                                "Domain": vehiculos[i].Domain,
                                "Color": vehiculos[i].Color,
                                "PurchasedPrice": vehiculos[i].PurchasedPrice,
                                "Detail": vehiculos[i].Detail,
                                "Vehicle": vehiculos[i].Vehicle,
                                "UsedDetail": vehiculos[i].UsedDetail,
                                "Status": vehiculos[i].Status,
                                "BranchOffice": vehiculos[i].BranchOffice,
                                "carrito": carrito,
                                "descuento": descuento,
                                "descontado": descontado,
                                "Kind": vehiculos[i].Kind
                            };
                            this.vehiculos.push(vehiculoAGuardar);
                            this.vehiculosFiltrados.push(vehiculoAGuardar);
                            localStorage.setItem(String("v" + cont), JSON.stringify(vehiculoAGuardar));
                            cont++;
                        }
                    }
                })
            localStorage.setItem("lengthv", cont);
        },
        agregarAlCarrito(item) {
            this.ultimoEnCarrito = item;
            let seleccionado = this.vehiculos.indexOf(item);
            if (seleccionado != -1) {
                this.vehiculos[seleccionado].carrito = true;
                let item = JSON.parse(localStorage.getItem(String("v" + seleccionado)));
                if (item != null) {
                    item.carrito = true;
                    localStorage.setItem(String("v" + seleccionado), JSON.stringify(item));
                }
            }
        },
        eliminarDelCarrito(item) {
            this.ultimoEnCarrito = false;
            let seleccionado = this.vehiculos.indexOf(item);
            if (seleccionado != -1) {
                this.vehiculos[seleccionado].carrito = false;
                let item = JSON.parse(localStorage.getItem("v" + String(seleccionado)));
                if (item != null) {
                    item.carrito = false;
                    this.descuento = 0;
                    item.descuento = 0;
                    localStorage.setItem(String("v" + seleccionado), JSON.stringify(item));
                }
            }
        },
        confirmarElemento() {
            if (this.$refs.form.validate()) {
                let index = this.vehiculos.indexOf(this.ultimoEnCarrito);
                if (index != -1) {

                    let item = JSON.parse(localStorage.getItem("v" + String(index)));
                    if (item != null) {
                        item.descuento = this.descuento;
                        let valorDescuento = (item.PurchasedPrice * this.descuento) / 100;
                        item.descontado = item.PurchasedPrice - valorDescuento;
                        localStorage.setItem(String("v" + String(index)), JSON.stringify(item));
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

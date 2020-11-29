<!--template v-slot:[`item.actions`]="{ item }">

            <v-btn v-if="item.carrito == false" fab small color="success">
                <v-icon class="text-center" @click="agregarAlCarrito(item)">
                    mdi-cart-plus</v-icon>
            </v-btn>
            <v-btn v-if="item.carrito" fab small color="error">
                <v-icon class="text-center" @click="eliminarDelCarrito(item)">
                    mdi-cart-remove</v-icon>
            </v-btn>

        </template-->
<template>
<v-data-table v-model="selected" :single-select="singleSelect" :headers="headers" :items="vehiculos" :search="search" item-key="_idTabla" class="elevation-1">
    <template v-slot:[`item.actions`]="{ item }">

        <v-btn v-if="item.carrito == false" fab small color="success">
            <v-icon class="text-center" @click="agregarAlCarrito(item)">
                mdi-cart-plus</v-icon>
        </v-btn>
        <v-btn v-else fab small color="error">
            <v-icon class="text-center" @click="eliminarDelCarrito(item)">
                mdi-cart-remove</v-icon>
        </v-btn>

    </template>
</v-data-table>
</template>

<script>
import axios from "axios";
import urlAPI from "../config/config.js"

export default {
    data: () => ({
        selected: [],
        singleSelect: true,
        vehiculos: [],
        vehiculosFiltrados: [],
        search: '',
        on: '',
        attrs: '',
        /*
          "ChasisNum": "10021",
    "EngineNum": "1421",
    "Domain": "MB400MLK",
    "Color": "Black", 
    "PurchasedPrice": 60000000,
    "Vehicle":
        */
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
        //this.getVehiculos();
    },
    methods: {
        /*getVehiculos() {
            axios.get(urlAPI + 'vehiclestock').then(res => {
                console.log(res);
                console.log(JSON.stringify(res));
                this.vehiculos = res.data.vehicle.filter(v => v.Status == "AVAILABLE");
            })
        },*/

        iniciar() {
            this.getVehiculos();
            //this.obtenerDeLocalStorage();
        },

        async getVehiculos() {
            let vehiculos = [];
            let vehiculoAGuardar = {};
            let cont = 0;
            await axios.get(urlAPI + "vehiclestock")
                .then(res => {
                    vehiculos = res.data.vehicle.filter(v => v.Status === "AVAILABLE");
                    if (vehiculos != null) {
                        for (let i = 0; i < vehiculos.length; i++) {
                            let item = JSON.parse(localStorage.getItem(String("v" + i)));
                            let carrito = false;
                            if (item != null) {
                                carrito = item.carrito;
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
                            };
                            this.vehiculos.push(vehiculoAGuardar);
                            this.vehiculosFiltrados.push(vehiculoAGuardar);
                            localStorage.setItem(String("v"+cont), JSON.stringify(vehiculoAGuardar));
                            cont++;
                        }
                    }
                })
            localStorage.setItem("lengthv", cont);
        },
        agregarAlCarrito(item) {
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
            let seleccionado = this.vehiculos.indexOf(item);
            if (seleccionado != -1) {
                this.vehiculos[seleccionado].carrito = false;
                let item = JSON.parse(localStorage.getItem("v" + String(seleccionado)));
                if (item != null) {
                    item.carrito = false;
                    localStorage.setItem(String("v" + seleccionado), JSON.stringify(item));
                }
            }
        },

        /*obtenerDeLocalStorage() {
            let length = parseInt(JSON.parse(localStorage.getItem("lengthv")));
            length++;
            for (let i = 0; i < length; i++) {
                let vehiculo = JSON.parse(localStorage.getItem(String("v"+i)));
                if (vehiculo != null) {
                    this.vehiculos.push(vehiculo);
                }
            }
            this.vehiculosFiltrados = this.vehiculos;
        },*/
    }
}
</script>

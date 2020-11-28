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
            <v-btn v-if="item.carrito" fab small color="error">
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
        search: '',
        on: '',
        attrs: '',
          headers: [{
                text: 'Marca',
                value: 'Brand',
                align: 'start',
                sortable: false,
            },
            {
                text: 'Precio',
                value: 'Price',
            },
          ],
    }),
    created(){
        this.getVehiculos();
    },
    methods:{
        getVehiculos(){
            axios.get(urlAPI+'vehiclestock').then(res=>{
                this.vehiculos = res.data.vehicle.filter(v=>{v.Status=="ACTIVE"});
            })
        }
    }
}
</script>
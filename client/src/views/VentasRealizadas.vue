<template>
<div>
    <v-data-table v-model="selected" :single-select="singleSelect" :headers="headers" :items="ventas" :search="search" item-key="_idTabla" class="elevation-1">
           <template v-slot:item.Factura.PrecioNeto="{ item }">
            {{ formatPrice(item.Factura.PrecioNeto) }}
        </template>   
          <template v-slot:item.Date="{ item }">
            {{ formatDate(item.Date) }}
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
        singleSelect: true,
        ventas: [],
        ventasFiltrados: [],
        search: '',
        on: '',
        valid: true,
        attrs: '',
        /* 
        RewarderDiscount: [{Detail,Service:[]}],
        Client,
        Date,
        Factura,
        Employee,
        Service: [],
        ProductStock: [],
        VehicleSold: [{VehicleStock,PurchaseOrderV}],
        PaymentType: [ {Price,Type: ['CASH', 'CREDICARD', 'WIRETRANSFER'],CurrencyType,
        ExchangeRate: {type: Number},Credicard{},WireTransfer: {} ],
        WorkOrder: {type: Schema.Types.ObjectId, ref: 'WorkOrder'}
        },{timestamps: true}*/
        headers: [{
                text: 'Fecha',
                value: 'Date',
                align: 'start',
                sortable: false,
            },
            {
                text: 'ID del Cliente',
                value: 'Client.DNI',
            },
            {
                text: 'Factura Emitida',
                value: 'Factura.Kind',
            },

            {
                text: 'Total Neto',
                value: 'Factura.PrecioNeto',
            },
         
        ],
        requerido: [
            value => {
                const pattern = /^[0-9]{1,}$/
                return pattern.test(value) || 'Requerido.'
            },
            value => parseFloat(value) < 100 || 'El máximo es 100%!'
        ],
    }),
    created() {
        this.iniciar();
    },
    methods: {
        iniciar() {
            this.getventas();
        },

        async getventas() {
            let ventas = [];
            let repuestoAGuardar = {};
            let cont = 0;
            await axios.get(urlAPI + "sellVehicle")
                .then(res => {
                    this.ventas = res.data.sell;});
        },
         formatPrice(value) {
            return value == null ? "$0" : "$" + value;
        },
        formatDate(value) {
            if (value == null) {
                return "N/A";
            }
            value = String(value);
            value = value.slice(0, 10);
            return value;
        },
    },

}
</script>

<style>
.slide {
    touch-action: none;
}
</style>

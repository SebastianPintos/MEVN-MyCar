<template>
<div>
    <v-data-table v-model="selected" show-select :single-select="singleSelect" :headers="headers" :items="ventas" :search="search" item-key="_id" class="elevation-1">
              <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-divider class="mx-4" dark vertical></v-divider>
                    <v-spacer></v-spacer>
                      <v-btn right color="grey" dark class="mb-2" v-bind="attrs" v-on="on" @click="mostrarDialogFactura">
                        <v-icon>
                            mdi-information-outline
                        </v-icon>
                    </v-btn>
                </v-flex>
            </v-toolbar>
        </template>

          <template v-slot:item.Date="{ item }">
            {{ formatDate(item.Date) }}
        </template>     
         <template v-slot:item.Factura.PrecioNeto="{ item }">
            {{ formatPrice(item.Factura.PrecioNeto) }}
        </template>     
    </v-data-table>

     <v-dialog v-model="mostrarFactura">
        <v-card>

            <v-card-title>
                <v-flex class="text-center">
                    <h1>Factura: {{Factura.Kind}}</h1>
                </v-flex>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <ol>
                        <li v-for="(elemento,index) in Factura.Elements" :key="index">
                          <v-text-field readonly :value="'Elemento :'+elemento.Name"></v-text-field>
                          <v-text-field readonly :value="'Precio: $'+elemento.PrecioNeto"></v-text-field>
                         <div v-if="elemento.Descuento>0">
                               <v-text-field readonly :value="'Descuento: '+elemento.Descuento+'%'"></v-text-field>
                                <v-text-field readonly :value="'Precio con Descuento: $'+elemento.PrecioConDescuento"></v-text-field>
                            </div>
                            <div v-if="Factura.Kind=='A'">
                                <v-text-field readonly :value="'Impuestos: '+elemento.PrecioConDescuento"></v-text-field>
                            </div>
                        </li>
                    </ol>
                    <div v-if="Factura.Kind!='A'">
                        <v-text-field readonly :value="'Total: $'+Factura.TotalNeto"></v-text-field>
                    </div>
                    <div v-else>
                        <v-text-field readonly :value="'Total Neto: $'+Factura.TotalNeto"></v-text-field>
                        <v-text-field readonly :value="'Total+IVA: $'+Factura.TotalImpuesto"></v-text-field>
                    </div>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-flex class="text-right">
                    <v-btn class="info mb-2" @click="mostrarFactura=false;selected=[]">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                </v-flex>
            </v-card-actions>
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
        ventas: [],
        ventasFiltrados: [],
        search: '',
        on: '',
        valid: true,
        attrs: '',
        mostrarFactura: false,
        
        Factura: {
                Kind: "",
                Elements: [],
                BranchOffice: "",
                TotalNeto: 0,
                TotalImpuesto: 0,
            },
        
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
                align: 'right'
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
                    this.ventas = res.data.sell;
                    });
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
        mostrarDialogFactura(){
            if(this.selected.length>0){
              this.Factura.Kind = this.selected[0].Factura.Kind;
              this.Factura.Elements = this.selected[0].Factura.Elements;
              this.Factura.BranchOffice = this.selected[0].Factura.BranchOffice;
              this.Factura.TotalNeto = this.selected[0].Factura.PrecioNeto;
              this.Factura.TotalImpuesto = this.selected[0].Factura.Impuesto;
               
              this.mostrarFactura = true;
            }
        }
    },

}
</script>

<style>
.slide {
    touch-action: none;
}
</style>

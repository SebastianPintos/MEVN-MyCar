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

        <template v-slot:item.Factura.PrecioNeto="{ item }">
            {{ formatPrice(item.Factura.PrecioNeto) }}
        </template>   
          <template v-slot:item.Date="{ item }">
            {{ formatDate(item.Date) }}
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
                            <v-row>
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field disabled label="Elemento :"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field disabled :value="elemento.Name"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <strong>
                                        <v-text-field disabled label="Precio:"></v-text-field>
                                    </strong>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field disabled :value="elemento.PrecioNeto" prefix="$"></v-text-field>
                                </v-col>
                            </v-row>
                            <div v-if="elemento.Descuento>0">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <strong>
                                            <v-text-field disabled label="Descuento:"></v-text-field>
                                        </strong>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field disabled :value="elemento.Descuento" suffix="%"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <strong>
                                            <v-text-field disabled label="Precio con Descuento:"></v-text-field>
                                        </strong>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field disabled :value="elemento.PrecioConDescuento" prefix="$"></v-text-field>
                                    </v-col>
                                </v-row>
                            </div>
                            <div v-if="Factura.Kind=='A'">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <strong>
                                            <v-text-field disabled label="Impuestos:"></v-text-field>
                                        </strong>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field disabled :value="elemento.PrecioConDescuento" prefix="$"></v-text-field>
                                    </v-col>
                                </v-row>
                            </div>
                        </li>
                    </ol>
                    <div v-if="Factura.Kind!='A'">
                        <v-row>
                            <v-col cols="12" md="6">
                                <strong>
                                    <v-text-field disabled label="Total:"></v-text-field>
                                </strong>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field disabled prefix="$" :value="Factura.TotalNeto"></v-text-field>
                            </v-col>
                        </v-row>
                    </div>
                    <div v-else>
                        <v-row>
                            <v-col cols="12" md="6">
                                <strong>
                                    <v-text-field disabled label="Total Neto:"></v-text-field>
                                </strong>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field disabled prefix="$" :value="Factura.TotalNeto"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="6">
                                <strong>
                                    <v-text-field disabled label="Total+IVA:"></v-text-field>
                                </strong>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field disabled prefix="$" :value="Factura.TotalImpuesto"></v-text-field>
                            </v-col>
                        </v-row>
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

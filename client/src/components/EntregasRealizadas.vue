<template>
<div>
    <v-data-table  :headers="headers" :items="entregas" :search="search" class="elevation-1">
        <template v-slot:top>
            <v-toolbar flat>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details></v-text-field>
                <v-divider class="mx-4" dark vertical></v-divider>
                <v-spacer></v-spacer>
            </v-toolbar>
        </template>

    </v-data-table>
    <v-dialog v-model="dialogMensaje" persistent max-width="400px">
        <v-card>
            <v-card-title>
                <v-flex class="text-center">
                    <h2>{{tituloMensaje}}</h2>
                </v-flex>
            </v-card-title>
            <v-card-text>
                <h3>{{mensaje}}</h3>
            </v-card-text>
            <v-card-actions>
                <v-flex class="text-right">
                    <v-btn class="info mb-2" @click="dialogMensaje=false;mensaje='';tituloMensaje=''">
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
        entregas: [],
        entregasFiltrados: [],
        search: '',
        on: '',
        valid: true,
        dialogMensaje: false,
        tituloMensaje: '',
        mensaje: '',
        attrs: '',
        mostrarLDocumentos: false,
        headers: [{
                text: 'Fecha',
                value: 'Date',
                align: 'start',
                sortable: false,
            },
            {
                text: 'ID empleado',
                value: 'Employee.DNI'
            },
            {
                text: 'ID del Cliente',
                value: 'Client.DNI',
            },
            {
                text: 'Marca',
                value: 'Marca',
            },
            {
                text: 'Modelo',
                value: 'Model',
            },
            {
                text: 'Año',
                value: 'Año',
            },
            {
                text: 'Transmisión',
                value: 'Transmission',
            },
            {
                text: 'Tipo',
                value: 'Type',
            },
            {
                text: 'Nuevo/Usado',
                value: 'Kind',
            },
            {
                text: 'Categoría',
                value: 'Category',
            },
            {
                text: 'Color',
                value: 'Color',
            },
        ],

        vehiculos: [],
        ordenesCompra: [],
        delivery: [],
        documentation: [],
        requerido: [
            value => {
                const pattern = /^[0-9]{1,}$/
                return pattern.test(value) || 'Requerido.'
            },
            value => parseFloat(value) < 100 || 'El máximo es 100%!'
        ],
        employee: null,
        editedItem: {
            Documentation: [],
        }

    }),
    created() {
        let employee = localStorage.getItem("employee");
        this.employee = JSON.parse(employee);
        this.iniciar();
    },
    methods: {
        iniciar() {
            this.getDelivery();
            this.getVehiculos();
            this.getOrdenes();
        },

        async getentregas() {
            this.entregas = [];
            let entregas = [];
            let repuestoAGuardar = {};
            let cont = 0;
            await axios.get(urlAPI + "sellVehicle")
                .then(res => {
                    let entregas = res.data.sell;
                    entregas.forEach(v => {
                        if (v.VehicleSold != null) {
                            v.VehicleSold.forEach(delivery => {
                                delivery = this.delivery.find(d => d._id == delivery);
                                if (delivery != null && this.employee!=null) {
                                    if (delivery != null && delivery.Documentation!=null){
                                    if (delivery.VehicleStock != null && delivery.VehicleStock.BranchOffice == this.employee.BranchOffice) {
                                            let vehiculo = this.vehiculos.find(v => v._id == delivery.VehicleStock.Vehicle);

                                            if (vehiculo != null) {
                                                this.agregarEntrega(v, vehiculo, delivery.VehicleStock.Color,delivery);
                                            }
                                        }
                                        else if (delivery.PurchaseOrderV != null && delivery.PurchaseOrderV.BranchOffice == this.employee.BranchOffice) {
                                            let vehiculo = this.vehiculos.find(v => v._id == delivery.PurchaseOrderV.Vehicle[0].VehicleID);
                                            if (vehiculo != null) {
                                                this.agregarEntrega(v, vehiculo, delivery.PurchaseOrderV.Vehicle[0].Color,delivery);
                                            }
                                        }
                                    }
                                }
                            })
                        
                    }})
                    
                });
        },

        async getVehiculos() {
            await axios.get(urlAPI + 'vehicle').then(res => {
                if (res != null) {
                    this.vehiculos = res.data.vehicle.filter(o => o.Status == "ACTIVE");
                }
            })
        },

        async getOrdenes() {
            await axios.get(urlAPI + 'purchaseOrderV').then(res => {
                if (res != null) {
                    this.ordenes = res.data.purchaseOrderV.filter(o => o.Status == "ACTIVE");
                }
            })
        },

        async getDelivery() {
            await axios.get(urlAPI + 'deliveryVehicle').then(res => {
                if (res != null) {
                    this.delivery = res.data.deliveryVehicle.filter(o => o.Status == "ACTIVE");
                    this.getentregas();
                }
            })
        },
        async getDocumentos() {
            await axios.get(urlAPI + 'documentation').then(res => {
                if (res != null) {
                    this.documentation = res.data.documentation.filter(o => o.Status == "ACTIVE");
                }
            })
        },

        agregarEntrega(venta, vehiculo, color, delivery) {
            let date = new Date(delivery.Date);

            date = date != null ? date.getDate() + "-" + date.getMonth() + "-" + parseInt(date.getYear() + 1900) : null
                this.entregas.push({
                    "Marca": vehiculo.Brand,
                    "Model": vehiculo.Model,
                    "Año": vehiculo.year,
                    "Transmission": vehiculo.transmission,
                    "Category":vehiculo.Category,
                    "Color":color,
                    "Type": vehiculo.Type,
                    "Kind": vehiculo.Kind,
                    "Client": venta.Client,
                    "Date": date,
                    "Employee": {"DNI": delivery.Employee==null? "":delivery.Employee.DNI}
                   })
            
        },

    },

}
</script>

<style>
.slide {
    touch-action: none;
}
</style>

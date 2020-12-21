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
                text: 'ID del Empleado',
                value: 'Employee.DNI',
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
        empleados: [],
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
            Documentation: []
        },
        vehiculosStock:[],

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
            this.getVehiculosStock();
            this.getOrdenes();
            this.getEmpleados();
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
                                if (delivery != null && this.employee!=null) {  
                                    if (delivery.VehicleStock != null) {
                                            let vehiculo = this.vehiculosStock.find(v => v._id == delivery.VehicleStock);
                                            if (vehiculo != null) {
                                                this.agregarEntrega(v, vehiculo.Vehicle, vehiculo.Color,delivery);
                                            }
                                        }
                                        else if (delivery.PurchaseOrderV != null  && delivery.PurchaseOrderV.ArrivalDate!=null) {
                                            let vehiculo = this.vehiculos.find(v => v._id == delivery.PurchaseOrderV.Vehicle[0].VehicleID);
                                            if (vehiculo != null) {
                                                this.agregarEntrega(v, vehiculo, delivery.PurchaseOrderV.Vehicle[0].Color,delivery);
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
                    this.vehiculos = res.data.vehicle;
                }
            })
        },

        async getVehiculosStock() {
            await axios.get(urlAPI + 'vehicleStock').then(res => {
                if (res != null) {
                    this.vehiculosStock = res.data.vehicle;
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
             async getEmpleados() {
            await axios.get(urlAPI + 'employee').then(res => {
                if (res != null) {
                    this.empleados = res.data.employee;
                   
                }
            })
        },
        getStringDate(date){
             let dateAux = new Date(date);
            return dateAux!=null? dateAux.getDate()+"-"+(dateAux.getMonth()+1)+"-"+(dateAux.getYear()+1900): new Date().getDate()+"-"+(new Date().getMonth()+1)+"-"+(new Date().getYear()+1900);
        },

        agregarEntrega(venta, vehiculo, color, delivery) {
           let date = this.getStringDate(delivery.Date);
             let empleado = this.empleados.find(e=>e._id==delivery.Employee);
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
                     "Employee": {"DNI": empleado==null? "":empleado.DNI},
                    "Date": date,
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

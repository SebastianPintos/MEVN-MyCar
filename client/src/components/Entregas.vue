<template>
<div>
    <v-data-table v-model="selected" show-select :single-select="singleSelect" :headers="headers" :items="entregas" item-key="_id" :search="search" class="elevation-1">
        <template v-slot:top>
            <v-toolbar flat>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details></v-text-field>
                <v-divider class="mx-4" dark vertical></v-divider>
                <v-spacer></v-spacer>
                <v-btn right color="success" dark class="mb-2" v-bind="attrs" v-on="on" @click="mostrarDocumentos">
                    <v-icon>
                        mdi-check
                    </v-icon>
                </v-btn>
            </v-toolbar>
        </template>

        <template v-slot:item.Factura.PrecioNeto="{ item }">
            {{ formatPrice(item.Factura.PrecioNeto) }}
        </template>
        <template v-slot:item.Date="{ item }">
            {{ formatDate(item.Date) }}
        </template>
    </v-data-table>

    <v-dialog v-model="mostrarLDocumentos" persistent>
        <v-card v-if="editedItem.Documentation.DocumentationID!=''">
            <v-card-title>
                <v-flex class="text-center">
                    <h1>DOCUMENTOS OBLIGATORIOS</h1>
                </v-flex>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <ul>
                        <li v-for="(elemento,index) in editedItem.Documentation" :key="index">
                            <v-row>
                                <v-radio-group mandatory class="text-align: left" v-model="elemento.Completed" row>
                                    <h3 style="margin-left:4px;">{{elemento.DocumentationID.Name}}</h3>
                                    <v-radio class="mb-1" label="Sí" :value="true"></v-radio>
                                    <v-radio class="mb-1" label="No" :value="false"></v-radio>
                                </v-radio-group>
                            </v-row>
                        </li>
                    </ul>

                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-flex class="text-right">
                    <v-btn class="info mb-2" @click="selected=[];editedItem.Documentation=[];mostrarLDocumentos=false">
                        <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-btn class="info mb-2" @click="guardar">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                </v-flex>
            </v-card-actions>
        </v-card>
    </v-dialog>

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
        selected: [],
        singleSelect: true,
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
                text: 'Fecha de Encargue',
                value: 'Date',
                align: 'start',
                sortable: false,
            },
            {
                text: 'Fecha Estimada Entrega',
                value: 'DateEntrega',
                align: 'start',
                sortable: false,
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
                                    if (delivery != null && delivery.Status == "ACTIVE") {
                                        let documentos = this.getDocumentosObligatorios(delivery.Documentation);
                                        let estimado = this.calcularEstimado(documentos, v.Date);
                                        if (delivery.VehicleStock != null && delivery.VehicleStock.BranchOffice == this.employee.BranchOffice) {
                                            let vehiculo = this.vehiculos.find(v => v._id == delivery.VehicleStock.Vehicle);

                                            if (vehiculo != null) {
                                                this.agregarEntrega(v, vehiculo, documentos, delivery.VehicleStock.Color, estimado, delivery.VehicleStock._id, null, delivery);
                                            }
                                        }
                                        else if (delivery.PurchaseOrderV != null && delivery.PurchaseOrderV.BranchOffice == this.employee.BranchOffice) {
                                            let vehiculo = this.vehiculos.find(v => v._id == delivery.PurchaseOrderV.Vehicle[0].VehicleID);
                                            if (vehiculo != null) {
                                                this.agregarEntrega(v, vehiculo, documentos, delivery.PurchaseOrderV.Vehicle[0].Color, estimado, null, delivery.PurchaseOrderV._id, delivery);
                                            }
                                        }
                                    }
                                }
                            })
                        }
                    })
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

        agregarEntrega(venta, vehiculo, documentos, color, estimated, idStock, idOrden, delivery) {
            estimated = estimated.getDate() == null ? "N/A" : estimated.getDate() + "-" + estimated.getMonth() + "-" + parseInt(estimated.getYear() + 1900);
            let date = new Date(venta.Date);
            date = date != null ? date.getDate() + "-" + date.getMonth() + "-" + parseInt(date.getYear() + 1900) : null
            if (documentos.length > 0) {
                this.entregas.push({
                    "_id": venta._id + documentos[0]._id,
                    "id": delivery._id,
                    "Marca": vehiculo.Brand,
                    "Model": vehiculo.Model,
                    "Año": vehiculo.year,
                    "Transmission": vehiculo.transmission,
                    "Category":vehiculo.Category,
                    "Type": vehiculo.Type,
                    "Kind": vehiculo.Kind,
                    "Client": venta.Client,
                    "Date": date,
                    "DateEntrega": estimated,
                    "Color": color,
                    "Documentos": documentos,
                    "PurchaseOrderV": idOrden,
                    "VehicleStock": idStock
                })
            }
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
        mostrarDocumentos() {
            if (this.selected.length > 0) {
                this.editedItem.Documentation = this.selected[0].Documentos;
                this.mostrarLDocumentos = this.editedItem.Documentation != "" ? true : this.mostrarLDocumentos;
            } else {
                this.mensaje = "No ha seleccionado ningún elemento!";
                this.dialogMensaje = true;
            }
        },
        getDocumentosObligatorios(documentos) {
            let ret = [];
            documentos.forEach(d => {
                if (d.DocumentationID != null) {
                    ret.push(d);
                }
            })
            return ret;
        },

        calcularEstimado(documentos, date) {
            date = new Date(date);
            let max = 0;
            for (let i = 0; i < documentos.length; i++) {
                if (documentos[i].DocumentationID.EstimatedTime > max) {
                    max = documentos[i].DocumentationID.EstimatedTime;
                }
            }
            return new Date(date.setDate(date.getDate() + max));
        },

        guardar() {
            let completo = false;
            let cont = 0;
            for (let i = 0; i < this.editedItem.Documentation.length; i++) {
                if (this.editedItem.Documentation[i].Completed) {
                    cont++;
                }
            }
            if (cont == this.editedItem.Documentation.length) {
                completo = true;
            }
            let documentation = [];
            for (let i = 0; i < this.editedItem.Documentation.length; i++) {
                documentation.push({
                    "DocumentationID": this.editedItem.Documentation[i].DocumentationID._id,
                    "Completed": this.editedItem.Documentation[i].Completed
                })
            }
            axios.post(urlAPI + "deliveryVehicle/" + this.selected[0].id + "/update", {
                "deliveryVehicle": {
                    "Documentation": documentation,
                    "Status": completo ? "INACTIVE" : "ACTIVE",
                    "Date": new Date(),
                    "Employee": this.employee._id
                }
            }).then(res => {
                if (res != null) {
                    if (completo) {
                        this.entregas.splice(this.entregas.indexOf(this.selected[0]), 1);
                        this.tituloMensaje = "Operación Exitosa";
                        this.mensaje = "Vehículo Entregado";            
                    } else {
                        this.selected = [];
                        this.getentregas();
                        this.tituloMensaje = "Actualización Exitosa";
                        this.mensaje = "Documentos Actualizados";
                    }
                    this.selected=[];
                    this.dialogMensaje = true;      
                    this.mostrarLDocumentos = false;
                }
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

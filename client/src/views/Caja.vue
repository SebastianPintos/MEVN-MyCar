<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>
        <h1 class="text-center" style="background-color:DimGray;color:white">INGRESOS/EGRESOS {{fecha}}</h1>
        <h4 class="text-center" style="background-color:DimGray;color:white">ESTADO: {{caja}}</h4>
        <v-data-table v-model="selected" :headers="headers" :items="movimientos" :search="search" item-key="_id" sort-by="Brand" class="elevation-1">

            <template v-slot:item.Date="{ item }">
                {{ formatDate(item.Date) }}
            </template>
            <template v-slot:item.Monto="{ item }">
                {{ formatPrice(item.Monto) }}
            </template>
            <template v-slot:item.Description="{ item }">
                {{ formatString(item.Description) }}
            </template>

            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details single-select></v-text-field>
                    <v-divider class="mx-4" dark vertical></v-divider>
                    <v-spacer></v-spacer>

                    <div v-if="validateUsers('Administrativo')">
                        <v-btn v-if="caja=='CERRADA'" color="success" dark class="mb-2" v-bind="attrs" v-on="on" @click="mostrarDialog">
                            <v-icon>mdi-cash-lock-open</v-icon>
                        </v-btn>

                        <v-btn v-if="caja=='ABIERTA'" color="error" dark class="mb-2" v-bind="attrs" v-on="on" @click="mostrarDialog">
                            <v-icon>mdi-cash-lock</v-icon>
                        </v-btn>

                    </div>

                </v-toolbar>
            </template>
        </v-data-table>

        <v-snackbar v-model="snackbar">
            {{ mensaje }}

            <template v-slot:action="{ attrs }">
                <v-btn class="info" text v-bind="attrs" @click="snackbar = false">
                    <v-icon>mdi-check</v-icon>
                </v-btn>
            </template>
        </v-snackbar>

        <v-dialog v-model="dialogMensaje" max-width="400px" persistent>
            <v-card>
                <v-card-text>
                    <br>
                    <h1 class="text-center">Confirmación</h1><br>
                    <h3>{{mensaje}}</h3>
                </v-card-text>
                <v-card-actions>
                    <v-flex class="text-right">
                        <v-btn class="mb-2" @click="dialogMensaje=false;mensaje=''" color="info">
                            <v-icon>mdi-cancel</v-icon>
                        </v-btn>
                        <v-btn class="mb-2" @click="cambiarCaja" color="info">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</v-img>
</template>

<script>
import axios from "axios"
import urlAPI from "../config/config.js"
export default {
    data: () => ({
        fecha: null,
        caja: 'CERRADA',
        ordenesR: [],
        ordenesV: [],
        ventas: [],
        dialogMensaje: false,
        mensaje: '',
        snackbar: false,
        titulo: '',
        menu: false,
        selected: [],
        egresos: [],
        movimientos: [],
        search: '',

        headers: [{
                text: 'Fecha y Hora',
                value: 'Date',
                align: 'start',
            },
            {
                text: 'Monto',
                value: 'Monto',
            },
            {
                text: 'Tipo',
                value: 'Type',
            },
            {
                text: 'Motivo',
                value: 'Motivo',
            },
            {
                text: 'Decripción',
                value: 'Description',
            },
            {
                text: 'Responsable',
                value: 'Responsable',
            },
        ],
        empleados: [],
        branchOffice: null,
        editedIndex: -1,
        attrs: '',
        on: '',
        employee: null,
        date: null
    }),

    created() {
        let date = new Date()
        this.fecha = date.getDate() + "-" + parseInt(date.getMonth() + 1) + "-" + parseInt(date.getYear() + 1900);
        let employee = localStorage.getItem("employee");
        employee = JSON.parse(employee);
        this.employee = employee;
        this.branchOffice = employee != null & employee.BranchOffice != null ? employee.BranchOffice : "";
        this.getegresos(this.branchOffice);
        this.getCaja();
        this.getOrdenes();
        this.getVentas();
        this.getEmpleados();
    },

    methods: {
        validateUsers(...authorizedUsers) {
            if (localStorage.getItem('userType') != null) {
                return (authorizedUsers.includes(localStorage.getItem('userType'))) ? true : false
            }
            return false;
        },

        getCaja() {
            axios.get(urlAPI + 'branchOffice').then(res => {
                if (res != null) {
                    let branchOffice = res.data.branchOffice;
                    branchOffice = branchOffice.find(b => b._id == this.employee.BranchOffice);
                    if (branchOffice != null) {
                        this.branchOffice = branchOffice;
                        this.caja = branchOffice.Caja;
                    }
                }
            })
        },

        async getegresos(branchOffice) {
            await axios.get(urlAPI + 'egreso')
                .then(res => {
                    this.egresos = [];
                    let egresos = res.data.egreso;
                    if (egresos != null) {
                        if (branchOffice != "") {
                            egresos.forEach(e => {
                                if (e.BranchOffice == branchOffice && e.Status == "ACTIVE") {
                                    this.egresos.push({
                                        "Date": e.Date,
                                        "Responsable": e.Employee.DNI,
                                        "Monto": e.Monto,
                                        "Description": e.Description,
                                        "Type": "EGRESO",
                                        "Motivo": e.Type
                                    })
                                }
                            })
                            this.egresos.forEach(e => {
                                this.movimientos.push(e)
                            });
                        }
                    }
                })
        },

        async getVentas(branchOffice) {
            await axios.get(urlAPI + 'sellVehicle')
                .then(res => {
                    this.ventas = [];
                    let ventas = res.data.sell;
                    if (ventas != null) {
                        if (branchOffice != "") {
                            ventas.forEach(e => {
                                if (e.BranchOffice != null && e.BranchOffice._id == branchOffice) {
                                    this.ventas.push({
                                        "Date": e.Date,
                                        "Responsable": e.Employee.DNI,
                                        "Monto": e.Factura.PrecioNeto,
                                        "Description": "N/A",
                                        "Type": "INGRESO",
                                        "Motivo": "VENTA"
                                    })
                                }
                            })
                            this.ventas.forEach(v => {
                                 this.movimientos.push(v)
                            });
                        }
                    }

                })
        },

        async getOrdenes(branchOffice) {
            let fecha = new Date();
            fecha = new Date(fecha.setTime(fecha.getTime()));
            await axios.get(urlAPI + 'purchaseOrder')
                .then(res => {
                    this.ordenesR = [];
                    let ordenesR = res.data.purchaseOrder;
                    if (ordenesR != null) {
                        if (branchOffice != "") {
                            ordenesR.forEach(o => {
                                let date = new Date(o.OrderDate);
                                if (o.BranchOffice == branchOffice && o.Status == "ACTIVE" && date.getDate() ==
                                    fecha.getDate() &&
                                    date.getMonth() == fecha.getMonth() &&
                                    date.getYear() == fecha.getYear()) {
                                    this.ordenesR.push({
                                        "Date": o.OrderDate,
                                        "Responsable": o.Employee.DNI,
                                        "Monto": o.Price,
                                        "Description": "ORDEN DE COMPRA",
                                        "Type": "EGRESO",
                                        "Motivo": "REPUESTOS"
                                    })
                                }
                            })
                            this.ordenesR.forEach(o => {
                                this.movimientos.push(o)
                            });
                        }
                    }
                })

            await axios.get(urlAPI + 'purchaseOrderV')
                .then(res => {
                    this.ordenesV = [];
                    let ordenes = res.data.purchaseOrderV;
                    if (ordenes != null) {
                        if (branchOffice != "") {
                            ordenes.forEach(o => {
                                let date = new Date(o.OrderDate);
                                if (o.BranchOffice == branchOffice && o.Status == "ACTIVE" && date.getDate() ==
                                    fecha.getDate() &&
                                    date.getMonth() == fecha.getMonth() &&
                                    date.getYear() == fecha.getYear()) {
                                    this.ordenesV.push({
                                        "Date": o.OrderDate,
                                        "Responsable": o.Employee.DNI,
                                        "Monto": o.Price,
                                        "Description": "ORDEN DE COMPRA",
                                        "Type": "EGRESO",
                                        "Motivo": "VEHÍCULOS"
                                    })
                                }
                            })
                            this.ordenesV.forEach(o => {
                                this.movimientos.push(o)
                            });
                        }
                    }
                })
        },

        async getEmpleados() {
            await axios.get(urlAPI + 'employee')
                .then(res => {
                    let empleados = res.data.employee;
                    if (empleados != null) {
                        empleados.forEach(s => {
                            if (s.Status === "ACTIVE" & s.BranchOffice._id == this.employee.BranchOffice) {
                                this.empleados.push(s);
                            }
                        })
                    }
                })
        },

        reset() {
            if (this.dialogNuevo) {
                this.$refs.form.resetValidation();
            }
            this.editedItem = this.defaultItem;
            this.dialogNuevo = false;
            this.nuevo = false;
            this.selected = [];
        },

        formatDate(date) {
            if (date == null) {
                return "N/A";
            }
          //  date.toLocaleString("es-AR", {timeZone: "America/Argentina/Buenos_Aires"});
            date = String(date)
            let fecha = (date.slice(0,10)).split("-");
            let hora = date.slice(11,19) ;
            date = fecha[2]+"-"+fecha[1]+"-"+fecha[0]+" "+hora;
            return date;
        },

        formatStringDate(value) {
            return String(value).length == 1 ? "0" + value : value;
        },

        formatString(value) {
            return value == null ? "S/D" : value;
        },

        formatPrice(value) {
            return value == null ? "$0" : "$" + value;
        },

        mostrarDialog() {
            if (this.caja == 'ABIERTA') {
                this.mensaje = "¿Está seguro de que deseas cerrar la caja?";
                this.dialogMensaje = true;
            } else {
                this.mensaje = "¿Está seguro de que deseas abrir la caja?";
                this.dialogMensaje = true;
            }
        },

        cambiarCaja() {
            if (this.caja == 'ABIERTA') {
                this.caja = 'CERRADA';
            } else {
                this.caja = 'ABIERTA';
                localStorage.setItem('caja', 'ABIERTA');
            }
            let fecha = new Date();
            fecha = new Date(fecha.setTime(fecha.getTime()));
            let change = { 
                    "Employee": this.employee._id,
                    "Date": fecha,
                    "Description":"CAJA: " + this.caja
                }
            let arrChange = this.branchOffice.ChangeStatus == null || this.branchOffice.ChangeStatus != null && this.branchOffice.ChangeStatus.length == 0 ? arrChange = [] : this.branchOffice.ChangeStatus;
            arrChange.push(change);
            axios.post(urlAPI + 'branchOffice/' + this.branchOffice._id + '/setCaja', {
                "Caja": this.caja
            });
            axios.post(urlAPI + 'branchOffice/' + this.branchOffice._id + '/changeStatus', arrChange);

            this.mensaje = "";
            this.dialogMensaje = false;
        }
    },

};
</script>

<style>
.mb-2 {
    margin-left: 3px;
    margin-right: 3px;
}

.btnMasMenos {
    margin: -10%;
}

.izq {
    align: left;
    margin-left: -90%;
}
</style>

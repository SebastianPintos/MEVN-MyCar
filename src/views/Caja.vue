<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>
        <h1 class="text-center" style="background-color:DimGray;color:white">INGRESOS/EGRESOS {{fecha}}</h1>
        <h4 class="text-center" style="background-color:DimGray;color:white">ESTADO: {{caja}}</h4>
        <h4 class="text-center" style="background-color:DimGray;color:white">Saldo: ${{saldoInicial}}</h4>
        <template>
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header class="indigo darken-4 white--text">
                        <template v-slot:actions>
                            <v-icon color="white">
                                $expand
                            </v-icon>
                        </template>
                        Ver filtros Disponibles
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-container>
                            <h2>Filtros</h2>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-select label="Tipo" v-model="filtros.Type" :items="['INGRESO','EGRESO']"></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="Responsable" v-model="filtros.Employee" :items="empleados" item-text="User" item-value="User"></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="Desde" v-model="filtros.Desde" :items="horarios"></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="Hasta" v-model="filtros.Hasta" :items="horarios"></v-select>
                                </v-col>

                                <v-col cols="12" sm="6" md="6">
                                    <v-btn class="success" @click="aplicarFiltros">
                                        <v-icon>mdi-check</v-icon>
                                    </v-btn>
                                    <v-btn class="warning" @click="reiniciarFiltros">
                                        <v-icon>mdi-cancel</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>

        <v-data-table v-model="selected" :headers="headers" :items="movimientos" :search="search" item-key="_id" sort-by="Type" class="elevation-1">

            <template v-slot:item.Date="{ item }">
                {{ formatDate(item.Date) }}
            </template>
            <template v-slot:item.Monto="{ item }" class="text-right">
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
            <v-form ref="formCaja" v-model="valid" lazy-validation>
                <v-card-text>
                    <br>
                    <h1 class="text-center">Confirmación</h1><br>
                    <h3>{{mensaje}}</h3>
                    <v-text-field v-if="caja=='CERRADA'" prefix="$" v-model="saldoEnCaja" :value="saldoEnCaja" label="Saldo Inicial" :rules="reglaPrecio"></v-text-field>
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
                </v-form>
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
        fecha: "",
        caja: 'CERRADA',
        ordenesR: [],
        ordenesV: [],
        ventas: [],
        horarios: [],
        valid: true,
        dialogMensaje: false,
        mensaje: '',
        saldoInicial: 0,
        snackbar: false,
        titulo: '',
        menu: false,
        filtros: {
            Type: '',
            Responsable: '',
            Desde: '',
            Hasta: ''
        },
        selected: [],
        egresos: [],
        movimientos: [],
        allMovimientos: [],
        search: '',

        headers: [{
                text: 'Hora',
                value: 'Date',
                align: 'start',
            },
            {
                text: 'Monto',
                value: 'Monto',
                align: 'right'
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
        date: null,
        ingresos: [],
        saldoEnCaja: 0,
        reglaPrecio: [
            value => !!value || 'Requerido.',
            value => {
                const pattern = /^[0-9]{1,}(.[0-9]{1,}){0,1}$/
                return pattern.test(value) || 'Sólo se permiten números!'
            },
        ],
    }),

    created() {
        let dateString = new Date().toLocaleString("es-AR", {
            timeZone: "America/Argentina/Buenos_Aires"
        });
        //16/12/2020 11:51:28 -> 16-12-2020 11:51:28
        this.fecha = dateString.replaceAll("/", "-").slice(0, 10);
        let employee = localStorage.getItem("employee");
        employee = JSON.parse(employee);
        this.employee = employee;
        if (employee != null) {
            this.getCaja();
        }
    },

    methods: {
        iniciar() {
            this.getegresos();
            this.getOrdenes();
            this.getVentas();
            this.getEmpleados();
            this.getIngresos();
            this.getHorarios();
        },
        aplicarFiltros() {
            let desde = this.filtros.Desde != "";
            let hasta = this.filtros.Hasta != "";
            let responsable = this.filtros.Responsable != "";
            let type = this.filtros.Type != "";

            if (!desde && !hasta && !responsable && !type) {
                return
            }
            this.movimientos = [];
            let TypeMatches = true
            let DesdeMatches = true
            let HastaMatches = true
            let ResponsableMatches = true
            let repAux = []
            let cant = 0
            for (var i = 0; i < this.allMovimientos.length; i++) {
                TypeMatches = type ? this.allMovimientos[i].Type === this.filtros.Type : TypeMatches
                DesdeMatches = desde ? this.allMovimientos[i].Date.slice(11, 19) >= this.filtros.Desde : DesdeMatches
                HastaMatches = hasta ? this.allMovimientos[i].Date.slice(11, 19) <= this.filtros.Hasta : HastaMatches
                ResponsableMatches = responsable ? this.allMovimientos[i].Responsable === this.filtros.Responsable : ResponsableMatches

                if (TypeMatches & DesdeMatches & HastaMatches & ResponsableMatches) {
                    this.movimientos.push(this.allMovimientos[i]);
                }
            }
        },

        reiniciarFiltros() {
            this.movimientos = this.allMovimientos;
            this.filtros.Desde = "";
            this.filtros.Hasta = "";
            this.filtros.Responsable = "";
            this.filtros.Type = "";
        },

        getHorarios() {
            for (let i = 9; i < 23; i++) {
                let hora = i < 10 ? "0" + i : i;
                this.horarios.push(hora + ":00");
            }
        },
        validateUsers(...authorizedUsers) {
            if (localStorage.getItem('userType') != null) {
                return (authorizedUsers.includes(localStorage.getItem('userType'))) ? true : false
            }
            return false;
        },

        getCaja() {
            axios.get(urlAPI + 'branchOffice').then(res => {
                this.saldoInicial =0;
                this.movimientos = [];
                this.saldoEnCaja=0;
                if (res != null) {
                    let branchOffice = res.data.branchOffice;
                    branchOffice = branchOffice.find(b => b._id == this.employee.BranchOffice);
                    if (branchOffice != null) {
                        if (branchOffice.Caja != null & branchOffice.Caja != "") {
                            if(branchOffice.Caja.Estado==null){
                                this.caja="CERRADA";    
                            }
                            else{
                                this.caja = branchOffice.Caja.Estado;
                            }
                            if(branchOffice.Caja.SaldoInicial!=null && branchOffice.Caja.Date == this.fecha){
                                    this.saldoEnCaja += branchOffice.Caja.SaldoInicial;
                                    this.saldoInicial+=this.saldoEnCaja;
                            }
                        }
                        this.branchOffice = branchOffice;
                        this.iniciar();
                    }
                }
            })
        },

        async getegresos() {
            await axios.get(urlAPI + 'egreso')
                .then(res => {
                    this.egresos = [];
                    let egresos = res.data.egreso;
                    if (egresos != null) {
                        if (this.branchOffice != "") {
                            egresos.forEach(e => {
                                let date = String(e.Date).slice(0, 10);;

                                if (e.BranchOffice == this.branchOffice._id && e.Status == "ACTIVE" &&
                                    this.fecha == date) {
                                    this.egresos.push({
                                        "Date": e.Date,
                                        "Responsable": e.Employee.User,
                                        "Monto": e.Monto,
                                        "Description": e.Description,
                                        "Type": "EGRESO",
                                        "Motivo": e.Type
                                    })
                                    this.saldoInicial-=e.Monto;
                                }
                            })
                            this.egresos.forEach(e => {
                                this.movimientos.push(e)
                                this.allMovimientos.push(e)
                            });
                        }
                    }
                })
        },

        async getVentas() {
            await axios.get(urlAPI + 'sellVehicle')
                .then(res => {
                    this.ventas = [];
                    let ventas = res.data.sell;
                    if (ventas != null) {
                        if (this.branchOffice != "") {
                            ventas.forEach(e => {
                                let fString="";
                                if (e.Date != null) {
                                    let date = String(e.Date).slice(0, 10).split("-");
                                    fString = date[2]+"-"+date[1]+"-"+date[0]; 
                                 }
                                if (e.BranchOffice != null && e.BranchOffice == this.branchOffice._id && this.fecha == fString) {
                                    this.ventas.push({
                                        "Date": e.Date,
                                        "Responsable": e.Employee.User,
                                        "Monto": e.Factura.PrecioNeto,
                                        "Description": "N/A",
                                        "Type": "INGRESO",
                                        "Motivo": "VENTA"
                                    })
                                    this.saldoInicial+=e.Factura.PrecioNeto;
                                }
                            })
                            this.ventas.forEach(v => {
                                this.movimientos.push(v)
                                this.allMovimientos.push(v)
                            });
                        }
                    }
                })
        },

        async getOrdenes(branchOffice) {
            await axios.get(urlAPI + 'purchaseOrder')
                .then(res => {
                    this.ordenesR = [];
                    let ordenesR = res.data.purchaseOrder;
                    if (ordenesR != null) {
                        if (branchOffice != "") {
                            ordenesR.forEach(o => {
                                let date = "";
                                if (o.OrderDate != null) {
                                    date = String(o.OrderDate).slice(0, 10);
                                }
                                if (o.BranchOffice == branchOffice && o.Status == "ACTIVE" && o.Type == "RECIBIDA" && date == this.fecha) {
                                    this.ordenesR.push({
                                        "Date": o.OrderDate,
                                        "Responsable": o.Employee.User,
                                        "Monto": o.Price,
                                        "Description": "ORDEN DE COMPRA",
                                        "Type": "EGRESO",
                                        "Motivo": "allMovimientos"
                                    })
                                    this.saldoInicial-=o.Price;
                                }
                            })
                            this.ordenesR.forEach(o => {
                                this.movimientos.push(o)
                                this.allMovimientos.push(o)
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
                                let date = String(o.Date).slice(0, 10);
                                if (o.BranchOffice == branchOffice && o.Status == "ACTIVE" &&
                                    o.Type == "RECIBIDA" && this.fecha == date) {
                                    this.ordenesV.push({
                                        "Date": o.OrderDate,
                                        "Responsable": o.Employee.User,
                                        "Monto": o.Price,
                                        "Description": "ORDEN DE COMPRA",
                                        "Type": "EGRESO",
                                        "Motivo": "VEHÍCULOS"
                                    })
                                    this.saldoInicial-=o.Price;
                                }
                            })
                            this.ordenesV.forEach(o => {
                                this.movimientos.push(o)
                                this.allMovimientos.push(o)
                            });
                        }
                    }
                })
        },

        async getIngresos() {
            await axios.get(urlAPI + 'ingreso')
                .then(res => {
                    this.ingresos = [];
                    let ingresos = res.data.ingreso;
                    if (ingresos != null) {
                        if (this.branchOffice != "") {
                            ingresos.forEach(o => {
                                let date = String(o.Date).slice(0, 10);
                                if (o.BranchOffice == this.branchOffice._id && this.fecha == date) {
                                    this.ingresos.push({
                                        "Date": o.Date,
                                        "Responsable": o.Employee.User,
                                        "Monto": o.Monto,
                                        "Description": "N/A",
                                        "Type": "INGRESO",
                                        "Motivo": "SALDO INICIAL"
                                    })
                                    if(this.saldoEnCaja==0){
                                        this.saldoEnCaja+=o.Monto;
                                        this.saldoInicial+=this.saldoEnCaja;
                                    }
                                    else{
                                        this.saldoInicial+=o.Monto;
                                    }
                                     }
                            })
                            this.ingresos.forEach(o => {
                                this.movimientos.push(o)
                                this.allMovimientos.push(o)
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
                            if (s.Status === "ACTIVE" & s.BranchOffice != null) {
                                if (s.BranchOffice._id == this.employee.BranchOffice) {
                                    this.empleados.push(s);
                                }
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

            let dateAux = new Date(date);
            if(String(dateAux).includes("Invalid")){
                let fecha = String(date);
                let nD = new Date();
                if(fecha.length<19){
                        let horas = nD.getHours()<10? "0"+nD.getHours() : nD.getHours();
                        let min = nD.getMinutes()-1<10? "0"+nD.getMinutes()-1 : nD.getMinutes()-1;       
                        let seg = nD.getSeconds()<10? "0"+nD.getSeconds() : nD.getSeconds();
                        return horas+":"+min+":"+seg;
                }   
                return fecha.slice(11,19);
            }
            console.log(dateAux)
            console.log(date)
            let horas = dateAux.getHours()<10? "0"+dateAux.getHours() : dateAux.getHours();
            let min = dateAux.getMinutes()<10? "0"+dateAux.getMinutes() : dateAux.getMinutes();       
            let seg = dateAux.getSeconds()<10? "0"+dateAux.getSeconds() : dateAux.getSeconds();
            date = horas+":"+min+":"+seg;
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
            if(this.$refs.formCaja.validate()){
            if (this.caja == 'ABIERTA') {
                this.caja = 'CERRADA';
            } else {
                this.caja = 'ABIERTA';
                localStorage.setItem('caja', 'ABIERTA');
            }
            /*let dateString = new Date().toLocaleString("es-AR", {
                timeZone: "America/Argentina/Buenos_Aires"
            });*/
            //16/12/2020 11:51:28 -> 16-12-2020 11:51:28
            //this.saldoInicial+=this.saldoEnCaja;
            let change = {
                "Employee": this.employee._id,
                "Date": this.fecha,
                "Description": "CAJA: " + this.caja
            }
            let arrChange = this.branchOffice.ChangeStatus == null || this.branchOffice.ChangeStatus != null && this.branchOffice.ChangeStatus.length == 0 ? [] : this.branchOffice.ChangeStatus;
            arrChange.push(change);
            axios.post(urlAPI + 'branchOffice/' + this.branchOffice._id + '/setCaja', {
                "Caja": {
                    "Estado": this.caja,
                    "Date": this.fecha,
                    "SaldoInicial":this.saldoEnCaja
                }
            });
            axios.post(urlAPI + 'branchOffice/' + this.branchOffice._id + '/changeStatus', arrChange)
            .then(res=>{
                if(res!=null){
                      this.getCaja();
                }
            });
            this.mensaje = "";
            this.$refs.formCaja.resetValidation();
            this.dialogMensaje = false;
            }
            
        },
        getStringDate(date){
             let dateAux = new Date(date);
            return dateAux!=null? dateAux.getDate()+"-"+(dateAux.getMonth()+1)+"-"+(dateAux.getYear()+1900): new Date().getDate()+"-"+(new Date().getMonth()+1)+"-"+(new Date().getYear()+1900);
        },

    },

};
</script>

<style>
.mb-2 {
    margin-left: 3px;
    margin-right: 3px;
}

.right {
    text-align: right;
}
</style>

<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>
    <h1 class="text-center" style="background-color:DimGray;color:white">INGRESOS/EGRESOS {{fecha}}</h1>
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
                        <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on" @click="editar">
                            <v-icon>mdi-cash-lock-open</v-icon>
                        </v-btn>

                        <v-btn color="error" dark class="mb-2" v-bind="attrs" v-on="on" @click="corroborarSeleccionado">
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

    </div>
</v-img>
</template>

<script>
import axios from "axios"
import urlAPI from "../config/config.js"
export default {
    data: () => ({
        fecha: null,
        ordenes: [],
        ventas: [],
        dialogMensaje: false,
        mensaje: '',
        nuevo: false,
        valid: true,
        dialogNuevo: false,
        snackbar: false,
        dialogConfirm: false,
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
        editedIndex: -1,
        attrs: '',
        on: '',
        employee: null,
        
    }),

    created() {
        let date = new Date()
        this.fecha = date.getDate()+"-"+date.getMonth()+"-"+parseInt(date.getYear()+1900);
        let employee = localStorage.getItem("employee");
        employee = JSON.parse(employee);
        this.employee = employee;
        this.branchOffice = employee != null & employee.BranchOffice != null ? employee.BranchOffice : "";
        this.getegresos(this.branchOffice);
        this.getEmpleados();
    },

    methods: {
        validateUsers(...authorizedUsers) {
            if (localStorage.getItem('userType') != null) {
                return (authorizedUsers.includes(localStorage.getItem('userType'))) ? true : false
            }
            return false;
        },
        async getegresos(branchOffice) {
            await axios.get(urlAPI + 'egreso')
                .then(res => {
                    this.egresos = [];
                    let egresos = res.data.egreso;
                    if (egresos != null) {
                        if (branchOffice != "") {
                            egresos.forEach(e=>{
                                if(e.BranchOffice==branchOffice && e.Status=="ACTIVE"){
                                    egresos.push({
                                        "Date": e.Date,
                                        "Responsable": e.Employee,
                                        "Monto": e.Monto,
                                        "Description": e.Description,
                                        "Type": "EGRESO",
                                        "Motivo": e.Type
                                    })
                                }
                            })
                        
                        }
                    }
                })
        },
        
        async getOrdenes(branchOffice) {
            await axios.get(urlAPI + 'purchaseOrder')
                .then(res => {
                    this.ordenesR = [];
                    let ordenes = res.data.purchaseOrder;
                    if (ordenes != null) {
                        if (branchOffice != "") {
                            ordenes.forEach(o=>{
                                if(o.BranchOffice==branchOffice && o.Status=="ACTIVE"){
                                    ordenes.push({
                                        "Date": e.ArrivalDate,
                                        "Responsable": e.Employee,
                                        "Monto": e.Monto,
                                        "Description": e.Description,
                                        "Type": "EGRESO",
                                        "Motivo": e.Type
                                    })
                                }
                            })
                        
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

        guardar() {
            if (this.validate()) {
                let sueldo = null;

                if (this.sueldo) {
                    sueldo = {
                        "Employee": this.editedItem.Sueldo.Employee,
                        "Monto": this.editedItem.Sueldo.Monto
                    };
                    this.editedItem.Monto = this.editedItem.Sueldo.Monto;
                    this.editedItem.Description = "N/A";
                }
                let date = new Date();
                date = new Date(date.setTime(date.getTime()));
                let auxegresos = {
                    "egreso": {
                        "Employee": this.employee._id,
                        "Sueldo": sueldo,
                        "Monto": this.editedItem.Monto,
                        "BranchOffice": this.branchOffice,
                        "Type": this.editedItem.Type,
                        "Description": this.editedItem.Description,
                        "Date": date,
                        "Status": "ACTIVE"
                    }
                };
                if (this.nuevo == true) {
                    axios.post(urlAPI + "egreso/add", auxegresos).then(res => {
                        if (res != null) {
                            this.editedItem = this.defaultItem;
                            this.getegresos(this.branchOffice);
                            this.reset();
                        }
                    })

                } else {
                    axios.post(urlAPI + "egreso/" + this.selected[0]._id + "/update", auxegresos).then(res => {
                        if (res != null) {
                            this.egresos = [];
                            this.editedItem = this.defaultItem;
                            this.getegresos(this.branchOffice);
                            this.reset();
                        }
                    })
                }
            }
        },

        eliminar() {
            axios.post(urlAPI + "egreso/" + this.selected[0]._id + "/delete").then(res => {
                if (res != null) {
                    this.egresos.splice(this.egresos.indexOf(this.selected[0]), 1)
                    this.selected = [];
                    this.dialogDelete = false;
                    this.reset();
                }
            })

        },
        corroborarSeleccionado() {
            if (this.selected.length != 1) {
                this.mensaje = "No ha seleccionado ningún elemento!";
                this.snackbar = true;
                return;
            }
            this.dialogDelete = true;
        },
        editar() {
            if (this.selected.length != 1) {
                this.mensaje = "No ha seleccionado ningún elemento!";
                this.snackbar = true;
                return;
            }
            this.editedItem.Description = this.selected[0].Description;
            if (this.selected[0].Sueldo != null) {
                this.editedItem.Sueldo.Employee = this.selected[0].Sueldo.Employee;
                this.editedItem.Sueldo.Monto = this.selected[0].Sueldo.Monto;
            }
            this.editedItem.Monto = this.selected[0].Monto;
            this.editedItem.Employee = this.selected[0].Employee;
            this.editedItem.BranchOffice = this.selected[0].BranchOffice;
            this.editedItem.Type = this.selected[0].Type;
            this.editedItem.Date = this.selected[0].Date;
            this.titulo = "Editar Egreso";
            this.dialogNuevo = true;
        },

        validate() {
            return this.$refs.form.validate();
        },

        reset() {
            if (this.dialogNuevo) {
                this.$refs.form.resetValidation();
            }
            this.editedItem = this.defaultItem;
            this.dialogNuevo = false;
            this.nuevo = false;
            this.selected=[];
        },

        formatDate(date) {
            if (date == null) {
                return "N/A";
            }
            date = new Date(date);
            let dia =this.formatStringDate(date.getDate());
            let hs = this.formatStringDate(date.getHours());
            let min = this.formatStringDate(date.getMinutes());
            let seg = this.formatStringDate(date.getSeconds());

            date = (dia + "-" + (parseInt(date.getMonth() + 1)) + "-" + (date.getYear() + 1900) + " " + hs + ":" + min + ":" + seg);
            return date;
        },

        formatStringDate(value){
            return String(value).length==1? "0"+value : value;
        },

        
        formatString(value){
            return value==null? "S/D": value;
        },

        formatPrice(value) {
            return value == null ? "$0" : "$" + value;
        },
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

<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>
        <v-data-table v-model="selected"  :headers="headers" :items="ingresos" :search="search" item-key="_id" sort-by="Brand" class="elevation-1">

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

                    <div v-if="validateUsers('Administrativo') & caja=='ABIERTA'">
                        <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on" @click="dialogNuevo=true; titulo='Nuevo Saldo'">
                            <v-icon>mdi-plus</v-icon>
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
        <v-dialog v-model="dialogNuevo" max-width="600px" persistent>
            <v-card>
                <v-card-title>{{titulo}}</v-card-title>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-card-text>
                            <v-text-field type="Number" label="Monto" v-model="editedItem.Monto" prefix="$" :rules="requerido"></v-text-field>
                    </v-card-text>

                    <v-card-actions>
                        <v-flex class="text-right">
                            <v-btn class="mb-2 info" @click="reset">
                                <v-icon>mdi-cancel</v-icon>
                            </v-btn>
                            <v-btn class="mb-2 info" @click="guardar">
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
        dialogMensaje: false,
        mensaje: '',
        valid: true,
        dialogNuevo: false,
        snackbar: false,
        dialogConfirm: false,
        titulo: '',
        menu: false,
        selected: [],
        sueldo: false,
        date: null,
        dialogDelete: false,
        ingresos: [],
        search: '',
        requerido: [
            value => !!value || 'Requerido.',
        ],
        reglaNumero: [
            value => {
                const pattern = /^[0-9]{1,}$/
                return pattern.test(value) || 'Sólo se permiten números!'
            },
        ],
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
                 text: 'Responsable',
                value: 'Employee.User',
                
            }
        ],
        empleados: [],
        editedIndex: -1,
        attrs: '',
        on: '',
        employee: null,
        editedItem: {
            Responsable: "",
            Monto: 0,
            BranchOffice: "",
            Date: null
        },
        defaultItem: {
            Employee: "",
            Monto: 0,
            BranchOffice: "",
            Date: null
        },
        caja:"CERRADA"
    }),

    created() {
        let employee = localStorage.getItem("employee");
        employee = JSON.parse(employee);
        this.employee = employee;
        this.branchOffice = employee != null & employee.BranchOffice != null ? employee.BranchOffice : "";
        if (employee != null & this.branchOffice != null) {
            this.iniciar();
        }
    },

    methods: {

        getCaja() {
            axios.get(urlAPI + 'branchOffice').then(res => {
                if (res != null) {
                    let branchOffice = res.data.branchOffice;
                    branchOffice = branchOffice.find(b => b._id == this.employee.BranchOffice);
                    if (branchOffice != null) {
                        this.caja = branchOffice.Caja;
                    }
                }
            })
        },
        iniciar() {
            this.getingresos(this.branchOffice);
            this.getCaja();
        },
        validateUsers(...authorizedUsers) {
            if (localStorage.getItem('userType') != null) {
                return (authorizedUsers.includes(localStorage.getItem('userType'))) ? true : false
            }
            return false;
        },
        async getingresos(branchOffice) {
            await axios.get(urlAPI + 'ingreso')
                .then(res => {
                    this.ingresos = [];
                    let ingresos = res.data.ingreso;
                    if (ingresos != null) {
                        if (branchOffice != "") {
                            this.ingresos = ingresos.filter(d => d.BranchOffice == branchOffice);
                        }
                    }
                })
        },

        guardar() {
            if (this.validate()) {
                 let dateString = new Date().toLocaleString("es-AR", {
                    timeZone: "America/Argentina/Buenos_Aires"
                });
                let date = dateString.replaceAll("/","-");
                let auxingresos = {
                    "ingreso": {
                        "Employee": this.employee._id,
                        "Monto": this.editedItem.Monto,
                        "BranchOffice": this.branchOffice,
                        "Date": date,
                         }
                };
                    axios.post(urlAPI + "ingreso/add", auxingresos).then(res => {
                        if (res != null) {
                            this.editedItem = this.defaultItem;
                            this.getingresos(this.branchOffice);
                            this.reset();
                        }
                    })

                }
                           
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
        },

        formatDate(date) {
            if (date == null) {
                return "N/A";
            }
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

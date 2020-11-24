<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>
        <v-data-table v-model="selected" show-select :headers="headers" :items="clients" :search="search" item-key="_id" sort-by="Name" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details></v-text-field>

                    <v-divider class="mx-4" dark vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" @click="editItem(selected[0])">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn color="error" dark class="mb-2" v-bind="attrs" v-on="on" @click="deleteItem()">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>

                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn @click="formTitle='Nuevo Cliente'" color="success" dark class="mb-2" v-bind="attrs" v-on="on">
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <v-form ref="form" v-model="valid" lazy-validation>

                                <v-card-title>
                                    <span class="headline">{{ formTitle }}</span>
                                </v-card-title>

                                <v-card-text>

                                    <v-container>

                                        <v-row>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-select v-model="client.Nationality" :items="paises" item-text="name" label="Nacionalidad" @change="(value) => changeState(value)"></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field :rules="reglaNombre" v-model="client.Name" label="Nombre"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field :rules="reglaNombre" v-model="client.LastName" label="Apellido"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field type="number" :rules="reglaID" v-model="client.DNI" label="ID"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field :rules="reglaCUITAux" v-model="client.CUIT" label="ID Fiscal" @input="(value)=> cambiarReglaCUIT(value)"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="12" md="6">
                                                <v-select ref="categoría" v-model="client.TaxCategory" :items="categorias" label="Categoría" @change="(value) => cambiarRequired(value)"></v-select>
                                            </v-col>

                                            <v-col cols="12" sm="12" md="6">
                                                <v-text-field :rules="reglaRazonSocial" ref="razonSocial" v-model="client.CompanyName" label="Razón Social"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="4" md="3">
                                                <v-text-field v-model="prefijo" readonly label="Prefijo"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="8" md="9">
                                                <v-text-field type="number" :rules="reglaTelefono" v-model="num" label="Número"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field :rules="reglaPrincipioEmail" v-model="principioEmail" label="example"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="5" md="6">
                                                <v-text-field :rules="reglaFinEmail" prefix="@" v-model="finEmail" label="hotmail.com"></v-text-field>
                                            </v-col>

                                        </v-row>

                                    </v-container>
                                </v-card-text>

                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn class="info" text @click="close">
                                        <v-icon>mdi-cancel</v-icon>
                                    </v-btn>
                                    <v-btn class="info" text @click="save(selected[0]!=null? selected[0]._id:-1)">
                                        <v-icon>mdi-check</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-col cols="12" sm="12" md="12">
                                <p class="headline">Ingrese los Motivos: </p>
                                <v-textarea class="headline" v-model="motivos" label="Motivos" required></v-textarea>
                            </v-col>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn class="info" text @click="closeDelete">
                                <v-icon>mdi-cancel</v-icon></v-btn>
                                <v-btn class="info" text @click="deleteItemConfirm">
                                <v-icon>mdi-check</v-icon></v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                </v-toolbar>
            </template>
        </v-data-table>
        <v-snackbar v-model="snackbar">
            {{ mensaje }}

            <template v-slot:action="{ attrs }">
                <v-btn class="info" v-bind="attrs" @click="snackbar = false">
                     <v-icon>mdi-check</v-icon>
                </v-btn>

            </template>
        </v-snackbar>
    </div>
</v-img>
</template>

<script>
class client {
    constructor(Name, LastName, Phone, Email, Status, DNI, CUIT, CompanyName, Nationality, TaxCategory) {
        this.Name = Name;
        this.LastName = LastName;
        this.Phone = Phone;
        this.Email = Email;
        this.Status = Status;
        this.DNI = DNI;
        this.CUIT = CUIT;
        this.CompanyName = CompanyName;
        this.Nationality = Nationality;
        this.TaxCategory = TaxCategory;
    }

}

import axios from "axios";
import urlAPI from "../config/config.js"
//const instance = axios.create();

export default {
    data: () => ({
        client: new client(),
        editedIndex: -1,
        defaultClient: new client(),
        selected: [],
        categorias: ['Responsable Inscripto', 'Excento', 'Consumidor Final'],
        search: '',
        poblacion: '',
        valid: true,
        snackbar: false,
        mensaje: "",
        dialog: false,
        dialogDelete: false,
        
        headers: [{
                text: 'Nombre',
                value: 'Name',
                align: 'start',
                sortable: false,
            },
            {
                text: 'Apellido',
                value: 'LastName',
            },
            {
                text: 'ID',
                value: 'DNI'
            },
            {
                text: 'ID Fiscal',
                value: 'CUIT'
            },
            {
                text: 'Categoría Fiscal',
                value: 'TaxCategory'
            },
            {
                text: 'Razón Social',
                value: 'CompanyName'
            },
            {
                text: 'Nacionalidad',
                value: 'Nationality'
            },
            {
                text: 'Email',
                value: 'Email'
            },
            {
                text: 'Teléfono',
                value: 'Phone'
            },
            
        ],

        clients: [],
        paises: [],
        nombrePaises: [],
        codigosPaises: [],
        prefijo: '',
        num: '',
        principioEmail: '',
        finEmail: '',

        reglaNombre: [
            value => !!value || 'Requerido.',
            value => (value || '').length <= 50 || 'Máximo 50 caracteres',
            value => {
                const pattern = /^[A-Z ÑÁÉÍÓÚ]{1}[a-z ñáéíóú]{1,15}(\s{1}[A-Z ÑÁÉÍÓÚ]{1}[a-z náéíóú]{1,15}){0,}$/
                return pattern.test(value) || 'Nombre inválido'
            },
        ],
        reglaID: [value => !!value || 'Requerido.'],

        reglaCUIT: [ value => (value || '').length <= 13|| 'Máximo 13 caracteres',
            value => {
                const pattern = /^20|23|24|27|30|33|34([1-9]{1}\d{7}){1}-\d{1}$/
                return pattern.test(value) || 'Formato de CUIT inválido'
            },
            value => {
                if (value === undefined) {
                    return true || 'CUIT ingresado inválido';
                }
                let auxCuit = value
                let cuitValido = false
                auxCuit = auxCuit.split("-")
                var sCUIT = auxCuit[0] + auxCuit[1] + auxCuit[2]
                var aMult = '5432765432'
                aMult = aMult.split('')

                if (sCUIT && sCUIT.length == 11) {
                    var aCUIT = sCUIT.split('')
                    var iResult = 0
                    for (var i = 0; i <= 9; i++) {
                        iResult += aCUIT[i] * aMult[i]
                    }
                    iResult = (iResult % 11)
                    iResult = 11 - iResult

                    if (iResult == 11) {
                        iResult = 0
                    }
                    if (iResult == 10) {
                        iResult = 9
                    }
                    if (iResult == aCUIT[10]) {
                        cuitValido = true
                    }
                }
                return cuitValido || 'CUIT ingresado inválido'

            },
        ],
        reglaCUITAux:[],
        reglaTelefono: [
            value => !!value || 'Requerido.',
            value => (value || '').length <= 12 || 'Máximo 12 caracteres',
            value => (value || '').length >= 8 || 'Mínimo 8 caracteres',
            value => {
                const pattern = /^\d{8,12}$/
                return pattern.test(value) || 'Sólo se permiten números!'
            },
        ],

        reglaRazonSocial: [],

        reglaPrincipioEmail: [
            value => !!value || 'Requerido.',
            value => (value || '').length <= 20 || 'Máximo 20 caracteres',
            value => (value || '').length >= 3 || 'Mínimo 3 caracteres',
            value => {
                const pattern = /^[a-z A-Z 0-9 -_.]{3,}$/
                return pattern.test(value) || 'Email inválido'
            },
        ],
        reglaFinEmail: [
            value => !!value || 'Requerido.',
            value => (value || '').length <= 20 || 'Máximo 20 caracteres',
            value => {
                const pattern = /^[a-z]{1,}(.[a-z]{1,}){1,}$/
                return pattern.test(value) || 'Email inválido'
            },
        ],

        reglaNacionalidad: [
            value => !!value || 'Requerido.',
        ],
        attrs: '',
        on: '',
        motivos: '',
        formTitle: '',
    }),

    watch: {
        dialog(val) {
            val || this.reiniciar()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    created() {
        this.iniciar();
    },


    methods: {
        iniciar() {
            this.getClients();
            this.getPaises();
        },

        getPaises() {
            axios.get('https://restcountries.eu/rest/v2/all')
                .then(res => {
                    this.paises = res.data;
                });

        },
        getClients() {
            axios.get(urlAPI + 'client')
                .then(res => {
                    this.clients = res.data.client.filter(aClient => aClient.Status === "ACTIVE")
                });
        },
        cambiarRequired(value) {
            if (value === 'Responsable Inscripto') {
                this.reglaRazonSocial = [
                    value => !!value || 'Requerido.'
                ];
            } else {
                this.reglaRazonSocial = [];
            }
        },
        cambiarReglaCUIT(value) {
            if (value != null & value!= '') {
                this.reglaCUITAux = this.reglaCUIT;
            } else {
                this.reglaCUITAux = [];
            }
        },

        obtenerDatosPorNacion(value) {
            let datos = ['', ''];
            for (let i = 0; i < this.paises.length; i++) {
                if (this.paises[i] && this.paises[i].name == value) {
                    datos[0] = this.paises[i].callingCodes;
                    datos[1] = this.paises[i].population;
                }
            }
            return datos;
        },

        changeState(value) {
            let datos = this.obtenerDatosPorNacion(value);
            this.prefijo = datos[0]
            this.poblacion = datos[1]
            let cantidad = JSON.stringify(this.poblacion).length;

           // this.reglaID = [];
            this.reglaID = [value => !!value || 'Requerido.',
                value => (value || '').length <= cantidad || 'Máximo ' + cantidad + ' caracteres',
                value => {
                    const pattern = /^0$/
                    return !pattern.test(value) || 'El primer elemento no puede ser 0!'
                },
                value => {
                    const pattern = /^[0-9]{1,}$/
                    return pattern.test(value) || 'Sólo se permiten números!'
                },
            ]   
        },

        haySeleccionado() {
            return this.selected.length > 0;
        },

        mensajeNoSelecciono() {
            if (!this.haySeleccionado()) {
                this.snackbar = true
                this.mensaje = "No ha seleccionado ningun elemento!"
                return true;
            }
            return false;
        },

        editItem(item) {
            if (!this.mensajeNoSelecciono()) {
                if(this.selected.length > 1){
                     this.snackbar = true
                     this.mensaje = "Sólo puede editar un elemento a la vez!"
                     return;
                }
                this.editedIndex = this.clients.indexOf(item);
                this.client = Object.assign({}, item);
                this.separarDatos(item);
                this.formTitle = "Editar Cliente";
                this.dialog = true;
            } 
        },

        deleteItem() {
            this.dialogDelete = true;
        },

        deleteItemConfirm() {
            for (let i = 0; i < this.selected.length; i++) {
                this.editar("INACTIVE", this.selected[i]);
                this.clients.splice(this.clients.indexOf(this.selected[i]), 1);
            }
            this.closeDelete()
        },

        reset() {
            this.selected = [];
            this.motivos='';
            this.$nextTick(() => {
                this.client = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        close() {
            this.dialog = false
            this.reset()
        },

        closeDelete() {
            this.dialogDelete = false
            this.reset()
        },

        validate() {
            return this.$refs.form.validate()
        },

        getClient(selected) {
            return new client(selected.Name, selected.LastName, this.prefijo + "-" + this.num,
                this.principioEmail + "@" + this.finEmail, "ACTIVE", selected.DNI,
                selected.CUIT, selected.CompanyName, selected.Nationality, selected.TaxCategory);

        },

        getJSONClient(selected) {
            return {
                "client": {
                    "Name": selected.Name,
                    "LastName": selected.LastName,
                    "Phone": selected.Phone,
                    "Email": selected.Email,
                    "Status": selected.Status,
                    "DNI": selected.DNI,
                    "CUIT": selected.CUIT,
                    "CompanyName": selected.CompanyName,
                    "Nationality": selected.Nationality,
                    "TaxCategory": selected.TaxCategory,
                }
            };
        },
        post(url, data) {
            axios.post(url, data, {
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json; charset=utf-8"
                    }
                })
                .catch(err => {
                    console.log(err)
                });
        },

         save(id) {
            //Cliente Nuevo
            if (id === -1) {
                this.client = this.getClient(this.client);
                if (this.validate()) {
                    this.post(urlAPI + 'client/add', JSON.stringify(this.getJSONClient(this.client)));
                    this.clients.push(this.client);
                    this.reiniciar();
                }
            }
            //Editar Cliente
            else {
                if(this.validate()){
                    this.client.Email = this.principioEmail + "@" + this.finEmail;
                    this.client.Phone = this.num;
                    Object.assign(this.clients[this.editedIndex], this.client)
                    this.editar("ACTIVE", this.client);
                    this.reiniciar();
                }
            }
        },

        editar(estado, selected) {
            selected.Status = estado;
            this.post(urlAPI + 'client/' + selected._id + '/update', JSON.stringify(this.getJSONClient(selected)));
        },

        reiniciar() {
            this.close();
            this.selected = [];
            this.client = new client();
            this.prefijo = '';
            this.num = '';
            this.principioEmail = '';
            this.finEmail = '';
            this.$refs.form.resetValidation();
        },

        separarTel(value) {
            try {
                this.prefijo = value.Phone.split("-")[0]
                this.num = value.Phone.split("-")[1]
            } catch (e) {
                return
            }
        },
        separarEmail(value) {
            try {
                this.principioEmail = value.Email.split("@")[0]
                this.finEmail = value.Email.split("@")[1]

            } catch (e) {
                return
            }
        },

        separarDatos(value) {
            this.separarTel(value)
            this.separarEmail(value)
        },

    },
};
</script>

<style>
.mb-2 {
    margin-left: 3px;
    margin-right: 3px;
}

.mb-4 {
    width: 12%;
    margin-left: -10%;
}

p,
.motivos {
    text-align: center;
    font-size: 4%;
}
</style>

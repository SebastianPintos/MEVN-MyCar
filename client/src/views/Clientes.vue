<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>
        <v-data-table v-model="selected" show-select :headers="headers" :expanded.sync="expanded" show-expand :items="clients" :search="search" item-key="_id" sort-by="Name" class="elevation-1">
            <template v-slot:item.TaxCategory="{ item }">
                {{ format(item.TaxCategory) }}
            </template>
            <template v-slot:item.CompanyName="{ item }">
                {{ format(item.CompanyName) }}
            </template>
            <template v-slot:item.CUIT="{ item }">
                {{ format(item.CUIT) }}
            </template>
            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">

                    <v-chip-group>
                        <v-chip color="success" small v-for="v in item.Vehicle" :key="v._id">Vehículo: {{v.Domain}}</v-chip>
                    </v-chip-group>
                </td>
            </template>

            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details></v-text-field>

                    <v-divider class="mx-4" dark vertical></v-divider>
                    <v-spacer></v-spacer>

                    <v-btn color="grey" dark class="mb-2" v-bind="attrs" v-on="on" @click="mostrarDialogVehiculo">
                        <v-icon>mdi-car-outline</v-icon>
                    </v-btn>

                    <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" @click="editItem(selected[0])">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn color="error" dark class="mb-2" v-bind="attrs" v-on="on" @click="deleteItem()">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>

                    <v-dialog v-model="dialog" max-width="500px" persistent>
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
                                                <v-select v-model="client.Nationality" :items="paises" item-text="Name" item-value="Name" label="Nacionalidad" @change="(value) => changeState(value)"></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field :rules="reglaNombre" hide-details="auto" v-model="client.Name" label="Nombre"></v-text-field>
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
                                    <v-flex class="text-right">
                                        <v-btn class="mb-2 info" text @click="reset">
                                            <v-icon>mdi-cancel</v-icon>
                                        </v-btn>
                                        <v-btn class="mb-2 info" text @click="save(selected[0]!=null? selected[0]._id:-1)">
                                            <v-icon>mdi-check</v-icon>
                                        </v-btn>
                                    </v-flex>
                                </v-card-actions>
                            </v-form>
                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="dialogDelete" max-width="500px" persistent>
                        <v-card>
                            <v-col cols="12" sm="12" md="12">
                                <p class="headline">Ingrese los Motivos: </p>
                                <v-textarea class="headline" v-model="motivos" label="Motivos" required></v-textarea>
                            </v-col>
                            <v-card-actions>
                                <v-spacer></v-spacer>

                                <v-btn class="info mb-2" text @click="reset">
                                    <v-icon>mdi-cancel</v-icon>
                                </v-btn>
                                <v-btn class="info mb-2" text @click="deleteItemConfirm">
                                    <v-icon>mdi-check</v-icon>
                                </v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="dialogDeleteV" max-width="500px" persistent>
                        <v-card>
                            <h2>¿Estás seguro de que deseas eliminar el vehículo?</h2>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-flex class="text-right">
                                    <v-btn class="info mb-2" text @click="resetVehicle();dialogDeleteV=false">
                                        <v-icon>mdi-cancel</v-icon>
                                    </v-btn>
                                    <v-btn class="info mb-2" text @click="eliminarVehiculoConfirm">
                                        <v-icon>mdi-check</v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-spacer></v-spacer>

                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                </v-toolbar>
            </template>
        </v-data-table>

        <v-dialog ref="asociarVehiculo" v-model="nuevoVehiculo">
            <v-card>
                <v-card-title>Asociar Vehículo</v-card-title>
                <v-card-text>
                    <v-select label="Vehículo" :items="vehicles" v-model="vehiculoNuevo.VehicleID" item-text="Brand" item-value="_id" :rules="requerido">
                        <template slot="item" slot-scope="data">
                            {{ data.item.Brand }}-{{ data.item.Model }}-{{data.item.year}}-{{data.item.origin}}-{{data.item.transmission}}-{{data.item.Category}}-{{data.item.Fuel}}-{{data.item.Type}}-{{data.item.Kind}}
                        </template>
                    </v-select>
                    <v-text-field label="Dominio" :rules="reglaDominio" v-model="vehiculoNuevo.Domain"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-flex class="text-rigth">
                        <v-btn class="info mb-2" text @click="vehiculoNuevo.Domain='';vehiculoNuevo.VehicleID='',nuevoVehiculo=false">
                            <v-icon>mdi-cancel</v-icon>
                        </v-btn>
                        <v-btn class="info mb-2" text @click="asociarVehiculo">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-if="selected.length>0" v-model="agregarVehiculo" persistent>
            <!--v-card-->
            <v-form v-model="valid" lazy-validation>

                <!--v-card-text-->
                <h1 class="text-center" style="background-color:indigo; padding-top: 10px; padding-bottom: 10px; color:white">
                    VEHÍCULO/S <v-btn color="green" dark class="mb-2" v-bind="attrs" v-on="on" @click="nuevoVehiculo=true; editarVehiculo=false">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </h1>

                <v-data-table v-model="selected[0].Vehicle" :single-select="true" :headers="headersV" :items="vehicleClient" :search="search" item-key="_id" sort-by="Name" class="elevation-1">
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-btn fab small color="success" class="mb-0" @click="editV(item)">
                                    <v-icon class="text-center">
                                        mdi-pencil</v-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols="12" md="6">

                                <v-btn fab small color="error" class="mb-0" @click="eliminarVehiculo(item)">
                                    <v-icon class="text-center">
                                        mdi-delete</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </template>

                </v-data-table>
                <!--/v-card-text-->
                <!--v-card-text>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field disabled label="ID del Cliente: "></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field disabled v-model="selected[0].DNI"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="3">
                                <v-text-field disabled label="Nombre: "></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field disabled v-model="selected[0].Name"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field disabled label="Apellido: "></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field disabled v-model="selected[0].LastName"></v-text-field>
                            </v-col>
                        </v-row>

                        <div v-for="(v,index) in selected[0].Vehicle" :key="index">
                            <v-text-field label="Marca">{{v.VehicleID.Vehicle.Brand}}</v-text-field>
                            <v-text-field label="Dominio">{{v.Domain}}</v-text-field>
                            <v-text-field label="Dominio">AAA</v-text-field>

                        </div>
                        <v-select v-model="vehiculo" label="Vehiculo" :items="vehicles" item-text="Model" item-value="_id" :rules="requerido">
                            <template slot="item" slot-scope="data">
                                {{ data.item.Brand }} {{ data.item.Model }} - {{ data.item.year }}
                            </template>
                        </v-select>
                        <v-text-field label="Dominio" v-model="dominio" :rules="reglaDominio"></v-text-field>
                    </v-card-text-->
                <!--v-card-actions-->
                <div style="background-color:white">
                    <v-flex class="text-right">
                        <v-btn class="info mb-2" @click="vehiculo=null;agregarVehiculo=false; dominio=''">
                            <v-icon>mdi-cancel</v-icon>
                        </v-btn>
                        <v-btn class="info mb-2" @click="asociarVehiculo">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </v-flex>
                </div>
                <!--/v-card-actions-->

            </v-form>
            <!--/v-card-->
        </v-dialog>

        <v-snackbar v-model="snackbar">
            {{ mensaje }}

            <template v-slot:action="{ attrs }">
                <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
                    Aceptar
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
        vehiculoNuevo: {
            VehicleID: "",
            Domain: ""
        },
        editedIndex: -1,
        vehicleClient: [],
        vehicleDefault: [],
        defaultClient: new client(),
        selected: [],
        selectedV: [],
        expanded: [],
        categorias: ['AUTÓNOMO', 'CONSUMIDOR FINAL', 'EXENTO', 'MONOTRIBUTISTA', 'RESPONSABLE INSCRIPTO'],
        search: '',
        poblacion: '',
        valid: true,
        snackbar: false,
        mensaje: "",
        dialog: false,
        agregarVehiculo: false,
        dialogDelete: false,
        dialogDeleteV: false,
        requerido: [
            value => !!value || 'Requerido.',
        ],

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

        headersV: [{
                text: 'Marca',
                value: 'VehicleID.Brand',
                align: 'start',
                class: 'indigo white--text',
            },
            {
                text: 'Modelo',
                value: 'VehicleID.Model',
                class: 'indigo white--text'
            },
            {
                text: 'Año',
                value: 'VehicleID.year',
                class: 'indigo white--text',
            },
            {
                text: 'Origen',
                value: 'VehicleID.origin',
                class: 'indigo white--text',
            },
            {
                text: 'Transmisión',
                value: 'VehicleID.transmission',
                class: 'indigo white--text',
            },
            {
                text: 'Tipo',
                value: 'VehicleID.type',
                class: 'indigo white--text',
            },
            {
                text: 'NUEVO/USADO',
                value: 'VehicleID.Kind',
                class: 'indigo white--text',
            },
            {
                text: 'Dominio',
                value: 'Domain',
                class: 'indigo white--text',
            },
            {
                text: 'Acciones',
                value: 'actions',
                class: 'indigo white--text',
            },
        ],

        dominio: "",
        vehicles: [],
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
        reglaDominio: [
            value => !!value || 'Requerido.',
            value => {
                const pattern = /^(([A-Z]{2}[0-9]{3}[A-Z]{2}){0,1}([A-Z]{3}[0-9]{3}){0,1}){1}$/
                return pattern.test(value) || 'Dominio inválido'
            },
        ],
        reglaID: [value => !!value || 'Requerido.'],

        reglaCUIT: [value => (value || '').length <= 13 || 'Máximo 13 caracteres',
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
        reglaCUITAux: [],
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
        alta: false,
        baja: false,
        modificacion: false,
        motivos: '',
        formTitle: '',
        nuevoVehiculo: false,
        employee: null,
        indexV: -1,
    }),

    created() {
        this.iniciar();
    },

    methods: {
        iniciar() {
            this.employee = localStorage.getItem("employee");
            this.employee = JSON.parse(this.employee);

            this.getClients();
            this.getPaises();
            this.getVehicles();
        },

        getVehicles() {
            axios.get(urlAPI + 'vehicle')
                .then(res => {
                    this.vehicles = res.data.vehicle.filter(vehicle => vehicle.Status === "ACTIVE")
                });
        },

        getPaises() {
            axios.get(urlAPI+"paises")
                .then(res => {
                    this.paises = res.data.paises;
                    this.paises.sort();
                });

        },
        async getClients() {
            await axios.get(urlAPI + 'client')
                .then(res => {
                    this.clients = res.data.client.filter(aClient => aClient.Status === "ACTIVE")
                });
        },
        cambiarRequired(value) {
            if (value === 'RESPONSABLE INSCRIPTO') {
                this.reglaRazonSocial = [
                    value => !!value || 'Requerido.'
                ];
            } else {
                this.reglaRazonSocial = [];
            }
        },
        cambiarReglaCUIT(value) {
            if (value != null & value != '') {
                this.reglaCUITAux = this.reglaCUIT;
            } else {
                this.reglaCUITAux = [];
            }
        },

        obtenerDatosPorNacion(value) {
            let datos = ['', ''];
            for (let i = 0; i < this.paises.length; i++) {
                if (this.paises[i] && this.paises[i].Name == value) {
                    datos[0] = this.paises[i].CodePhone;
                    datos[1] = this.paises[i].Population;
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
                if (this.selected.length > 1) {
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
            this.baja = true;
            for (let i = 0; i < this.selected.length; i++) {
                this.editar("INACTIVE", this.selected[i], false);
                if (i == this.selected.length - 1) {
                    this.reset();
                }
                this.clients.splice(this.clients.indexOf(this.selected[i]), 1);
            }
        },

        reset() {
            if (this.dialog) {
                this.$refs.form.resetValidation();
            }
            this.dialogDelete = false;
            this.dialog = false;
            this.selected = [];
            this.motivos = '';
            this.$nextTick(() => {
                //this.client = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
            this.client = new client();
            this.prefijo = '';
            this.num = '';
            this.principioEmail = '';
            this.finEmail = '';
            this.alta = false;
            this.baja = false;
            this.modificacion = false;
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
            /*     ChangeStatus: [{
            Motive: {type: String},
            EmployerID: {type: Schema.Types.ObjectId, required: true}
        },{timestamps: true}]*/
            let changeStatus = [];
            let idEmployee = this.employee != null ? this.employee._id : null;
            let time = new Date();
            if (this.alta) {
                changeStatus.push({
                    "Motive": "ALTA",
                    "EmployerID": idEmployee,
                    "Time": new Date()
                })
            } else if (this.baja) {
                changeStatus = selected.ChangeStatus;
                changeStatus.push({
                    "Motive": "BAJA " + (this.motivos != "" ? this.motivos : ""),
                    "EmployerID": idEmployee,
                    "Time": new Date()
                })
            } else {
                changeStatus = selected.ChangeStatus;
                changeStatus.push({
                    "Motive": "MODIFICACIÓN ",
                    "EmployerID": idEmployee,
                    "Time": new Date()
                })
            }

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
                    "ChangeStatus": changeStatus
                }
            };
        },
        post(url, data) {
            axios.post(url, data, {
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json; charset=utf-8"
                    }
                }).then(res => {
                    if (res != null) {
                        this.reset();
                    }
                })
                .catch(err => {
                    console.log(err)
                });
        },

        save(id) {
            //Cliente Nuevo
            if (id === -1) {
                this.alta = true;
                this.client = this.getClient(this.client);
                if (this.validate()) {
                    this.post(urlAPI + 'client/add', JSON.stringify(this.getJSONClient(this.client)));
                    this.clients.push(this.client);
                }
            }
            //Editar Cliente
            else {
                this.modificacion = true;
                if (this.validate()) {
                    Object.assign(this.clients[this.editedIndex], this.client)
                    this.editar("ACTIVE", this.client, true);
                }
            }
        },

        editar(estado, selected, reset) {
            selected.Status = estado;
            this.post(urlAPI + 'client/' + selected._id + '/update', JSON.stringify(this.getJSONClient(selected)))
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

        mostrarDialogVehiculo() {
            if (this.selected.length == 1) {
                this.vehicleClient = this.selected[0].Vehicle;
                console.log("VEHICULO: " + JSON.stringify(this.vehicleClient))
                this.agregarVehiculo = true;
            } else if (this.selected.length == 0) {
                this.mensaje = "No ha seleccionado ningún elemento!";
                this.snackbar = true;
                this.selected = [];
            } else {
                this.mensaje = "Sólo puede seleccionar un cliente a la vez para esta acción!";
                this.snackbar = true;
                this.selected = [];
            }
        },

        format(value) {
            return value == null ? "S/D" : String(value);
        },

        getJSONVehicle(item) {
            return {
                "vehicle": {
                    "VehicleID": item.VehicleID,
                    "Domain": item.Domain
                }
            }
        },

        resetVehicle() {
            this.vehiculoNuevo.Domain = "";
            this.vehiculoNuevo.VehicleID = "";
            this.dominio = "";
            this.agregarVehiculo = false;
            this.selected = [];
            this.indexV = -1;
            if (this.nuevoVehiculo) {
                this.$refs.asociarVehiculo.resetValidation();
                this.nuevoVehiculo = false;
            }
            this.reset();
        },

        asociarVehiculo(item) {
            if (this.$refs.asociarVehiculo.validate()) {
                if (this.editarVehiculo == false) {
                    axios.post(urlAPI + "client/" + this.selected[0]._id + "/addvehicle", this.getJSONVehicle(item))
                        .then(res => {
                            if (res != null) {
                                this.resetVehicle();
                                this.mensaje = "Vehículo asociado con éxito";
                                this.snackbar = true
                            }
                        })
                } else {
                    let vehiculo = {
                        "vehicle": {
                            "Vehicle": {
                                "VehicleID": this.vehiculoNuevo.VehicleID,
                                "Domain": this.vehiculoNuevo.Domain
                            },
                            "index": this.indexV
                        }
                    };
                    axios.post(urlAPI + "client/" + this.selected[0]._id + "/updateVehicle", vehiculo)
                        .then(res => {
                            if (res != null) {
                                this.resetVehicle();
                                this.mensaje = "Vehículo actualizado con éxito";
                                this.snackbar = true
                            }
                        })
                }
            }
        },
        editV(item) {
            console.log("AGREANDO V");
            if (item == null) {
                this.mensaje = "No ha seleccionado ningún elemento";
                this.snackbar = true;
                return;
            }
            this.indexV = this.selected[0].Vehicle.indexOf(item);
            this.editarVehiculo = true;
            let vehiculo = item;
            this.vehiculoNuevo.Domain = vehiculo.Domain;
            this.vehiculoNuevo.VehicleID = vehiculo.VehicleID;
            this.nuevoVehiculo = true;
        },

        eliminarVehiculo(item) {
            if (item == null) {
                this.mensaje = "No ha seleccionado ningún elemento!";
                this.snackbar = true;
                return;
            }
            this.vehiculoNuevo = item;
            this.dialogDeleteV = true;
        },

        eliminarVehiculoConfirm() {
            let index = this.selected[0].Vehicle.indexOf(this.vehiculoNuevo);
            this.selectedV.splice(index, 1);
            axios.post(urlAPI + "client/" + this.selected[0]._id + "/deletevehicle", {
                "index": index
            });
            this.dialogDeleteV=false;
            this.resetVehicle();
            this.mensaje="Vehículo eliminado con éxito";
            this.snackbar=true;
        }
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

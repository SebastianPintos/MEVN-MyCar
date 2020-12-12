<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>

        <v-data-table v-model="selected" show-select :headers="headers" :items="dealers" :search="search" item-key="_id" sort-by="Name" class="elevation-1">

            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details></v-text-field>

                    <v-divider class="mx-4" dark vertical></v-divider>
                    <v-spacer></v-spacer>

                    <div v-if="validateUsers('Administrativo','Gerente','Administrador')">
                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" @click="editItem(selected[0])">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>

                        <v-btn color="error" dark class="mb-2" v-bind="attrs" v-on="on" @click="deleteItem()">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>

                        <v-dialog v-model="dialog" max-width="500px" persistent>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn @click="formTitle='Nuevo Proveedor'" color="success" dark class="mb-2" v-bind="attrs" v-on="on">
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
                                                    <v-text-field v-model="Dealer.Name" label="Nombre y Apellido" :rules="reglaNombre"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="12">
                                                    <v-text-field type="number" :rules="reglaTelefono" v-model="Dealer.Phone" label="Teléfono"></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="6" md="6">
                                                    <v-text-field :rules="reglaPrincipioEmail" v-model="principioEmail" label="example"></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="5" md="6">
                                                    <v-text-field :rules="reglaFinEmail" prefix="@" v-model="finEmail" label="hotmail.com"></v-text-field>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-select v-model="DealerProvince" :items="provincias" label="Provincia" @change=" prov => localidades = getLocalidades(prov)" :rules="requerido"></v-select>
                                                </v-col>

                                                <v-col cols="12" sm="12" md="12">
                                                    <v-select v-model="DealerCity" :items="localidades" label="Ciudad" :rules="requerido"></v-select>
                                                </v-col>

                                                <v-col cols="12" sm="5" md="6">
                                                    <v-text-field v-model="DealerStreet" label="Calle" :rules="requerido"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="5" md="6">
                                                    <v-text-field prefix="N°: " v-model="DealerNumber" label="Numeración" :rules="requerido"></v-text-field>
                                                </v-col>
                                            </v-row>

                                        </v-container>
                                    </v-card-text>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn class="info" text @click="reset">
                                            <v-icon>mdi-cancel</v-icon>
                                        </v-btn>
                                        <v-btn class="info" text @click="save()">
                                            <v-icon>mdi-check</v-icon>
                                        </v-btn>
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
                                    <v-btn class="info" text @click="reset">
                                        <v-icon>mdi-cancel</v-icon>
                                    </v-btn>
                                    <v-btn class="info" text @click="deleteItemConfirm">
                                        <v-icon>mdi-check</v-icon>
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
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
class Dealer {
    constructor(Name, Email, Phone, Address, Status) {
        this.Name = Name;
        this.Phone = Phone;
        this.Email = Email;
        this.Address = Address;
        this.Status = Status
    }
}

import axios from "axios";
import urlAPI from "../config/config.js"
export default {
    props: {
        tipo: String,
    },
    data: () => ({

        Dealer: new Dealer(),
        provincia: '',
        localidad: '',
        editedIndex: -1,
        defaultDealer: new Dealer(),
        selected: [],
        search: '',
        valid: true,
        snackbar: false,
        mensaje: "",
        dialog: false,
        dialogDelete: false,
        DealerCity: '',
        DealerStreet: '',
        DealerNumber: '',
        DealerProvince: '',
        headers: [{
                text: 'Nombre',
                value: 'Name',
                align: 'start',
                sortable: false,
            },
            {
                text: 'Celular',
                value: 'Phone',
            },
            {
                text: 'Email',
                value: 'Email',
            },
            {
                text: 'Provincia',
                value: 'Address.Province',
            },
            {
                text: 'Ciudad',
                value: 'Address.City'
            },
            {
                text: 'Calle',
                value: 'Address.Street'
            },
            {
                text: 'N°',
                value: 'Address.Number'
            },

        ],

        dealers: [],
        principioEmail: '',
        finEmail: '',

        requerido: [
            value => !!value || 'Requerido.',
        ],

        reglaNombre: [
            value => !!value || 'Requerido.',
            value => (value || '').length <= 50 || 'Máximo 50 caracteres',
            value => {
                const pattern = /^[A-Z ÑÁÉÍÓÚ]{1}[a-z ñáéíóú]{1,15}(\s{1}[A-Z ÑÁÉÍÓÚ]{1}[a-z náéíóú]{1,15}){0,}$/
                return pattern.test(value) || 'Nombre inválido'
            },
        ],

        reglaTelefono: [
            value => !!value || 'Requerido.',
            value => (value || '').length <= 12 || 'Máximo 12 caracteres',
            value => (value || '').length >= 8 || 'Mínimo 8 caracteres',
            value => {
                const pattern = /^\d{8,12}$/
                return pattern.test(value) || 'Sólo se permiten números!'
            },
        ],

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

        attrs: '',
        on: '',
        motivos: '',
        formTitle: '',
        provincias: [],
        localidades: [],
    }),

    watch: {
        dialog(val) {
            val || this.reset()
        },
        dialogDelete(val) {
            val || this.reset()
        },
    },

    created() {
        this.iniciar();
    },

    methods: {
        iniciar() {
            this.getDealers();
            this.getProvincias();
        },
        validateUsers(...authorizedUsers) {
            if (localStorage.getItem('userType') != null) {
                return (authorizedUsers.includes(localStorage.getItem('userType'))) ? true : false
            }
            return false;
        },

        async getDealers() {
            await axios.get(urlAPI + 'dealer')
                .then(res => {
                    this.dealers = res.data.dealer.filter(aDealer => aDealer.Status == "ACTIVE" & aDealer.Kind == this.tipo)
                });
        },

        async getProvincias() {
            await axios.get('https://apis.datos.gob.ar/georef/api/provincias?campos=nombre')
                .then(res => {
                    this.provincias = res.data.provincias;
                    this.provincias.forEach(prov =>
                        this.provincias.push(prov.nombre));
                    this.provincias.sort();
                });
        },

        getLocalidades(nombre) {
            axios.get('https://apis.datos.gob.ar/georef/api/localidades?provincia=' + nombre + '&campos=nombre&max=5000')
                .then(res => {
                    this.localidades = res.data.localidades;
                    this.localidades.forEach(localidad =>
                        this.localidades.push(localidad.nombre));
                    this.localidades.sort();
                });
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
                this.editedIndex = this.dealers.indexOf(item);

                this.separarDatos(item);
                this.Dealer = Object.assign({}, item);

                this.formTitle = "Editar Proveedor";
                this.dialog = true;
                try {
                    this.DealerProvince = item.Address.Province;
                    this.DealerStreet = item.Address.Street;
                    this.localidades = this.getLocalidades(this.DealerProvince);
                    this.DealerCity = item.Address.City;
                    this.DealerNumber = item.Address.Number;
                } catch (err) {
                    console.log(err);
                }
            }
        },

        deleteItem() {
            this.dialogDelete = true;
        },

        deleteItemConfirm() {
            for (let i = 0; i < this.selected.length; i++) {
                axios.delete(urlAPI + 'dealer/' + this.selected[i]._id + '/delete')
                this.dealers.splice(this.dealers.indexOf(this.selected[i]), 1);
            }
            this.reset()
        },

        reset() {
            if (this.dialog) {
                this.$refs.form.resetValidation();
            }
            this.DealerCity = "";
            this.DealerStreet = '';
            this.DealerNumber = '';
            this.DealerProvince = '';

            this.selected = [];
            this.motivos = '';
            this.$nextTick(() => {
                this.Dealer = new Dealer();
                this.editedIndex = -1;
            })
            this.dialog = false;
            this.dialogDelete = false;
        },

        validate() {
            return this.$refs.form.validate()
        },

        getJSONDealer(selected, estado) {
            selected.Email = this.principioEmail + "@" + this.finEmail;
            return {
                "dealer": {
                    "Name": selected.Name,
                    "Phone": selected.Phone,
                    "Email": selected.Email,
                    "Address": {
                        "Street": selected.Street,
                        "Number": selected.Number,
                        "City": selected.City,
                        "Province": selected.Province,
                    },
                    "Status": estado,
                    "Kind": this.tipo,
                }
            };
        },

        async post(url, data) {
            await axios.post(url, data, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                }
            }).then(res => {
                if (res != null) {
                    this.reset();
                }
            })
            this.dealers = [];
            this.getDealers();
        },

        save() {
            if (this.editedIndex > -1) {
                if (this.validate()) {
                    let DealerAux = {
                        "dealer": {
                            "Name": this.Dealer.Name,
                            "Phone": this.Dealer.Phone,
                            "Email": this.principioEmail + "@" + this.finEmail,
                            "Address": {
                                "Street": this.DealerStreet,
                                "Number": this.DealerNumber,
                                "City": this.DealerCity,
                                "Province": this.DealerProvince,
                            },
                            "Status": this.Dealer.Status,
                            "Kind": this.tipo,
                        }
                    }
                    Object.assign(this.dealers[this.editedIndex], DealerAux);
                    this.update(JSON.stringify(DealerAux));

                }
            } else {
                if (this.validate()) {
                    let DealerAux = {
                        "dealer": {
                            "Name": this.Dealer.Name,
                            "Phone": this.Dealer.Phone,
                            "Email": this.principioEmail + "@" + this.finEmail,
                            "Address": {
                                "Street": this.DealerStreet,
                                "Number": this.DealerNumber,
                                "City": this.DealerCity,
                                "Province": this.DealerProvince,
                            },
                            "Status": "ACTIVE",
                            "Kind": this.tipo,
                        }
                    }
                    this.post(urlAPI + 'dealer/add', DealerAux);
                    this.dealers.push(DealerAux);

                }
            }
        },

        async update(data) {
            await axios.post(urlAPI + 'dealer/' + this.selected[0]._id + '/update', data, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json; charset=utf-8"
                }
            }).then(res => {
                if (res != null) {
                    this.reset();
                }
            })
            this.dealers = [];
            this.getDealers();
        },

        guardar(estado, selected, accion, id) {
            this.post(urlAPI + 'dealer/' + id + accion, JSON.stringify(this.getJSONDealer(selected, estado)));
        },

        separarDatos(value) {
            try {
                this.principioEmail = value.Email.split("@")[0]
                this.finEmail = value.Email.split("@")[1]

            } catch (e) {
                return
            }
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

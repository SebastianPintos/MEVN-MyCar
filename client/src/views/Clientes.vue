<template>
<v-img 
 src="../assets/Sun-Tornado.svg"
 gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)"
 class="bkg-img"
 >
<v-container>
    <h1 class="titulo">CLIENTES</h1>
    <v-data-table v-model="selected" show-select :headers="headers" :items="clientes" :search="search" item-key="cuit" sort-by="nombre" class="elevation-1">
        <template v-slot:top>
            <v-toolbar flat>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details></v-text-field>

                <v-divider class="mx-4" dark vertical></v-divider>
                <v-spacer></v-spacer>

                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" @click="editItem(selected[0])">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>

                <v-btn color="error" dark class="mb-2" v-bind="attrs" v-on="on" @click="deleteItem(selected)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>

                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on">
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
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field :rules="reglaNombre" v-model="editedItem.nombre" label="Nombre y Apellido"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field :rules="reglaCUIT" v-model="editedItem.cuit" label="CUIT"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field :rules="reglaDNI" v-model="editedItem.dni" label="DNI"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field :rules="reglaTelefono" v-model="editedItem.tel" label="Teléfono"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field :rules="reglaEmail" v-model="editedItem.email" label="Email"></v-text-field>
                                        </v-col>
                                        <v-flex xs12 sm6>
                                            <v-select v-model="editedItem.razonSocial" :rules="reglaRazonSocial" :items="['Responsable Inscripto', 'Otra razón Social', 'Otra..', 'etc..']" label="Razón Social" required></v-select>
                                        </v-flex>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">
                                    Cancelar
                                </v-btn>
                                <v-btn color="blue darken-1" text @click="save">
                                    Guardar
                                </v-btn>
                            </v-card-actions>
                        </v-form>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="headline">Estas seguro de que quiere eliminar el/los elemento/s?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">Confirmar</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">
                Reset
            </v-btn>
        </template>
    </v-data-table>
    <v-snackbar v-model="snackbar">
        {{ mensaje }}

        <template v-slot:action="{ attrs }">
            <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
                Aceptar
            </v-btn>
        </template>
    </v-snackbar>
</v-container>
</v-img>
</template>

<script>
export default {
    data: () => ({
        selected: [],
        search: '',
        valid: true,
        snackbar: false,
        mensaje: "",
        dialog: false,
        dialogDelete: false,
        headers: [{
                text: 'Nombre y Apellido',
                value: 'nombre',
                align: 'start',
                sortable: false,
            },
            {
                text: 'DNI',
                value: 'dni'
            },
            {
                text: 'CUIT',
                value: 'cuit'
            },
            {
                text: 'Email',
                value: 'email'
            },
            {
                text: 'Teléfono',
                value: 'tel'
            },
            {
                text: 'Razón Social',
                value: 'razonSocial'
            }
        ],
        clientes: [],

        reglaNombre: [
            value => !!value || 'Requerido.',
            value => (value || '').length <= 50 || 'Máximo 50 caracteres',
            value => {
                const pattern = /^([A-Z]{1}[a-z]{1,15}\s{1}[A-Z]{1}[a-z]{1,15}){1}(\s{1}[A-Z]{1}[a-z]{1,15}){0,}$/
                return pattern.test(value) || 'Nombre inválido'
            },
        ],
        reglaTelefono: [
            value => !!value || 'Requerido.',
            value => {
                const pattern = /^11\d{8}$/
                return pattern.test(value) || 'Sólo se permiten números del formato 11xxxxxxxx!'
            },
        ],
        reglaDNI: [
            value => !!value || 'Requerido.',
            value => {
                const pattern = /^\d{8}$/
                return pattern.test(value) || 'Sólo se permiten números de 8 caracteres!'
            },
        ],
        reglaCUIT: [
            value => !!value || 'Requerido.',
            value => {
                const pattern = /^\d{2}-\d{8}-\d{1}$/
                return pattern.test(value) || 'Formato requerido: XX-XXXXXXXX-X'
            },
        ],
        reglaEmail: [
            value => !!value || 'Requerido.',
            value => (value || '').length <= 35 || 'Máximo 35 caracteres',
            value => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return pattern.test(value) || 'Email inválido'
            },
        ],

        reglaRazonSocial: [
            value => !!value || 'Requerido.',
        ],
        editedIndex: -1,
        attrs: '',
        on: '',
        editedItem: {
            email: '',
            nombre: '',
            cuit: '',
            dni: '',
            tel: '',
            razonSocial: '',
        },
        defaultItem: {
            email: '',
            nombre: '',
            cuit: '',
            dni: '',
            tel: '',
            razonSocial: '',
        },
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo Cliente' : 'Editar Cliente'
        },
    },

    watch: {
        dialog(val) {
            val || this.close()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    created() {
        this.initialize()
    },

    methods: {
        initialize() {
            this.clientes = [{
                    email: 'pepito@gmail.com.ar',
                    nombre: 'Pepe Gomez',
                    cuit: '32-42221144-2',
                    dni: '42222144',
                    tel: '11442255',
                    razonSocial: 'Responsable Inscripto',
                },
                {
                    email: 'juan_diego1394@hotmail.com',
                    nombre: 'Juan Lopez',
                    cuit: '24-42431232-2',
                    dni: '42324232',
                    tel: '1192848293',
                    razonSocial: 'Responsable Inscripto',
                },
                {
                    email: 'solpierozzi@hotmail.com',
                    nombre: 'Sol Pierozzi',
                    cuit: '27-42433311-3',
                    dni: '42433311',
                    tel: '1151103863',
                    razonSocial: 'Responsable Inscripto',
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
                if (this.selected.length === 1) {
                    this.editedIndex = this.clientes.indexOf(item)
                    this.editedItem = Object.assign({}, item)
                    this.dialog = true
                } else {
                    this.mensaje = "Sólo puede editar un elemento a la vez!"
                    this.snackbar = true
                }
            }
        },

        deleteItem(items) {
            if (!this.mensajeNoSelecciono()) {
                this.editedIndex = this.clientes.indexOf(items)
                this.editedItem = Object.assign({}, items)

                this.dialogDelete = true
            }
        },

        deleteItemConfirm() {
            this.selected.forEach(item => {
                this.clientes.splice(this.clientes.indexOf(item), 1);
            });
            this.closeDelete()
        },
        reset() {
            this.selected = []
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
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

        save() {
            if (this.validate()) {
                if (this.editedIndex > -1) {

                    Object.assign(this.clientes[this.editedIndex], this.editedItem)
                } else {
                    this.clientes.push(this.editedItem)
                }
                this.close()
            }
        },

    },
}
</script>

<style>

.mb-2 {
    margin-left: 3px;
    margin-right: 3px;
}
</style>

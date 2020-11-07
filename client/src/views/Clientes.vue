<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <v-container>
        <h1 class="titulo">CLIENTES</h1>
        <v-data-table v-model="selected" show-select :headers="headers" :items="clientes" :search="search" item-key="cuit" sort-by="nombre" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details></v-text-field>

                    <v-divider class="mx-4" dark vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" @click="editItem(selected[0])">
                        <v-icon @click="separarDatos(selected[0])">mdi-pencil</v-icon>
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
                                            <v-col cols="12" sm="12" md="6">
                                                <v-select v-model="editedItem.nacionalidad" :items="paises" item-text="name" label="Nacionalidad" required @change="(valor) => changeState(valor)"></v-select>
                                            </v-col>

                                            <v-col cols="12" sm="12" md="6">
                                                <v-text-field :rules="reglaNombre" v-model="editedItem.nombre" label="Nombre y Apellido"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field :rules="reglaDNI" v-model="editedItem.dni" label="DNI"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field :rules="reglaCUIT" v-model="editedItem.cuit" label="CUIT"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="12" md="6">
                                                <v-select ref="categoría" v-model="editedItem.categoría" :items="categorias" label="Categoría" required @change="(valor) => cambiarRequired(valor)"></v-select>
                                            </v-col>

                                            <v-col cols="12" sm="12" md="4">
                                                <v-text-field :rules="reglaRazonSocial" ref="razonSocial" v-model="editedItem.razonSocial" label="Razón Social"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="4" md="3">
                                                <v-text-field v-model="prefijo" readonly label="Prefijo"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="8" md="8">
                                                <v-text-field :rules="reglaTelefono" v-model="num" label="Número"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="5">
                                                <v-text-field :rules="reglaPrincipioEmail" v-model="principioEmail" label="example"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="1" md="2">
                                                <v-text-field disabled label="@"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="5" md="5">
                                                <v-text-field :rules="reglaFinEmail" v-model="finEmail" label="hotmail.com"></v-text-field>
                                            </v-col>

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
                            <v-col cols="12" sm="12" md="5">        
                            <p class="headline">Ingrese los Motivos: </p>    
                            <v-textarea class="headline" label="Motivos" required></v-textarea>
                            </v-col>
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
                <v-btn color="primary" @click="iniciar">
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
import axios from "axios"
export default {
    //https://medium.com/@hemnys25/creaci%C3%B3n-de-un-select-dependiente-con-laravel-5-4-vue-js-select2-957ac043bbdd
    data: () => ({
        selected: [],
        categorias: ['Responsable Inscripto', 'Excento', 'Consumidor Final'],
        search: '',
        poblacion:'',
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
                value: 'LastName'
            },
            {
                text: 'DNI',
                value: 'DNI'
            },
            {
                text: 'CUIT',
                value: 'CUIT'
            },
            {
                text: 'Categoría',
                value: 'TaxCategory'
            },
            {
                text: 'Email',
                value: 'Email'
            },
            {
                text: 'Teléfono',
                value: 'Phone'
            },
            {
                text: 'Nacionalidad',
                value: 'nacionalidad'
            },
            {
                text: 'Razón Social',
                value: 'razonSocial'
            }
        ],

        clientes: [],
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
                const pattern = /^([A-Z ÑÁÉÍÓÚ]{1}[a-z ñáéíóú]{1,15}\s{1}[A-Z ÑÁÉÍÓÚ]{1}[a-z ñáéíóú]{1,15}){1}(\s{1}[A-Z ÑÁÉÍÓÚ]{1}[a-z náéíóú]{1,15}){0,}$/
                return pattern.test(value) || 'Nombre inválido'
            },
        ],

        reglaTelefono: [
            value => !!value || 'Requerido.',
            value => value[0]!="0" || 'El primer dígito no puede ser 0',
            value => {
                const pattern = /^\d{7,12}$/
                return pattern.test(value) || 'Sólo se permiten números!'
            },
        ],
        reglaRazonSocial: [],

        reglaDNI: [
        ],

        reglaCUIT: [
            value => !!value || 'Requerido.',
            value => {
                const pattern = /^\d{2}-\d{8}-\d{1}$/
                return pattern.test(value) || 'Formato requerido: XX-XXXXXXXX-X'
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
        reglaNacionalidad: [
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
            nacionalidad: '',
            razonSocial: '',
            categoría: '',
        },

        defaultItem: {
            email: '',
            nombre: '',
            cuit: '',
            dni: '',
            tel: '',
            nacionalidad: '',
            razonSocial: '',
            categoría: '',
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
        this.iniciar()

        axios.get('http://localhost:8081/client')
            .then(res => {
                this.paises = res.data;
            })

        axios.get('http://localhost:8081/client')
            .then(res => {
                console.log(res)
                this.clientes = res.data.client;
            })
    },

    methods: {
        iniciar() {
            this.clientes = [{
                    email: 'pepito@gmail.com.ar',
                    nombre: 'Pepe Gomez',
                    cuit: '32-42221144-2',
                    dni: '42222144',
                    tel: '54-1144225533',
                    nacionalidad: 'Argentina',
                    razonSocial: '',
                    categoría: 'Consumidor Final'
                },
                {
                    email: 'juan_diego1394@hotmail.com',
                    nombre: 'Juan Lopez',
                    cuit: '24-42431232-2',
                    dni: '42324232',
                    tel: '54-1192848293',
                    nacionalidad: 'Argentina',
                    razonSocial: '',
                    categoría: 'Consumidor Final',
                },
                {
                    email: 'solpierozzi@hotmail.com',
                    nombre: 'Sol Pierozzi',
                    cuit: '27-42433311-3',
                    dni: '42433311',
                    tel: '54-1151103863',
                    nacionalidad: 'Argentina',
                    razonSocial: '',
                    categoría: 'Consumidor Final',
                },
            ]
        },

        cambiarRequired(valor) {
            if (valor === 'Responsable Inscripto') {
                this.reglaRazonSocial = [
                    value => !!value || 'Requerido.'
                ]
            } else {
                this.reglaRazonSocial = []
            }
        },

        obtenerDatosPorNacion(valor) {
            let datos=['','']
            for (let i = 0; i < this.paises.length; i++) {
                if (this.paises[i].name == valor) {
                    datos[0] =  this.paises[i].callingCodes
                    datos[1] = this.paises[i].population
                }
            }
            return datos
        },

        changeState(valor) {
            
            this.prefijo = this.obtenerDatosPorNacion(valor)[0]
            this.poblacion = this.obtenerDatosPorNacion(valor)[1]
            let cantidad = (JSON.stringify(this.poblacion).length)
       
            this.reglaDNI =   [value => !!value || 'Requerido.',
                              value => value[0]!="0" || 'El primer dígito no puede ser 0',
                              value => (value || '').length <= cantidad || 'Máximo '+cantidad+' caracteres']
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
            let clienteAGuardar = {
                email: this.principioEmail + "@" + this.finEmail,
                nombre: this.editedItem.nombre,
                cuit: this.editedItem.cuit,
                dni: this.editedItem.dni,
                tel: this.prefijo + "-" + this.num,
                nacionalidad: this.editedItem.nacionalidad,
                razonSocial: this.editedItem.razonSocial,
                categoría: this.editedItem.categoría,
            }
            this.editedItem = clienteAGuardar
            if (this.validate()) {
                if (this.editedIndex > -1) {
                    Object.assign(this.clientes[this.editedIndex], this.editedItem);
                }
            } else {
                this.clientes.push(this.editedItem);
            }
            this.close()
        },
        separarTel(value) {
            try {
                this.prefijo = value.tel.split("-")[0]
                this.num = value.tel.split("-")[1]
            } catch (e) {
                return
            }
        },
        separarEmail(value) {
            try {
                this.principioEmail = value.email.split("@")[0]
                this.finEmail = value.email.split("@")[1]

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
p, .motivos{
    text-align: center;
    font-size: 4%;
}

</style>

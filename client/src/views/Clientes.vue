<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <v-container>
        <h1 class="titulo">CLIENTES</h1>

        <v-data-table v-model="selected" show-select :headers="headers" :items="clientes" :search="search" item-key="id" sort-by="nombre" class="elevation-1">
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
                                                <v-select v-model="editedItem.nacionalidad" :items="paises" item-text="name" label="Nacionalidad" @change="(valor) => changeState(valor)"></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="6">
                                                <v-text-field :rules="reglaNombre" v-model="editedItem.nombre" label="Nombre y Apellido"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field :rules="reglaID" v-model="editedItem.id" label="ID"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field :rules="reglaIDFiscal" v-model="editedItem.idFiscal" label="ID Fiscal"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="12" md="6">
                                                <v-select ref="categoría" :disabled="disabled" v-model="editedItem.categoría" :items="categorias" label="Categoría" @change="(valor) => cambiarRequired(valor)"></v-select>
                                            </v-col>

                                            <v-col cols="12" sm="12" md="6">
                                                <v-text-field :rules="reglaRazonSocial" :disabled="disabled" ref="razonSocial" v-model="editedItem.razonSocial" label="Razón Social"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="4" md="3">
                                                <v-text-field v-model="prefijo" readonly label="Prefijo"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="8" md="9">
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
                            <v-col cols="12" sm="12" md="12">
                                <p class="headline">Ingrese los Motivos: </p>
                                <v-textarea class="headline" v-model="motivos" label="Motivos" required></v-textarea>
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
    data: () => ({
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
                text: 'Nombre y Apellido',
                value: 'nombre',
                align: 'start',
                sortable: false,
            },
            {
                text: 'ID',
                value: 'id'
            },
            {
                text: 'ID Fiscal',
                value: 'idFiscal'
            },
            {
                text: 'Categoría',
                value: 'categoría'
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
                text: 'Nacionalidad',
                value: 'nacionalidad'
            },
            {
                text: 'Razón Social',
                value: 'razonSocial'
            },
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
        /*
    El CUIL/T es el Código Único de Identificación Laboral – Código Único de Identificación Tributaria. El mismo consta de 11 (once) números. Los 10 (diez) primeros (2 + 8) conforman el Código de Identificación y el último conforma el Digito de Verificación.
    Para obtener los elementos mencionados en el párrafo anterior se aplica el siguiente algoritmo matemático:

    XY – 12345678 – Z

    XY: Indican el Tipo (Hombre, Mujer, Sociedad o Empresa)
    Z: Dígito de Verificación

    Se determina XY de la siguiente manera:
    Hombre = 20
    Mujer = 27
    Empresa o Sociedad = 30

    Se multiplica XY 12345678 por un número [5432765432] de forma separada:
    Se suman los resultados de las multiplicaciones
    El resultado calculado en el paso anterior se divide por 11 (once) y se obtiene el resto de dicha división
    Una vez determinado el resto se aplican las siguientes reglas:
    Si el resto es igual a 0 (cero), entonces Z (Dígito de Verificación) es igual a 0 (cero).
    Si el resto es igual a 1 (uno) ocurre lo siguiente:
    • Si es Hombre, entonces Z (Dígito de Verificación) es igual a 9 (nueve) y XY es igual a 23 (veintitrés).
    • Si es Mujer, entonces Z (Dígito de Verificación) es igual a 4 (cuatro) y XY es igual a 23 (veintitrés).
    • En cualquier otro caso Z (Dígito de Verificación) es igual a 11 (once) menos el resto del cociente.
    */
        reglaIDFiscal: [true || ''],
        reglaCUIT: [
            value => (value || '').length <= 13 || 'Máximo 13 caracteres',
            value => {
                const pattern = /^20|23|24|27|30|33|34([1-9]{1}\d{7}){1}-\d{1}$/
                return pattern.test(value) || 'Formato de CUIT inválido'
            },
            value => {
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
                console.log("CUIT VALIDO: ? " + cuitValido)
                return cuitValido || 'CUIT ingresado inválido'

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

        reglaRazonSocial: [true || ''],

        reglaID: [true || ''],

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
        motivos: '',
        editedItem: {
            email: '',
            nombre: '',
            idFiscal: '',
            id: '',
            tel: '',
            nacionalidad: '',
            razonSocial: '',
            categoría: '',
        },

        defaultItem: {
            email: '',
            nombre: '',
            idFiscal: '',
            id: '',
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
        disabled() {
            return this.editedItem.nacionalidad != 'Argentina'
        }
    },

    watch: {
        dialog(val) {
            val || this.reiniciar()
        },
        dialogDelete(val) {
            val || this.closeDelete()
        },
    },

    created() {
        this.iniciar()

        axios.get('https://restcountries.eu/rest/v2/all')
            .then(res => {
                this.paises = res.data;
            })
    },

    methods: {
        iniciar() {
            this.clientes = [{
                    email: 'pepito@gmail.com.ar',
                    nombre: 'Pepe Gomez',
                    idFiscal: '32-42221144-2',
                    id: '42222144',
                    tel: '54-1144225533',
                    nacionalidad: 'Argentina',
                    razonSocial: '',
                    categoría: 'Consumidor Final',
                },
                {
                    email: 'juan_diego1394@hotmail.com',
                    nombre: 'Juan Lopez',
                    idFiscal: '24-42431232-2',
                    id: '42324232',
                    tel: '54-1192848293',
                    nacionalidad: 'Argentina',
                    razonSocial: '',
                    categoría: 'Consumidor Final',
                },
                {
                    email: 'solpierozzi@hotmail.com',
                    nombre: 'Sol Pierozzi',
                    idFiscal: '27-42433311-3',
                    id: '42433311',
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
            let datos = ['', '']
            for (let i = 0; i < this.paises.length; i++) {
                if (this.paises[i].name == valor) {
                    datos[0] = this.paises[i].callingCodes
                    datos[1] = this.paises[i].population
                }
            }
            return datos
        },

        changeState(valor) {

            this.prefijo = this.obtenerDatosPorNacion(valor)[0]
            this.poblacion = this.obtenerDatosPorNacion(valor)[1]
            let cantidad = (JSON.stringify(this.poblacion).length)

            this.reglaID = [value => !!value || 'Requerido.',
                value => value[0] != "0" || 'El primer dígito no puede ser 0',
                value => (value || '').length <= cantidad || 'Máximo ' + cantidad + ' caracteres'
            ]
            if (this.editedItem.nacionalidad == 'Argentina') {
                this.reglaIDFiscal = this.reglaCUIT
            } else {
                this.reglaIDFiscal = []
            }
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
            this.motivos = ''
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
                idFiscal: this.editedItem.idFiscal,
                id: this.editedItem.id,
                tel: this.prefijo + "-" + this.num,
                nacionalidad: this.editedItem.nacionalidad,
                razonSocial: this.editedItem.razonSocial,
                categoría: this.editedItem.categoría,
            }
            this.editedItem = clienteAGuardar

            if (this.validate()) {
                if (this.editedIndex > -1) {
                    Object.assign(this.clientes[this.editedIndex], this.editedItem)
                } else {
                    this.clientes.push(this.editedItem)
                }
                this.reiniciar()
            }
        },

        reiniciar() {
            this.close()
            this.prefijo = ''
            this.num = ''
            this.principioEmail = ''
            this.finEmail = ''
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

p,
.motivos {
    text-align: center;
    font-size: 4%;
}
</style>

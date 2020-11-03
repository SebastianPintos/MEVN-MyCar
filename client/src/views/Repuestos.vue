<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <v-container>
        <h1 class="titulo">REPUESTOS</h1>
        <v-data-table v-model="selected" show-select :headers="headers" :items="repuestos" :search="search" item-key="codigo" sort-by="nombre" class="elevation-1" :single-expand="singleExpand" :expanded.sync="expanded" show-expand>
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
                                                <v-text-field :rules="reglaNombre" v-model="editedItem.nombre" label="Nombre"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field :rules="reglaCUIT" v-model="editedItem.codigo" label="Código"></v-text-field>
                                            </v-col>

                                            <v-flex xs12 sm6>
                                                <v-select v-model="editedItem.categoría" :rules="reglaNombre" :items="['Categoría Aa','Categoría Bb', 'Categoría Cc', 'Categoría Dd']" label="Categoría" required></v-select>
                                            </v-flex>

                                            <v-flex xs12 sm6>
                                                <v-select v-model="editedItem.sub" :rules="reglaNombre" :items="['SubCategoría Aa','SubCategoría Bb', 'SubCategoría Cc', 'SubCategoría Dd']" label="Subcategoría" required></v-select>
                                            </v-flex>

                                            <v-flex xs12 sm6>
                                                <v-select v-model="editedItem.marca" :rules="reglaNombre" :items="['Marca Aa','Marca Bb', 'Marca Cc', 'Marca Dd']" label="Marca" required></v-select>
                                            </v-flex>

                                            <v-col cols="12" sm="6" md="4">
                                                <v-textarea :rules="reglaNombre" v-model="editedItem.descripción" label="Descripción"></v-textarea>
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

            <template>
                <v-toolbar flat>
                    <v-spacer></v-spacer>
                    <v-switch v-model="singleExpand" label="Single expand" class="mt-2"></v-switch>
                </v-toolbar>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    <h3 class="mb-3"> Descripción: </h3>
                    <p class="mb-3">{{ item.descripción }}</p>
                </td>
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
        expanded: [],
        singleExpand: false,
        search: '',
        valid: true,
        snackbar: false,
        mensaje: "",
        dialog: false,
        dialogDelete: false,
        headers: [{
                text: 'Nombre',
                value: 'nombre',
                align: 'start',
                sortable: false,
            },
            {
                text: 'Código',
                value: 'codigo'
            },
            {
                text: 'Categoría',
                value: 'categoría'
            },
            {
                text: 'Subcategoría',
                value: 'sub'
            },
            {
                text: 'Marca',
                value: 'marca'
            },

        ],

        repuestos: [],

        reglaNombre: [
            value => !!value || 'Requerido.',
            value => (value || '').length <= 50 || 'Máximo 50 caracteres',
            value => {
                const pattern = /^[A-Z ÑÁÉÍÓÚ a-z ñáéíóú]{3,}(\s{1}[A-Z ÑÁÉÍÓÚ]{0,}[0-9]{0,}){0,}$/
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
            categoría: '',
            nombre: '',
            codigo: '',
            sub: '',
            marca: '',
            descripción: '',
        },
        defaultItem: {
            categoría: '',
            nombre: '',
            codigo: '',
            sub: '',
            marca: '',
            descripción: '',
        },
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo Repuesto' : 'Editar Repuesto'
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
            this.repuestos = [{
                    categoría: 'Categoría Aa',
                    nombre: 'Lubricante',
                    codigo: '32-42221144-2',
                    sub: 'Sub Cat',
                    marca: 'Marca Aa',
                    descripción: 'Este producto ....',
                },
                {
                    categoría: 'Categoría Bb',
                    nombre: 'Radiador',
                    codigo: '24-42431232-2',
                    sub: 'Subcategoría Aa',
                    marca: 'Marca Aa',
                    descripción: 'El Radiador ... posee ..',
                },
                {
                    categoría: 'Categoría Cc',
                    nombre: 'Radiador',
                    codigo: '27-42433311-3',
                    sub: 'Subcategoría Aa',
                    marca: 'Marca Aa',
                    descripción: 'Descripción Detallada sasakjfdklsjfksdjfksljdflskjdf',
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
                    this.editedIndex = this.repuestos.indexOf(item)
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
                this.editedIndex = this.repuestos.indexOf(items)
                this.editedItem = Object.assign({}, items)
                this.dialogDelete = true
            }
        },

        deleteItemConfirm() {
            this.selected.forEach(item => {
                this.repuestos.splice(this.repuestos.indexOf(item), 1);
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
                    Object.assign(this.repuestos[this.editedIndex], this.editedItem)
                } else {
                    this.repuestos.push(this.editedItem)
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
.mb-3{
    margin-left: 5%;
}
h3{
    padding-top: 1%;
}
</style>

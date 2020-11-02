<template>
<v-container>
    <h1 class="titulo">Clientes</h1>
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
                        <v-card-title>
                            <span class="headline">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.nombre" label="Nombre y Apellido"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.cuit" label="CUIT"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.dni" label="DNI"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.tel" label="Teléfono"></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                                    </v-col>

                                </v-row>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close">
                                Cancel
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="save">
                                Save
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
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
</template>

<script>
export default {
    data: () => ({
        selected: [],
        search: '',
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
        ],
        clientes: [],
        editedIndex: -1,
        attrs: '',
        on: '',
        editedItem: {
            email: '',
            nombre: '',
            cuit: '',
            dni: '',
            tel: '',
        },
        defaultItem: {
            email: '',
            nombre: '',
            cuit: '',
            dni: '',
            tel: '',
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
                    email: 'Frozen Yogurt',
                    nombre: '159',
                    cuit: '6.0',
                    dni: '24',
                    tel: '4.0',
                },
                {
                    email: 'Ice cream sandwich',
                    nombre: '237',
                    cuit: '9.0',
                    dni: '37',
                    tel: '4.3',
                },
                {
                    email: 'Eclair',
                    nombre: '262',
                    cuit: '16.0',
                    dni: '23',
                    tel: '6.0',
                },
                {
                    email: 'Cupcake',
                    nombre: '305',
                    cuit: '3.7',
                    dni: '67',
                    tel: '4.3',
                },
                {
                    email: 'Gingerbread',
                    nombre: '356',
                    cuit: '100',
                    dni: '49',
                    tel: '3.9',
                },
                {
                    email: 'Jelly bean',
                    nombre: '375',
                    cuit: '0.0',
                    dni: '94',
                    tel: '0.0',
                },

            ]
        },
        haySeleccionado() {
            return this.selected.length>0;
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
            if (!this.mensajeNoSelecciono() & this.selected.length === 1) {
                this.editedIndex = this.clientes.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            }
        },

        deleteItem(items) {
          if(!this.mensajeNoSelecciono()){
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

        close() {
            this.dialog = false
            this.selected= []
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        closeDelete() {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.clientes[this.editedIndex], this.editedItem)
            } else {
                this.clientes.unshift(this.editedItem)
            }
            this.close()
            this.selected= []
        },
    },
}
</script>

<style>
.titulo {
    text-align: center;
    margin: 20px;
}

.mb-2 {
    margin-left: 3px;
    margin-right: 3px;
}
</style>

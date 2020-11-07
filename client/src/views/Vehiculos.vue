<template>
<v-img 
 src="../assets/Sun-Tornado.svg"
 gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)"
 class="bkg-img"
 >
<v-container>
    <h1 class="titulo">VEHÍCULOS</h1>
    <v-data-table v-model="selected" show-select :headers="headers" :items="vehículos" :search="search" item-key="_id" sort-by="Brand" class="elevation-1">
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
                        <v-form ref="form" v-if="selected.length <= 1" v-model="valid" lazy-validation>

                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.categoría" label="Categoria"></v-text-field>
                                        </v-col>

                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.marca" label="Marca"></v-text-field>
                                        </v-col>

                                        <v-col cols="12" sm="6" md="4">
                                            <v-select v-model="editedItem.modelo" :items="vehículos" item-text="modelo" item-value="modelo" label="Modelo" required></v-select>
                                        </v-col>

                                        <v-col cols="12" sm="6" md="4">
                                            <v-select v-model="editedItem.version" :items="vehículos" item-text="version" item-value="Version" label="Version" required></v-select>
                                        </v-col>

                                        <v-col cols="12" sm="6" md="4">
                                            <v-select v-model="editedItem.año" :items="vehículos" item-text="año" item-value="Año" label="Año" required></v-select>
                                        </v-col>

                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.color" label="Color"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="editedItem.precioFinal" prefix="$" label="Precio"></v-text-field>
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

                    <v-card>
                        <v-form ref="editarVarios" v-if="selected.length > 1" v-model="valid" lazy-validation>

                            <v-card-title>
                                <span class="headline">Editar varios</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="editedItem.precioFinal" prefix="$" label="Precio"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="editedItem.precioFinal" label="Stock minimo"></v-text-field>
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
import axios from "axios"
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
                text: 'Marca',
                value: 'Brand',
                align: 'start',
            },
            {
                text: 'Modelo',
                value: 'Model'
            },
            {
                text: 'Categoria',
                value: 'Category'
            },
            {
                text: 'Tipo',
                value: 'Type'
            },
            {
                text: 'Transmision',
                value: 'transmission'
            },
            {
                text: 'Origen',
                value: 'origin'
            },
            {
                text: 'Año',
                value: 'year'
            },
            {
                text: 'Precio Sugerido',
                value: 'SuggestedPrice'
            },

        ],
        vehículos: [],

        editedIndex: -1,
        attrs: '',
        on: '',
        editedItem: {
            categoría: '',
            marca: '',
            modelo: '',
            version: '',
            año: '',
            color: '',
        },
        defaultItem: {
            categoría: '',
            marca: '',
            modelo: '',
            version: '',
            año: '',
            color: '',
            precioFinal: '',
        },
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo Vehículo' : 'Editar Vehículo'
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

        axios.get('http://localhost:8081/vehicle')
            .then(res => {
                console.log(res)
                this.vehículos = res.data.vehicle;
                
            })
    },

    methods: {
        initialize() {
            this.vehículos = [ ]
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
                    this.editedIndex = this.vehículos.indexOf(item)
                    this.editedItem = Object.assign({}, item)
                    this.dialog = true
                } else {
                    this.dialog = true
                }
            }
        },

        deleteItem(items) {
            if (!this.mensajeNoSelecciono()) {
                this.editedIndex = this.vehículos.indexOf(items)
                this.editedItem = Object.assign({}, items)
                this.dialogDelete = true
            }
        },

        deleteItemConfirm() {
            this.selected.forEach(item => {
                this.vehículos.splice(this.vehículos.indexOf(item), 1);
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
                    if(this.selected.length > 1){
                        console.log("mas de uno")
                    }
                    else{
                        Object.assign(this.vehículos[this.editedIndex], this.editedItem)
                    }
                } else {
                    this.vehículos.push(this.editedItem)
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

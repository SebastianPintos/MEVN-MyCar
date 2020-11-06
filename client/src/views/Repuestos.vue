<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <v-container>

        <h1 class="titulo">REPUESTOS</h1>

        <!--Filtros-->
        <template>
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header class="indigo darken-4 white--text">
                        Ver filtros Disponibles
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-container>
                            <h2>Filtros</h2>
                            <v-row>
                                <v-col cols="12" sm="6" md="3">
                                    <v-select v-model="filtros.categoría" :items="['Categoría Aa','Categoría Bb', 'Categoría Cc', 'Categoría Dd']" label="Categoría"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                    <v-select v-model="filtros.sub" :items="['Sub A','Sub B', 'Sub C', 'Sub D']" label="Subcategoría"></v-select>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                    <v-select v-model="filtros.marca" :items="['Marca Aa','Marca Bb', 'Marca Cc', 'Marca Dd']" label="Marca"></v-select>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field v-model="filtros.nroLote" label="N° de Lote"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field v-model="filtros.sku" label="SKU"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field v-model="filtros.estado" label="Estado"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field v-model="filtros.precioVenta" label="Precio de Venta"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field v-model="filtros.idProveedor" label="ID Proveedor"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                    <v-btn class="success" @click="aplicarFiltros">Aplicar Filtros</v-btn>
                                    <v-btn class="warning" @click="reiniciarFiltros">Reiniciar Filtros</v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </template>

        <!-- Tabla -->
        <v-data-table v-model="selected" show-select :headers="headers" :items="repuestosFiltrados" :search="search" item-key="codigo" sort-by="nombre" class="elevation-1" :single-expand="singleExpand" :expanded.sync="expanded" show-expand>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda Rápida" single-line hide-details></v-text-field>

                    <v-divider class="mx-4" dark vertical></v-divider>
                    <v-spacer></v-spacer>

                    <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" @click="editItem(selected[0])">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn color="error" dark class="mb-2" v-bind="attrs" v-on="on" @click="deleteItem(selected)">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    
                    <!--Dialog Nuevo Repuesto/Editar Repuesto-->
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
                                            <v-col cols="12" sm="12" md="12">
                                                <v-select v-model="editedItem.categoría" :items="['Categoría Aa','Categoría Bb', 'Categoría Cc', 'Categoría Dd']" label="Categoría" required></v-select>
                                            </v-col>

                                            <v-col cols="12" sm="12" md="12">
                                                <v-select v-model="editedItem.sub" :items="['Sub A','Sub B', 'Sub C', 'Sub D']" label="Subcategoría"></v-select>
                                            </v-col>

                                            <v-col cols="12" sm="12" md="12">
                                                <v-select v-model="editedItem.marca" :items="['Marca Aa','Marca Bb', 'Marca Cc', 'Marca Dd']" label="Marca" required></v-select>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="editedItem.nroLote" label="N° de Lote"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="06" md="6">
                                                <v-text-field :rules="reglaSKU" v-model="editedItem.sku" label="SKU"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="editedItem.estado" label="Estado"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="editedItem.precioVenta" label="Precio de Venta"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="editedItem.idProveedor" label="ID Proveedor"></v-text-field>
                                            </v-col>

                                            <v-col cols="12" sm="12" md="12">
                                                <v-textarea v-model="editedItem.descripción" label="Descripción"></v-textarea>
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

                    <!--Dialog eliminar Repuesto-->
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
        
        filtros:[{
            categoría: "",
            sub:"",
            marca:"",
            nroLote:"",
            sku:"",
            estado:"",
            precioVenta:"",
            idProveedor:"",
        }],

        repuestosFiltrados:[],

        headers: [{
                text: 'Categoría',
                value: 'categoría',
                align: 'start',
                sortable: false,
            },
            {
                text: 'Subcategoría',
                value: 'sub'
            },
            {
                text: 'Marca',
                value: 'marca'
            },
            {
                text: 'N° de Lote',
                value: 'nroLote'
            },
            {
                text: 'SKU',
                value: 'sku'
            },

            {
                text: 'Estado',
                value: 'estado'
            },
            {
                text: 'Precio de Venta',
                value: 'precioVenta'
            },
            {
                text: 'ID Proveedor',
                value: 'idProveedor'
            },
        ],

        repuestos: [],

        reglaSKU: [
            value => !!value || 'Requerido.',
            value => (value || '').length <= 35 || 'Máximo 35 caracteres',
            value => {
                const pattern = /^[0-9 A-Z]{1}[0-9 A-Z -]{9,34}$/
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
            nroLote: '',
            descripción: '',
            sku: '',
            estado: '',
            precioVenta: '',
            idProveedor: '',
        },
        defaultItem: {
            categoría: '',
            nombre: '',
            codigo: '',
            sub: '',
            marca: '',
            nroLote: '',
            descripción: '',
            sku: '',
            estado: '',
            precioVenta: '',
            idProveedor: '',
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
                    sub: 'Sub B',
                    marca: 'Marca Aa',
                    descripción: 'Este producto ....',
                    nroLote: '29182920',
                    sku: 'ABC-123566',
                    estado: 'Disponible',
                    precioVenta: '600',
                    idProveedor: '233',
                },
                {
                    categoría: 'Categoría Bb',
                    nombre: 'Radiador',
                    codigo: '24-42431232-2',
                    sub: 'Sub A',
                    marca: 'Marca Aa',
                    descripción: 'El Radiador ... posee ..',
                    nroLote: '29182920',
                    sku: 'ABC-123566',
                    estado: 'Disponible',
                    precioVenta: '600',
                    idProveedor: '233',
                },
                {
                    categoría: 'Categoría Cc',
                    nombre: 'Radiador',
                    codigo: '27-42433311-3',
                    sub: 'Sub A',
                    marca: 'Marca Aa',
                    descripción: 'Descripción Detallada sasakjfdklsjfksdjfksljdflskjdf',
                    nroLote: '29182920',
                    sku: 'ABC-123566',
                    estado: 'Disponible',
                    precioVenta: '600',
                    idProveedor: '233',
                },
            ]
            this.repuestosFiltrados = this.repuestos
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
        aplicarFiltros(){
            let categoría = this.filtros.categoría != null & this.filtros.categoría != ""
            let sub = this.filtros.sub != null & this.filtros.sub !=""
            let marca = this.filtros.marca != null & this.filtros.marca != ""
            let sku = this.filtros.sku != null & this.filtros.sku != ""
            let estado = this.filtros.estado != null & this.filtros.estado != ""
            let precioVenta = this.filtros.precioVenta != null & this.filtros.precioVenta != ""
            let idProveedor = this.filtros.idProveedor != null & this.filtros.idProveedor != ""
        
            if(!categoría & !sub & !marca & !sku & !estado & !precioVenta & !idProveedor){
                return
            }
            let coincideCategoría = true
            let coincideSub = true
            let coincideMarca = true
            let coincideSku = true
            let coincideEstado = true
            let coincidePrecioVenta = true
            let coincideIdProveedor = true

            let repAux = []
            let cant = 0

            for(var i=0; i<this.repuestos.length;i++){
            
                    coincideCategoría = categoría ? this.repuestos[i].categoría === this.filtros.categoría: coincideCategoría
                    coincideSub = sub ? this.repuestos[i].sub === this.filtros.sub : coincideSub
                    coincideMarca = marca ? this.repuestos[i].marca === this.filtros.marca : coincideMarca
                    coincideSku = sku ? this.repuestos[i].sku === this.filtros.sku : coincideSku
                    coincidePrecioVenta = precioVenta ? this.repuestos[i].precioVenta === this.filtros.precioVenta : coincidePrecioVenta
                    coincideIdProveedor = idProveedor ? this.repuestos[i].idProveedor === this.filtros.idProveedor : coincideIdProveedor
                    coincideEstado = estado ? this.repuestos[i].estado === this.filtros.estado : coincideEstado
             
                if(coincideCategoría & coincideSub & coincideMarca & coincideSku & coincideEstado & coincidePrecioVenta & coincideIdProveedor){
                    repAux[cant] = this.repuestos[i]
                    cant++
                }
            }
        this.repuestosFiltrados = repAux
        
        },

        reiniciarFiltros(){
                this.filtros=[{
            categoría: "",
            sub:"",
            marca:"",
            nroLote:"",
            sku:"",
            estado:"",
            precioVenta:"",
            idProveedor:"",
            }]
            this.repuestosFiltrados = this.repuestos
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

.mb-3 {
    margin-left: 5%;
}

h3 {
    padding-top: 1%;
}
</style>

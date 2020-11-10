<template>
<v-img 
 src="../assets/Sun-Tornado.svg"
 gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)"
 class="bkg-img"
 >
<v-container>
    <h1 class="titulo">VEHÍCULOS</h1>
    
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
                                    <v-text-field v-model="filtros.Brand" label="Marca"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                    <v-text-field v-model="filtros.Model" label="Modelo"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="3">
                                    <v-text-field v-model="filtros.Category" label="Categoria"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field v-model="filtros.Fuel" label="Combustible"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field v-model="filtros.Type" label="Tipo"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field v-model="filtros.transmission" label="Transmision"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field v-model="filtros.origin"  label="Origen"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-select v-model="filtros.year" :items="años" label="Año"></v-select>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-select v-model="filtros.Dealer" :items="dealersList" item-text="Email" item-value="_id" label="Proveedor" required></v-select>
                                </v-col>
                                <v-col cols="12" sm="4" md="3">
                                    <v-text-field v-model="filtros.SuggestedPrice" prefix="$" label="Precio Sugerido"></v-text-field>
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
    <v-data-table v-model="selected" show-select :headers="headers" :items="vehículosFiltrados" :search="search" item-key="_id" sort-by="Brand" class="elevation-1">
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
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="editedItem.Brand" label="Marca"></v-text-field>
                                        </v-col>

                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="editedItem.Model" label="Modelo"></v-text-field>
                                        </v-col>

                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.Category" label="Categoria"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.Type" label="Tipo"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.Fuel" label="Combustible"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.transmission" label="Transmision"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.origin" label="Origen"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-select v-model="editedItem.year" :items="años" item-text="year" item-value="year" label="Año" required></v-select>
                                        </v-col>
                                         <v-col cols="12" sm="6" md="6">
                                            <v-select v-model="editedItem.Dealer" :items="dealersList" item-text="Email" item-value="_id" label="Proveedor" required></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="editedItem.SuggestedPrice" prefix="$" label="Precio Sugerido"></v-text-field>
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
                                            <v-text-field v-model="editedItem.SuggestedPrice" prefix="$" label="Precio"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-select v-model="editedItem.Dealer" :items="dealersList" item-text="Email" item-value="_id" label="Proveedor" required></v-select>
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
                text: 'Combustible',
                value: 'Fuel'
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
                text: 'Proveedor',
                value: 'Dealer.Email'
            },
            {
                text: 'Precio Sugerido',
                value: 'SuggestedPrice'
            },

        ],
        vehículos: [],
        allvehiculos: [],
        vehículosFiltrados: [],
        años:["2020","2019","2018","2017","2016","2015","2014","2013","2012","2011","2010","2009","2008","2007","2006"],
        statusList: ["Activo", "Inactivo"],
        dealersList: [],

        filtros:[{
            Brand: '',
            Model: '',
            Category: '',
            Fuel: '',
            Type: '',
            transmission: '',
            origin: '',
            year: '',
            Dealer: '',
            SuggestedPrice: 0,
        }],

        editedIndex: -1,
        attrs: '',
        on: '',
        editedItem: {
            Brand: '',
            Model: '',
            Category: '',
            Fuel: '',
            Type: '',
            transmission: '',
            origin: '',
            year: '',
            Dealer: '',
            SuggestedPrice: 0,
            Status: '',
            
        },
        defaultItem: {
            Brand: '',
            Model: '',
            Category: '',
            Fuel: '',
            Type: '',
            transmission: '',
            origin: '',
            year: '',
            Dealer: '',
            SuggestedPrice: 0,
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

        this.getVehicles()

        

        axios.get('http://localhost:8081/dealer')
            .then(res => {
                this.dealersList = res.data.dealer;
        })
        
    },

    methods: {
        getVehicles(){
        this.vehículos=[]
            axios.get('http://localhost:8081/vehicle')
            .then(res => {
                this.allvehiculos = res.data.vehicle;
                this.allvehiculos.forEach(vehiculo => {
                    if(vehiculo.Status === "ACTIVE"){
                        this.vehículos.push(vehiculo);
                    } 
                })
        })
        this.vehículosFiltrados = this.vehículos;
        console.log(this.vehículos)
        },

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
                this.vehículos.splice(this.vehículos.indexOf(item), 1)
                this.deleteVehicle(item)
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
            let Brand = this.filtros.Brand != null & this.filtros.Brand != ""
            let Model = this.filtros.Model != null & this.filtros.Model !=""
            let Category = this.filtros.Category != null & this.filtros.Category != ""
            let Fuel = this.filtros.Fuel != null & this.filtros.Fuel != ""
            let Type = this.filtros.Type != null & this.filtros.Type != ""
            let transmission = this.filtros.transmission != null & this.filtros.transmission != ""
            let origin = this.filtros.origin != null & this.filtros.origin != ""
            let year = this.filtros.year != null & this.filtros.year != ""
            let SuggestedPrice = this.filtros.SuggestedPrice != null & this.filtros.SuggestedPrice != ""
        
            if(!Brand & !Model & !Category & !Fuel & !Type & !transmission & !origin & !year & !SuggestedPrice){
                return
            }
            let BrandMatches = true
            let ModelMatches = true
            let CategoryMatches = true
            let FuelMatches = true
            let TypeMatches = true
            let transmissionMatches = true
            let originMatches = true
            let yearMatches = true
            let SuggestedPriceMatches = true

            let repAux = []
            let cant = 0

            for(var i=0; i<this.vehículos.length;i++){
            
                    BrandMatches = Brand ? this.vehículos[i].Brand === this.filtros.Brand: BrandMatches
                    ModelMatches = Model ? this.vehículos[i].Model === this.filtros.Model : ModelMatches
                    CategoryMatches = Category ? this.vehículos[i].Category === this.filtros.Category : CategoryMatches
                    FuelMatches = Fuel ? this.vehículos[i].Fuel === this.filtros.Fuel : FuelMatches
                    TypeMatches = Type ? this.vehículos[i].Type === this.filtros.Type : TypeMatches
                    transmissionMatches = transmission ? this.vehículos[i].transmission === this.filtros.transmission : transmissionMatches
                    originMatches = origin ? this.vehículos[i].origin === this.filtros.origin : originMatches
                    yearMatches = year ? this.vehículos[i].year == this.filtros.year : yearMatches
                    SuggestedPriceMatches = SuggestedPrice ? this.vehículos[i].SuggestedPrice == this.filtros.SuggestedPrice : SuggestedPriceMatches
             
                if(BrandMatches & ModelMatches & CategoryMatches & FuelMatches & TypeMatches & transmissionMatches & originMatches & yearMatches & SuggestedPriceMatches){
                    repAux[cant] = this.vehículos[i]
                    cant++
                }
            }
        this.vehículosFiltrados = repAux
        
        },

        reiniciarFiltros(){
                this.filtros=[{
            Brand: '',
            Model: '',
            Category: '',
            Fuel: '',
            Type: '',
            transmission: '',
            origin: '',
            year: '',
            Dealer: '',
            SuggestedPrice: 0,
            }]
            this.vehículosFiltrados = this.vehículos
        },
        
        
        deleteVehicle(item){
            axios.delete('http://localhost:8081/vehicle/'+ item._id +'/delete')
        },

        updateVehicle(){
            axios.post('http://localhost:8081/vehicle/' + this.selected[0]._id + '/update',{
                "vehicle":{
                    "Brand": this.editedItem.Brand,
                    "Model": this.editedItem.Model,
                    "Type": this.editedItem.Type,
                    "Category": this.editedItem.Category,
                    "Fuel": this.editedItem.Fuel,
                    "transmission": this.editedItem.transmission,
                    "origin": this.editedItem.origin,
                    "year": this.editedItem.year,
                    "Dealer": this.editedItem.Dealer,
                    "SuggestedPrice": this.editedItem.SuggestedPrice,
                    "Status": "ACTIVE",
                }
            })
        },

        async updateManyVehicles(){
             await this.selected.forEach(vehicle => {
                axios.post('http://localhost:8081/vehicle/' + vehicle._id + '/update',{
                "vehicle":{
                    "Brand": vehicle.Brand,
                    "Model": vehicle.Model,
                    "Type": vehicle.Type,
                    "Category": vehicle.Category,
                    "Fuel": vehicle.Fuel,
                    "transmission": vehicle.transmission,
                    "origin": vehicle.origin,
                    "year": vehicle.year,
                    "Dealer": this.editedItem.Dealer,
                    "SuggestedPrice": this.editedItem.SuggestedPrice,
                    "Status": "ACTIVE",
                }
            })
            })
            this.getVehicles()
        },

        createVehicle(){
            axios.post('http://localhost:8081/vehicle/add',{
                "vehicle":{
                    "Brand": this.editedItem.Brand,
                    "Model": this.editedItem.Model,
                    "Type": this.editedItem.Type,
                    "Category": this.editedItem.Category,
                    "Fuel": this.editedItem.Fuel,
                    "transmission": this.editedItem.transmission,
                    "origin": this.editedItem.origin,
                    "year": this.editedItem.year,
                    "Dealer": this.editedItem.Dealer,
                    "SuggestedPrice": this.editedItem.SuggestedPrice,
                }
            })
        },

        save() {
            if (this.editedIndex > -1) {
                    Object.assign(this.vehículos[this.editedIndex], this.editedItem)
                    this.updateVehicle();
            } else {
                if(this.selected.length > 1){
                    this.updateManyVehicles()
                }
                else{
                this.vehículos.push(this.editedItem)
                this.createVehicle()
                }
                
            }
            this.close()
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

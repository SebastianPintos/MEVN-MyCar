<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>
        <v-data-table v-model="selected" :single-select="true" show-select :headers="headers" :items="vehicleStock" :search="search" item-key="_id" sort-by="Brand" class="elevation-1">
            <template v-slot:item.Domain="{ item }">
                {{ formatString(item.Domain,'N/A')}}
            </template>
            <template v-slot:item.PurchasedPrice="{ item }">
                {{ formatPrice(item.PurchasedPrice) }}
            </template>
            <template v-slot:item.Detail="{ item }">
                {{ formatString(item.Detail,'-') }}
            </template>
            <template v-slot:item.Status="{ item }">
                {{ formatStatus(item.Status)}}
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details single-select></v-text-field>
                    <v-divider class="mx-4" dark vertical></v-divider>
                    <v-spacer></v-spacer>

                    <div v-if="validateUsers('Administrativo')">
                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on" @click="editar">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>

                        <v-btn color="error" dark class="mb-2" v-bind="attrs" v-on="on" @click="corroborarSeleccionado">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>

                        <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on" @click="dialogNuevo=true; nuevo=true; titulo='Nuevo Vehículo'">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
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

        <v-dialog v-model="dialogNuevo" max-width="900px">
            <v-card>
                <v-card-title>{{titulo}}</v-card-title>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-card-text>
                        <v-select :items="kind" label="Nuevo/Usado" :rules="requerido" v-model="editedItem.Kind"></v-select>
                        <v-select :items="estados" label="Estado" :rules="requerido" v-model="editedItem.Status"></v-select>
                        <v-text-field label="Dominio" v-model="editedItem.Domain" :rules="reglaDominio"></v-text-field>
                        <v-select :items="sucursales" item-text="Name" item-value="_id" label="Sucursal" :rules="requerido" v-model="editedItem.BranchOffice"></v-select>
                        <v-select :items="vehiculos" item-text="Brand" item-value="_id" label="Vehículo" :rules="requerido" v-model="editedItem.Vehicle">
                            <template slot="item" slot-scope="data">
                                Marca: {{ data.item.Brand }},Modelo :{{ data.item.Model }},Año :{{ data.item.year }},
                                Estado: {{data.item.Kind}}, Tipo: {{data.item.Type}} Transmisión: {{data.item.transmission}}, Combustible: {{data.item.Fuel}}
                            </template>
                        </v-select>
                        <v-text-field type="number" label="Precio" prefix="$" v-model="editedItem.PurchasedPrice" :rules="reglaPrecio"></v-text-field>

                        <v-textarea label="Detalle" v-model="editedItem.Detail"></v-textarea>

                        <v-text-field type="number" label="N° de Chasis" v-model="editedItem.ChasisNum" :rules="reglaNumero"></v-text-field>
                        <v-text-field type="number" label="N° de Motor" v-model="editedItem.EngineNum" :rules="reglaNumero"></v-text-field>
                        <v-select :items="colores" label="Color" :rules="requerido" v-model="editedItem.Color"></v-select>
                        <v-textarea v-if="editedItem.Kind=='USADO'" label="Detalle Usado" v-model="editedItem.UsedDetail.Detail"></v-textarea>
                        <v-text-field v-if="editedItem.Kind=='USADO'" suffix="%" type="number" label="Porcentaje a Modificar" v-model="editedItem.UsedDetail.PriceModifier" :rules="reglaPrecioNoRequerido"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-flex class="text-right">
                            <v-btn class="mb-2 info" @click="reset">
                                <v-icon>mdi-cancel</v-icon>
                            </v-btn>
                            <v-btn class="mb-2 info" @click="guardar">
                                <v-icon>mdi-check</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px" persistent>
            <v-card>
                <v-card-title class="headline">¿Estás seguro de que deseas eliminarlo?</v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="info" text @click="dialogDelete=false;selected=[]">
                        <v-icon>mdi-cancel</v-icon>
                    </v-btn>
                    <v-btn class="info" text @click="eliminar">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</v-img>
</template>

<script>
import axios from "axios"
import urlAPI from "../config/config.js"
export default {
    data: () => ({
        dialogMensaje: false,
        mensaje: '',
        colores: ["Amarillo", "Azul", "Blanco", "Celeste", "Gris", "Rojo", "Negro", "Verde"],
        nuevo: false,
        valid: true,
        dialogNuevo: false,
        snackbar: false,
        dialogConfirm: false,
        titulo: '',
        menu: false,
        selected: [],
        kind: ["NUEVO", "USADO"],
        estados: ["Disponible", "No Disponible", "Vendido", "Reservado"],
        date: null,
        dialogDelete: false,
        vehicleStock: [],
        vehiculos: [],
        search: '',
        requerido: [
            value => !!value || 'Requerido.',
        ],

        editedItem: {
            ChasisNum: "",
            EngineNum: "",
            Domain: "",
            Color: "",
            PurchasedPrice: 0,
            Detail: "",
            Vehicle: "",
            UsedDetail: {
                Detail: "",
                PriceModifier: 0
            },
            BranchOffice: "",
            Status: "",
            Kind: "",
        },
        defaultItem: {
            ChasisNum: "",
            EngineNum: "",
            Domain: "",
            Color: "",
            PurchasedPrice: 0,
            Detail: "",
            Vehicle: "",
            UsedDetail: {
                Detail: "",
                PriceModifier: 0
            },
            BranchOffice: "",
            Status: "",
            Kind: "",
        },
        reglaNumero: [
            value => {
                const pattern = /^[0-9]{1,}$/
                return pattern.test(value) || 'Sólo se permiten números!'
            },
        ],
        reglaPrecio: [
            value => !!value || 'Requerido.',
            value => {
                const pattern = /^[-]{0,1}[0-9]{1,}(.[0-9]{1,}){0,1}$/
                return pattern.test(value) || 'Sólo se permiten números!'
            },
        ],
        reglaPrecioNoRequerido: [
            value => {
                const pattern = /^[-]{0,1}[0-9]{1,}(.[0-9]{1,}){0,1}$/
                return pattern.test(value) || value.length == 0 || 'Sólo se permiten números!'
            },
        ],

        reglaDominio: [
            value => {
                const pattern = /^(([A-Z]{2}[0-9]{3}[A-Z]{2}){0,1}([A-Z]{3}[0-9]{3}){0,1}){1}$/
                return pattern.test(value) || value.length == 0 || 'Dominio inválido'
            },
        ],
        headers: [{
                text: 'N° de Chasis:',
                value: 'ChasisNum',
                align: 'start',
            },
            {
                text: 'N° de Motor',
                value: 'EngineNum',
            },
            {
                text: 'Dominio',
                value: 'Domain',
            },
            {
                text: 'Color',
                value: 'Color',
            },
            {
                text: 'Precio',
                value: 'PurchasedPrice'
            },

            {
                text: 'Detalle',
                value: 'Detail',
            },
            {
                text: 'Detalle Usado',
                value: 'UsedDetail.Detail'
            },
            {
                text: 'Modificación Precio Usado',
                value: 'UsedDetail.PriceModifier'
            },
            {
                text: 'Marca',
                value: 'Vehicle.Brand',
            },
            {
                text: 'Modelo',
                value: 'Vehicle.Model',
            },
            {
                text: 'Año',
                value: 'Vehicle.year',
            },
            {
                text: 'Combustible',
                value: 'Vehicle.Fuel',
            },
            {
                text: 'Transmisión',
                value: 'Vehicle.transmission',
            }, ,
            {
                text: 'Tipo',
                value: 'Vehicle.Type',
            },
            {
                text: 'Origen',
                value: 'Vehicle.origin',
            },
            {
                text: 'NUEVO/USADO',
                value: 'Kind',
            },
            {
                text: 'Estado',
                value: 'Status',
            }

        ],
        repuestos: [],
        sucursales: [],
        editedIndex: -1,
        attrs: '',
        on: '',
        branchOffice: null,

    }),

    created() {
        let employee = localStorage.getItem("employee");
        employee = JSON.parse(employee);
        this.branchOffice = employee != null & employee.BranchOffice != null ? employee.BranchOffice : "";
        this.getVehicleStock(this.branchOffice);
        this.getVehiculos();
        this.getSucursales();
    },

    methods: {
        validateUsers(...authorizedUsers) {
            if (localStorage.getItem('userType') != null) {
                return (authorizedUsers.includes(localStorage.getItem('userType'))) ? true : false
            }
            return false;
        },
        save() {
            this.$refs.menu.save(this.editedItem.Expiration)
        },
        formatString(value, string) {
            if (value == null) {
                return string;
            }
            return String(value);
        },
        formatStatus(value) {
            if (value == "AVAILABLE") {
                return "Disponible";
            }
            if (value == "NOT AVAILABLE") {
                return "No Disponible";
            }
            if (value == "SOLD") {
                return "Vendido";
            }
            if (value == "RESERVED") {
                return "Reservado";
            }
            return String(value);
        },
        formatPrice(value) {
            return value == null ? "$0" : "$" + value;
        },

        async getVehicleStock(branchOffice) {
            await axios.get(urlAPI + 'vehicleStock')
                .then(res => {
                    this.vehicleStock = res.data.vehicle;
                    if (branchOffice != "") {
                        this.vehicleStock = this.vehicleStock.filter(v => v.BranchOffice._id == branchOffice);
                    }
                })
        },

        async getSucursales() {
            await axios.get(urlAPI + 'branchOffice')
                .then(res => {
                    let sucursales = res.data.branchOffice;
                    if (sucursales != null) {
                        sucursales.forEach(s => {
                            if (s.Status === "ACTIVE") {
                                this.sucursales.push(s);
                            }
                        })
                    }
                })
        },
        async getVehiculos() {
            await axios.get(urlAPI + 'vehicle')
                .then(res => {
                    let vehicles = res.data.vehicle;
                    if (vehicles != null) {
                        vehicles.forEach(r => {
                            if (r.Status === "ACTIVE") {
                                this.vehiculos.push(r);
                            }
                        })
                    }
                })
        },

        guardar() {
            if (this.validate()) {
                this.obtenerEstadoIng();
                let auxVehiculo = {
                    "vehicleStock": {
                        "ChasisNum": this.editedItem.ChasisNum,
                        "EngineNum": this.editedItem.EngineNum,
                        "Domain": this.editedItem.Domain,
                        "Color": this.editedItem.Color,
                        "PurchasedPrice": this.editedItem.PurchasedPrice,
                        "Detail": this.editedItem.Detail,
                        "Vehicle": this.editedItem.Vehicle,
                        "UsedDetail": {
                            "Detail": this.editedItem.UsedDetail.Detail,
                            "PriceModifier": this.editedItem.UsedDetail.PriceModifier
                        },
                        "BranchOffice": this.editedItem.BranchOffice,
                        "Status": this.editedItem.Status,
                        "Kind": this.editedItem.Kind,
                    }
                };

                if (this.nuevo == true) {
                    axios.post(urlAPI + "vehicleStock/add", auxVehiculo).then(res => {
                        if (res != null) {
                            this.reset();
                        }
                    })

                } else {
                    axios.post(urlAPI + "vehicleStock/" + this.selected[0]._id + "/update", auxVehiculo).then(res => {
                        if (res != null) {
                            this.reset();
                        }
                    })
                }
            }
        },

        reset() {
            if (this.dialogNuevo) {
                this.$refs.form.resetValidation();
            }
            this.editedItem = this.defaultItem;
            this.vehicleStock = [];
            this.selected = [];
            this.getVehicleStock(this.branchOffice == null ? "" : this.branchOffice);
            this.nuevo = false;
            this.dialogNuevo = false;
        },

        eliminar() {
            axios.delete(urlAPI + "vehicleStock/" + this.selected[0]._id + "/delete").then(res => {
                if (res != null) {
                    this.vehicleStock.splice(this.vehicleStock.indexOf(this.selected[0]), 1)
                    this.selected = [];
                    this.dialogDelete = false;
                }
            })
        },

        corroborarSeleccionado() {
            if (this.selected.length != 1) {
                this.mensaje = "No ha seleccionado ningún elemento!";
                this.snackbar = true;
                return;
            }
            this.dialogDelete = true;
        },

        obtenerEstadoEsp() {
            if (this.editedItem.Status == "AVAILABLE") {
                this.editedItem.Status = "Disponible";
            } else if (this.editedItem.Status == "NOT AVAILABLE") {
                this.editedItem.Status = "No Disponible";
            } else if (this.editedItem.Status == "SOLD") {
                this.editedItem.Status = "Vendido";
            } else {
                this.editedItem.Status = "Reservado";
            }
        },

        obtenerEstadoIng() {
            if (this.editedItem.Status == "Disponible") {
                this.editedItem.Status = "AVAILABLE";
            } else if (this.editedItem.Status == "No Disponible") {
                this.editedItem.Status = "NOT AVAILABLE";
            } else if (this.editedItem.Status == "Vendido") {
                this.editedItem.Status = "SOLD";
            } else {
                this.editedItem.Status = "RESERVED";
            }
        },

        editar() {
            if (this.selected.length != 1) {
                this.mensaje = "No ha seleccionado ningún elemento!";
                this.snackbar = true;
                return;
            }
            this.editedItem.ChasisNum = this.selected[0].ChasisNum;
            this.editedItem.EngineNum = this.selected[0].EngineNum;
            this.editedItem.Reserved = this.selected[0].Reserved;
            this.editedItem.Domain = this.selected[0].Domain;
            this.editedItem.Color = this.selected[0].Color;
            this.editedItem.PurchasedPrice = this.selected[0].PurchasedPrice;
            this.editedItem.UsedDetail.Detail = this.selected[0].UsedDetail.Detail;
            this.editedItem.UsedDetail.PriceModifier = this.selected[0].UsedDetail.PriceModifier;
            this.editedItem.BranchOffice = this.selected[0].BranchOffice;
            this.editedItem.Status = this.selected[0].Status;
            this.obtenerEstadoEsp();
            this.editedItem.Detail = this.selected[0].Detail;
            this.editedItem.Kind = this.selected[0].Kind;
            this.editedItem.Vehicle = this.selected[0].Vehicle;
            this.titulo = "Editar Vehículo";
            this.dialogNuevo = true;
        },

        validate() {
            if (this.editedItem.Kind == "USADO") {
                try {
                    parseFloat(this.editedItem.UsedDetail.PriceModifier);
                } catch (e) {
                    if (e != null) {
                        return false;
                    }
                }
            }
            return this.$refs.form.validate();
        },
    },

};
</script>

<style>
.mb-2 {
    margin-left: 3px;
    margin-right: 3px;
}

.btnMasMenos {
    margin: -10%;
}

.izq {
    align: left;
    margin-left: -90%;
}
</style>

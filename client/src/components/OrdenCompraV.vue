<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>

        <v-data-table v-model="selected" :single-select="true" show-select :headers="headers" :items="ordenes" :search="search" item-key="_id" sort-by="OrderDate" class="elevation-1">
            <template v-slot:item.OrderDate="{ item }">
                {{ formatDate(item.OrderDate) }}
            </template>
            <template v-slot:item.ArrivalDate="{ item }">
                {{ formatDate(item.ArrivalDate) }}
            </template>
            <template v-slot:item.Price="{ item }">
                {{ formatPrice(item.Price) }}
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details></v-text-field>
                    <v-divider class="mx-4" dark vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="warning" dark class="mb-2" v-bind="attrs" v-on="on" @click="dialogStock=true">
                        <v-icon @click="dialogStock=true">mdi-paperclip</v-icon>
                    </v-btn>
                    <v-btn color="success" dark class="mb-2" v-bind="attrs" v-on="on" @click="validarCorroboracionStock">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                </v-toolbar>
            </template>
        </v-data-table>

        <v-dialog v-model="dialogStock" persistent max-width="600px">

            <v-card>
                <v-card-title>Agregar Nuevo Stock:</v-card-title>
                <br>
                <v-form ref="formStock" v-model="valid" lazy-validation>
                    <v-card-text>

                        <v-select :items="proveedores" v-model="proveedor" item-text="Email" item-value="_id" :rules="requerido">
                            <template slot="item" slot-scope="data">
                                {{ data.item.Name }} - {{ data.item.Email }}
                            </template>
                        </v-select>
                        <v-file-input accept=".csv" label="Haga click aquí para elegir un archivo .csv" v-model="chosenFile" :rules="requerido">
                        </v-file-input>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="info" right @click="dialogStock=false">
                            <v-icon>mdi-cancel</v-icon>
                        </v-btn>
                        <v-btn class="info" right @click="readFile">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>

        <v-dialog v-if="dialogConfirm" v-model="dialogConfirm" max-width="500px" persistent>
            <v-card>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-card-title class="headline text-center"> Confirmar llegada </v-card-title>
                    <v-card-text v-if="selected.length>0">

                        <ol>
                            <ul>
                                <li v-for="(vehiculo, r) in selected[0].Vehicle" :key="r">

                                    <v-text-field disabled :value="'Marca: '+vehiculo.VehicleID.Brand"></v-text-field>
                                    <v-text-field disabled :value="' Modelo: '+vehiculo.VehicleID.Model"></v-text-field>
                                    <v-text-field disabled :value="'Año: '+vehiculo.VehicleID.year"></v-text-field>
                                     <v-text-field disabled :value="'Color: '+vehiculo.Color"></v-text-field>
                                    <v-text-field disabled :value="'N° de Chasis: '+vehiculo.ChasisNum"></v-text-field>
                                    <v-text-field disabled :value="'N° de Motor: '+vehiculo.EngineNum"></v-text-field>
                                   
                                    <v-row>
                                        <v-radio-group mandatory class="text-align: left" v-model="recibidos[r]" row :rules="requerido">
                                            <h3>Recibido: </h3>
                                            <v-radio class="mb-1" label="Sí" value="true"></v-radio>
                                            <v-radio class="mb-1" label="No" value="false"></v-radio>
                                        </v-radio-group>
                                    </v-row>

                                </li>
                            </ul>
                        </ol>

                    </v-card-text>

                    <v-card-actions>
                        <v-flex class="text-right">
                            <v-btn class="info mb-2" text @click="dialogConfirm=false">
                                <v-icon>mdi-cancel</v-icon>
                            </v-btn>
                            <v-btn class="info mb-2" text @click="guardarLlegada">
                                <v-icon>mdi-check</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogMensaje" max-width="600px">
            <v-card>
                <v-card-text>
                    <br>
                    <span v-html="titulo"></span>
                    <span v-html="mensaje"></span>
                </v-card-text>
                <v-card-actions>
                    <v-flex class="text-right">
                        <v-btn class="info" @click="dialogMensaje=false; mensaje='';titulo='' ">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar">
            {{ mensaje }}

            <template v-slot:action="{ attrs }">
                <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
                    Aceptar
                </v-btn>
            </template>
        </v-snackbar>

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
        titulo: '',
        dialogStock: false,
        valid: true,
        dialogConfirm: false,
        snackbar: false,
        selected: [],
        proveedores: [],
        proveedor: null,
        vehiclesStock: [],
        vehicles:[],
        max: [],
        ordenes: [],
        search: '',
        recibidos: [],
        reglaNumero: [
            value => {
                const pattern = /^[0-9]{1,}$/
                return pattern.test(value) || 'Sólo se permiten números!'
            },
        ],
        requerido: [
            value => !!value || 'Requerido.',
        ],

        headers: [{
                text: 'Proveedor',
                value: 'Dealer.Email',
                align: 'start',
            },
            {
                text: 'Fecha de Orden',
                value: 'OrderDate'
            },
            {
                text: 'Fecha de Llegada',
                value: 'ArrivalDate'
            },

            {
                text: 'Precio',
                value: 'Price',
            },
        ],

        editedIndex: -1,
        attrs: '',
        on: '',

        files: [],
        data: null,
        chosenFile: null,
    }),

    created() {
        this.getOrdenes();
        this.getVehicleStock();
        this.getVehicles();
        this.getProveedores();
    },

    methods: {

        async getVehicleStock() {
            await axios.get(urlAPI + 'vehicleStock')
                .then(res => {
                    let vehiclesStock = res.data.vehicleStock;
                    if (vehiclesStock != null) {
                        vehiclesStock.forEach(orden => {
                            if (orden.Status === "ACTIVE") {
                                this.vehiclesStock.push(orden);
                            }
                        })
                    }
                })
        },
        
        async getVehicles() {
            await axios.get(urlAPI + 'vehicle')
                .then(res => {
                    let vehicles = res.data.vehicle;
                    if (vehicles != null) {
                        vehicles.forEach(v => {
                            if (v.Status === "ACTIVE") {
                                this.vehicles.push(v);
                            }
                        })
                    }
                })
        },

        async getProveedores() {
            await axios.get(urlAPI + 'dealer')
                .then(res => {
                    let proveedores = res.data.dealer;
                    if (proveedores != null) {
                        proveedores.forEach(p => {
                            if (p.Status === "ACTIVE" & p.Kind == "VEHICLE") {
                                this.proveedores.push(p);
                            }
                        })
                    }
                })
        },

        async getOrdenes() {
            await axios.get(urlAPI + 'purchaseOrderV')
                .then(res => {
                    this.ordenes = [];
                    let ordenes = res.data.purchaseOrderV;
                    if (ordenes != null) {
                        ordenes.forEach(orden => {
                            if (orden.Status === "ACTIVE") {
                                this.ordenes.push(orden);
                            }
                        })
                    }
                })
        },

        formatPrice(value) {
            return value == null ? "$0" : "$" + value;
        },

        formatDate(value) {
            if (value == null) {
                return "Sin Definir";
            }
            value = String(value);
            value = value.slice(0, 10);
            return value;
        },

        validate() {
            return this.$refs.form.validate();
        },

        validarCorroboracionStock() {
            if (this.selected.length == 0) {
                this.mensaje = "No ha seleccionado ningún elemento!";
                this.snackbar = true;
                return;
            }
            if (this.selected[0].ArrivalDate != null) {
                this.mensaje = "Esta orden ya ha sido verificada!";
                this.snackbar = true;
                return;

            }

            for (let j = 0; j < this.selected[0].Vehicle.length; j++) {
                this.recibidos.push(true);
            }
            this.dialogConfirm = true
        },

        guardarLlegada() {
            for (let i = 0; i < this.selected[0].Vehicle.length; i++) {
                let status = this.recibidos[i] == "true" ? "AVAILABLE" : "NOT AVAILABLE";
                let vehiculoStock = {
                    "vehicleStock": {
                        "ChasisNum": this.selected[0].Vehicle[i].ChasisNum,
                        "EngineNum": this.selected[0].Vehicle[i].EngineNum,
                        "Status": status,
                        "Color": this.selected[0].Vehicle[i].Color,
                        "PurchasedPrice": this.selected[0].Vehicle[i].VehicleID.SuggestedPrice,
                        "Vehicle": this.selected[0].Vehicle[i].VehicleID._id,
                        "Dealer": this.selected[0].Dealer._id,
                        "BranchOffice": this.selected[0].BranchOffice._id,
                        "Kind": "NUEVO",
                    }
                };

                axios.post(urlAPI + 'vehicleStock/add', vehiculoStock);
                axios.post(urlAPI + 'purchaseOrderV/' + this.selected[0]._id + '/setArrival').then(res => {
                    if (res != null) {
                        this.getOrdenes();
                        this.titulo = "<h1 class='text-center'>Carga realizada con éxito</h1>";
                        this.mensaje = "<h3>Podrá ver los elementos cargados en la sección: Stock.</h3>";
                        this.dialogMensaje = true;
                    }
                });
            }
            this.selected = [];
            this.recibidos = [];
            this.dialogConfirm = false;
        },

        parseCSV(text) {
            // Obtenemos las lineas del texto
            let lines = text.replace(/\r/g, '').split('\n');
            return lines.map(line => {
                // Por cada linea obtenemos los valores
                let values = line.split(';');
                return values;
            });
        },

        reverseMatrix(matrix) {
            let output = [];
            // Por cada fila
            matrix.forEach((values, row) => {
                // Vemos los valores y su posicion
                values.forEach((value, col) => {
                    // Si la posición aún no fue creada
                    if (value != null) {
                        if (output[col] === undefined) output[col] = [];
                        output[col][row] = value;
                    }
                });
            });
            return output;
        },

        readFile() {
            if (this.$refs.formStock.validate()) {
                if (this.ordenes == null) {
                    this.dialogMensaje = true;
                    this.mensaje = "No existen ordenes para referenciar!";
                    return;
                }
                let file = this.chosenFile;
                let reader = new FileReader();
                reader.onload = (e) => {
                    // Cuando el archivo se terminó de cargar
                    let lines = this.parseCSV(e.target.result);
                    let output = this.reverseMatrix(lines);

                    if (this.corroborarValidez(output)) {
                        this.guardarOrden(output);
                    }
                };

                // Leemos el contenido del archivo seleccionado
                reader.readAsBinaryString(file);
            }
        },

        guardarOrden(output) {
            let orden = this.getJSONOrder(output);
            if (orden != null) {
                axios.post(urlAPI + 'purchaseOrderV/add', orden).then(res => {
                    if (res != null) {
                        this.ordenes = [];
                        this.getOrdenes();
                    }
                });
            }
            this.dialogStock = false;
        },
        getJSONOrder(output) {
            let precio = 0;
            let vehicle = [];

            for (let i = 1; i < output[1].length; i++) {
                let vehicleID = this.vehicles.filter(v => 
                    v.Brand == output[0][i] &
                    v.Model == output[1][i] &
                    v.Type == output[2][i] &
                    v.Category == output[3][i] &
                    v.Fuel == output[4][i] &
                    v.transmission == output[5][i] &
                    v.origin == output[6][i] &
                    v.year == output[7][i]);
                if (vehicleID != null & vehicleID.length > 0) {
                    let precioUnitario = Number(output[11][i]);
                    precio += precioUnitario;
                    vehicle.push({
                        "VehicleID": vehicleID[0],
                        "ChasisNum": output[8][i],
                        "Color": output[10][i],
                        "EngineNum": output[9][i],
                        "Price": precioUnitario,
                    })
                } else {
                    this.mensaje += "<h2> Vehículo no encontrado </h2>";
                    this.mensaje += "<h4> -Marca: " + output[0][i] + " </h4>";
                    this.mensaje += "<h4> -Modelo: " + output[1][i] + " </h4>";
                    this.mensaje += "<h4> -Año: " + output[7][i] + " </h4>";
                    this.mensaje += "<h4> -Tipo: " + output[2][i] + " </h4>";
                    this.mensaje += "<h4> -Categoría: " + output[3][i] + " </h4>";
                    this.mensaje += "<h4> -Comubistible: " + output[4][i] + " </h4>";
                    this.mensaje += "<h4> -Transmisión: " + output[5][i] + " </h4>";
                    this.mensaje += "<h4> -Origen: " + output[6][i] + " </h4>";
                }
            };
            if (this.mensaje != "") {
                this.titulo = "<h1 class='text-center'>Vehículo/s inexistente/s</h1><br>";
                this.dialogMensaje = true;
                return null;
            }
            return {
                "purchaseOrderV": {
                    "OrderDate": new Date(),
                    "Price": precio,
                    "Vehicle": vehicle,
                    "Dealer": this.proveedor,
                    "BranchOffice": "5fb3d83987565231fcd5a756",
                }
            }

        },
        corroborarValidez(output) {
            if (output.length != 12) {
                this.titulo = "<h1 class='text-center'>Formato de archivo Inválido</h1>";
                this.mensaje = "<h4>Columnas inválidas, debe contener exactamente 12 columnas</h4>";
                this.dialogMensaje = true;
                return false;
            }
            for (let i = 1; i < output[1].length; i++) {
                if (output[11][i] == null) {
                    this.titulo = "<h1>Formato de archivo Inválido</h1>";
                    this.mensaje = "<h4>El precio es obligatorio</h4>";
                    this.dialogMensaje = true;
                    return false;
                }
                try {
                    let precio = parseFloat(output[11][i]);
                    if (precio < 0) {
                        this.titulo = "<h1>Formato de archivo Inválido</h1>";
                        this.mensaje = "<h4>El precio no debe ser negativo!</h4>";
                        this.dialogMensaje = true;
                        return false;
                    }
                } catch (e) {
                    if (e != null) {
                        this.titulo = "<h1>Formato de archivo Inválido</h1>";
                        this.mensaje = "<h4>El precio debe ser un valor numérico!</h4>";
                        this.dialogMensaje = true;
                        return false;
                    }
                }
            }
            return true;
        }
    }

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

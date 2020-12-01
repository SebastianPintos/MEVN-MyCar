<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>

        <v-data-table v-model="selected" :single-select="true" show-select :headers="headers" :items="ordenes" :search="search" item-key="_id" sort-by="Brand" class="elevation-1">
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
                                    <v-text-field v-if="vehiculo.VehicleID.Kind!=null" disabled :value="'Nuevo/Usado: '+vehiculo.VehicleID.SubCategory"></v-text-field>

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

        <v-dialog v-model="dialogMensaje" max-width="400px">
            <v-card>
                <v-card-text>
                    <br>
                    <h2>{{mensaje}}</h2>
                </v-card-text>
                <v-card-actions>
                    <v-flex class="text-right">
                        <v-btn class="info" @click="dialogMensaje=false; mensaje='' ">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                    </v-flex>
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
        dialogStock: false,
        valid: true,
        dialogConfirm: false,
        selected: [],
        proveedores: [],
        proveedor: null,
        vehiclesStock: [],
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
                this.dialogMensaje = true;
                this.mensaje = "No ha seleccionado ningún elemento!";
                return;
            }
            if (this.selected[0].ArrivalDate != null) {
                this.dialogMensaje = true;
                this.mensaje = "Esta orden ya ha sido verificada!";
                return;

            }
            
            for (let j = 0; j < this.selected[0].Vehicle.length; j++) {
                this.recibidos.push(true);
            }
            /*
            ESTADOS DE UN VEHÍCULO: ACTIVE, INACTIVE
            ESTADOS DE UN VEHÍCULO STOCK: ['AVAILABLE', 'RESERVED', 'SOLD', 'NOT AVAILABLE']
              OrderDate: {type: Date},
  ArrivalDate: {type: Date},
  Price: {type: Number, required: true},
  Vehicle: [{
    ChasisNum: {type: String, required: true},
    EngineNum: {type: String, required: true},
    Domain: {type: String},
    Color: {type: String, required: true}, 
    Detail: {type: String},
    Kind: {type: String, enum: ['NUEVO', 'USADO'], required: true},
    VehicleID : {type: Schema.Types.ObjectId, required: true, ref: 'Vehicle'},
    Price: {type: Number, required: true},
    TotalOrdered: {type: Number, required: true},
  }],
  Dealer : {type: Schema.Types.ObjectId, required: true, ref: 'Dealer'},  
  BranchOffice: {type: Schema.Types.ObjectId,required: true,ref: 'BranchOffice'},
  Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},
  ------
  */

            this.dialogConfirm = true
        },

        guardarLlegada() {
/*ChasisNum: {type: String, required: true},
    EngineNum: {type: String, required: true},
    Domain: {type: String},
    Color: {type: String, required: true}, 
    PurchasedPrice: {type: Number, required: true},
    Detail: {type: String},
    Vehicle: {
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: 'Vehicle'
    },
    UsedDetail: [{
        Detail: {type: String},
        PriceModifier: {type: Number}
    }],
    BranchOffice: {type: Schema.Types.ObjectId,required: true,ref: 'BranchOffice'},
    Status: {type: String, enum: ['AVAILABLE', 'RESERVED', 'SOLD', 'NOT AVAILABLE'], required: true},
    Kind: {type: String, enum: ['NUEVO', 'USADO'], required: true},
    ChangeStatus: [{
      Motive: {type: String},
      EmployerID: {type: Schema.Types.ObjectId, required: true}
    },{timestamps: true}]
*/
            for (let i = 0; i < this.selected[0].Vehicle.length; i++) {
            let status = this.recibidos[i] =="true"? "AVAILABLE": "NOT AVAILABLE";
            console.log("STATUS: "+status)
            let vehiculoStock = {
                    "vehicleStock": {
                        "ChasisNum":this.selected[0].Vehicle[i].ChasisNum,
                        "EngineNum":this.selected[0].Vehicle[i].EngineNum,
                        "Status": status,
                        "Color": this.selected[0].Vehicle[i].Color,
                        "PurchasedPrice": this.selected[0].Vehicle[i].Price,
                        "Vehicle": this.selected[0].Vehicle[i],
                        "Dealer": this.selected[0].Dealer,
                        "BranchOffice": this.selected[0].BranchOffice,
                        "Kind":"NUEVO",
                    }
                };
                axios.post(urlAPI + 'vehicleStock/add', vehiculoStock);
            }
            axios.post(urlAPI + 'purchaseOrderV/' + this.selected[0]._id + '/setArrival').then(res => {
                if (res != null) {
                    this.ordenes = [];
                    this.getOrdenes();
                }
            });
            this.selected=[];
            this.recibidos=[];
            this.dialogConfirm = false;
        },

        async updateVehicle(productEdited) {
            await axios.post(urlAPI + 'productStock/' + this.selected[0]._id + '/update', productEdited);
            this.vehiclesStock = [];
            this.getVehicleStock();
        },

        comprobarMax(event, r, array, otroArray) {
            let nuevoValor = Number(String(array[r]) + String(event.key));
            let total = nuevoValor + Number(otroArray[r]);
            if (nuevoValor > Number(this.max[r]) || total > Number(this.max[r])) {
                event.preventDefault();
                return false;
            }

            return true;
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
            //LOTE SKU TOTAL PRECIO UNITARIO
            /*FORMATO ARCHIVO: 
              0-SKU: Vehicle.VehicleID.SKU
              1-LOTE: nLote
              2-VENCIMIENTO: Vehicle.Expiration,
              3-TOTAL: TotalOrdered,
              4-PRECIO: Price,*/
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
            /*OrderDate: {type: Date},
            ArrivalDate: {type: Date},
            Price: {type: Number, required: true},
            Vehicle: [{
            VehicleID : {type: Schema.Types.ObjectId, required: true, ref: 'Vehicle'},
            Expiration: {type: Date},
            TotalOrdered: {type: Number},
            Price: {type: Number, required: true}
            }],
            Dealer : {type: Schema.Types.ObjectId, required: true, ref: 'Dealer'},  
            BranchOffice: {type: Schema.Types.ObjectId,required: true,ref: 'BranchOffice'},
            Status: {type: String, enum: ['ACTIVE', 'INACTIVE'], required: true},*/
            let orden = this.getJSONOrder(output);
            axios.post(urlAPI + 'vehicleStock/add', orden).then(res => {
                if (res != null) {
                    this.vehiclesStock = [];
                    this.getVehicleStock();
                }
            });
            this.dialogStock = false;

        },
        getJSONOrder(output) {
            /* 0-SKU: Vehicle.VehicleID.SKU
              1-LOTE: nLote
              2-VENCIMIENTO: Vehicle.Expiration,
              3-TOTAL: TotalOrdered,
              4-PRECIO: Price,*/
            let precio = 0;
            let product = [];

            for (let i = 1; i < output[1].length; i++) {
                let productID = this.ordenes.filter(r => r.SKU == output[0][i]);
                if (productID != null & productID.length > 0) {
                    let expiration = new Date(output[2][i]) != null ? new Date(output[2][i]) : null;
                    let total = Number(output[3][i]);
                    let precioUnitario = Number(output[4][i]);
                    precio += precioUnitario * total;
                    product.push({
                        "VehicleID": productID[0],
                        "ChasisNum": output[1][i],
                        "Expiration": expiration,
                        "TotalOrdered": total,
                        "Price": precioUnitario,
                    })
                }
            };
            return {
                "vehicleStock": {
                    "OrderDate": new Date(),
                    "Price": precio,
                    "Vehicle": product,
                    "Dealer": this.proveedor,
                    "BranchOffice": "5fb3d83987565231fcd5a756",
                }
            }

        },
        corroborarValidez(output) {

            if (output.length != 5) {
                this.mensaje = "Columnas inválidas, debe contener:  SKU, N°de Lote, Vencimiento, Total y Precio";
                this.dialogMensaje = true;
                return false;
            }
            //FILA 0: SKU
            for (let i = 1; i < output[0].length; i++) {
                if (output[0][i] == null) {
                    this.mensaje = "El código SKU es obligatorio";
                    this.dialogMensaje = true;
                    return false;
                }
            }
            //FILA 3: TOTAL OBLIGATORIO
            for (let i = 1; i < output[3].length; i++) {
                const pattern = /^\d{1,}$/
                if (!pattern.test(output[3][i])) {
                    this.mensaje = "Total inválido, debe ser un valor numérico";
                    this.dialogMensaje = true;
                    return false;
                }
            }
            //FILA 4: PRECIO
            for (let i = 1; i < output[4].length; i++) {
                try {
                    if (parseFloat(output[4][i]) < 0) {
                        this.mensaje = "Total inválido, debe ser un número mayor a 0";
                        this.dialogMensaje = true;
                        return false;
                    }
                } catch (e) {
                    this.mensaje = "Total inválido, debe ser un número mayor a 0";
                    this.dialogMensaje = true;
                    return false;
                }
            }
            return true;
        }
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

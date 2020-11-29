<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>

        <v-data-table v-model="selected" :single-select="true" show-select :headers="headers" :items="repuestosStock" :search="search" item-key="_id" sort-by="Brand" class="elevation-1">
            <template v-slot:item.OrderDate="{ item }">
                {{ formatDate(item.OrderDate) }}
            </template>
            <template v-slot:item.ArrivalDate="{ item }">
                {{ formatDate(item.ArrivalDate) }}
            </template>
            <template v-slot:item.Expiration="{ item }">
                {{ formatVto(item.Expiration) }}
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

        <v-dialog v-model="dialogStock" persistent>
            <v-container fill-height>
                <v-row justify="center">
                    <v-col cols="auto">
                        <v-card width="600" height="300" raised>
                            <v-card-title>Agregar Nuevo Stock:</v-card-title>
                            <br>
                            <v-card-text>
                                <v-select :items="proveedores" v-model="proveedor" item-text="Email" item-value="_id">
                                    <template slot="item" slot-scope="data">
                                        {{ data.item.Name }} - {{ data.item.Email }}
                                    </template>
                                </v-select>

                                <v-file-input accept=".csv" label="Haga click aquí para elegir un archivo .csv" outlined v-model="chosenFile">
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
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-dialog>

        <v-dialog v-if="dialogConfirm" v-model="dialogConfirm" max-width="500px" persistent>
            <v-card>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-card-title class="headline"> <span class="headline">Total ordenados: {{selected[0].TotalOrdered}}</span> </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field v-model="defectuosos" :rules="reglaNumero" label="Recibidos defectuosos"></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="6">
                                <v-text-field v-model="noRecibidos" :rules="reglaNumero" label="No Recibidos"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="info" text @click="dialogConfirm=false">
                            <v-icon>mdi-cancel</v-icon>
                        </v-btn>
                        <v-btn class="info" text @click="guardarLlegada">
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                </v-form>
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
        snackbar: false,
        mensaje: '',
        dialogStock: false,
        valid: true,
        dialogConfirm: false,
        selected: [],
        proveedores: [],
        proveedor: null,
        repuestosStock: [],
        repuestos: [],
        search: '',
        defectuosos: 0,
        noRecibidos: 0,
        reglaNumero: [
            value => {
                const pattern = /^[0-9]{1,}$/
                return pattern.test(value) || 'Sólo se permiten números!'
            },
        ],

        headers: [{
                text: 'Código',
                value: 'Code',
                align: 'start',
            },
            {
                text: 'N° Lote',
                value: 'BatchNum'
            },
            {
                text: 'Vencimiento',
                value: 'Expiration'
            },

            {
                text: 'Fecha de Orden',
                value: 'OrderDate',
            },

            {
                text: 'Fecha de Llegada',
                value: 'ArrivalDate'
            },
            {
                text: 'Código del Producto',
                value: 'Product.Code'
            }
        ],

        editedIndex: -1,
        attrs: '',
        on: '',

        files: [],
        data: null,
        chosenFile: null,
    }),

    created() {
        this.getRepuestos();
        this.getrepuestosStock();
        this.getProveedores();
    },

    methods: {

        async getrepuestosStock() {
            await axios.get(urlAPI + 'productStock')
                .then(res => {
                    let repuestosStock = res.data.productStock;
                    if (repuestosStock != null) {
                        repuestosStock.forEach(repuesto => {
                            if (repuesto.Status === "ACTIVE") {
                                this.repuestosStock.push(repuesto);
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
                            if (p.Status === "ACTIVE" & p.Kind == "PRODUCT") {
                                this.proveedores.push(p);
                            }
                        })
                    }
                })
        },

        async getRepuestos() {
            await axios.get(urlAPI + 'product')
                .then(res => {
                    let repuestos = res.data.product;
                    if (repuestos != null) {
                        repuestos.forEach(repuesto => {
                            if (repuesto.Status === "ACTIVE") {
                                this.repuestos.push(repuesto);
                            }
                        })
                    }
                })
        },

        async createproduct(code, bn, total, product) {
            await axios.post(urlAPI + 'productStock/add', {
                "productStock": {
                    "Code": code,
                    "BatchNum": bn,
                    "TotalOrdered": total,
                    "OrderDate": new Date(),
                    "Product": product,
                }
            })
        },

        formatVto(value) {
            return value == null ? "N/A" : String(value);
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
                this.snackbar = true;
                this.mensaje = "No ha seleccionado ningún elemento!";
                return;
            }
            if (this.selected[0].ArrivalDate != null) {
                this.snackbar = true;
                this.mensaje = "Esta orden ya ha sido verificada!";
                return;

            }
            this.dialogConfirm = true
        },

        guardarLlegada() {
            if (this.validate()) {
                this.editedIndex = this.repuestosStock.indexOf(this.selected[0]);
                let noDisponibles = parseInt(this.defectuosos) + parseInt(this.noRecibidos);
                let disponibles = (this.selected[0].TotalOrdered) - noDisponibles;

                if (noDisponibles <= this.selected[0].TotalOrdered && noDisponibles + disponibles === this.selected[0].TotalOrdered) {
                    let productEdited = {
                        "productStock": {
                            "Code": this.selected[0].Code,
                            "BatchNum": this.selected[0].BatchNum,
                            "Reserved": 0,
                            "Available": disponibles,
                            "OutOfService": noDisponibles,
                            "TotalOrdered": this.selected[0].TotalOrdered,
                            "Expiration": this.selected[0].Expiration != null ? this.selected[0].Expiration : null,
                            "Product": this.selected[0].Product,
                            "OrderDate": this.selected[0].OrderDate,
                            "ArrivalDate": new Date(),
                        }
                    };
                    this.updateProduct(productEdited);
                    this.defectuosos = 0;
                    this.noRecibidos = 0;
                    this.dialogConfirm = false;
                    this.selected = [];
                    this.$refs.form.resetValidation();
                    Object.assign(this.repuestosStock[this.editedIndex], productEdited);
                    this.editedIndex = -1;
                } else {
                    alert("Los valores ingesados no deben superar el total!");
                }
            }
        },

        async updateProduct(productEdited) {
            await axios.post(urlAPI + 'productStock/' + this.selected[0]._id + '/update', productEdited);
            this.repuestosStock = [];
            this.getrepuestosStock();
        },

        /*importTxt() {
            var reader = new FileReader();
            reader.readAsText(this.chosenFile);
            reader.onload = () => {
                this.data = reader.result;
                try {
                    var dataParsed = JSON.parse(this.data);
                } catch (e) {
                    this.snackbar = true;
                    this.mensaje = "Formato del archivo inválido!";
                    return;
                }
                if (this.data == null) {
                    this.snackbar = true;
                    this.mensaje = "No ha seleccionado ningún archivo!";
                    return;
                }

                if (this.repuestos == null) {
                    this.snackbar = true;
                    this.mensaje = "No existen repuestos para referenciar!";
                    return;
                }
                for(let elemento in this.data){
                    console.log(elemento);
                }
                /*for (let i = 0; i < dataParsed.repuestos.length; i++) {
                    let code = dataParsed.repuestos[i].Code;
                    let batchNum = dataParsed.repuestos[i].BatchNum;
                    let total = dataParsed.repuestos[i].TotalOrdered;
                    var product = "";

                    this.repuestos.forEach(repuesto => {
                        if (repuesto.SKU === dataParsed.repuestos[i].Product) {
                            product = repuesto._id;
                        }
                    });

                    if (code == null | total == null | product == null) {
                        this.snackbar = true;
                        this.mensaje = "Formato del archivo inválido!";
                        return;
                    }
                    this.createproduct(code, batchNum, total, product);
                }*/

        /*      this.repuestosStock = [];
                this.getrepuestosStock();
                this.dialogStock = false;
            }
            this.chosenFile = null;
            this.data = null;
        }*/
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
                    if (output[col] === undefined) output[col] = [];
                    output[col][row] = value;
                });
            });
            return output;
        },

        readFile() {
            //LOTE SKU TOTAL PRECIO UNITARIO
            if (this.repuestos == null) {
                this.snackbar = true;
                this.mensaje = "No existen repuestos para referenciar!";
                return;
            }
            let file = this.chosenFile;
            let reader = new FileReader();
            reader.onload = (e) => {
                // Cuando el archivo se terminó de cargar
                let lines = this.parseCSV(e.target.result);
                let output = this.reverseMatrix(lines);
                if (output.length != 4) {
                    this.mensaje = "Columnas inválidas, deben contener: N°de Lote, SKU, Total y Precio";
                    this.snackbar = true;
                }
                for (let i = 1; i < output[2].length; i++) {
                  const pattern = /^\d{1,}$/
                    if (!pattern.test(output[2][i])) {
                        this.mensaje = "Total inválido, debe ser un valor numérico";
                        this.snackbar = true;
                        return;
                    }
                    try {
                        if (parseInt(output[2][i]) < 0) {
                            this.mensaje = "Total inválido, debe ser un número mayor a 0";
                            this.snackbar = true;
                            return;
                        }
                    } catch(e) {
                        this.mensaje = "Total inválido, debe ser un número mayor a 0";
                        this.snackbar = true;
                        return;
                    }
                }
                for (let i = 1; i < output[3].length; i++) {
                    try {
                        if (parseFloat(output[3][i]) < 0) {
                            this.mensaje = "Total inválido, debe ser un número mayor a 0";
                            this.snackbar = true;
                            return;
                        }
                    } catch(e) {
                        this.mensaje = "Total inválido, debe ser un número mayor a 0";
                        this.snackbar = true;
                        return;
                    }
                }
            };

            // Leemos el contenido del archivo seleccionado
            reader.readAsBinaryString(file);
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

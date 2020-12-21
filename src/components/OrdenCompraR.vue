<template>
<v-img src="../assets/Sun-Tornado.svg" gradient="to top right, rgba(20,20,20,.2), rgba(25,32,72,.35)" class="bkg-img">
    <div>

        <v-data-table v-model="selected" :single-select="true" show-select :headers="headers" :items="purchaseOrders" :search="search" item-key="_id" sort-by="Brand" class="elevation-1">
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
                    <v-btn color="grey" dark class="mb-2" v-bind="attrs" v-on="on" @click="verInfo">
                        <v-icon>mdi-information-outline</v-icon>
                    </v-btn>
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
                        <v-btn class="info" right @click="reset">
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
                                <li v-for="(repuesto, r) in selected[0].Product" :key="r">

                                    <v-text-field readonly :value="'SKU: '+repuesto.ProductID.SKU"></v-text-field>
                                    <v-text-field readonly :value="' Marca: '+repuesto.ProductID.Brand"></v-text-field>
                                    <v-text-field readonly :value="'Categoría: '+repuesto.ProductID.Category"></v-text-field>
                                    <v-text-field v-if="repuesto.ProductID.SubCategory!=null" readonly :value="'Sub-Categoría: '+repuesto.ProductID.SubCategory"></v-text-field>

                                    <v-text-field v-if="repuesto.ProductID.BatchNum!=null" readonly :value="'N°Lote: '+repuesto.ProductID.BatchNum"></v-text-field>
                                    <v-text-field readonly :value="'Cantidad: '+repuesto.TotalOrdered"></v-text-field>

                                    <v-row>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field type="number" v-model="fueraServicio[r]" label="Recibidos defectuosos" @keypress="comprobarMax($event,r,fueraServicio,noLlegaron)"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field type="number" v-model="noLlegaron[r]" label="No Recibidos" @keypress="comprobarMax($event,r,noLlegaron,fueraServicio)"></v-text-field>
                                        </v-col>
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
                    <span v-html="titulo"></span>
                    <span v-html="mensaje"></span>
                </v-card-text>
                <v-card-actions>
                    <v-flex class="text-right">
                        <v-btn v-if="procesar" class="info mb-2" @click="dialogMensaje=false; mensaje='';titulo='';procesar=false ">
                            <v-icon>mdi-cancel</v-icon>
                        </v-btn>

                        <v-btn class="info mb-2" @click="aceptarDialog">
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
        selected: [],
        procesar: false,
        proveedores: [],
        snackbar: false,
        proveedor: null,
        purchaseOrders: [],
        orden: null,
        fueraServicio: [],
        noLlegaron: [],
        max: [],
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
        requerido: [
            value => !!value || 'Requerido.',
        ],

        headers: [{
                text: 'Código',
                value: 'Code',
                align: 'start',
            },
            {
                text: 'Proveedor',
                value: 'Dealer.Email'
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
                align: 'right'
            },
        ],

        editedIndex: -1,
        attrs: '',
        allOrders: [],
        on: '',
        output: [],
        files: [],
        data: null,
        chosenFile: null,
        employee: null,
    }),

    created() {
        let employee = localStorage.getItem("employee");
        this.employee = JSON.parse(employee);
        this.getRepuestos();
        this.getOrders();
        this.getProveedores();
    },

    methods: {

        async getOrders() {
            await axios.get(urlAPI + 'purchaseOrder')
                .then(res => {
                    this.purchaseOrders = [];
                    this.allOrders = [];
                    let purchaseOrders = res.data.purchaseOrder;
                    if (purchaseOrders != null) {
                        purchaseOrders.forEach(orden => {
                            if (orden.Status === "ACTIVE") {
                                this.allOrders.push(orden);
                            }
                        })
                    }
                    this.purchaseOrders = this.allOrders.filter(o => o.Type == "RECIBIDA");
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
                        repuestos.forEach(orden => {
                            if (orden.Status === "ACTIVE") {
                                this.repuestos.push(orden);
                            }
                        })
                    }
                })
        },

        formatPrice(value) {
            return value == null ? "$0" : "$" + value;
        },

        formatDate(value) {
            if (value == null || new Date(value)==null) {
                return "Sin Definir";
            }
            let date = new Date(value);
            return date.getDate()+"-"+date.getMonth()+"-"+(1900+date.getYear());
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
            for (let j = 0; j < this.selected[0].Product.length; j++) {
                this.max.push(this.selected[0].Product[j].TotalOrdered);
                this.fueraServicio.push(0);
                this.noLlegaron.push(0);
            }
            this.dialogConfirm = true
        },

        guardarLlegada() {
            for (let i = 0; i < this.selected[0].Product.length; i++) {
                let noDisponibles = Number(this.fueraServicio[i]) + Number(this.noLlegaron[i]);
                let disponibles = Number(this.selected[0].Product[i].TotalOrdered) - noDisponibles;
                let employee = localStorage.getItem("employee");
                employee = JSON.parse(employee);
                let branchOffice = employee != null & employee.BranchOffice != null ? employee.BranchOffice : null;

                let repuestoStock = {
                    "productStock": {
                        "BatchNum": this.selected[0].Product[i].BatchNum,
                        "Status": "ACTIVE",
                        "Available": disponibles,
                        "OutOfService": noDisponibles,
                        "Reserved": 0,
                        "Expiration": this.selected[0].Product[i].Expiration,
                        "Dealer": this.selected[0].Dealer,
                        "Product": this.selected[0].Product[i].ProductID._id,
                        "Price": this.selected[0].Product[i].ProductID.SalePrice,
                        "BranchOffice": branchOffice
                    }
                };
                axios.post(urlAPI + 'productStock/add', repuestoStock);
                axios.post(urlAPI + 'product/' + this.selected[0].Product[i].ProductID._id + '/actualizarPrecio', {
                    "precio": this.selected[0].Product[i].Price
                })
            }

            axios.post(urlAPI + 'purchaseOrder/' + this.selected[0]._id + '/setArrival').then(res => {
                if (res != null) {
                    this.getOrders();
                    this.titulo = "<h1 class='text-center'>Carga realizada con éxito</h1>";
                    this.mensaje = "<h3>Podrá ver los elementos cargados en la sección: Stock.</h3>";
                    this.dialogMensaje = true;
                }
            });

            this.selected = [];
            this.dialogConfirm = false;
            this.fueraServicio = [];
            this.noLlegaron = [];
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
            // Por cada fila
            matrix.forEach((values, row) => {
                // Vemos los valores y su posicion
                values.forEach((value, col) => {
                    // Si la posición aún no fue creada
                    if (value != null) {
                        if (this.output[col] === undefined) this.output[col] = [];
                        this.output[col][row] = value;
                    }
                });
            });
        },

        readFile() {
            //0_LOTE 1_SKU 2_VENCIMIENTO, 3_TOTAL 4_PRECIO-UNITARIO 5_CODIGO
            if (this.$refs.formStock.validate()) {
                if (this.repuestos == null) {
                    this.mensaje = "No existen repuestos para referenciar!";
                    this.snackbar = true;
                    return;
                }
                let file = this.chosenFile;
                let reader = new FileReader();
                reader.onload = (e) => {
                    // Cuando el archivo se terminó de cargar
                    let lines = this.parseCSV(e.target.result);
                    this.reverseMatrix(lines);

                    if (this.corroborarValidez()) {
                        if (this.orden == null) {
                            this.procesar = true;
                            this.titulo = "<h1 class='text-center'>Código de orden inexistente</h1><br>";
                            this.mensaje = "<h4>¿Desea procesar igualmente la orden?</h4>";
                            this.dialogMensaje = true;
                            return;
                        } else if (this.mensaje != "") {
                            this.titulo = "<h1 class='text-center'>Contenido inválido</h1><br>";
                            this.dialogMensaje = true;
                        }
                        this.guardarOrden();
                    }
                };

                // Leemos el contenido del archivo seleccionado
                reader.readAsBinaryString(file);
            }
        },

        guardarOrden() {
            let orden = this.getJSONOrder();

            if (orden != null) {
                if (this.procesar) {
                    axios.post(urlAPI + 'purchaseOrder/add', orden).then(res => {
                        if (res != null) {
                            this.getOrders();
                            this.procesar = false;
                            this.reset();
                        }
                    });
                } else {
                    let id = this.allOrders.indexOf(this.orden);
                    if (id != -1) {
                        id = this.allOrders[id]._id;
                        axios.post(urlAPI + 'purchaseOrder/' + id + "/update", orden).then(res => {
                            if (res != null) {
                                this.getOrders();
                                this.reset();
                            }
                        });
                    }
                }
                this.dialogStock = false;
            } else {
                this.titulo = "<h1 class='text-center'>Repuesto/s inexistente/s</h1><br>";
                this.dialogMensaje = true;
            }
        },
        getJSONOrder() {
            /* 0-SKU, 1-LOTE, 2-VENCIMIENTO, 3-TOTAL, 4-PRECIO, 5-CODIGO*/
            
             console.log("NEW DATE : "+new Date())
            let precio = 0;
            let product = [];
            let mensaje = this.mensaje;
            this.mensaje = "";
            for (let i = 1; i < this.output[1].length; i++) {
                let productID = this.repuestos.find(r => r.SKU == this.output[0][i]);
                if (productID != null) {
                    let expiration = new Date(this.output[2][i]) != null ? new Date(this.output[2][i]) : null;
                    let total = Number(this.output[3][i]);
                    let precioUnitario = Number(this.output[4][i]);
                    precio += precioUnitario * total;
                    product.push({
                        "ProductID": productID._id,
                        "BatchNum": this.output[1][i],
                        "Expiration": expiration,
                        "TotalOrdered": total,
                        "Price": precioUnitario
                    })
                } else {
                    this.mensaje += "<h2> Repuesto no encontrado </h2>";
                    this.mensaje += "<h4> -SKU: " + this.output[0][i] + " </h4>";
                    this.procesar = false;
                }
            };
            if (this.mensaje != "") {

                this.mensaje = mensaje + this.mensaje;
                return null;
            }

            this.mensaje = mensaje + this.mensaje;
            // date = new Date(date.setTime(date.getTime()));
       
            return {
                "purchaseOrder": {
                    "Code": this.output[5][1],
                    "OrderDate":new Date(),
                    "Price": precio,
                    "Product": product,
                    "Dealer": this.proveedor,
                    "Type": "RECIBIDA",
                    "Status": "ACTIVE",
                    "Info": this.mensaje,
                    "Employee": this.employee._id,
                    "BranchOffice": this.employee.BranchOffice
                }
            }
        },
        getOrden() {
            let orden = this.allOrders.filter(o =>
                o.Code == this.output[5][1] && o.Type == "ENVIADA"
            );
            if (orden.length > 0) {
                this.orden = orden[0];
            }
        },

        corroborarValidez() {
            let ret = true;
            if (this.output.length != 6) {
                this.mensaje = "<h4>Columnas inválidas, debe contener exactamente 6 columnas.</h4>";
                this.titulo = "<h1 class='text-center'>Formato de archivo Inválido</h1>";
                this.dialogMensaje = true;
                return false;
            } else {
                this.getOrden();
            }
            //FILA 0: SKU
            for (let i = 1; i < this.output[0].length; i++) {
                if (this.output[0][i] == null) {
                    this.mensaje += "<h4>El código SKU es obligatorio</h4>";
                    return false;
                } else {
                    if (this.orden != null && this.orden.Product != null & this.orden.Product.filter(o => o.ProductID!=null && o.ProductID.SKU == this.output[0][i]).length == 0) {
                        this.mensaje += "<h4>No existe un producto con SKU: " + this.output[0][i] + " en la orden original</h4>";
                    }
                }
            }
            //FILA 3: TOTAL OBLIGATORIO
            for (let i = 1; i < this.output[3].length; i++) {
                const pattern = /^\d{1,}$/
                if (!pattern.test(this.output[3][i])) {
                    this.mensaje = "<h4>Total inválido, debe ser un valor numérico</h4>";
                    return false;
                } else {
                    if (this.orden != null && this.output[3][i] &&
                        this.orden.Product != null && this.orden.Product[i] != null && this.orden.Product[i].ProductID.TotalOrdered) {
                        this.mensaje = "<h4>Total inválido, no coincide con el valor de la orden enviada</h4>";
                    }
                }
            }
            //FILA 4: PRECIO
            for (let i = 1; i < this.output[4].length; i++) {
                try {
                    if (parseFloat(this.output[4][i]) < 0) {
                        this.mensaje = "<h4>Total inválido, debe ser un número mayor a 0</h4>";
                        return false;
                    }
                } catch (e) {
                    this.mensaje = "<h4>Total inválido, debe ser un número mayor a 0</h4>";
                    return false;
                }
            }
            return ret;
        },

        verInfo() {
            if (this.selected.length == 0) {
                this.mensaje = "No ha seleccionado ningún elemento!";
                this.snackbar = true;
                return;
            }

            this.titulo = "<h1>Información de procesamiento</h1><br>"
            if (this.selected[0].Info == "" || this.selected[0].Info == null) {
                this.mensaje = "<h4>Orden procesada con éxito</h4>";
                this.dialogMensaje = true;
            } else {
                this.mensaje = this.selected[0].Info;
                this.dialogMensaje = true;

            }
        },

        aceptarDialog() {
            this.dialogMensaje = false;
            this.mensaje = '';
            this.titulo = '';
            if (this.procesar) {
                this.guardarOrden()
            }
        },

        reset() {
            if(this.dialogStock){
                this.$refs.formStock.resetValidation();
            }
            this.dialogStock = false;
            this.chosenFile = null;
            this.proveedor = null;
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
